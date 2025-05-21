import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import * as api from '../services/api';

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

export const Usuarios: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRol, setSelectedRol] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getUsers()
      .then(setUsuarios)
      .catch((err) => setError(err.detail || 'Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(usuario => {
      const matchesSearch = usuario.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRol = !selectedRol || usuario.role === selectedRol;
      const matchesEstado = !selectedEstado || (usuario.is_active ? 'ACTIVO' : 'INACTIVO') === selectedEstado;
      return matchesSearch && matchesRol && matchesEstado;
    });
  }, [searchTerm, selectedRol, selectedEstado, usuarios]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Usuarios" />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center mb-6 gap-4 flex-wrap"
          >
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Search className="text-gray-400 mr-2 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar usuario"
                className="flex-1 bg-transparent outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <motion.select
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-700 text-sm"
              value={selectedRol}
              onChange={(e) => setSelectedRol(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="estudiante">Estudiante</option>
              <option value="docente">Profesor</option>
              <option value="admin">Admin</option>
            </motion.select>
            <motion.select
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-700 text-sm"
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </motion.select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2 text-gray-700 text-sm"
            >
              <Plus className="w-5 h-5" /> Crear usuario
            </motion.button>
          </motion.div>

          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 mt-8">
              Cargando usuarios...
            </motion.div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-600 mt-8">
              {error}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {filteredUsuarios.map((usuario, idx) => (
                <motion.div key={usuario.id} variants={itemVariants}>
                  <AnimatedCard className="p-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative w-12 h-12"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <UserCircle className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{usuario.fullname}</h3>
                        <p className="text-sm text-gray-600">{usuario.role}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          usuario.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {usuario.is_active ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-red-600"
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
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {filteredUsuarios.length === 0 && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-8"
            >
              No se encontraron usuarios que coincidan con los filtros
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
