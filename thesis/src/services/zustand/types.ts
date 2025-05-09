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
  units: string;
  width: number;
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
export type SavedPolygon = { polygon: Polygon; perimeter: string | null; area: string | null; note: string };
export type SavedRectangle = {
  rectangle: Rectangle;
  perimeter: string | null;
  area: string | null;
  note: string;
};
export type SavedCircle = {
  circle: Circle;
  length: string | null;
  area: string | null;
  note: string;
};
export type SavedEllipse = {
  ellipse: Ellipse;
  length: string | null;
  area: string | null;
  note: string;
};

export type ZustandStoreStateType = {
  typeOfAuthForm: 'login' | 'registration';
  userInfo: UserInfoType;

  selectedProject: ProjectType | null;
  selectedImage: ImageType | null;
  scaleFactor: number | null;
  visibleLayers: LayerType[];
  selectedLayer: LayerType | null;
  selectedTool: string | null;
  projects: ProjectType[];

  setTypeOfAuthForm: (typeOfAuthForm: 'login' | 'registration') => void;
  setUserInfo: (userInfo: UserInfoType) => void;
  setSelectedProject: (selectedProject: ProjectType | null) => void;
  setSelectedImage: (selectedImage: ImageType | null) => void;
  setScaleFactor: (scaleFactor: number | null) => void;
  setVisibleLayers: (visibleLayers: LayerType[]) => void;
  setSelectedLayer: (selectedLayer: LayerType | null) => void;
  setSelectedTool: (selectedTool: string | null) => void;
  setProjects: (projects: ProjectType[]) => void;

  generatedObjects: Record<string, any> | null;
  isGeneratingObjects: boolean;
  isVisibleGeneratedLayer: boolean;
  isOpenAddObjectModal: { visible: boolean; selectedObject: Polygon | Polygon[] | null };
  setGeneratedObjects: (generatedObjects: Record<string, any> | null) => void;
  setIsGeneratingObjects: (isGeneratingObjects: boolean) => void;
  setIsVisibleGeneratedLayer: (isVisibleGeneratedLayer: boolean) => void;
  setIsOpenAddObjectModal: (isOpenAddObjectModal: {
    visible: boolean;
    selectedObject: Polygon | Polygon[] | null;
  }) => void;

  stagePosition: Point;
  setStagePosition: (stagePosition: Point) => void;

  //Метрики
  savedMeasurements: Record<string, any> | null;
  setSavedMeasurements: (savedMeasurements: Record<string, any> | null) => void;
};
