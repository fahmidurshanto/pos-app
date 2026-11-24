import { apiClient, ApiResponse } from '@/services/api-client';
import { ApiPurchaseItem, CreatePurchasePayload } from '@/types/api-types';
import { authStorage } from '@/utils/auth-storage';

export const purchaseService = {
  // API 23: GET /api/v1/purchases
  async getPurchases(params?: {
    company?: string;
    auto?: string | number;
    name?: string;
    supplier_id?: string;
    row_id?: string | number;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<ApiPurchaseItem[]>> {
    const targetCompany = params?.company || authStorage.getActiveCompany();
    return apiClient<ApiPurchaseItem[]>('/api/v1/purchases', {
      method: 'GET',
      params: {
        company: targetCompany,
        ...params,
      },
    });
  },

  // API 24: POST /api/v1/purchases
  async createPurchase(payload: CreatePurchasePayload): Promise<ApiResponse<{ NewID: string }>> {
    const targetCompany = payload.company || authStorage.getActiveCompany();
    return apiClient('/api/v1/purchases', {
      method: 'POST',
      body: {
        ...payload,
        company: targetCompany,
      },
    });
  },

  // API 25: PUT /api/v1/purchases
  async updatePurchase(
    row_id: string | number,
    payload: CreatePurchasePayload
  ): Promise<ApiResponse<{ UpdateID: string }>> {
    const targetCompany = payload.company || authStorage.getActiveCompany();
    return apiClient('/api/v1/purchases', {
      method: 'PUT',
      body: {
        row_id: String(row_id),
        ...payload,
        company: targetCompany,
      },
    });
  },

  // API 26: PATCH /api/v1/purchases (Delete)
  async deletePurchase(row_id: string | number): Promise<ApiResponse<{ RowID: string }>> {
    return apiClient('/api/v1/purchases', {
      method: 'PATCH',
      body: {
        row_id: String(row_id),
      },
    });
  },

  // API 27: GET /api/v1/postToAccount
  async postToAccount(
    row_id: string | number,
    userId?: string,
    company?: string
  ): Promise<ApiResponse<any>> {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient('/api/v1/postToAccount', {
      method: 'GET',
      params: {
        company: targetCompany,
        row_id: String(row_id),
        user_id: userId,
      },
    });
  },
};

