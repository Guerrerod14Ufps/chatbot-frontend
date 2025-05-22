import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';
import * as api from '../services/api';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      setError(null);
      try {
        await api.verifyEmail(token);
        setSuccess(true);
      } catch (err: any) {
        setError(err.detail || 'Error al verificar el correo.');
      } finally {
        setLoading(false);
      }
    };
    if (token) verify();
    else {
      setError('Token inválido.');
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AnimatedCard className="p-8 text-center">
          {loading ? (
            <div className="text-gray-600">Verificando correo...</div>
          ) : success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Correo verificado!</h2>
              <p className="text-gray-600 mb-4">Tu correo ha sido verificado correctamente. Ya puedes iniciar sesión.</p>
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={() => navigate('/login')}
              >
                <ArrowLeft className="inline w-4 h-4 mr-1" /> Ir al inicio de sesión
              </button>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={() => navigate('/login')}
              >
                <ArrowLeft className="inline w-4 h-4 mr-1" /> Ir al inicio de sesión
              </button>
            </>
          )}
        </AnimatedCard>
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 