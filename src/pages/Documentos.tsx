import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';

const documentos = [
  { nombre: 'Requisitos Grado.pdf', tipo: 'pdf' },
  { nombre: 'Formato Practicas.docx', tipo: 'doc' },
  { nombre: 'Movilidad Estudiantil.pdf', tipo: 'pdf' },
  { nombre: 'Formato Anteproyecto.docx', tipo: 'doc' },
];

const icono = (tipo: string) => tipo === 'pdf' ? (
  <svg className="w-16 h-16 mx-auto" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><path d="M12 8a4 4 0 0 1 4-4h16l8 8v28a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V8z" fill="#fff"/><path d="M36 8v8H28V0h4a4 4 0 0 1 4 4v4z" fill="#d32f2f"/><text x="14" y="36" fontSize="14" fontWeight="bold" fill="#d32f2f">PDF</text></svg>
) : (
  <svg className="w-16 h-16 mx-auto" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#fff"/><path d="M12 8a4 4 0 0 1 4-4h16l8 8v28a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V8z" fill="#fff"/><path d="M36 8v8H28V0h4a4 4 0 0 1 4 4v4z" fill="#1976d2"/><rect x="14" y="32" width="20" height="6" rx="2" fill="#1976d2"/><rect x="14" y="24" width="20" height="4" rx="2" fill="#1976d2"/></svg>
);

export const Documentos: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#d3d3d3] flex">
      <Sidebar selected="Documentos" />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8">
          <div className="flex items-center mb-6 gap-4">
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-md shadow">
              <span className="material-icons text-gray-400 mr-2">search</span>
              <input
                type="text"
                placeholder="Buscar documento"
                className="flex-1 bg-transparent outline-none text-gray-700"
              />
            </div>
            <select className="bg-white rounded-full px-4 py-2 shadow text-gray-700 text-sm">
              <option>Tipo</option>
              <option>PDF</option>
              <option>DOC</option>
            </select>
            <button className="bg-white rounded-full px-4 py-2 shadow flex items-center gap-2 text-gray-700 text-sm">
              <span className="material-icons">upload</span> Subir doc
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {documentos.map((doc, idx) => (
              <div key={idx} className="bg-white rounded shadow p-4 flex flex-col items-center">
                {icono(doc.tipo)}
                <div className="mt-2 text-xs font-medium text-gray-700 truncate w-full text-center">
                  {doc.nombre}
                </div>
                <button className="mt-2 text-gray-400 hover:text-gray-600">
                  <span className="material-icons">more_horiz</span>
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-8">
            <button className="text-gray-500 hover:text-gray-700"><span className="material-icons">chevron_left</span></button>
            <span className="font-semibold">1</span>
            <button className="text-gray-500 hover:text-gray-700"><span className="material-icons">chevron_right</span></button>
          </div>
        </main>
      </div>
    </div>
  );
}; 