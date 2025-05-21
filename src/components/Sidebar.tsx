import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Box, HelpCircle, Menu } from 'lucide-react';

interface SidebarProps {
  selected: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ selected }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/usuarios', icon: Users, label: 'Usuarios' },
    { path: '/documentos', icon: FileText, label: 'Documentos' },
    { path: '/recursos-ra', icon: Box, label: 'Recursos RA' },
    { path: '/preguntas-frecuentes', icon: HelpCircle, label: 'Preguntas Frecuentes' },
  ];

  return (
    <aside className={`bg-white shadow-lg transition-all duration-300 ${isMinimized ? 'w-16' : 'w-64'}`}>
      <div className="p-5 flex items-center justify-between bg-red-600">
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-white hover:text-gray-200"
        >
          <Menu className="w-6 h-6" />
        </button>
        {!isMinimized && <span className="text-lg font-semibold text-white">Menú</span>}
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 ${
                isActive ? 'bg-red-50 text-red-600' : ''
              }`}
            >
              <Icon className="w-6 h-6" />
              {!isMinimized && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}; 