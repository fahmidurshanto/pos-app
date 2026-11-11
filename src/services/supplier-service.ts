import { apiClient } from '@/services/api-client';
import { API_CONFIG } from '@/constants/api';
import { ApiSupplier } from '@/types/api-types';

export const supplierService = {
  async getSuppliers(company: string = API_CONFIG.DEFAULT_COMPANY) {
    return apiClient<ApiSupplier[]>('/api/v1/suppliers', {
      method: 'GET',
      params: { company },
    });
  },

  async createSupplier(payload: Omit<ApiSupplier, 'RowID' | 'id'>) {
    return apiClient('/api/v1/suppliers', {
      method: 'POST',
      body: payload,
    });
  },

  async updateSupplier(row_id: string | number, payload: Partial<ApiSupplier>) {
    return apiClient('/api/v1/suppliers', {
      method: 'PUT',
      body: { row_id: String(row_id), ...payload },
    });
  },

  async deleteSupplier(row_id: string | number) {
    return apiClient('/api/v1/suppliers', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },
};

