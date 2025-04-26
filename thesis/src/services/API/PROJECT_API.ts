import { ChangeNameVariablesType, CreateProjectVariablesType } from './types';

import apiClient from './utils/axiosInterceptor';

export class PROJECT_API {
  static GetAllProjects() {
    return apiClient.get('/project');
  }

  static GetProject(id: number) {
    return apiClient.get(`/project/${id}`);
  }

  static CreateProject(variables: CreateProjectVariablesType) {
    return apiClient.post('/project', {
      ...variables,
    });
  }

  static ChangeProjectName(id: number, variables: ChangeNameVariablesType) {
    return apiClient.put(`/project/${id}`, {
      ...variables,
    });
  }

  static DeleteProject(id: number) {
    return apiClient.delete(`/project/${id}`);
  }
}
