import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Users, TrendingUp, Clock, MessageSquare, Download, RefreshCw, Star } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../components/AnimatedCard';
import { getReports } from '../services/api';
import type { ReportData } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
  const [descargandoPDF, setDescargandoPDF] = useState(false);
  const contenidoRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const descargarPDF = async () => {
    if (!contenidoRef.current || !datos) return;

    setDescargandoPDF(true);
    try {
      const canvas = await html2canvas(contenidoRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f3f4f6',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      const fecha = new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generado el ${fecha}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });

      pdf.save(`estadisticas-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
      setError('Error al generar el PDF. Por favor, intenta nuevamente.');
    } finally {
      setDescargandoPDF(false);
    }
  };

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
          'rgba(220, 38, 38, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderColor: [
          'rgb(220, 38, 38)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const datosSatisfaccion = {
    labels: ['Satisfacción'],
    datasets: [
      {
        label: 'Nivel de Satisfacción (1-5)',
        data: datos ? [datos.average_satisfaction_level || 0] : [0],
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
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

  const porcentajeSatisfaccion = datos?.average_satisfaction_level 
    ? ((datos.average_satisfaction_level / 5) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Estadísticas" />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-gray-800"
            >
              Estadísticas del Sistema
            </motion.h1>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cargarEstadisticas}
                disabled={cargando}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={descargarPDF}
                disabled={descargandoPDF || !datos || cargando}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className={`w-4 h-4 ${descargandoPDF ? 'animate-bounce' : ''}`} />
                <span>{descargandoPDF ? 'Generando...' : 'Descargar PDF'}</span>
              </motion.button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div ref={contenidoRef}>
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
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                  Comparación de Mensajes
                </h3>
                {cargando ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <Bar
                    data={comparacionMensajes}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          padding: 12,
                          titleFont: { size: 14 },
                          bodyFont: { size: 13 },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                          },
                          ticks: {
                            callback: function(value) {
                              return value.toLocaleString();
                            },
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Star className="w-5 h-5 text-red-600" />
                  Nivel de Satisfacción
                </h3>
                {cargando ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Line
                      data={datosSatisfaccion}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            callbacks: {
                              label: function(context) {
                                return `Satisfacción: ${context.parsed.y.toFixed(1)}/5`;
                              },
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 5,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)',
                            },
                            ticks: {
                              stepSize: 1,
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                      height={200}
                    />
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Satisfacción promedio</span>
                        <span className="text-lg font-bold text-red-600">
                          {formatearSatisfaccion(datos?.average_satisfaction_level ?? null)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-red-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${porcentajeSatisfaccion}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{porcentajeSatisfaccion}% de satisfacción</p>
                    </div>
                  </div>
                )}
              </AnimatedCard>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-2">
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  Métricas de Rendimiento
                </h3>
                <div className="space-y-6">
                  {cargando ? (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                  ) : datos ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Mensajes del día</p>
                          <p className="text-2xl font-bold text-blue-600">{datos.daily_user_messages}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Tiempo promedio</p>
                          <p className="text-xl font-semibold text-green-600">
                            {formatearTiempo(datos.average_response_time)}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">Resumen general</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total de usuarios:</span>
                            <span className="font-semibold">{datos.total_users.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total de mensajes:</span>
                            <span className="font-semibold">{datos.total_user_messages.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mensajes diarios:</span>
                            <span className="font-semibold">{datos.daily_user_messages.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">No hay datos disponibles</p>
                  )}
                </div>
              </AnimatedCard>
            </motion.div>
          </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}; 