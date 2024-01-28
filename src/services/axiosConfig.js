import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './tokenService';
import { BACKEND_API_URL } from '../constants';

export const axiosInstance = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const getNewAccessToken = async () => {
  const existingRefreshToken = getRefreshToken();
  if (!existingRefreshToken) {
    return null;
  }

  const response = await axiosInstance.post('/user/token/refresh', {
    refresh_token: existingRefreshToken
  });
  const data = await response.json();
  saveTokens({ accessToken: data.access_token, refreshToken: existingRefreshToken });
  return data.access_token;
};

export const axiosAuthInstance = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosAuthInstance.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      }
    };
  }

  return config;
});

axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const navigate = useNavigate();

    // Check if the error is due to an expired access token
    // eslint-disable-next-line no-underscore-dangle
    if (error.response.status === 401 && !originalRequest._retry) {
      // eslint-disable-next-line no-underscore-dangle
      originalRequest._retry = true;

      // Attempt to refresh the access token
      try {
        const newAccessToken = await getNewAccessToken();

        if (newAccessToken) {
          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosAuthInstance(originalRequest);
        }

        // If refresh fails, initiate logout
        clearTokens();

        // Redirect to the login page or handle as needed
        navigate('/login');
        return Promise.reject(error);
      } catch (refreshError) {
        // If there's an error during refresh, initiate logout
        clearTokens();
        // Redirect to the login page or handle as needed
        navigate('/login');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
