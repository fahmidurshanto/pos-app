import { apiClient } from '@/services/api-client';
import { API_CONFIG } from '@/constants/api';
import { ApiCategory, ApiSubCategory, ApiUnit } from '@/types/api-types';

export const lookupService = {
  // Categories (API 7-10)
  async getCategories(company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient<ApiCategory[]>('/api/v1/category', {
      method: 'GET',
      params: { company },
    });
  },

  async createCategory(category: string, company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient('/api/v1/category', {
      method: 'POST',
      body: { category, company, status: '1' },
    });
  },

  // Sub Categories (API 11-14)
  async getSubCategories(company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient<ApiSubCategory[]>('/api/v1/subcats', {
      method: 'GET',
      params: { company },
    });
  },

  // Units (API 15-18)
  async getUnits(company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient<ApiUnit[]>('/api/v1/units', {
      method: 'GET',
      params: { company, auto: 1 },
    });
  },
};

