import { create } from 'zustand';

import {
  BrokenLine,
  Line,
  Polygon,
  SavedBrokenLine,
  SavedLine,
  UserInfoType,
  ZustandStoreStateType,
} from './types';

const useStore = create<ZustandStoreStateType>(set => ({
  typeOfAuthForm: 'login',
  userInfo: {
    id: 1,
    lastName: 'Преображенский',
    firstName: 'Виктор',
    middleName: 'Васильевич',
    email: 'preobr@mail.ru',
  },
  selectedProjectId: null,
  selectedImage: null,
  selectedTool: null,

  setTypeOfAuthForm: (typeOfAuthForm: 'login' | 'registration') => set({ typeOfAuthForm }),
  setUserInfo: (userInfo: UserInfoType) => set({ userInfo }),
  setSelectedProjectId: (selectedProjectId: number | null) => set({ selectedProjectId }),
  setSelectedImage: (selectedImage: File | null) => set({ selectedImage }),
  setSelectedTool: (selectedTool: string | null) => set({ selectedTool }),

  // Редактор
  lines: [],
  brokenLines: [],
  polygons: [],

  setLines: (lines: Line[]) => set({ lines }),
  setBrokenLines: (brokenLines: BrokenLine[]) => set({ brokenLines }),
  setPolygons: (polygons: Polygon[]) => set({ polygons }),

  //Метрики
  savedLines: [],
  savedBrokenLines: [],

  setSavedLines: (savedLines: SavedLine[]) => set({ savedLines }),
  setSavedBrokenLines: (savedBrokenLines: SavedBrokenLine[]) => set({ savedBrokenLines }),
}));

export default useStore;
