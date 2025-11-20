import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { motion } from 'framer-motion';
import { User, Bot, Send, Star } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';
import { getChats, getChatById, updateChatSatisfaction } from '../services/api';
import type { ChatItem } from '../services/api';
import { useChatSocket } from '../contexts/ChatSocketContext';
import type { MensajeChat } from '../contexts/ChatSocketContext';

type Mensaje = MensajeChat;

const NIVELES_SATISFACCION = [1, 2, 3, 4, 5];
const ETIQUETAS_SATISFACCION: Record<number, string> = {
  1: 'Muy baja',
  2: 'Baja',
  3: 'Neutral',
  4: 'Alta',
  5: 'Excelente',
};

export const Chatbot: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [input, setInput] = useState('');
  const [guardandoSatisfaccion, setGuardandoSatisfaccion] = useState(false);
  const [mensajeSatisfaccion, setMensajeSatisfaccion] = useState<string | null>(null);
  const [guardandoSatisfaccionHistorial, setGuardandoSatisfaccionHistorial] = useState(false);
  const [mensajeSatisfaccionHistorial, setMensajeSatisfaccionHistorial] = useState<string | null>(null);
  const [tabActiva, setTabActiva] = useState<'chat' | 'historial'>('chat');
  const [chatsHistorial, setChatsHistorial] = useState<ChatItem[]>([]);
  const [historialCargando, setHistorialCargando] = useState(false);
  const [historialError, setHistorialError] = useState<string | null>(null);
  const [chatSeleccionado, setChatSeleccionado] = useState<ChatItem | null>(null);
  const [mensajesHistorial, setMensajesHistorial] = useState<Mensaje[]>([]);
  const [detalleCargando, setDetalleCargando] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const satisfaccionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    mensajes,
    estadoConexion,
    errorConexion,
    modeloListo,
    esperandoRespuesta,
    chatIdActual,
    satisfaccion,
    setSatisfaccion,
    enviarMensaje,
  } = useChatSocket();

  const normalizarMensajes = useCallback((messages?: ChatItem['messages']): Mensaje[] => {
    if (!messages?.length) return [];
    return messages.map(msg => ({
      texto: msg?.texto ?? '',
      emisor: msg?.role === 'user' ? 'usuario' : 'bot',
    }));
  }, []);

  const tieneMensajes = useCallback((chat?: ChatItem | null) => {
    if (!chat) return false;
    if (!chat.messages) {
      return false;
    }
    return chat.messages.some(msg => (msg?.texto ?? '').trim().length > 0);
  }, []);

  const formatearFecha = useCallback((fecha?: string) => {
    if (!fecha) return 'Sin fecha';
    const fechaObj = new Date(fecha);
    if (Number.isNaN(fechaObj.getTime())) return fecha;
    return fechaObj.toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }, []);

  const obtenerEtiquetaSatisfaccion = useCallback((nivel?: number | null) => {
    if (!nivel) return 'Sin valorar';
    return ETIQUETAS_SATISFACCION[nivel] ?? `${nivel}/5`;
  }, []);

  const manejarSeleccionChat = useCallback(async (chatId: number, chatEnMemoria?: ChatItem) => {
    setDetalleCargando(true);
    setHistorialError(null);
    try {
      const chat = chatEnMemoria ?? await getChatById(chatId);
      if (!tieneMensajes(chat)) {
        setChatsHistorial(prev => prev.filter(item => item.id !== chat.id));
        setHistorialError('Este chat no tiene mensajes guardados.');
        setChatSeleccionado(null);
        setMensajesHistorial([]);
        return;
      }
      setChatSeleccionado(chat);
      setMensajesHistorial(normalizarMensajes(chat.messages));
    } catch (err) {
      console.error('Error cargando chat del historial:', err);
      setHistorialError('No se pudo cargar el chat seleccionado.');
    } finally {
      setDetalleCargando(false);
    }
  }, [normalizarMensajes, tieneMensajes]);

  const cargarHistorial = useCallback(async () => {
    setHistorialCargando(true);
    setHistorialError(null);
    try {
      const chats = await getChats();
      const chatsConMensajes = chats.filter(ch => tieneMensajes(ch));
      setChatsHistorial(chatsConMensajes);
      if (chatsConMensajes.length) {
        await manejarSeleccionChat(chatsConMensajes[0].id, chatsConMensajes[0]);
      } else {
        setChatSeleccionado(null);
        setMensajesHistorial([]);
      }
    } catch (err) {
      console.error('Error obteniendo historial de chats:', err);
      setHistorialError('No se pudo cargar el historial de chats.');
    } finally {
      setHistorialCargando(false);
    }
  }, [manejarSeleccionChat, tieneMensajes]);

  const manejarSatisfaccion = useCallback(async (nivel: number, opciones?: { chatId?: number; origen?: 'chat' | 'historial' }) => {
    const objetivoId = opciones?.chatId ?? chatIdActual;
    if (!objetivoId) return;
    const esHistorial = opciones?.origen === 'historial';
    const setGuardando = esHistorial ? setGuardandoSatisfaccionHistorial : setGuardandoSatisfaccion;
    const setMensaje = esHistorial ? setMensajeSatisfaccionHistorial : setMensajeSatisfaccion;
    setGuardando(true);
    setMensaje(null);
    try {
      const chatActualizado = await updateChatSatisfaction(objetivoId, nivel);
      const nuevoNivel = chatActualizado.satisfaction_level ?? nivel;
      if (esHistorial) {
        setChatsHistorial(prev => prev.map(chat => (chat.id === objetivoId ? { ...chat, satisfaction_level: nuevoNivel } : chat)));
        setChatSeleccionado(prev => (prev && prev.id === objetivoId ? { ...prev, satisfaction_level: nuevoNivel } : prev));
        setMensaje('Guardamos la valoración del historial.');
      } else {
        setSatisfaccion(nuevoNivel);
        setMensaje('Guardamos tu valoración.');
      }
    } catch (err) {
      console.error('Error guardando nivel de satisfacción:', err);
      setMensaje(esHistorial ? 'No se pudo guardar la valoración del historial.' : 'No se pudo guardar tu nivel de satisfacción.');
    } finally {
      setGuardando(false);
      if (satisfaccionTimeoutRef.current) {
        clearTimeout(satisfaccionTimeoutRef.current);
      }
      satisfaccionTimeoutRef.current = setTimeout(() => setMensaje(null), 4000);
    }
  }, [chatIdActual, setSatisfaccion]);

  const renderMensajes = (lista: Mensaje[]) => (
    lista.map((msg, idx) => (
      <motion.div
        key={`${msg.emisor}-${idx}-${msg.texto.slice(0, 16)}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className={`flex ${msg.emisor === 'usuario' ? 'justify-end' : 'justify-start'}`}
      >
        <AnimatedCard className={`max-w-[80%] md:max-w-[60%] px-4 py-3 rounded-xl text-sm shadow-md ${msg.emisor === 'usuario' ? 'bg-red-100 text-gray-800' : 'bg-red-200 text-gray-800'}`}>
          <div className="flex items-end gap-2">
            {msg.emisor === 'bot' && <Bot className="w-5 h-5 text-red-400" />}
            <span className="whitespace-pre-line">{msg.texto}</span>
            {msg.emisor === 'usuario' && <User className="w-5 h-5 text-red-400" />}
          </div>
        </AnimatedCard>
      </motion.div>
    ))
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    if (tabActiva === 'historial') {
      cargarHistorial();
    }
  }, [tabActiva, cargarHistorial]);

  useEffect(() => {
    return () => {
      if (satisfaccionTimeoutRef.current) {
        clearTimeout(satisfaccionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (estadoConexion === 'cerrado') {
      setMensajeSatisfaccion(null);
    }
  }, [estadoConexion]);

  useEffect(() => {
    setMensajeSatisfaccionHistorial(null);
  }, [chatSeleccionado?.id]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const enviado = enviarMensaje(input);
    if (enviado) {
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <Sidebar selected="Chatbot" />
      <div className="flex-1 flex flex-col">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-1 flex flex-col p-0 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full max-h-[calc(100vh-80px)] bg-gray-200 rounded-lg shadow-lg overflow-hidden min-h-0"
          >
            <div className="px-4 py-3 bg-white border-b border-gray-300 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTabActiva('chat')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${tabActiva === 'chat' ? 'bg-red-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Chat en vivo
                </button>
                <button
                  type="button"
                  onClick={() => setTabActiva('historial')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${tabActiva === 'historial' ? 'bg-red-500 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Historial
                </button>
              </div>
              {tabActiva === 'chat' && (
                <div className="flex flex-col items-start gap-1 text-sm text-gray-700">
                  <div className="flex items-center gap-1 font-semibold text-gray-800">
                    <Star className="w-4 h-4 text-red-400" />
                    <span>Valoración del chat</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      {NIVELES_SATISFACCION.map(nivel => {
                        const activo = satisfaccion === nivel;
                        return (
                          <button
                            key={nivel}
                            type="button"
                            onClick={() => manejarSatisfaccion(nivel)}
                            disabled={!chatIdActual || guardandoSatisfaccion}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium transition ${
                              activo ? 'bg-red-500 text-white border-red-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                            } ${(!chatIdActual || guardandoSatisfaccion) ? 'cursor-not-allowed opacity-70' : ''}`}
                            title={chatIdActual ? `Selecciona para marcar ${nivel}/5` : 'Inicia un chat para valorar'}
                          >
                            <Star className={`w-3.5 h-3.5 ${activo ? 'text-white fill-white' : 'text-red-400'}`} />
                            <span>{nivel}</span>
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs text-gray-500">
                      {chatIdActual ? obtenerEtiquetaSatisfaccion(satisfaccion) : 'Disponible al iniciar el chat'}
                    </span>
                    {mensajeSatisfaccion && <span className="text-xs text-green-600">{mensajeSatisfaccion}</span>}
                  </div>
                </div>
              )}
            </div>
            {tabActiva === 'chat' ? (
              <div className="px-4 py-2 bg-gray-100 text-sm text-gray-600 border-b border-gray-300 flex flex-wrap gap-2">
                <span className="font-medium">
                  Estado:
                  {' '}
                  {estadoConexion === 'conectando' && 'Conectando...'}
                  {estadoConexion === 'listo' && 'Conectado'}
                  {estadoConexion === 'cerrado' && 'Desconectado'}
                  {estadoConexion === 'error' && 'Error'}
                </span>
                {!modeloListo && estadoConexion === 'listo' && <span>Preparando al asistente...</span>}
                {errorConexion && <span className="text-red-600">{errorConexion}</span>}
              </div>
            ) : (
              <div className="px-4 py-2 bg-gray-100 text-sm text-gray-600 border-b border-gray-300 flex flex-wrap items-center justify-between gap-2">
                <span>{historialError ?? 'Selecciona un chat del historial para revisarlo.'}</span>
                <button
                  type="button"
                  onClick={cargarHistorial}
                  disabled={historialCargando}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition ${
                    historialCargando ? 'cursor-not-allowed opacity-70' : 'bg-white hover:border-red-300'
                  }`}
                >
                  {historialCargando ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            )}
            <div className="flex-1 flex flex-col min-h-0">
              {tabActiva === 'chat' ? (
                <div className="flex-1 overflow-y-auto px-2 md:px-8 py-6 space-y-4 bg-gray-200 min-h-0">
                  {renderMensajes(mensajes)}
                  {esperandoRespuesta && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <AnimatedCard className="max-w-[70%] md:max-w-[50%] px-4 py-3 rounded-xl text-sm shadow-md bg-white/80 text-gray-700 border border-red-100">
                        <div className="flex items-center gap-3">
                          <Bot className="w-5 h-5 text-red-400" />
                          <span className="text-sm font-medium">El asistente está escribiendo</span>
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-300 animate-bounce" />
                            <span className="w-2 h-2 rounded-full bg-red-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-red-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </AnimatedCard>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div className="flex flex-1 flex-col md:flex-row bg-gray-200 min-h-0">
                  <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300 bg-white/80 px-4 py-4 space-y-3 overflow-y-auto max-h-64 md:max-h-full min-h-0">
                    {historialCargando ? (
                      <p className="text-sm text-gray-500">Cargando chats...</p>
                    ) : chatsHistorial.length === 0 ? (
                      <p className="text-sm text-gray-600">No hay chats con mensajes guardados.</p>
                    ) : (
                      chatsHistorial.map(chat => {
                        const seleccionado = chatSeleccionado?.id === chat.id;
                        return (
                          <button
                            key={chat.id}
                            type="button"
                            onClick={() => manejarSeleccionChat(chat.id)}
                            className={`w-full text-left rounded-lg border px-3 py-2 transition ${
                              seleccionado ? 'bg-red-50 border-red-300 shadow' : 'bg-white border-gray-200 hover:border-red-200'
                            }`}
                          >
                            <p className="font-semibold text-gray-800 text-sm">{chat.titulo}</p>
                            <p className="text-xs text-gray-500">{formatearFecha(chat.created_at)}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Star className="w-3.5 h-3.5 text-red-400" />
                              {obtenerEtiquetaSatisfaccion(chat.satisfaction_level)}
                            </p>
                          </button>
                        );
                      })
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto px-2 md:px-8 py-6 space-y-4 min-h-0">
                    {detalleCargando ? (
                      <p className="text-sm text-gray-600">Cargando conversación...</p>
                    ) : !chatSeleccionado ? (
                      <p className="text-sm text-gray-600">Selecciona un chat para ver sus mensajes.</p>
                    ) : (
                      <>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-semibold text-gray-800">{chatSeleccionado.titulo}</p>
                          <p className="text-xs">{formatearFecha(chatSeleccionado.created_at)}</p>
                          <div className="text-xs flex flex-wrap items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-red-400" />
                              {obtenerEtiquetaSatisfaccion(chatSeleccionado.satisfaction_level)}
                            </span>
                            <div className="flex flex-wrap items-center gap-1">
                              {NIVELES_SATISFACCION.map(nivel => {
                                const activo = chatSeleccionado.satisfaction_level === nivel;
                                return (
                                  <button
                                    key={`hist-${nivel}`}
                                    type="button"
                                    onClick={() => manejarSatisfaccion(nivel, { chatId: chatSeleccionado.id, origen: 'historial' })}
                                    disabled={guardandoSatisfaccionHistorial}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] font-medium transition ${
                                      activo ? 'bg-red-500 text-white border-red-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                                    } ${guardandoSatisfaccionHistorial ? 'cursor-not-allowed opacity-70' : ''}`}
                                    title="Actualiza la valoración de este chat"
                                  >
                                    <Star className={`w-3 h-3 ${activo ? 'text-white fill-white' : 'text-red-400'}`} />
                                    <span>{nivel}</span>
                                  </button>
                                );
                              })}
                            </div>
                            {mensajeSatisfaccionHistorial && (
                              <span className="text-green-600">{mensajeSatisfaccionHistorial}</span>
                            )}
                          </div>
                        </div>
                        {mensajesHistorial.length === 0 ? (
                          <p className="text-sm text-gray-600">Este chat no tiene mensajes guardados.</p>
                        ) : (
                          renderMensajes(mensajesHistorial)
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {tabActiva === 'chat' ? (
              <form onSubmit={handleSend} className="bg-gray-100 px-4 py-4 flex items-center gap-2 border-t border-gray-300 relative">
                {esperandoRespuesta && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-t-lg flex items-center justify-center text-sm text-gray-600 font-medium pointer-events-none">
                    El asistente está generando una respuesta...
                  </div>
                )}
                <input
                  type="text"
                  className={`flex-1 rounded-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none bg-white text-gray-700 shadow ${esperandoRespuesta ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="¿Qué quieres saber?"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={esperandoRespuesta || estadoConexion !== 'listo' || !modeloListo}
                  autoFocus
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!input.trim() || estadoConexion !== 'listo' || !modeloListo || esperandoRespuesta}
                  className={`bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors ${(!input.trim() || estadoConexion !== 'listo' || !modeloListo || esperandoRespuesta) ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>
            ) : (
              <div className="bg-gray-100 px-4 py-4 text-sm text-gray-600 border-t border-gray-300">
                El historial es de solo lectura. No puedes enviar mensajes desde esta vista.
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}; 