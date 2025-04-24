import { LoginVariablesType, RegisterVariablesType } from './types';

import apiClient from './utils/axiosInterceptor';

export class AUTH_API {
  static Login(variables: LoginVariablesType) {
    return apiClient.post('/auth/login', {
      ...variables,
    });
  }

  static Register(variables: RegisterVariablesType) {
    return apiClient.post('/auth/register', {
      ...variables,
    });
  }

  static GetMe() {
    return apiClient.get('/user/me');
  }
}
