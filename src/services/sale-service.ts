import { apiClient } from '@/services/api-client';
import { authStorage } from '@/utils/auth-storage';

export interface SaleOrderPayload {
  customer_name: string;
  mobile?: string;
  address?: string;
  date: string;
  note?: string;
  items: {
    product_id: string;
    product: string;
    sku: string;
    unit: string;
    rate: number;
    qty: number;
    total: number;
  }[];
  total_amount: number;
  discount: number;
  payment: number;
  due: number;
  company?: string;
}

export const saleService = {
  // GET Sales List (Endpoint: /api/v1/sales)
  async getSales(company?: string, search?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient('/api/v1/sales', {
      method: 'GET',
      params: { company: targetCompany, search },
    });
  },

  // GET Sale Order Details by row_id (Endpoint: /api/v1/sales?row_id=...)
  async getSaleDetails(row_id: string | number, company?: string) {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient('/api/v1/sales', {
      method: 'GET',
      params: { company: targetCompany, row_id: String(row_id) },
    });
  },

  // POST Create Sale (Endpoint: /api/v1/sales)
  async createSale(payload: SaleOrderPayload) {
    const targetCompany = payload.company || authStorage.getActiveCompany();
    return apiClient('/api/v1/sales', {
      method: 'POST',
      body: { ...payload, company: targetCompany },
    });
  },

  // PATCH Delete Sale (Endpoint: /api/v1/sales)
  async deleteSale(row_id: string | number) {
    return apiClient('/api/v1/sales', {
      method: 'PATCH',
      body: { row_id: String(row_id) },
    });
  },
};
