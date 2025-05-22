import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import * as api from '../services/api';

interface Categoria {
  id: number;
  name: string;
  description: string;
}

export const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editCat, setEditCat] = useState<Categoria | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCategories();
      setCategorias(data);
    } catch (err: any) {
      setError(err.detail || err.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.createCategory({ name: newName, description: newDesc });
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
      fetchCategorias();
    } catch (err: any) {
      alert('Error al crear categoría');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.deleteCategory(deleteId);
      setDeleteId(null);
      fetchCategorias();
    } catch (err: any) {
      alert('Error al eliminar categoría');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenEdit = (cat: Categoria) => {
    setEditCat(cat);
    setEditName(cat.name);
    setEditDesc(cat.description);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCat) return;
    setEditLoading(true);
    try {
      await api.updateCategory(editCat.id, { name: editName, description: editDesc });
      setEditCat(null);
      fetchCategorias();
    } catch (err: any) {
      alert('Error al editar categoría');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Categorías" />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-red-600">Categorías</h1>
            <button
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="w-5 h-5" /> Nueva categoría
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Cargando categorías...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {categorias.map(cat => (
                <motion.div key={cat.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 relative">
                  <h2 className="text-lg font-bold text-red-600 cursor-pointer" onClick={() => handleOpenEdit(cat)}>{cat.name}</h2>
                  <p className="text-gray-700 flex-1">{cat.description}</p>
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
                    onClick={() => setDeleteId(cat.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal crear categoría */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-red-600 mb-4">Nueva categoría</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setShowCreate(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" disabled={createLoading}>
                  {createLoading ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal eliminar categoría */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm"
          >
            <h2 className="text-lg font-bold text-red-600 mb-4">Eliminar categoría</h2>
            <div className="mb-6 text-gray-700">¿Estás seguro de que deseas eliminar esta categoría?</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setDeleteId(null)}>Cancelar</button>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal editar categoría */}
      {editCat && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-red-600 mb-4">Editar categoría</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setEditCat(null)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" disabled={editLoading}>
                  {editLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}; 