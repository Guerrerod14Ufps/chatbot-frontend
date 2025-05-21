import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import { UserCircle } from 'lucide-react';
import * as api from '../services/api';

interface UserProfile {
  id: number;
  fullname: string;
  email: string;
  photo_url?: string | null;
  role?: string;
}

export const Perfil: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getProfile()
      .then(setProfile)
      .catch((err) => setError(err.detail || 'Error al cargar perfil'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Perfil" />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-1 p-8 flex items-center justify-center">
          <AnimatedCard className="w-full max-w-md p-8">
            {loading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500">
                Cargando perfil...
              </motion.div>
            ) : error ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-600">
                {error}
              </motion.div>
            ) : profile && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt="Foto de perfil" className="w-24 h-24 rounded-full object-cover shadow" />
                ) : (
                  <UserCircle className="w-24 h-24 text-red-400" />
                )}
                <div className="text-xl font-bold text-gray-800">{profile.fullname}</div>
                <div className="text-gray-600">{profile.email}</div>
                {profile.role && (
                  <div className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mt-2">
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatedCard>
        </main>
      </div>
    </div>
  );
}; 