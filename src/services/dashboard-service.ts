import { apiClient } from '@/services/api-client';
import { API_CONFIG } from '@/constants/api';
import { DashboardData } from '@/types/api-types';

export const dashboardService = {
  async getDashboardData(company: string = API_CONFIG.DEFAULT_COMPANY, year: string = '2026') {
    return apiClient<DashboardData>('/api/v1/dashboard', {
      method: 'GET',
      params: { company, year },
    });
  },
};

