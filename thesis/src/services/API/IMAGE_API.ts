import { CreateChangeImageProjectVariablesType, CreateImageVariablesType } from './types';

import apiClient from './utils/axiosInterceptor';

export class IMAGE_API {
  static CreateImage(variables: CreateImageVariablesType) {
    const formData = new FormData();
    formData.append('projectID', variables.projectID.toString());
    formData.append('name', variables.name);
    formData.append('image', variables.image);

    return apiClient.post('/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static ChangeImageName(id: number, variables: CreateChangeImageProjectVariablesType) {
    return apiClient.put(`/image/${id}`, {
      ...variables,
    });
  }

  static DeleteImage(id: number) {
    return apiClient.delete(`/image/${id}`);
  }
}
