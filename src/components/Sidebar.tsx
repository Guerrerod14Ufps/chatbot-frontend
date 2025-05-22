import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Box, HelpCircle, Menu, BarChart2, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  selected: string;
}

export const Sidebar: React.FC<SidebarProps> = ({  }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();
  const { rol } = useAuth();

  // Opciones según el rol
  const menuItems = [
    { path: '/usuarios', icon: Users, label: 'Usuarios', roles: ['admin'] },
    { path: '/categorias', icon: Box, label: 'Categorías', roles: ['admin'] },
    { path: '/documentos', icon: FileText, label: 'Documentos', roles: ['admin'] },
    { path: '/recursos-ra', icon: Box, label: 'Recursos RA', roles: ['admin', 'profesor', 'estudiante'] },
    { path: '/chatbot', icon: MessageCircle, label: 'Chatbot', roles: ['admin', 'profesor', 'estudiante'] },
    { path: '/preguntas-frecuentes', icon: HelpCircle, label: 'Preguntas Frecuentes', roles: ['admin', 'profesor', 'estudiante'] },
    { path: '/estadisticas', icon: BarChart2, label: 'Estadísticas', roles: ['admin'] },
  ];

  const itemsFiltrados = menuItems.filter(item => !rol || item.roles.includes(rol));

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
        {itemsFiltrados.map((item) => {
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