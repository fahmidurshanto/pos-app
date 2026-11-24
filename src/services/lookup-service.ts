import { apiClient } from '@/services/api-client';
import { authStorage } from '@/utils/auth-storage';
import { ApiCategory, ApiSubCategory, ApiUnit, ApiBrand } from '@/types/api-types';

export const lookupService = {
  // Categories (API 7-10)
  async getCategories(company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient<ApiCategory[]>('/api/v1/category', {
      method: 'GET',
      params: { company: targetCompany },
    });
  },

  async createCategory(category: string, company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient('/api/v1/category', {
      method: 'POST',
      body: { category, company: targetCompany, status: '1' },
    });
  },

  async updateCategory(row_id: string | number, category: string, company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient('/api/v1/category', {
      method: 'PUT',
      body: { row_id: String(row_id), category, company: targetCompany, status: '1' },
    });
  },

  async deleteCategory(row_id: string | number) {
    return apiClient('/api/v1/category', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },

  // Sub Categories (API 11-14)
  async getSubCategories(company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient<ApiSubCategory[]>('/api/v1/subcats', {
      method: 'GET',
      params: { company: targetCompany },
    });
  },

  async createSubCategory(payload: { subcat: string; category_id: string; company?: string }) {
    const targetCompany = payload.company || authStorage.getActiveCompany();
    return apiClient('/api/v1/subcats', {
      method: 'POST',
      body: {
        subcat: payload.subcat,
        category_id: payload.category_id,
        company: targetCompany,
      },
    });
  },

  async updateSubCategory(row_id: string | number, payload: { subcat: string; category_id: string; company?: string }) {
    const targetCompany = payload.company || authStorage.getActiveCompany();
    return apiClient('/api/v1/subcats', {
      method: 'PUT',
      body: {
        row_id: String(row_id),
        subcat: payload.subcat,
        category_id: payload.category_id,
        company: targetCompany,
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
  async getUnits(company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient<ApiUnit[]>('/api/v1/units', {
      method: 'GET',
      params: { company: targetCompany, auto: 1 },
    });
  },

  async createUnit(unit: string, company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient('/api/v1/units', {
      method: 'POST',
      body: { unit, company: targetCompany },
    });
  },

  async updateUnit(row_id: string | number, unit: string, company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient('/api/v1/units', {
      method: 'PUT',
      body: { row_id: String(row_id), unit, company: targetCompany },
    });
  },

  async deleteUnit(row_id: string | number) {
    return apiClient('/api/v1/units', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },

  // Brands (Setting / Products -> Brands)
  async getBrands(company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient<ApiBrand[]>('/api/v1/brands', {
      method: 'GET',
      params: { company: targetCompany },
    });
  },

  async createBrand(brand: string, company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient('/api/v1/brands', {
      method: 'POST',
      body: { brand, company: targetCompany, status: '1' },
    });
  },

  async updateBrand(row_id: string | number, brand: string, company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient('/api/v1/brands', {
      method: 'PUT',
      body: { row_id: String(row_id), brand, company: targetCompany, status: '1' },
    });
  },

  async deleteBrand(row_id: string | number) {
    return apiClient('/api/v1/brands', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },
};
