import React, { useState, useRef, useEffect } from 'react';
import { UserCircle } from 'lucide-react';

interface AdminHeaderProps {
  onLogout?: () => void;
  userName?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout, userName = 'Administrador' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <div className="px-4 py-2 text-gray-800 font-semibold border-b">{userName}</div>
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-800"
              onClick={onLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}; 