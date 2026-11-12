import { apiClient } from '@/services/api-client';
import { API_CONFIG } from '@/constants/api';

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
  company: string;
}

export const saleService = {
  // GET Sales List (Endpoint: /api/v1/sales)
  async getSales(company: string = API_CONFIG.SALES_COMPANY, search?: string) {
    return apiClient('/api/v1/sales', {
      method: 'GET',
      params: { company, search },
    });
  },

  // POST Create Sale (Endpoint: /api/v1/sales)
  async createSale(payload: SaleOrderPayload) {
    return apiClient('/api/v1/sales', {
      method: 'POST',
      body: { ...payload, company: payload.company || API_CONFIG.SALES_COMPANY },
    });
  },
};
