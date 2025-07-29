import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

// Function to get user from localStorage
const getUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        return null;
    }
};

// Request interceptor to add the access token to headers
apiClient.interceptors.request.use((config) => {
  const user = getUser();
  if (user && user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check for 401, that it's not a retry request, and not the refresh token request itself
    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;
      try {
        const { data } = await apiClient.post('/auth/refresh-token');
        const user = getUser();
        if (user) {
            user.accessToken = data.accessToken;
            localStorage.setItem('user', JSON.stringify(user));
        }
        // Update the header for the retried request
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // On refresh error, logout user
        localStorage.removeItem('user');
        // Redirect to login page, but avoid causing redirect loops
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
