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

const mensajesMock: Mensaje[] = [
  { texto: 'Hola, estoy buscando cursos de formación complementaria en ingeniería de sistemas. ¿Me puedes ayudar?', emisor: 'usuario' },
  { texto: '¡Hola! Claro, estaré encantado de ayudarte. ¿Tienes algún tema en específico que te interese, como desarrollo web, inteligencia artificial o bases de datos?', emisor: 'bot' },
  { texto: 'Me interesa aprender sobre inteligencia artificial. ¿Qué opciones hay?', emisor: 'usuario' },
  { texto: 'Excelente elección. Aquí tienes algunos cursos disponibles:\n1. Introducción a la Inteligencia Artificial – Nivel básico, duración: 6 semanas.\n2. Machine Learning con Python – Nivel intermedio, duración: 8 semanas.\n3. Redes Neuronales y Deep Learning – Nivel avanzado, duración: 10 semanas.\n¿Te gustaría más detalles sobre alguno en particular?', emisor: 'bot' },
  { texto: 'Sí, cuéntame más sobre el curso de Machine Learning con Python.', emisor: 'usuario' },
  { texto: 'Por supuesto. El curso Machine Learning con Python cubre los siguientes temas:\n📌 Introducción al aprendizaje automático\n📌 Regresión y clasificación\n📌 Algoritmos de aprendizaje supervisado y no supervisado\n📌 Implementación en Python...', emisor: 'bot' },
];

export const Chatbot: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>(mensajesMock);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setMensajes([...mensajes, { texto: input, emisor: 'usuario' }]);
    setInput('');
    // Aquí podrías simular una respuesta del bot si lo deseas
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
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
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