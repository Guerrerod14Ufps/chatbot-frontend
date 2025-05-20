import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, UserCircle, Pencil, Square, ChevronLeft, ChevronRight } from 'lucide-react';

const usuarios = [
  { nombre: 'ANDERSSON CAMILO CARDENAS GUARIN', rol: 'Estudiante', estado: 'ACTIVO' },
  { nombre: 'ANDRES ALFONSO PARRA GARZON', rol: 'Estudiante', estado: 'INACTIVO' },
  { nombre: 'MAURICIO DI DONATO SANCHEZ', rol: 'Estudiante', estado: 'ACTIVO' },
];

export const Usuarios: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#d3d3d3] flex">
      <Sidebar selected="Usuarios" />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-md shadow">
              <Search className="text-gray-400 mr-2 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar usuario"
                className="flex-1 bg-transparent outline-none text-gray-700"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usuarios.map((usuario, idx) => (
              <div key={idx} className="bg-white rounded shadow p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <UserCircle className="text-gray-400 w-10 h-10" />
                  <div>
                    <div className="font-semibold text-xs leading-tight">{usuario.nombre}</div>
                    <div className="text-xs text-gray-500">{usuario.rol}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button className="text-xs text-gray-600 flex items-center gap-1 hover:underline">
                    Asignar rol <Pencil className="w-4 h-4" />
                  </button>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${usuario.estado === 'ACTIVO' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{usuario.estado}</span>
                  <button className="ml-auto"><Square className="text-gray-500 w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-8">
            <button className="text-gray-500 hover:text-gray-700"><ChevronLeft className="w-5 h-5" /></button>
            <span className="font-semibold">1</span>
            <button className="text-gray-500 hover:text-gray-700"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </main>
      </div>
    </div>
  );
}; 