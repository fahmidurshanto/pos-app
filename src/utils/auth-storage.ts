const memoryStorage = new Map<string, string>();

let activeCompanyId: string = '';

export const authStorage = {
  setActiveCompany(company: string) {
    activeCompanyId = company;
  },

  getActiveCompany(): string {
    return activeCompanyId;
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
    memoryStorage.set(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // ignore
    }
    return memoryStorage.get(key) || null;
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
    memoryStorage.delete(key);
  },
};
