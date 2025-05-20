import React from 'react';

const menuItems = [
  'Usuarios',
  'Documentos',
  'Recursos RA',
  'Preguntas Frecuentes',
  'Estadísticas',
];

export const Sidebar: React.FC<{selected?: string}> = ({ selected = 'Usuarios' }) => (
  <aside className="bg-red-700 w-56 min-h-screen py-4 flex flex-col">
    <div className="px-6 mb-4">
      <button className="text-white flex items-center gap-2 mb-4">
        <span className="material-icons">menu</span>
        <span className="font-semibold">Usuarios</span>
      </button>
    </div>
    <nav className="flex-1">
      {menuItems.map(item => (
        <a
          key={item}
          href="#"
          className={`block px-6 py-3 text-left font-medium text-white rounded-none transition-colors ${selected === item ? 'bg-red-600' : 'hover:bg-red-500'}`}
        >
          {item}
        </a>
      ))}
    </nav>
  </aside>
); 