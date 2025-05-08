import { create } from 'zustand';

import { ImageType, LayerType, Point, ProjectType, UserInfoType, ZustandStoreStateType } from './types';

const useStore = create<ZustandStoreStateType>(set => ({
  typeOfAuthForm: 'login',
  userInfo: {
    id: null,
    lastName: '',
    firstName: '',
    patronymic: '',
    username: '',
  },
  selectedProject: null,
  selectedImage: null,
  scaleFactor: null,
  visibleLayers: [],
  selectedLayer: null,
  selectedTool: null,
  projects: [],

  setTypeOfAuthForm: (typeOfAuthForm: 'login' | 'registration') => set({ typeOfAuthForm }),
  setUserInfo: (userInfo: UserInfoType) => set({ userInfo }),
  setSelectedProject: (selectedProject: ProjectType | null) => set({ selectedProject }),
  setSelectedImage: (selectedImage: ImageType | null) => set({ selectedImage }),
  setScaleFactor: (scaleFactor: number | null) => set({ scaleFactor }),
  setVisibleLayers: (visibleLayers: LayerType[]) => set({ visibleLayers }),
  setSelectedLayer: (selectedLayer: LayerType | null) => set({ selectedLayer }),
  setSelectedTool: (selectedTool: string | null) => set({ selectedTool }),
  setProjects: (projects: ProjectType[]) => set({ projects }),

  stagePosition: { x: 0, y: 0 },
  setStagePosition: (stagePosition: Point) => set({ stagePosition }),

  //Метрика
  savedMeasurements: null,
  setSavedMeasurements: (savedMeasurements: Record<string, any> | null) => set({ savedMeasurements }),
}));

export default useStore;
