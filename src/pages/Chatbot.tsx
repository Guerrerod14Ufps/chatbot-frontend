import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { AdminHeader } from '../components/AdminHeader';
import { motion } from 'framer-motion';
import { User, Bot, Send } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';

interface Mensaje {
  texto: string;
  emisor: 'usuario' | 'bot';
}

export const Chatbot: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [estadoConexion, setEstadoConexion] = useState<'conectando' | 'listo' | 'cerrado' | 'error'>('conectando');
  const [error, setError] = useState<string | null>(null);
  const [modeloListo, setModeloListo] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró un token activo. Inicia sesión nuevamente.');
      setEstadoConexion('error');
      return;
    }

    const wsUrl = `ws://chatbot-api-yikx.onrender.com/ws/chat?token=${encodeURIComponent(token)}`;
    const websocket = new WebSocket(wsUrl);

    wsRef.current = websocket;
    setEstadoConexion('conectando');
    setError(null);

    websocket.onopen = () => {
      setEstadoConexion('listo');
    };

    websocket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.status === 'ready') {
          setModeloListo(true);
          return;
        }
        if (data?.error) {
          setError(data.error);
          setEstadoConexion('error');
          return;
        }
      } catch {
        setMensajes(prev => [...prev, { texto: event.data as string, emisor: 'bot' }]);
        return;
      }
    };

    websocket.onerror = () => {
      setError('Error en la conexión con el chatbot.');
      setEstadoConexion('error');
    };

    websocket.onclose = () => {
      setEstadoConexion('cerrado');
      setModeloListo(false);
    };

    return () => {
      websocket.close(1000, 'Componente desmontado');
      wsRef.current = null;
    };
  }, []);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    if (wsRef.current?.readyState !== WebSocket.OPEN || !modeloListo) {
      setError('El chatbot aún no está listo. Espera un momento e intenta de nuevo.');
      return;
    }

    const mensajeUsuario = input.trim();
    setMensajes(prev => [...prev, { texto: mensajeUsuario, emisor: 'usuario' }]);
    setInput('');
    setError(null);

    try {
      wsRef.current.send(mensajeUsuario);
    } catch (err) {
      console.error('Error enviando mensaje:', err);
      setError('No se pudo enviar el mensaje. Revisa tu conexión.');
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
            className="flex flex-col h-full max-h-[calc(100vh-80px)] bg-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
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
              {error && <span className="text-red-600">{error}</span>}
            </div>
            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto px-2 md:px-8 py-6 space-y-4 bg-gray-200">
              {mensajes.map((msg, idx) => (
                <motion.div
                  key={idx}
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
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Input de mensaje */}
            <form onSubmit={handleSend} className="bg-gray-100 px-4 py-4 flex items-center gap-2 border-t border-gray-300">
              <input
                type="text"
                className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none bg-white text-gray-700 shadow"
                placeholder="¿Qué quieres saber ?"
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={!input.trim() || estadoConexion !== 'listo' || !modeloListo}
                className={`bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors ${(!input.trim() || estadoConexion !== 'listo' || !modeloListo) ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}; 