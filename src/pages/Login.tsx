import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, GraduationCap, User, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatedCard } from '../components/AnimatedCard';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.login({ username: email, password });
      login('admin'); // Por ahora, asume admin. Luego se puede obtener el rol real del perfil.
      navigate('/usuarios');
    } catch (err: any) {
      setError(err.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Simulación de login por tipo de usuario (demo)
  const handleLoginTipo = (tipo: 'estudiante' | 'profesor' | 'admin') => {
    login(tipo);
    if (tipo === 'admin') {
      navigate('/usuarios');
    } else {
      navigate('/chatbot');
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AnimatedCard className="p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
              <p className="text-gray-600 mt-2">Ingresa tus credenciales para continuar</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div variants={itemVariants} className="text-red-600 text-sm text-center">
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </motion.button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="flex flex-col items-center gap-2">
              <Link 
                to="/recuperar-password" 
                className="text-sm text-gray-600 hover:text-red-600"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Link 
                to="/registro" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-red-600"
              >
                Crear una cuenta
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            {/* Botones de acceso rápido por tipo de usuario (demo) */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2 pt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-red-500 text-white py-2 px-4 rounded-lg shadow hover:from-red-500 hover:to-red-600 transition-all"
                onClick={() => handleLoginTipo('estudiante')}
                type="button"
              >
                <GraduationCap className="w-5 h-5" /> Entrar como Estudiante
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-red-500 text-white py-2 px-4 rounded-lg shadow hover:from-red-500 hover:to-red-600 transition-all"
                onClick={() => handleLoginTipo('profesor')}
                type="button"
              >
                <User className="w-5 h-5" /> Entrar como Profesor
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 px-4 rounded-lg shadow hover:from-gray-800 hover:to-black transition-all"
                onClick={() => handleLoginTipo('admin')}
                type="button"
              >
                <Shield className="w-5 h-5" /> Entrar como Admin
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}; 