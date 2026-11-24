import { apiClient } from '@/services/api-client';
import { authStorage } from '@/utils/auth-storage';
import { ApiSupplier } from '@/types/api-types';

export const supplierService = {
  async getSuppliers(company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient<ApiSupplier[]>('/api/v1/suppliers', {
      method: 'GET',
      params: { company: targetCompany },
    });
  },

  async createSupplier(payload: Omit<ApiSupplier, 'RowID' | 'id'>) {
    const targetCompany = payload.company || authStorage.getActiveCompany();
    return apiClient('/api/v1/suppliers', {
      method: 'POST',
      body: { ...payload, company: targetCompany },
    });
  },

  async updateSupplier(row_id: string | number, payload: Partial<ApiSupplier>) {
    const targetCompany = payload.company || authStorage.getActiveCompany();
    return apiClient('/api/v1/suppliers', {
      method: 'PUT',
      body: { row_id: String(row_id), ...payload, company: targetCompany },
    });
  },

  async deleteSupplier(row_id: string | number) {
    return apiClient('/api/v1/suppliers', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },
};
