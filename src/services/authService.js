import { axiosInstance } from './axiosConfig';
import { clearTokens, saveTokens } from './tokenService';

// authService.js
const authService = {
  isAuthenticated: true, // getAccessToken() !== null,
  // eslint-disable-next-line no-unused-vars
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/user/login', { email, password });

      if (response.status === 200) {
        // Save tokens to local storage
        saveTokens({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token
        });

        authService.isAuthenticated = true;
        return response.data;
      }
    } catch (err) {
      alert('Login failed');
    }
    return null;
  },
  logout: () => {
    clearTokens();
    authService.isAuthenticated = false;
  }
};

export default authService;
