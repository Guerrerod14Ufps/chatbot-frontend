import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const menuItems = [
  { label: 'Usuarios', path: '/usuarios' },
  { label: 'Documentos', path: '/documentos' },
  { label: 'Recursos RA', path: '/recursos-ra' },
  { label: 'Preguntas Frecuentes', path: '/preguntas-frecuentes' },
  { label: 'Estadísticas', path: '#' },
];

export const Sidebar: React.FC<{selected?: string}> = ({ selected = 'Usuarios' }) => (
  <aside className="bg-red-700 w-56 min-h-screen py-4 flex flex-col">
    <div className="px-6 mb-4">
      <button className="text-white flex items-center gap-2 mb-4">
        <Menu className="w-5 h-5" />
        <span className="font-semibold">{selected}</span>
      </button>
    </div>
    <nav className="flex-1">
      {menuItems.map(item => (
        <Link
          key={item.label}
          to={item.path}
          className={`block px-6 py-3 text-left font-medium text-white rounded-none transition-colors ${selected === item.label ? 'bg-red-600' : 'hover:bg-red-500'}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  </aside>
); 