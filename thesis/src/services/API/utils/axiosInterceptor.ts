import axios from 'axios';

const API_ROOT_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_ROOT_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401 || error?.response?.status === 404) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);

export default apiClient;

// // Можно добавить логику для refresh-токенов
// if (error?.response?.status === 401 && !originalRequest._retry) {
//   originalRequest._retry = true;
//   const refreshToken = localStorage.getItem('refreshToken');
//   return apiClient.post('/refresh-token', { refreshToken })
//     .then((res) => {
//       localStorage.setItem('token', res.data.token);
//       originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
//       return apiClient(originalRequest);
//     });
// }
