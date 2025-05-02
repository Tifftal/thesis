import { create } from 'zustand';

import {
  BrokenLine,
  LayerType,
  Line,
  Polygon,
  ProjectType,
  Rectangle,
  SavedBrokenLine,
  SavedLine,
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
  selectedImageURL: null,
  visibleLayers: [],
  selectedLayer: null,
  selectedTool: null,
  projects: [],

  setTypeOfAuthForm: (typeOfAuthForm: 'login' | 'registration') => set({ typeOfAuthForm }),
  setUserInfo: (userInfo: UserInfoType) => set({ userInfo }),
  setSelectedProject: (selectedProject: ProjectType | null) => set({ selectedProject }),
  setSelectedImageURL: (selectedImageURL: string | null) => set({ selectedImageURL }),
  setVisibleLayers: (visibleLayers: LayerType[]) => set({ visibleLayers }),
  setSelectedLayer: (selectedLayer: LayerType | null) => set({ selectedLayer }),
  setSelectedTool: (selectedTool: string | null) => set({ selectedTool }),
  setProjects: (projects: ProjectType[]) => set({ projects }),

  //Метрики
  savedLines: [],
  savedBrokenLines: [],

  setSavedLines: (savedLines: SavedLine[]) => set({ savedLines }),
  setSavedBrokenLines: (savedBrokenLines: SavedBrokenLine[]) => set({ savedBrokenLines }),
}));

export default useStore;
