export type UserInfoType = {
  id: number | null;
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
};

export type Point = { x: number; y: number };
export type Line = [Point, Point];
export type BrokenLine = Point[];
export type Polygon = Point[];

export type SavedLine = { line: Line; distance: string | null; note: string };
export type SavedBrokenLine = { brokenLine: BrokenLine; distance: string | null; note: string };

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
  brokenLines: BrokenLine[];
  polygons: Polygon[];
  setLines: (lines: Line[]) => void;
  setBrokenLines: (brokenLines: BrokenLine[]) => void;
  setPolygons: (brokenLines: Polygon[]) => void;

  //Метрики
  savedLines: SavedLine[];
  savedBrokenLines: SavedBrokenLine[];
  setSavedLines: (savedLines: SavedLine[]) => void;
  setSavedBrokenLines: (savedBrokenLines: SavedBrokenLine[]) => void;
};
