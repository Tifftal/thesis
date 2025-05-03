export type UserInfoType = {
  id: number | null;
  lastName: string;
  firstName: string;
  patronymic: string;
  username: string;
};

export type LayerType = {
  id: number;
  imageID: number;
  name: string;
  measurements: Record<string, any>;
};

export type ImageType = {
  id: number;
  name: string;
  fileName: string;
  projectID: number;
  layers: LayerType[];
  url: string;
};

export type ProjectType = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  images?: ImageType[];
};

export type Point = { x: number; y: number };
export type Line = [Point, Point];
export type BrokenLine = Point[];
export type Polygon = Point[];
export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type Circle = {
  x: number;
  y: number;
  radius: number;
};
export type Ellipse = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
};

export type SavedLine = { line: Line; distance: string | null; note: string };
export type SavedBrokenLine = { brokenLine: BrokenLine; distance: string | null; note: string };

export type ZustandStoreStateType = {
  typeOfAuthForm: 'login' | 'registration';
  userInfo: UserInfoType;

  selectedProject: ProjectType | null;
  selectedImageURL: string | null;
  visibleLayers: LayerType[];
  selectedLayer: LayerType | null;
  selectedTool: string | null;
  projects: ProjectType[];
  setTypeOfAuthForm: (typeOfAuthForm: 'login' | 'registration') => void;
  setUserInfo: (userInfo: UserInfoType) => void;
  setSelectedProject: (selectedProject: ProjectType | null) => void;
  setSelectedImageURL: (selectedImageURL: string | null) => void;
  setVisibleLayers: (visibleLayers: LayerType[]) => void;
  setSelectedLayer: (selectedLayer: LayerType | null) => void;
  setSelectedTool: (selectedTool: string | null) => void;
  setProjects: (projects: ProjectType[]) => void;

  stagePosition: Point;
  setStagePosition: (stagePosition: Point) => void;

  //Метрики
  savedLines: SavedLine[];
  savedBrokenLines: SavedBrokenLine[];
  setSavedLines: (savedLines: SavedLine[]) => void;
  setSavedBrokenLines: (savedBrokenLines: SavedBrokenLine[]) => void;
};
