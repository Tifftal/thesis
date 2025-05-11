import { create } from 'zustand';

import {
  ImageType,
  LayerType,
  Point,
  Polygon,
  ProjectType,
  UserInfoType,
  ZustandStoreStateType,
} from './types';

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

  generatedObjects: null,
  isGeneratingObjects: false,
  isVisibleGeneratedLayer: false,
  isOpenAddObjectModal: { visible: false, selectedObject: null },
  setGeneratedObjects: (generatedObjects: Record<string, any> | null) => set({ generatedObjects }),
  setIsGeneratingObjects: (isGeneratingObjects: boolean) => set({ isGeneratingObjects }),
  setIsVisibleGeneratedLayer: (isVisibleGeneratedLayer: boolean) => set({ isVisibleGeneratedLayer }),
  setIsOpenAddObjectModal: (isOpenAddObjectModal: {
    visible: boolean;
    selectedObject: Polygon | Polygon[] | null;
  }) => set({ isOpenAddObjectModal }),

  stagePosition: { x: 0, y: 0 },
  isEditMode: false,
  editModeForPolygon: false,
  setStagePosition: (stagePosition: Point) => set({ stagePosition }),
  setIsEditMode: (isEditMode: boolean) => set({ isEditMode }),
  setEditModeForPolygon: (editModeForPolygon: boolean) => set({ editModeForPolygon }),

  //Метрика
  savedMeasurements: null,
  setSavedMeasurements: (savedMeasurements: Record<string, any> | null) => set({ savedMeasurements }),
}));

export default useStore;
