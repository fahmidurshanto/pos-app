import { API_CONFIG } from '@/constants/api';

export interface ApiResponse<T = any> {
  error: 'False' | 'True' | boolean;
  code?: string | number;
  message?: string;
  data?: T;
  RowID?: string | number;
  UpdateID?: string | number;
  pages?: {
    centerpage?: string;
    total_page?: number;
    total_row?: number;
    offset?: number;
  };
  [key: string]: any;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, string | number | undefined | null>;
  body?: any;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', params, body } = options;

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (params) {
    const query = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    if (query) {
      url += (url.includes('?') ? '&' : '?') + query;
    }
  }

  const headers: Record<string, string> = {
    'x-api-key': API_CONFIG.X_API_KEY,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await response.json();
    return json as ApiResponse<T>;
  } catch (error: any) {
    console.error(`API Error on [${method}] ${url}:`, error);
    return {
      error: 'True',
      code: 500,
      message: error?.message || 'Network request failed',
    };
  }
}

