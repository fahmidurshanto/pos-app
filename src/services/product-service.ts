import { apiClient } from '@/services/api-client';
import { API_CONFIG } from '@/constants/api';
import { ApiProduct } from '@/types/api-types';

export interface CreateProductPayload {
  product: string;
  sku: string;
  category_id: string;
  subcat_id?: string;
  unit_id: string;
  brand_id?: string;
  buy_price: string;
  sale_price: string;
  margin?: string;
  description?: string;
  barcode?: string;
  company: string;
}

export const productService = {
  async getProducts(company: string = API_CONFIG.DEFAULT_COMPANY, name?: string) {
    return apiClient<ApiProduct[]>('/api/v1/products', {
      method: 'GET',
      params: { company, auto: 1, name },
    });
  },

  async createProduct(payload: CreateProductPayload) {
    return apiClient('/api/v1/products', {
      method: 'POST',
      body: payload,
    });
  },

  async updateProduct(row_id: string | number, payload: Partial<CreateProductPayload>) {
    return apiClient('/api/v1/products', {
      method: 'PUT',
      body: { row_id: String(row_id), ...payload },
    });
  },

  async deleteProduct(row_id: string | number) {
    return apiClient('/api/v1/products', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },
};

