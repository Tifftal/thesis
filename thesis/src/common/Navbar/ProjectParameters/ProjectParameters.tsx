import useStore from 'services/zustand/store';
import { ZustandStoreStateType } from 'services/zustand/types';

import { Button } from 'ui-kit/button';

import { ChangeLayer } from 'pages/changeDataHelpers';

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
  } = useStore((state: ZustandStoreStateType) => state);

  const { onMessage } = useToast();

  const handleClearLayer = () => {
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
  };

  return (
    <div className='project-parameters__container'>
      {selectedLayer && (
        <Button size='s' type='secondary' onClick={handleClearLayer}>
          Очистить слой
        </Button>
      )}
    </div>
  );
};
