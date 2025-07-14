import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and new response format
api.interceptors.response.use(
  response => response,
  error => {
    let message = 'Something went wrong!';
    if (error.response) {
      // Backend responded with an error
      message = error.response.data?.message || message;
    } else if (error.request) {
      // No response from backend (network error)
      message = 'Network error. Please check your connection.';
    }
    // Log for debugging
    console.error('API Error:', error);
    // Throw just the message string
    throw message;
  }
);

// Helper function to extract data from response
const extractData = (response) => {
  if (response.data && response.data.success !== undefined) {
    return response.data.data || response.data;
  }
  return response.data;
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return {
      ...response,
      data: extractData(response)
    };
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return {
      ...response,
      data: extractData(response)
    };
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return {
      ...response,
      data: extractData(response)
    };
  },
};

// Books API
export const booksAPI = {
  getAll: async (params) => {
    const response = await api.get('/books', { params });
    return {
      ...response,
      data: extractData(response)
    };
  },
  
  getById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return {
      ...response,
      data: extractData(response)
    };
  },
  
  create: async (bookData) => {
    const response = await api.post('/books', bookData);
    return {
      ...response,
      data: extractData(response)
    };
  },
  
  update: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return {
      ...response,
      data: extractData(response)
    };
  },
  
  delete: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return {
      ...response,
      data: extractData(response)
    };
  },
};

// Reviews API
export const reviewsAPI = {
  getByBookId: async (bookId, params) => {
    const response = await api.get(`/books/${bookId}/reviews`, { params });
    return {
      ...response,
      data: extractData(response)
    };
  },
  
  create: async (bookId, reviewData) => {
    const response = await api.post(`/books/${bookId}/reviews`, reviewData);
    return {
      ...response,
      data: extractData(response)
    };
  },
};

export default api; 