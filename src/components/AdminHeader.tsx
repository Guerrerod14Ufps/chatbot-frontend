import React, { useState, useRef, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ROL_LABELS: Record<string, string> = {
  admin: 'Administrador',
  profesor: 'Profesor',
  estudiante: 'Estudiante',
};

interface AdminHeaderProps {
  onLogout?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { rol, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    if (onLogout) onLogout();
    logout();
  };

  return (
    <header className="w-full bg-red-600 py-3 px-8 flex items-center justify-end relative">
      <div className="relative" ref={ref}>
        <button
          className="bg-white rounded-full p-2 shadow hover:bg-gray-100"
          onClick={() => setOpen((v) => !v)}
        >
          <UserCircle className="w-7 h-7 text-red-600" />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-50">
            <div className="px-4 py-2 text-gray-800 font-semibold border-b">
              {ROL_LABELS[rol || 'admin']}
            </div>
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-800"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}; 