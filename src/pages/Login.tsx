import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
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
      const response = await api.login({ username: email, password });
      console.log(response);
      const profile = await api.getProfile();
      login(profile.role as 'admin' | 'docente' | 'estudiante');
      
      // Redirigir según el rol
      if (profile.role === 'admin') {
        navigate('/usuarios');
      } else {
        navigate('/chatbot');
      }
    } catch (err: any) {
      setError(err.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatedCard className="bg-white rounded-xl shadow-xl p-8">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-600 mb-2">Bienvenido</h1>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </motion.div>

          

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            {error && (
              <motion.div
                variants={itemVariants}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {loading && (
              <motion.div
                variants={itemVariants}
                className="text-gray-500 text-sm text-center"
              >
                Ingresando...
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <Link
              to="/recuperar-password"
              className="text-sm text-red-600 hover:text-red-700"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿No tienes una cuenta?
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/registro"
                className="w-full bg-white border border-red-600 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Crear cuenta</span>
                <User className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}; 