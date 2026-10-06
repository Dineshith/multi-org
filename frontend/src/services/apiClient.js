import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
        if (token) {
            // Auto-sync token to localStorage so it works in new tabs without re-login
            if (!localStorage.getItem('adminToken') && sessionStorage.getItem('adminToken')) {
                localStorage.setItem('adminToken', token);
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthenticated - could trigger logout here if needed
            console.error("Unauthorized access, token may be invalid or expired.");
        }
        return Promise.reject(error);
    }
);

export default apiClient;
