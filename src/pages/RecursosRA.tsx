import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, Upload, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const recursos = [
  { nombre: 'Campus Universitario', tipo: 'ar' },
  { nombre: 'Laboratorio de...', tipo: 'ar' },
  { nombre: 'Árbol Binario Bu...', tipo: 'ar' },
];

const iconoAR = (
  <div className="w-16 h-16 mx-auto bg-black rounded flex items-center justify-center">
    <span className="text-white text-3xl font-bold">AR</span>
  </div>
);

export const RecursosRA: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-[#d3d3d3] flex">
      <Sidebar selected="Recursos RA" />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-1 p-8">
          <div className="flex items-center mb-6 gap-4">
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-md shadow">
              <Search className="text-gray-400 mr-2 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar recurso"
                className="flex-1 bg-transparent outline-none text-gray-700"
              />
            </div>
            <select className="bg-white rounded-full px-4 py-2 shadow text-gray-700 text-sm">
              <option>Tipo</option>
            </select>
            <button className="bg-white rounded-full px-4 py-2 shadow flex items-center gap-2 text-gray-700 text-sm">
              <Upload className="w-5 h-5" /> Subir
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recursos.map((recurso, idx) => (
              <div key={idx} className="bg-white rounded shadow p-4 flex flex-col items-center">
                {iconoAR}
                <div className="mt-2 text-xs font-medium text-gray-700 truncate w-full text-center">
                  {recurso.nombre}
                </div>
                <button className="mt-2 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
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