export type UserInfoType = {
  id: number | null;
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
};

export type Point = { x: number; y: number };
export type Line = [Point, Point];
export type SavedLine = { line: Line; distance: string | null; note: string };

export type ZustandStoreStateType = {
  typeOfAuthForm: 'login' | 'registration';
  userInfo: UserInfoType;
  selectedProjectId: number | null;
  selectedImage: File | null;
  selectedTool: string | null;
  setTypeOfAuthForm: (typeOfAuthForm: 'login' | 'registration') => void;
  setUserInfo: (userInfo: UserInfoType) => void;
  setSelectedProjectId: (selectedProjectId: number | null) => void;
  setSelectedImage: (selectedImage: File | null) => void;
  setSelectedTool: (selectedImage: string | null) => void;

  //Редактор
  lines: Line[];
  setLines: (lines: Line[]) => void;

  //Метрики
  savedLines: SavedLine[];
  setSavedLines: (savedLines: SavedLine[]) => void;
};
