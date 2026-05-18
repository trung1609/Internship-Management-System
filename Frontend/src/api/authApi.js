import axiosClient from './axiosClient';

export const authApi = {
    login: (credentials) => axiosClient.post('/api/v1/auth/login', credentials),
    
    getMe: () => axiosClient.get('/api/v1/auth/me'),
    
    logout: () => axiosClient.post('/api/v1/auth/logout'),
};