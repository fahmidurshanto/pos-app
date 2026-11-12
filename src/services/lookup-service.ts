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

  async updateCategory(row_id: string | number, category: string, company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient('/api/v1/category', {
      method: 'PUT',
      body: { row_id: String(row_id), category, company, status: '1' },
    });
  },

  async deleteCategory(row_id: string | number) {
    return apiClient('/api/v1/category', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },

  // Sub Categories (API 11-14)
  async getSubCategories(company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient<ApiSubCategory[]>('/api/v1/subcats', {
      method: 'GET',
      params: { company },
    });
  },

  async createSubCategory(payload: { subcat: string; category_id: string; company?: string }) {
    return apiClient('/api/v1/subcats', {
      method: 'POST',
      body: {
        subcat: payload.subcat,
        category_id: payload.category_id,
        company: payload.company || API_CONFIG.DEFAULT_COMPANY,
      },
    });
  },

  async updateSubCategory(row_id: string | number, payload: { subcat: string; category_id: string; company?: string }) {
    return apiClient('/api/v1/subcats', {
      method: 'PUT',
      body: {
        row_id: String(row_id),
        subcat: payload.subcat,
        category_id: payload.category_id,
        company: payload.company || API_CONFIG.DEFAULT_COMPANY,
      },
    });
  },

  async deleteSubCategory(row_id: string | number) {
    return apiClient('/api/v1/subcats', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },

  // Units (API 15-18)
  async getUnits(company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient<ApiUnit[]>('/api/v1/units', {
      method: 'GET',
      params: { company, auto: 1 },
    });
  },

  async createUnit(unit: string, company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient('/api/v1/units', {
      method: 'POST',
      body: { unit, company },
    });
  },

  async updateUnit(row_id: string | number, unit: string, company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient('/api/v1/units', {
      method: 'PUT',
      body: { row_id: String(row_id), unit, company },
    });
  },

  async deleteUnit(row_id: string | number) {
    return apiClient('/api/v1/units', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },
};
