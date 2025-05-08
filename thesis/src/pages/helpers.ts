import { LAYER_API } from 'services/API/LAYER_API';
import { PROJECT_API } from 'services/API/PROJECT_API';
import { LayerType, ProjectType } from 'services/zustand/types';

export const ChangeLayer = (
  selectedProject: ProjectType | null,
  setSelectedProject: (selectedProject: ProjectType | null) => void,
  selectedLayer: LayerType | null,
  setSelectedLayer: (selectedLayer: LayerType | null) => void,
  visibleLayers: LayerType[],
  setVisibleLayers: (visibleLayers: LayerType[]) => void,
  newMeasurements: Record<string, any> | undefined,
  onMessage: (message: string, type: string, label?: string) => void,
  errorMessage: string,
  thenFunc?: () => void,
) => {
  if (!selectedLayer?.id) return;
  LAYER_API.ChangeLayer(selectedLayer?.id, {
    name: selectedLayer?.name,
    measurements: newMeasurements,
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
          thenFunc && thenFunc();
        })
        .catch(e => {
          onMessage(`${e}`, 'error', 'Ошибка получения проекта');
        });
    })
    .catch(e => {
      onMessage(`${e}`, 'error', errorMessage);
    });
};

export const getScaledPosition = (
  pointer: { x: number; y: number },
  imagePosition: { x: number; y: number },
  stagePosition: { x: number; y: number },
  scale: number,
) => {
  return {
    x: (pointer.x - imagePosition.x - stagePosition.x) / scale,
    y: (pointer.y - imagePosition.y - stagePosition.y) / scale,
  };
};
