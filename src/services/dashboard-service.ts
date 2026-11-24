import { apiClient } from '@/services/api-client';
import { authStorage } from '@/utils/auth-storage';
import { DashboardData } from '@/types/api-types';

export const dashboardService = {
  async getDashboardData(company?: string, year: string = '2026') {
    const targetCompany = company || authStorage.getActiveCompany();
    return apiClient<DashboardData>('/api/v1/dashboard', {
      method: 'GET',
      params: { company: targetCompany, year },
    });
  },
};
