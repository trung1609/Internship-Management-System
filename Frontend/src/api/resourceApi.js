import axiosClient from './axiosClient';

export const studentApi = {
    // Get all students (Admin/Mentor only)
    getAllStudents: (page = 0, size = 10) =>
        axiosClient.get('/api/v1/students', { params: { page, size } }),

    // Get current student info
    getCurrentStudentInfo: () =>
        axiosClient.get('/api/v1/students/me'),

    // Get student by ID
    getStudentById: (studentId) =>
        axiosClient.get(`/api/v1/students/${studentId}`),

    // Create student (Admin only)
    createStudent: (data) =>
        axiosClient.post('/api/v1/students', data),

    // Update student info
    updateStudent: (studentId, data) =>
        axiosClient.put(`/api/v1/students/${studentId}`, data),
};

export const mentorApi = {
    // Get all mentors
    getAllMentors: (page = 0, size = 10) =>
        axiosClient.get('/api/v1/mentors', { params: { page, size } }),

    // Get mentor by ID
    getMentorById: (mentorId) =>
        axiosClient.get(`/api/v1/mentors/${mentorId}`),

    // Create mentor (Admin only)
    createMentor: (data) =>
        axiosClient.post('/api/v1/mentors', data),

    // Update mentor info (Admin/Mentor)
    updateMentor: (mentorId, data) =>
        axiosClient.put(`/api/v1/mentors/${mentorId}`, data),
};

export const userApi = {
    // Get all users by role (Admin) - returns PageResponseDTO
    getAllUsers: (role = '', page = 0, size = 10) =>
        axiosClient.get('/api/v1/users/profiles', { params: { role, page, size } }),

    // Get user by ID - returns ApiResponse
    getUserById: (userId) =>
        axiosClient.get(`/api/v1/users/${userId}`),

    // Create user (Admin) - returns ApiResponse
    createUser: (data) =>
        axiosClient.post('/api/v1/users', data),

    // Update user info - returns ApiResponse
    updateUser: (userId, data) =>
        axiosClient.put(`/api/v1/users/${userId}`, data),

    // Update user role (Admin) - returns ApiResponse
    updateUserRole: (userId, data) =>
        axiosClient.put(`/api/v1/users/${userId}/role`, data),

    // Update user status - returns ApiResponse
    updateUserStatus: (userId) =>
        axiosClient.put(`/api/v1/users/${userId}/status`),

    // Delete user (Admin) - returns ApiResponse
    deleteUser: (userId) =>
        axiosClient.delete(`/api/v1/users/${userId}`),
};
