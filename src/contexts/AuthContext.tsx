import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as api from '../services/api';

type RolUsuario = 'admin' | 'docente' | 'estudiante';

interface AuthContextType {
  isAuthenticated: boolean;
  rol: RolUsuario | null;
  fullname: string | null;
  photo: string | null;
  login: (rol: RolUsuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState<RolUsuario | null>(null);
  const [fullname, setFullname] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await api.getProfile();
          setIsAuthenticated(true);
          setRol(profile.role || 'estudiante');
          setFullname(profile.fullname || null);
          setPhoto(profile.photo || profile.photo_url || null);
        } catch (error) {
          // Si hay error al obtener el perfil, limpiamos el token
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setRol(null);
          setFullname(null);
          setPhoto(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (rol: RolUsuario) => {
    setIsAuthenticated(true);
    setRol(rol);
  };

  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
    setRol(null);
    setFullname(null);
    setPhoto(null);
  };

  if (isLoading) {
    return <div>Cargando...</div>; // O un componente de loading más elaborado
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, rol, fullname, photo, login, logout }}>
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