import React, { useState, useRef, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { setUserPhoto, unsetUserPhoto} from '../services/api';

const ROL_LABELS: Record<string, string> = {
  admin: 'Administrador',
  docente: 'Docente',
  estudiante: 'Estudiante',
};

interface AdminHeaderProps {
  onLogout?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { rol, fullname, photo, logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const updatePhotoInContext = async () => {
    try {
      window.location.reload(); // Solución rápida, idealmente usar contexto
    } catch {}
  };

  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await setUserPhoto(file);
      await updatePhotoInContext();
    } catch (err) {
      alert('Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };

  const handleUnsetPhoto = async () => {
    setUploading(true);
    try {
      await unsetUserPhoto();
      await updatePhotoInContext();
    } catch (err) {
      alert('Error al eliminar la foto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <header className="w-full bg-red-600 py-3 px-8 flex items-center justify-end relative">
      <div className="relative" ref={ref}>
        <button
          className="bg-white rounded-full p-2 shadow hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          title="Abrir menú de usuario"
        >
          {photo ? (
            <img src={photo} alt="Foto de perfil" className="w-7 h-7 rounded-full object-cover" />
          ) : fullname ? (
            <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">
              {fullname.charAt(0).toUpperCase()}
            </span>
          ) : (
            <UserCircle className="w-7 h-7 text-red-600" />
          )}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg py-2 z-50">
            <div className="flex flex-col items-center gap-2 px-4 py-4 border-b">
              {photo ? (
                <img src={photo} alt="Foto de perfil" className="w-16 h-16 rounded-full object-cover" />
              ) : fullname ? (
                <span className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-3xl">
                  {fullname.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserCircle className="w-16 h-16 text-red-400" />
              )}
              <div className="flex flex-col items-center mt-2">
                <span className="text-gray-800 font-semibold truncate max-w-[140px]">{fullname || 'Usuario'}</span>
                <span className="text-gray-500 text-sm truncate">{ROL_LABELS[rol || 'admin']}</span>
              </div>
              <button
                className="mt-3 px-4 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium border border-gray-200"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                disabled={uploading}
              >
                {photo ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
              </button>
              {photo && (
                <button
                  className="mt-1 px-4 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-red-600 text-sm font-medium border border-gray-200"
                  onClick={handleUnsetPhoto}
                  disabled={uploading}
                >
                  Quitar foto de perfil
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
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