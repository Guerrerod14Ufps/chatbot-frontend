import React, { useState, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, Upload, MoreHorizontal, ChevronLeft, ChevronRight, FileText, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';

const documentos = [
  { nombre: 'Requisitos Grado.pdf', tipo: 'pdf' },
  { nombre: 'Formato Practicas.docx', tipo: 'doc' },
  { nombre: 'Movilidad Estudiantil.pdf', tipo: 'pdf' },
  { nombre: 'Formato Anteproyecto.docx', tipo: 'doc' },
];

const icono = (tipo: string) => tipo === 'pdf' ? (
  <div className="relative w-16 h-16 mx-auto">
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="absolute inset-0 bg-red-500 rounded-lg shadow-lg"
    />
    <motion.div
      whileHover={{ scale: 1.1, rotate: -5 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <FileText className="w-10 h-10 text-white" />
    </motion.div>
  </div>
) : (
  <div className="relative w-16 h-16 mx-auto">
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="absolute inset-0 bg-blue-500 rounded-lg shadow-lg"
    />
    <motion.div
      whileHover={{ scale: 1.1, rotate: -5 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <File className="w-10 h-10 text-white" />
    </motion.div>
  </div>
);

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

export const Documentos: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredDocumentos = useMemo(() => {
    return documentos.filter(doc => {
      const matchesSearch = doc.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || doc.tipo === selectedType.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Documentos" />
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
                placeholder="Buscar documento"
                className="flex-1 bg-transparent outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <motion.select
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-700 text-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="pdf">PDF</option>
              <option value="doc">DOC</option>
            </motion.select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2 text-gray-700 text-sm"
            >
              <Upload className="w-5 h-5" /> Subir doc
            </motion.button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {filteredDocumentos.map((doc, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <AnimatedCard className="p-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {icono(doc.tipo)}
                  </motion.div>
                  <div className="mt-2 text-xs font-medium text-gray-700 truncate w-full text-center">
                    {doc.nombre}
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 text-gray-400 hover:text-gray-600 mx-auto block"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </motion.button>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>

          {filteredDocumentos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-8"
            >
              No se encontraron documentos que coincidan con los filtros
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