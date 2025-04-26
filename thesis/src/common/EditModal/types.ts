import { ImageType, LayerType, ProjectType } from 'services/zustand/types';

export type ResponseChangeImageType = {
  data: ImageType;
};

export type EditModalType = 'IMAGE' | 'PROJECT' | 'LAYER' | null;
export type EditModalItemType = ImageType | ProjectType | LayerType | null;
