import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'rh' | 'user';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demonstration
const mockUsers = [
  { id: '1', name: 'Admin Sistema', email: 'admin@empresa.com', password: 'admin123', role: 'admin' as const },
  { id: '2', name: 'RH Manager', email: 'rh@empresa.com', password: 'rh123', role: 'rh' as const },
  { id: '3', name: 'Usuário Teste', email: 'user@empresa.com', password: 'user123', role: 'user' as const },
];

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);