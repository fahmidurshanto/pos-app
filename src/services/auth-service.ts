import { apiClient } from '@/services/api-client';
import { LoginResponseData } from '@/types/api-types';

export const authService = {
  async login(username: string = 'admin@bditpark.com', password: string = '123456') {
    return apiClient<LoginResponseData>('/api/v1/login', {
      method: 'POST',
      body: { username, password },
    });
  },
};

