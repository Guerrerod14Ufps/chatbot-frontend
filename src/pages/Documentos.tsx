import React, { useEffect, useState, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, Upload, ChevronLeft, ChevronRight, FileText, File, Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import * as api from '../services/api';

interface Documento {
  id: number;
  description: string;
  type: string;
  name: string;
  url: string;
  is_enabled: boolean;
  category_id?: number;
  user_id?: number;
}

export const Documentos: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [editDoc, setEditDoc] = useState<Documento | null>(null);
  const [editCatId, setEditCatId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categorias, setCategorias] = useState<{ id: number; name: string }[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  const fetchDocumentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getResources();
      // Filtrar solo documentos
      setDocumentos(data.filter((r: any) => r.type === 'documento'));
    } catch (err: any) {
      setError(err.detail || err.message || 'Error al cargar documentos');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  useEffect(() => {
    api.getCategories().then(data => setCategorias(data));
  }, []);

  const filteredDocumentos = useMemo(() => {
    return documentos.filter(doc => {
      const matchesSearch = doc.description.toLowerCase().includes(searchTerm.toLowerCase()) || (doc.name?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = !selectedType || (doc.name && doc.name.toLowerCase().endsWith(selectedType));
      const matchesCategory = !selectedCategory || doc.category_id === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchTerm, selectedType, selectedCategory, documentos]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploadLoading(true);
    try {
      await api.uploadResource({ description: uploadDesc, type: 'documento', file: uploadFile });
      setShowUpload(false);
      setUploadDesc('');
      setUploadFile(null);
      fetchDocumentos();
    } catch (err: any) {
      alert('Error al subir documento');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleOpenEdit = (doc: Documento) => {
    setEditDoc(doc);
    setEditCatId(doc.category_id || null);
    setEditStatus(doc.is_enabled !== undefined ? doc.is_enabled : true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDoc) return;
    setEditLoading(true);
    try {
      if (editCatId !== null) {
        await api.updateResourceCategory(editDoc.id, { category_id: editCatId });
      }
      await api.updateResourceStatus(editDoc.id, { is_enabled: editStatus });
      setEditDoc(null);
      fetchDocumentos();
    } catch (err: any) {
      alert('Error al editar documento');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.deleteResource(deleteId);
      setDeleteId(null);
      fetchDocumentos();
    } catch (err: any) {
      alert('Error al eliminar documento');
    } finally {
      setDeleteLoading(false);
    }
  };

  const icono = (fileName: string | undefined) => fileName && fileName.endsWith('.pdf') ? (
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
              <option value=".pdf">PDF</option>
              <option value=".doc">DOC</option>
              <option value=".docx">DOCX</option>
            </motion.select>
            <motion.select
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-700 text-sm"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </motion.select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2 text-gray-700 text-sm"
              onClick={() => setShowUpload(true)}
            >
              <Upload className="w-5 h-5" /> Subir doc
            </motion.button>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {filteredDocumentos.map((doc) => (
              <motion.div key={doc.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                <AnimatedCard className="p-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {icono(doc.name)}
                  </motion.div>
                  <div className="mt-2 text-xs font-medium text-gray-700 truncate w-full text-center">
                    {doc.name || 'Sin archivo'}
                  </div>
                  <div className="text-xs text-gray-500 text-center mb-2">{doc.description}</div>
                  <div className="flex justify-center mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      doc.is_enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {doc.is_enabled ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                    {doc.category_id && (
                      <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {categorias.find(cat => cat.id === doc.category_id)?.name || 'Sin categoría'}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center gap-2 mt-2">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => setDeleteId(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-blue-600"
                      onClick={() => handleOpenEdit(doc)}
                    >
                      <Pencil className="w-4 h-4" />
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-600"
                    >
                      <FileText className="w-4 h-4" />
                    </motion.a>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>

          {filteredDocumentos.length === 0 && !loading && (
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

      {/* Modal subir documento */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-red-600 mb-4">Subir documento</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={uploadDesc}
                  onChange={e => setUploadDesc(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
                <input
                  type="file"
                  className="w-full"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setShowUpload(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" disabled={uploadLoading}>
                  {uploadLoading ? 'Subiendo...' : 'Subir'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal editar documento */}
      {editDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-red-600 mb-4">Editar documento</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={editCatId ?? ''}
                  onChange={e => setEditCatId(Number(e.target.value))}
                  required
                >
                  <option value="">Sin categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={editStatus ? 'activo' : 'inactivo'}
                  onChange={e => setEditStatus(e.target.value === 'activo')}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setEditDoc(null)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" disabled={editLoading}>
                  {editLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal eliminar documento */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm"
          >
            <h2 className="text-lg font-bold text-red-600 mb-4">Eliminar documento</h2>
            <div className="mb-6 text-gray-700">¿Estás seguro de que deseas eliminar este documento?</div>
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