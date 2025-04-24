import { CreateLayerType } from './types';

import apiClient from './utils/axiosInterceptor';

export class LAYER_API {
  static CreateLayer(variables: CreateLayerType) {
    return apiClient.post('/layer', {
      ...variables,
    });
  }
}
