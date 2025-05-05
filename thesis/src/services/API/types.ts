export type LoginVariablesType = {
  username: string;
  password: string;
};

export type RegisterVariablesType = {
  firstName: string;
  lastName: string;
  password: string;
  patronymic: string;
  username: string;
};

export type CreateProjectVariablesType = {
  name: string;
};

export type CreateImageVariablesType = {
  projectID: number;
  name: string;
  image: File;
};

export type ChangeNameVariablesType = {
  name: string;
};

export type ChangeLayerVariablesType = {
  name: string;
  measurements: Record<string, any> | undefined;
};

export type CreateLayerType = {
  imageID: number;
  name: string;
};
