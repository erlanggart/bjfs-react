import api from './api';

// Authentication endpoints
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Member endpoints
export const memberService = {
  getAll: async (params) => {
    const response = await api.get('/api/members', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/members/${id}`);
    return response.data;
  },

  create: async (memberData) => {
    const response = await api.post('/api/members', memberData);
    return response.data;
  },

  update: async (id, memberData) => {
    const response = await api.put(`/api/members/${id}`, memberData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/members/${id}`);
    return response.data;
  },
};

// Attendance endpoints
export const attendanceService = {
  getAll: async (params) => {
    const response = await api.get('/api/attendance', { params });
    return response.data;
  },

  mark: async (attendanceData) => {
    const response = await api.post('/api/attendance', attendanceData);
    return response.data;
  },

  getStats: async (params) => {
    const response = await api.get('/api/attendance/stats', { params });
    return response.data;
  },
};

// Branch endpoints
export const branchService = {
  getAll: async () => {
    const response = await api.get('/api/branches');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/branches/${id}`);
    return response.data;
  },

  create: async (branchData) => {
    const response = await api.post('/api/branches', branchData);
    return response.data;
  },

  update: async (id, branchData) => {
    const response = await api.put(`/api/branches/${id}`, branchData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/branches/${id}`);
    return response.data;
  },
};

// Schedule endpoints
export const scheduleService = {
  getAll: async (params) => {
    const response = await api.get('/api/schedules', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/schedules/${id}`);
    return response.data;
  },

  create: async (scheduleData) => {
    const response = await api.post('/api/schedules', scheduleData);
    return response.data;
  },

  update: async (id, scheduleData) => {
    const response = await api.put(`/api/schedules/${id}`, scheduleData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/schedules/${id}`);
    return response.data;
  },
};

// Analytics endpoints
export const analyticsService = {
  getRealtime: async () => {
    const response = await api.get('/api/analytics/realtime');
    return response.data;
  },

  getHistorical: async (params) => {
    const response = await api.get('/api/analytics/historical', { params });
    return response.data;
  },
};

// File upload helper
export const uploadFile = async (file, uploadType = 'documents') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadType', uploadType);

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
