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

export type CreateImageVariablesType = {
  projectID: number;
  name: string;
  image: File;
};

export type CreateChangeImageProjectVariablesType = {
  name: string;
};

export type CreateLayerType = {
  imageID: number;
  name: string;
};
