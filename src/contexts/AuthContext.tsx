import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type RolUsuario = 'admin' | 'profesor' | 'estudiante';

interface AuthContextType {
  isAuthenticated: boolean;
  rol: RolUsuario | null;
  login: (rol?: RolUsuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState<RolUsuario | null>(null);

  const login = (rol: RolUsuario = 'admin') => {
    setIsAuthenticated(true);
    setRol(rol);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 