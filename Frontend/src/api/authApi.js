import axiosClient from './axiosClient';

export const authApi = {
    login: (credentials) => axiosClient.post('/api/v1/auth/login', credentials),
    
    register: (userData) => axiosClient.post('/api/v1/auth/register', userData),
    
    getMe: () => axiosClient.get('/api/v1/auth/me'),
    
    logout: () => axiosClient.post('/api/v1/auth/logout'),
};