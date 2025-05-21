import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Users, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Datos de ejemplo
const visitasPorDia = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Visitas',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(220, 38, 38, 0.5)',
      borderColor: 'rgb(220, 38, 38)',
      borderWidth: 1,
    },
  ],
};

const temasConsultados = {
  labels: ['Prácticas', 'Grado', 'Movilidad', 'Certificados', 'Otros'],
  datasets: [
    {
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        'rgba(220, 38, 38, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(248, 113, 113, 0.8)',
        'rgba(252, 165, 165, 0.8)',
        'rgba(254, 202, 202, 0.8)',
      ],
      borderWidth: 1,
    },
  ],
};

const metricas = [
  { titulo: 'Usuarios Totales', valor: '1,234', icono: Users },
  { titulo: 'Consultas Hoy', valor: '156', icono: MessageSquare },
  { titulo: 'Tiempo Promedio', valor: '3.5 min', icono: Clock },
  { titulo: 'Crecimiento', valor: '+12%', icono: TrendingUp },
];

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Estadísticas" />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-1 p-8">
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
                          {metrica.valor}
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
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Visitas por Día</h3>
                <Bar
                  data={visitasPorDia}
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
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Temas Consultados</h3>
                <div className="h-[300px] flex items-center justify-center">
                  <Doughnut
                    data={temasConsultados}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            padding: 20,
                            font: {
                              size: 12,
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </AnimatedCard>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}; 