import axios from 'axios';

const API_ROOT_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_ROOT_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Функция для обновления токена
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_ROOT_URL}/auth/refresh`, {
      refreshToken,
    });

    localStorage.setItem('token', response.data.accessToken);
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data.accessToken;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth';
    throw error;
  }
};

// Интерцептор запросов
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

// Интерцептор ответов
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 404) {
      // Обработка 404 ошибки
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
