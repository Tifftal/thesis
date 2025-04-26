import { ChangeNameVariablesType, CreateLayerType } from './types';

import apiClient from './utils/axiosInterceptor';

export class LAYER_API {
  static CreateLayer(variables: CreateLayerType) {
    return apiClient.post('/layer', {
      ...variables,
    });
  }

  static ChangeLayerName(id: number, variables: ChangeNameVariablesType) {
    return apiClient.put(`/layer/${id}`, {
      ...variables,
    });
  }

  static DeleteLayer(id: number) {
    return apiClient.delete(`/layer/${id}`);
  }
}
