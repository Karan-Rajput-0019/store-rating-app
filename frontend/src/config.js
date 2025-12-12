// API Configuration
export const API_CONFIG = {
  BASE_URL: '/api', // This will be proxied to http://localhost:5000
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/me',
    },
    STORES: {
      BASE: '/stores',
      BY_ID: (id) => `/stores/${id}`,
      RATINGS: (storeId) => `/stores/${storeId}/ratings`,
      RATING_BY_ID: (storeId, ratingId) => `/stores/${storeId}/ratings/${ratingId}`,
    },
    USERS: {
      BASE: '/users',
      BY_ID: (id) => `/users/${id}`,
    },
  },
  STORAGE_KEYS: {
    AUTH_TOKEN: 'token',
    USER: 'user',
  },
  ROLES: {
    ADMIN: 'admin',
    OWNER: 'owner',
    CUSTOMER: 'customer',
  },
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    STORES: '/stores',
    STORE_DETAIL: (id) => `/stores/${id}`,
    ADMIN: {
      DASHBOARD: '/admin',
      USERS: '/admin/users',
      STORES: '/admin/stores',
    },
    OWNER: {
      DASHBOARD: '/owner',
    },
  },
};

// UI Configuration
export const UI_CONFIG = {
  APP_NAME: 'Store Rating App',
  THEME: {
    PRIMARY_COLOR: '#4F46E5',
    SECONDARY_COLOR: '#6366F1',
    TEXT_COLOR: '#1F2937',
    LIGHT_BG: '#F9FAFB',
    DARK_BG: '#111827',
  },
  TOAST: {
    POSITION: 'top-right',
    AUTO_CLOSE: 3000,
  },
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },
  PASSWORD: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  },
  STORE_NAME: {
    required: 'Store name is required',
    minLength: {
      value: 3,
      message: 'Store name must be at least 3 characters',
    },
  },
  RATING: {
    required: 'Rating is required',
    min: {
      value: 1,
      message: 'Rating must be at least 1',
    },
    max: {
      value: 5,
      message: 'Rating cannot be more than 5',
    },
  },
};

export default {
  API_CONFIG,
  UI_CONFIG,
  VALIDATION_RULES,
};
