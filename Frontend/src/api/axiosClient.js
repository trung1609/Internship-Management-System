import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosClient(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {}, {
                    withCredentials: true 
                });

                const newAccessToken = res.data.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);
                
                axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                processQueue(null, newAccessToken);
                
                return axiosClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                
                localStorage.removeItem('accessToken');
                window.location.href = '/login'; 
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;