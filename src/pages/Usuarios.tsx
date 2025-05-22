import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import * as api from '../services/api';
import { Dialog } from '@headlessui/react';
import type { UserRole } from '../services/api';

// Definir la interfaz User según la respuesta de la API
interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  photo?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

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
  hidden: { opacity: 1, y: 20 },
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
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newUser, setNewUser] = useState<{
    fullname: string;
    email: string;
    password: string;
    role: UserRole;
  }>({
    fullname: '',
    email: '',
    password: '',
    role: 'estudiante',
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState<UserRole>('estudiante');
  const [editActive, setEditActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    api.getUsers()
      .then(users => {
        // Verifica que users sea un array
        if (Array.isArray(users)) {
          setUsuarios(users);
        } else {
          // Si no es un array, intenta convertirlo o maneja el error
          setError('Formato de datos inesperado');
          console.error('La API no devolvió un array:', users);
        }
      })
      .catch((err) => {
        const errorMessage = err.detail || err.message || 'Error al cargar usuarios';
        setError(errorMessage);
        console.error('Error al cargar usuarios:', err);
      })
      .finally(() => setLoading(false));
      
  }, []);

  useEffect(() => {
    api.getFAQs().then(data => console.log('Recursos:', data));
  }, []);

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(usuario => {
      const matchesSearch = usuario.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRol = !selectedRol || usuario.role?.toLowerCase() === selectedRol.toLowerCase();
      const matchesEstado = !selectedEstado || (usuario.is_active ? 'ACTIVO' : 'INACTIVO') === selectedEstado;
      return matchesSearch && matchesRol && matchesEstado;
    });
  }, [searchTerm, selectedRol, selectedEstado, usuarios]);

  const handleCreateUser = async () => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const { fullname, email, password, role } = newUser;
      await api.createUserByAdmin({ fullname, email, password, role });
      setShowCreateModal(false);
      setShowConfirm(false);
      setNewUser({ fullname: '', email: '', password: '', role: 'estudiante' });
      // Recargar usuarios
      setLoading(true);
      const users = await api.getUsers();
      setUsuarios(users);
      window.location.reload();
    } catch (err: any) {
      setCreateError(err.detail || 'Error al crear usuario');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenEdit = (user: User) => {
    setEditUser(user);
    setEditRole(user.role as UserRole);
    setEditActive(user.is_active);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    setEditLoading(true);
    try {
      if (editUser.role !== editRole) {
        await api.updateUserRole(editUser.id, { role: editRole });
      }
      if (editUser.is_active !== editActive) {
        await api.updateUserStatus(editUser.id, { is_active: editActive });
      }
      setShowEditModal(false);
      setEditUser(null);
      setLoading(true);
      const users = await api.getUsers();
      setUsuarios(users);
      window.location.reload();
    } catch (err: any) {
      alert('Error al actualizar usuario');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setDeleteLoading(true);
    try {
      await api.deleteUser(deleteUserId);
      setDeleteUserId(null);
      setLoading(true);
      const users = await api.getUsers();
      setUsuarios(users);
      window.location.reload();
    } catch (err: any) {
      alert('Error al eliminar usuario');
    } finally {
      setDeleteLoading(false);
    }
  };

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
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-5 h-5" /> Crear usuario
            </motion.button>
          </motion.div>

          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 mt-8">
              Cargando usuarios...
            </motion.div>
          ) : usuarios.length === 0 && error ? (
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
              {filteredUsuarios.map((usuario) => (
                <motion.div key={usuario.id} variants={itemVariants}>
                  <AnimatedCard className="p-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative w-12 h-12"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{usuario.fullname.charAt(0)}</span>
                        </div>
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{usuario.fullname}</h3>
                        <p className="text-sm text-gray-600">{usuario.email}</p>
                        <p className="text-xs text-gray-500">Rol: {usuario.role}</p>
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
                          onClick={() => handleOpenEdit(usuario)}
                        >
                          <Pencil className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => setDeleteUserId(usuario.id)}
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

          {/* Mensaje si hay usuarios pero ningún resultado por los filtros */}
          {filteredUsuarios.length === 0 && usuarios.length > 0 && !loading && (
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

      {/* Modal de creación de usuario */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-md z-10"
          >
            <Dialog.Title className="text-xl font-bold text-red-600 mb-4">Crear nuevo usuario</Dialog.Title>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowConfirm(true); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={newUser.fullname}
                  onChange={e => setNewUser({ ...newUser, fullname: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  required
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Profesor</option>
                  <option value="admin">Admin</option>
                </select>
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
      </Dialog>

      {/* Confirmación antes de crear */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-sm z-10"
          >
            <Dialog.Title className="text-lg font-bold text-red-600 mb-4">Confirmar creación</Dialog.Title>
            <div className="mb-6 text-gray-700">¿Estás seguro de que deseas crear este usuario?</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setShowConfirm(false)}>Cancelar</button>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" onClick={handleCreateUser} disabled={createLoading}>
                {createLoading ? 'Creando...' : 'Confirmar'}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      {/* Modal de edición de usuario */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-md z-10"
          >
            <Dialog.Title className="text-xl font-bold text-red-600 mb-4">Editar usuario</Dialog.Title>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={editRole}
                  onChange={e => setEditRole(e.target.value as UserRole)}
                  required
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Profesor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  value={editActive ? 'activo' : 'inactivo'}
                  onChange={e => setEditActive(e.target.value === 'activo')}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
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
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={!!deleteUserId} onClose={() => setDeleteUserId(null)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-sm z-10"
          >
            <Dialog.Title className="text-lg font-bold text-red-600 mb-4">Eliminar usuario</Dialog.Title>
            <div className="mb-6 text-gray-700">¿Estás seguro de que deseas eliminar este usuario?</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setDeleteUserId(null)}>Cancelar</button>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" onClick={handleDeleteUser} disabled={deleteLoading}>
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </div>
  );
}; 
