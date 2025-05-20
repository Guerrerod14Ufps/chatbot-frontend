import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const preguntas = [
  '¿Cuáles son los requisitos para realizar las prácticas profesionales?',
  '¿Cuáles son las modalidades de trabajo de grado disponibles?',
  '¿Puedo hacer mis prácticas en una empresa de mi elección?',
  '¿Puedo cambiar de tutor durante el desarrollo de mi trabajo de grado?',
  '¿Cuáles son los requisitos para postularme a un programa de movilidad?',
  '¿Cómo solicito un certificado de estudios o de notas?'
];

export const PreguntasFrecuentes: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#d3d3d3] flex">
      <Sidebar selected="Preguntas Frecuentes" />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8">
          <div className="flex items-center mb-6 gap-4">
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-md shadow">
              <Search className="text-gray-400 mr-2 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar pregunta"
                className="flex-1 bg-transparent outline-none text-gray-700"
              />
            </div>
            <button className="bg-white rounded-full px-4 py-2 shadow flex items-center gap-2 text-gray-700 text-sm">
              <Plus className="w-5 h-5" /> Crear nueva pregunta
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preguntas.map((pregunta, idx) => (
              <div key={idx} className="bg-white rounded shadow p-4 flex flex-col gap-4">
                <div className="font-semibold text-sm text-gray-800">{pregunta}</div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-gray-700 hover:underline text-xs">
                    Editar <Pencil className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1 text-gray-700 hover:underline text-xs">
                    Eliminar <Trash2 className="w-4 h-4" />
                  </button>
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