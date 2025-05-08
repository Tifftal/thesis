import { useEffect, useState } from 'react';

import { IMAGE_API } from 'services/API/IMAGE_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { InputText } from 'ui-kit/inputs/InputText';

import { ChangeLayer } from 'pages/helpers';

import useToast from 'utils/hooks/useToast';

import './project-parameters.css';

export const ProjectParameters = () => {
  const {
    selectedLayer,
    selectedProject,
    setSelectedProject,
    setSelectedLayer,
    visibleLayers,
    setVisibleLayers,
    selectedImage,
    setSelectedImage,
  } = useStore((state: ZustandStoreStateType) => state);

  const { onMessage } = useToast();

  const [width, setWidth] = useState<string>('');
  const [units, setUnits] = useState<string>('');

  useEffect(() => {
    if (selectedImage) {
      setUnits(selectedImage?.units);
      setWidth(selectedImage?.width.toString());
    }
  }, [selectedImage?.id]);

  const handleClearLayer = () => {
    if (selectedLayer?.measurements) {
      ChangeLayer(
        selectedProject,
        setSelectedProject,
        selectedLayer,
        setSelectedLayer,
        visibleLayers,
        setVisibleLayers,
        undefined,
        onMessage,
        'Ошибка очищения слоя',
      );
    }
  };

  const handleChangeImageScale = (name: string, value: string) => {
    switch (name) {
      case 'width': {
        if (!value) setWidth(value);
        if (!Number(value)) break;
        setWidth(value);
        break;
      }
      case 'units': {
        setUnits(value);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (width !== '' && selectedImage?.id && Number(width) !== selectedImage.width && selectedProject) {
        IMAGE_API.ChangeImageScale(selectedImage?.id, {
          width: Number(width),
        })
          .then(response => {
            const newImage = { ...selectedImage, width: response.data.width };
            const newImages = selectedProject.images?.map(item => {
              if (item.id === newImage.id) {
                return newImage;
              }
              return item;
            });
            const newProject = { ...selectedProject, images: newImages };
            setSelectedImage(newImage);
            setSelectedProject(newProject);
          })
          .catch(e => {
            onMessage(`${e}`, 'error', 'Ошибка изменения ширины изображения');
          });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [width]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (units !== '' && selectedImage?.id && units !== selectedImage.units && selectedProject) {
        IMAGE_API.ChangeImageScale(selectedImage?.id, {
          units: units,
        })
          .then(response => {
            const newImage = { ...selectedImage, units: response.data.units };
            const newImages = selectedProject.images?.map(item => {
              if (item.id === newImage.id) {
                return newImage;
              }
              return item;
            });
            const newProject = { ...selectedProject, images: newImages };
            setSelectedImage(newImage);
            setSelectedProject(newProject);
          })
          .catch(e => {
            onMessage(`${e}`, 'error', 'Ошибка изменения единиц измерения');
          });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [units]);

  return (
    <div className='project-parameters__container'>
      {selectedLayer && (
        <Button size='s' type='secondary' onClick={handleClearLayer}>
          Очистить слой
        </Button>
      )}
      {selectedImage && (
        <div className='project-parameters__container__scale'>
          <InputText
            value={width}
            onChange={value => handleChangeImageScale('width', value)}
            height={32}
            status={!width.length ? 'error' : undefined}
          />
          <InputText
            value={units}
            onChange={value => handleChangeImageScale('units', value)}
            height={32}
            status={!units.length ? 'error' : undefined}
          />
        </div>
      )}
    </div>
  );
};
