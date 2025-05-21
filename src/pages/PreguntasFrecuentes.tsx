import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import { useAuth } from '../contexts/AuthContext';

const preguntas = [
  { id: 1, pregunta: '¿Cómo puedo inscribirme a los cursos?', respuesta: 'Debes acceder a la plataforma y seleccionar el curso de tu interés.' },
  { id: 2, pregunta: '¿Dónde encuentro los recursos RA?', respuesta: 'En la sección de Recursos RA del menú lateral.' },
  { id: 3, pregunta: '¿Puedo contactar a un profesor?', respuesta: 'Sí, puedes enviarle un mensaje desde la plataforma.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export const PreguntasFrecuentes: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { rol } = useAuth();

  const filteredPreguntas = preguntas.filter(p =>
    p.pregunta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Preguntas Frecuentes" />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center mb-6 gap-4"
          >
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Search className="text-gray-400 mr-2 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar pregunta"
                className="flex-1 bg-transparent outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Solo admin puede agregar preguntas */}
            {rol === 'admin' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2 text-gray-700 text-sm"
              >
                <Plus className="w-5 h-5" /> Agregar
              </motion.button>
            )}
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredPreguntas.map((pregunta) => (
              <motion.div key={pregunta.id} variants={itemVariants}>
                <AnimatedCard className="p-4">
                  <div className="font-semibold text-gray-800 mb-2">{pregunta.pregunta}</div>
                  <div className="text-gray-600 mb-4">{pregunta.respuesta}</div>
                  {/* Solo admin puede editar/eliminar */}
                  {rol === 'admin' && (
                    <div className="flex gap-2 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>

          {filteredPreguntas.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-8"
            >
              No se encontraron preguntas que coincidan con la búsqueda
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <span className="font-semibold">1</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}; 