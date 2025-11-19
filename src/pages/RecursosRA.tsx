import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, Upload, MoreHorizontal, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import { Model3D } from '../components/Model3D';
import { Model3DViewer } from '../components/Model3DViewer';
import { ClickSpark, Bounce } from '@appletosolutions/reactbits';

interface Recurso {
  nombre: string;
  tipo: 'ar';
  modelType?: 'box' | 'sphere' | 'torus' | 'cone' | 'cylinder';
  color?: string;
  modelUrl?: string;
}

const recursos: Recurso[] = [
  { nombre: 'Campus Universitario', tipo: 'ar', modelType: 'box', color: '#ef4444' },
  { nombre: 'FABLAB', tipo: 'ar', modelType: 'sphere', color: '#3b82f6' },
  { nombre: 'Árbol Binario ', tipo: 'ar', modelType: 'cone', color: '#10b981' },
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

export const RecursosRA: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleOpenViewer = (recurso: Recurso) => {
    setSelectedRecurso(recurso);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedRecurso(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Recursos RA" />
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
                placeholder="Buscar recurso"
                className="flex-1 bg-transparent outline-none text-gray-700"
              />
            </div>
            <motion.select
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-700 text-sm"
            >
              <option>Tipo</option>
            </motion.select>
            <ClickSpark sparkColor="#ef4444" sparkCount={10}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2 text-gray-700 text-sm"
              >
                <Upload className="w-5 h-5" /> Subir
              </motion.button>
            </ClickSpark>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {recursos.map((recurso, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Bounce>
                  <AnimatedCard className="p-4 relative group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-48 mb-2 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer relative"
                    onClick={() => handleOpenViewer(recurso)}
                  >
                    <Model3D
                      modelType={recurso.modelType}
                      color={recurso.color}
                      modelUrl={recurso.modelUrl}
                      autoRotate={true}
                      className="w-full h-full"
                    />
                    {/* Overlay con botón de expandir */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="bg-white/90 rounded-full p-3 shadow-lg"
                      >
                        <Maximize2 className="w-6 h-6 text-gray-800" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <div className="mt-2 text-xs font-medium text-gray-700 truncate w-full text-center">
                    {recurso.nombre}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <ClickSpark sparkColor="#ef4444" sparkCount={6}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOpenViewer(recurso)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Ver en pantalla completa"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </motion.button>
                    </ClickSpark>
                    <ClickSpark sparkColor="#6b7280" sparkCount={4}>
                      <motion.button
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Más opciones"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </motion.button>
                    </ClickSpark>
                  </div>
                  </AnimatedCard>
                </Bounce>
              </motion.div>
            ))}
          </motion.div>

          <Bounce>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center items-center gap-4 mt-8"
            >
              <ClickSpark sparkColor="#6b7280" sparkCount={5}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
              </ClickSpark>
              <span className="font-semibold">1</span>
              <ClickSpark sparkColor="#6b7280" sparkCount={5}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </ClickSpark>
            </motion.div>
          </Bounce>
        </main>
      </div>

      {/* Visor de pantalla completa */}
      {selectedRecurso && (
        <Model3DViewer
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
          modelType={selectedRecurso.modelType}
          color={selectedRecurso.color}
          modelUrl={selectedRecurso.modelUrl}
          title={selectedRecurso.nombre}
        />
      )}
    </div>
  );
}; 