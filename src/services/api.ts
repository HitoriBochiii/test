import axios, { AxiosError, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string | null;
  };
  token: string;
  profile: {
    id: string;
    user_id: string;
    full_name: string | null;
    phone: string | null;
    division: string | null;
    job_title: string | null;
    avatar_url: string | null;
  } | null;
  role: 'admin' | 'user';
}

// ==================== AUTH API ====================

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getProfile: async (): Promise<AuthResponse['profile']> => {
    const response = await apiClient.get<AuthResponse['profile']>('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<AuthResponse['profile']>): Promise<AuthResponse['profile']> => {
    const response = await apiClient.put<AuthResponse['profile']>('/auth/profile', data);
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.put('/auth/password', { current_password: currentPassword, new_password: newPassword });
  },
};

// ==================== INVENTORY API ====================

export interface IncomingGoodsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const inventoryApi = {
  // Incoming Goods
  getIncomingGoods: async (params: IncomingGoodsParams = {}): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get('/incoming-goods', { params });
    return response.data;
  },

  getIncomingGoodsById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/incoming-goods/${id}`);
    return response.data;
  },

  createIncomingGoods: async (data: any): Promise<any> => {
    const response = await apiClient.post('/incoming-goods', data);
    return response.data;
  },

  updateIncomingGoods: async (id: string, data: any): Promise<any> => {
    const response = await apiClient.put(`/incoming-goods/${id}`, data);
    return response.data;
  },

  deleteIncomingGoods: async (id: string): Promise<void> => {
    await apiClient.delete(`/incoming-goods/${id}`);
  },

  importIncomingGoods: async (file: File): Promise<{ count: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/incoming-goods/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Outgoing Goods
  getOutgoingGoods: async (params: IncomingGoodsParams = {}): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get('/outgoing-goods', { params });
    return response.data;
  },

  getOutgoingGoodsById: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/outgoing-goods/${id}`);
    return response.data;
  },

  createOutgoingGoods: async (data: any): Promise<any> => {
    const response = await apiClient.post('/outgoing-goods', data);
    return response.data;
  },

  updateOutgoingGoods: async (id: string, data: any): Promise<any> => {
    const response = await apiClient.put(`/outgoing-goods/${id}`, data);
    return response.data;
  },

  deleteOutgoingGoods: async (id: string): Promise<void> => {
    await apiClient.delete(`/outgoing-goods/${id}`);
  },

  importOutgoingGoods: async (file: File): Promise<{ count: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/outgoing-goods/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// ==================== DASHBOARD API ====================

export interface DashboardStats {
  totalIncoming: number;
  totalOutgoing: number;
  totalAsset: number;
  totalSewa: number;
  pendingItems: number;
  activeAllocations: number;
}

export interface ChartDataPoint {
  name: string;
  masuk: number;
  keluar: number;
}

export interface OwnershipDataPoint {
  name: string;
  value: number;
  color: string;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  getChartData: async (months: number = 6): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get<ChartDataPoint[]>('/dashboard/chart', { params: { months } });
    return response.data;
  },

  getOwnershipData: async (): Promise<OwnershipDataPoint[]> => {
    const response = await apiClient.get<OwnershipDataPoint[]>('/dashboard/ownership');
    return response.data;
  },
};

// ==================== NOTIFICATIONS API ====================

export interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const notificationsApi = {
  getNotifications: async (limit: number = 20): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/notifications', { params: { limit } });
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  },
};

// ==================== EXPORT API ====================

export const exportApi = {
  exportIncoming: async (): Promise<Blob> => {
    const response = await apiClient.get('/export/incoming', { responseType: 'blob' });
    return response.data;
  },

  exportOutgoing: async (): Promise<Blob> => {
    const response = await apiClient.get('/export/outgoing', { responseType: 'blob' });
    return response.data;
  },

  exportCombined: async (): Promise<Blob> => {
    const response = await apiClient.get('/export/combined', { responseType: 'blob' });
    return response.data;
  },
};
