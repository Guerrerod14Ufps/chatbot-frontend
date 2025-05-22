import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import { useAuth } from '../contexts/AuthContext';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../services/api';

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
  const [preguntas, setPreguntas] = useState<Array<{ id: number; question: string; answer: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newPregunta, setNewPregunta] = useState({ question: '', answer: '' });
  const [editPregunta, setEditPregunta] = useState<{ id: number; question: string; answer: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchPreguntas = async () => {
      setLoading(true);
      try {
        const data = await getFAQs();
        console.log('Preguntas recibidas:', data);
        // Normalizo los datos para asegurar que todas las propiedades existen
        const normalizadas = Array.isArray(data)
          ? data.map((p) => ({
              id: p.id ?? Math.random(),
              question: p.question ?? '',
              answer: p.answer ?? ''
            }))
          : [];
        setPreguntas(normalizadas);
      } catch (err: any) {
        setError(err.detail || 'Error al cargar preguntas frecuentes');
      } finally {
        setLoading(false);
      }
    };
    fetchPreguntas();
  }, []);

  const filteredPreguntas = preguntas.filter(p =>
    p.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      const data = await createFAQ(newPregunta);
      setPreguntas([...preguntas, data]);
      setShowCreateModal(false);
      setNewPregunta({ question: '', answer: '' });
    } catch (err: any) {
      setCreateError(err.detail || 'Error al crear pregunta frecuente');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenEdit = (pregunta: { id: number; question: string; answer: string }) => {
    setEditPregunta({ id: pregunta.id, question: pregunta.question, answer: pregunta.answer });
    setShowEditModal(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPregunta) return;
    setEditLoading(true);
    try {
      const data = await updateFAQ(editPregunta.id, editPregunta);
      setPreguntas(preguntas.map(p => p.id === data.id ? data : p));
      setShowEditModal(false);
      setEditPregunta(null);
    } catch (err: any) {
      alert('Error al actualizar pregunta frecuente');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteFAQ(deleteId);
      setPreguntas(preguntas.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      alert('Error al eliminar pregunta frecuente');
    } finally {
      setDeleteLoading(false);
    }
  };

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
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-5 h-5" /> Agregar
              </motion.button>
            )}
          </motion.div>

          {loading ? (
            <div className="text-center text-gray-500">Cargando preguntas...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredPreguntas.map((pregunta) => (
                <motion.div key={pregunta.id} variants={itemVariants}>
                  <AnimatedCard className="p-4">
                    <div className="font-semibold text-gray-800 mb-2">{pregunta.question || 'Sin pregunta'}</div>
                    <div className="text-gray-600 mb-4">{pregunta.answer || 'Sin respuesta'}</div>
                    {/* Solo admin puede editar/eliminar */}
                    {rol === 'admin' && (
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-blue-600"
                          onClick={() => handleOpenEdit(pregunta)}
                        >
                          <Pencil className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => setDeleteId(pregunta.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </AnimatedCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {filteredPreguntas.length === 0 && !loading && (
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

      {/* Modal de creación de pregunta frecuente */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-red-600 mb-4">Nueva pregunta frecuente</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={newPregunta.question}
                  onChange={e => setNewPregunta({ ...newPregunta, question: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Respuesta</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={newPregunta.answer}
                  onChange={e => setNewPregunta({ ...newPregunta, answer: e.target.value })}
                  required
                />
              </div>
              {createError && <div className="text-red-500 text-sm text-center">{createError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" disabled={createLoading}>
                  {createLoading ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal de edición de pregunta frecuente */}
      {showEditModal && editPregunta && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-red-600 mb-4">Editar pregunta frecuente</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={editPregunta.question}
                  onChange={e => setEditPregunta({ ...editPregunta, question: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Respuesta</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={editPregunta.answer}
                  onChange={e => setEditPregunta({ ...editPregunta, answer: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" disabled={editLoading}>
                  {editLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal de eliminación de pregunta frecuente */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm"
          >
            <h2 className="text-lg font-bold text-red-600 mb-4">Eliminar pregunta frecuente</h2>
            <div className="mb-6 text-gray-700">¿Estás seguro de que deseas eliminar esta pregunta frecuente?</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setDeleteId(null)}>Cancelar</button>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}; 