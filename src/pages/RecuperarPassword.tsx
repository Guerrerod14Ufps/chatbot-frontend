import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedCard } from '../components/AnimatedCard';
import * as api from '../services/api';

export const RecuperarPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.resetPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.detail || 'Error al solicitar recuperación');
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
              <h2 className="text-2xl font-bold text-gray-800">Recuperar Contraseña</h2>
              <p className="text-gray-600 mt-2">
                {isSubmitted 
                  ? "Revisa tu correo electrónico para las instrucciones"
                  : "Ingresa tu correo electrónico para recuperar tu contraseña"}
              </p>
            </motion.div>

            {!isSubmitted ? (
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
                    {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                  </motion.button>
                </motion.div>
              </form>
            ) : (
              <motion.div
                variants={itemVariants}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="inline-block mb-4"
                >
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </motion.div>
                <p className="text-gray-600">
                  Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.
                </p>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-red-600"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al inicio de sesión
              </Link>
            </motion.div>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}; 