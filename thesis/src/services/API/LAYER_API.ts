import { ChangeLayerVariablesType, CreateLayerType } from './types';

import apiClient from './utils/axiosInterceptor';

export class LAYER_API {
  static CreateLayer(variables: CreateLayerType) {
    return apiClient.post('/layer', {
      ...variables,
    });
  }

  static ChangeLayer(id: number, variables: ChangeLayerVariablesType) {
    return apiClient.put(`/layer/${id}`, {
      ...variables,
    });
  }

  static DeleteLayer(id: number) {
    return apiClient.delete(`/layer/${id}`);
  }
}
