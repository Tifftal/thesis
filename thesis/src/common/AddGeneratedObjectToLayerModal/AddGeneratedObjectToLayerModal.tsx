import { useState } from 'react';

import { LAYER_API } from 'services/API/LAYER_API';
import { PROJECT_API } from 'services/API/PROJECT_API';
import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';
import { Modal } from 'ui-kit/modal/Modal';
import { Select } from 'ui-kit/select/Select';

import useToast from 'utils/hooks/useToast';

export const AddGeneratedObjectToLayerModal = () => {
  const { onMessage } = useToast();

  const {
    selectedImage,
    isOpenAddObjectModal,
    setIsOpenAddObjectModal,
    selectedProject,
    setSelectedProject,
    generatedObjects,
  } = useStore((state: ZustandStoreStateType) => state);

  const [selectedLayerID, setSelectedLayerID] = useState<any>(null);
  const [layersOptions, setLayersOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);

  const handleGetLayersOptions = (open: boolean) => {
    if (open) {
      const newLayersOptions =
        selectedImage?.layers.map(layer => ({ label: layer.name, value: layer.id })) || [];
      setLayersOptions(newLayersOptions);
    }
  };

  const handleChooseLayer = (layerID: any) => {
    setSelectedLayerID(layerID);
  };

  const handleClose = () => {
    setSelectedLayerID(null);
    setIsOpenAddObjectModal({ visible: false, selectedObject: null });
  };

  const handleChangeLayer = () => {
    const newLayer = selectedImage?.layers.find(layer => layer.id === selectedLayerID);
    if (!newLayer || !isOpenAddObjectModal.selectedObject || !generatedObjects || !selectedImage) return;

    const currentPolygons = newLayer?.measurements ? newLayer?.measurements.polygons || [] : [];

    const selectedPolygons = Array.isArray(isOpenAddObjectModal.selectedObject[0])
      ? isOpenAddObjectModal.selectedObject
      : [isOpenAddObjectModal.selectedObject];

    const newPolygons = [...currentPolygons, ...selectedPolygons];

    const newMeasurements = {
      ...(newLayer?.measurements || []),
      polygons: newPolygons,
    };

    LAYER_API.ChangeLayer(newLayer?.id, {
      name: newLayer?.name,
      measurements: newMeasurements,
    })
      .then(() => {
        if (!selectedProject) return;
        PROJECT_API.GetProject(selectedProject.id)
          .then(response => {
            setSelectedProject(response.data);
            handleClose();
          })
          .catch(e => {
            onMessage(`${e}`, 'error', 'Ошибка получения проекта');
          });
      })
      .catch(e => {
        onMessage(`${e}`, 'error', 'Ошибка добавления новых объектов');
      });
  };

  const renderModalContent = () => {
    return (
      <div>
        <Select
          value={selectedLayerID}
          options={layersOptions}
          onChange={value => handleChooseLayer(value)}
          onDropdownVisibleChange={open => handleGetLayersOptions(open)}
          placeholder='Выберете существующий слой'
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpenAddObjectModal.visible}
      onCancel={handleClose}
      width={500}
      isCentered
      title='Сохранение объекта'>
      <div className='add-modal__content'>
        {renderModalContent()}
        <div className='add-modal__actions'>
          <Button size='s' stretched disabled={!selectedLayerID} onClick={handleChangeLayer}>
            Сохранить
          </Button>
          <Button onClick={handleClose} size='s' type='grey' stretched>
            Отменить
          </Button>
        </div>
      </div>
    </Modal>
  );
};
