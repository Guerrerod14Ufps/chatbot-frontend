import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Users, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import { getReports } from '../services/api';
import type { ReportData } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatearTiempo = (segundos: number | null): string => {
  if (!segundos) return 'N/A';
  if (segundos < 60) return `${Math.round(segundos)}s`;
  const minutos = Math.floor(segundos / 60);
  const segs = Math.round(segundos % 60);
  return `${minutos}m ${segs}s`;
};

const formatearSatisfaccion = (nivel: number | null): string => {
  if (!nivel) return 'N/A';
  return `${nivel.toFixed(1)}/5`;
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

export const Estadisticas: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [datos, setDatos] = useState<ReportData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      setCargando(true);
      setError(null);
      try {
        const reportData = await getReports();
        setDatos(reportData);
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
        setError('No se pudieron cargar las estadísticas.');
      } finally {
        setCargando(false);
      }
    };

    cargarEstadisticas();
  }, []);

  const comparacionMensajes = {
    labels: ['Mensajes Totales', 'Mensajes Hoy'],
    datasets: [
      {
        label: 'Cantidad de Mensajes',
        data: datos ? [
          datos.total_user_messages || 0,
          datos.daily_user_messages || 0
        ] : [0, 0],
        backgroundColor: [
          'rgba(220, 38, 38, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(220, 38, 38)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const metricas = [
    { 
      titulo: 'Usuarios Totales', 
      valor: datos ? datos.total_users.toLocaleString() : '...', 
      icono: Users 
    },
    { 
      titulo: 'Mensajes Totales', 
      valor: datos ? datos.total_user_messages.toLocaleString() : '...', 
      icono: MessageSquare 
    },
    { 
      titulo: 'Tiempo Promedio Respuesta', 
      valor: datos ? formatearTiempo(datos.average_response_time) : '...', 
      icono: Clock 
    },
    { 
      titulo: 'Satisfacción Promedio', 
      valor: datos ? formatearSatisfaccion(datos.average_satisfaction_level) : '...', 
      icono: TrendingUp 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Estadísticas" />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-1 p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {metricas.map((metrica, idx) => {
              const Icon = metrica.icono;
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <AnimatedCard className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{metrica.titulo}</p>
                        <motion.p
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-2xl font-semibold mt-1 text-gray-800"
                        >
                          {cargando ? 'Cargando...' : metrica.valor}
                        </motion.p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-8 h-8 text-red-600" />
                      </motion.div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants}>
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Comparación de Mensajes</h3>
                {cargando ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Cargando datos...
                  </div>
                ) : (
                  <Bar
                    data={comparacionMensajes}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                )}
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Resumen de Estadísticas</h3>
                <div className="h-[300px] flex flex-col items-center justify-center space-y-4 text-gray-700">
                  {cargando ? (
                    <p className="text-gray-500">Cargando datos...</p>
                  ) : datos ? (
                    <>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Mensajes del día</p>
                        <p className="text-3xl font-bold text-red-600">{datos.daily_user_messages}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Satisfacción promedio</p>
                        <p className="text-2xl font-semibold text-red-600">
                          {formatearSatisfaccion(datos.average_satisfaction_level)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Tiempo promedio de respuesta</p>
                        <p className="text-2xl font-semibold text-red-600">
                          {formatearTiempo(datos.average_response_time)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">No hay datos disponibles</p>
                  )}
                </div>
              </AnimatedCard>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}; 