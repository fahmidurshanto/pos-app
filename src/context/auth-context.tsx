import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth-service';
import { Employee, Company, Privilege, LoginResponseData } from '@/types/api-types';
import { authStorage } from '@/utils/auth-storage';

interface AuthContextType {
  user: Employee | null;
  company: Company | null;
  privileges: Privilege[];
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'POS_AUTH_USER';
const AUTH_COMPANY_KEY = 'POS_AUTH_COMPANY';
const AUTH_ROLE_KEY = 'POS_AUTH_ROLE';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await authStorage.getItem(AUTH_USER_KEY);
        const storedCompany = await authStorage.getItem(AUTH_COMPANY_KEY);
        const storedRole = await authStorage.getItem(AUTH_ROLE_KEY);

        if (storedUser && storedCompany) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setCompany(JSON.parse(storedCompany));
          setRole(storedRole);
          if (parsedUser?.company) {
            authStorage.setActiveCompany(String(parsedUser.company));
          }
        }
      } catch (e) {
        console.error('Failed to restore auth session:', e);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await authService.login(username, password);

      if (res.error === 'False' && res.data) {
        const data = res.data;
        setUser(data.employee);
        setCompany(data.company);
        setPrivileges(data.privilise || []);
        setRole(data.role || null);

        if (data.employee?.company) {
          authStorage.setActiveCompany(String(data.employee.company));
        }

        await authStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.employee));
        await authStorage.setItem(AUTH_COMPANY_KEY, JSON.stringify(data.company));
        if (data.role) await authStorage.setItem(AUTH_ROLE_KEY, data.role);

        return { success: true };
      } else {
        return {
          success: false,
          message: res.message || 'Invalid username or password',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Login request failed. Please check network.',
      };
    }
  };

  const logout = async () => {
    setUser(null);
    setCompany(null);
    setPrivileges([]);
    setRole(null);
    authStorage.setActiveCompany('');
    await authStorage.removeItem(AUTH_USER_KEY);
    await authStorage.removeItem(AUTH_COMPANY_KEY);
    await authStorage.removeItem(AUTH_ROLE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        privileges,
        role,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

