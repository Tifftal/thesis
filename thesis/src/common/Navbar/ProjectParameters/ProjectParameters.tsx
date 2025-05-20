import { useEffect, useState } from 'react';

import { ColorPicker } from 'antd';
import { Color } from 'antd/es/color-picker';
import { convertContoursToPolygons } from 'utils/parsers/convertContoursToPolygons';

import { IMAGE_API } from 'services/API/IMAGE_API';
import { LAYER_API } from 'services/API/LAYER_API';
import { PROJECT_API } from 'services/API/PROJECT_API';
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
    setIsGeneratingObjects,
    setGeneratedObjects,
    generatedObjects,
    setIsVisibleGeneratedLayer,
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

  const isMeasurementsEmpty = (measurements: Record<string, any>) => {
    return Object.values(measurements).every(array => !array.length);
  };

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

  const handleGenerateObjects = () => {
    if (selectedImage?.id) {
      setIsGeneratingObjects(true);
      IMAGE_API.DetectObjects(selectedImage.id)
        .then(response => {
          if (Object.keys(response.data).length === 0) {
            onMessage('Получены пустые данные', 'warning', 'Объекты не обнаружены');
            return;
          }
          const newPolygons = convertContoursToPolygons(response.data);
          setGeneratedObjects({ ...generatedObjects, [selectedImage.id]: newPolygons });
          setVisibleLayers([]);
          setSelectedLayer(null);
          setIsVisibleGeneratedLayer(true);
        })
        .catch(e => onMessage(`${e}`, 'error', 'Ошибка генерации объектов'))
        .finally(() => setIsGeneratingObjects(false));
    }
  };

  const handleChangeLayerColor = (color: Color) => {
    if (!selectedLayer) return;
    LAYER_API.ChangeLayer(selectedLayer.id, {
      name: selectedLayer.name,
      measurements: selectedLayer.measurements,
      color: color.toHex(),
    })
      .then(response => {
        const newLayer = response.data;
        setSelectedLayer(newLayer);

        const newVisibleLayers = visibleLayers.map(item => {
          if (item.id === newLayer.id) return { ...item, measurements: newLayer.measurements };
          return item;
        });
        setVisibleLayers(newVisibleLayers);

        if (!selectedProject) return;
        PROJECT_API.GetProject(selectedProject.id)
          .then(response => {
            setSelectedProject(response.data);
          })
          .catch(e => {
            onMessage(`${e}`, 'error', 'Ошибка получения проекта');
          });
      })
      .catch(e => {
        onMessage(`${e}`, 'error', 'Ошибка изменения цвета');
      });
  };

  return (
    <div className='project-parameters__container'>
      <div className='project-parameters__content'>
        {selectedImage && !generatedObjects?.[selectedImage.id] && (
          <Button
            size='s'
            onClick={handleGenerateObjects}
            className='project-parameters__container__detect-objects-btn'>
            Найти объекты
          </Button>
        )}
        {selectedImage && (
          <div className='project-parameters__container__scale'>
            <InputText
              label={'Ширина изображения'}
              placeholder='100'
              value={width}
              onChange={value => handleChangeImageScale('width', value)}
              height={32}
              status={!width.length ? 'error' : undefined}
            />
            <InputText
              label={'Единицы измерения'}
              placeholder='нм'
              value={units}
              onChange={value => handleChangeImageScale('units', value)}
              height={32}
              status={!units.length ? 'error' : undefined}
            />
          </div>
        )}
      </div>
      {selectedLayer &&
        !!selectedLayer.measurements &&
        !!Object.keys(selectedLayer.measurements).length &&
        !isMeasurementsEmpty(selectedLayer.measurements) && (
          <div className='project-parameters__container__layer-settings'>
            <ColorPicker
              value={selectedLayer.color || '#a0f600'}
              onChangeComplete={color => handleChangeLayerColor(color)}
              disabledAlpha
            />
            <Button size='s' onClick={handleClearLayer}>
              Очистить выбранный слой
            </Button>
          </div>
        )}
    </div>
  );
};
