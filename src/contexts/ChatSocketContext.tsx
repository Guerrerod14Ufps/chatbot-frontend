import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

type EstadoConexion = 'conectando' | 'listo' | 'cerrado' | 'error';

export interface MensajeChat {
  texto: string;
  emisor: 'usuario' | 'bot';
}

interface ChatSocketContextValue {
  mensajes: MensajeChat[];
  estadoConexion: EstadoConexion;
  errorConexion: string | null;
  modeloListo: boolean;
  esperandoRespuesta: boolean;
  chatIdActual: number | null;
  satisfaccion: number | null;
  setSatisfaccion: React.Dispatch<React.SetStateAction<number | null>>;
  enviarMensaje: (texto: string) => boolean;
  limpiarConversacion: () => void;
}

const ChatSocketContext = createContext<ChatSocketContextValue | undefined>(undefined);

const WS_URL = 'wss://chatbot-api-yikx.onrender.com/ws/chat';

export function ChatSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconectarRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [estadoConexion, setEstadoConexion] = useState<EstadoConexion>('cerrado');
  const [errorConexion, setErrorConexion] = useState<string | null>(null);
  const [modeloListo, setModeloListo] = useState(false);
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);
  const [chatIdActual, setChatIdActual] = useState<number | null>(null);
  const [satisfaccion, setSatisfaccion] = useState<number | null>(null);

  const limpiarConversacion = useCallback(() => {
    setMensajes([]);
    setModeloListo(false);
    setEsperandoRespuesta(false);
  }, []);

  const cerrarSocket = useCallback((codigo = 1000) => {
    if (wsRef.current) {
      try {
        wsRef.current.close(codigo);
      } catch (err) {
        console.error('Error cerrando WebSocket:', err);
      }
      wsRef.current = null;
    }
    if (reconectarRef.current) {
      clearTimeout(reconectarRef.current);
      reconectarRef.current = null;
    }
  }, []);

  const programarReconectar = useCallback(() => {
    if (reconectarRef.current || !isAuthenticated) return;
    reconectarRef.current = setTimeout(() => {
      reconectarRef.current = null;
      // Intentamos reconectar solo si no hay un socket existente
      if (!wsRef.current) {
        conectar();
      }
    }, 3000);
  }, [isAuthenticated]);

  const manejarMensaje = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data?.status === 'ready') {
        setModeloListo(true);
        setErrorConexion(null);
        if (typeof data.chat_id === 'number') {
          setChatIdActual(data.chat_id);
        }
        setSatisfaccion(data.satisfaction_level ?? null);
        return;
      }
      if (data?.error) {
        setErrorConexion(data.error);
        setEstadoConexion('error');
        setEsperandoRespuesta(false);
        return;
      }
      if (data?.message || data?.texto) {
        const contenido = data.message ?? data.texto;
        setMensajes(prev => [...prev, { texto: contenido, emisor: 'bot' }]);
        setEsperandoRespuesta(false);
        return;
      }
    } catch {
      setMensajes(prev => [...prev, { texto: event.data as string, emisor: 'bot' }]);
      setEsperandoRespuesta(false);
    }
  }, []);

  const conectar = useCallback(() => {
    if (!isAuthenticated) {
      cerrarSocket();
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorConexion('No se encontró un token activo. Inicia sesión nuevamente.');
      setEstadoConexion('error');
      return;
    }

    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const websocket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
      wsRef.current = websocket;
      setEstadoConexion('conectando');
      setErrorConexion(null);

      websocket.onopen = () => {
        setEstadoConexion('listo');
      };

      websocket.onmessage = manejarMensaje;

      websocket.onerror = () => {
        setErrorConexion('Error en la conexión con el chatbot.');
        setEstadoConexion('error');
        setEsperandoRespuesta(false);
      };

      websocket.onclose = (event: CloseEvent) => {
        setEstadoConexion('cerrado');
        setModeloListo(false);
        setEsperandoRespuesta(false);
        setChatIdActual(null);
        setSatisfaccion(null);
        wsRef.current = null;

        if (isAuthenticated && event.code !== 1000) {
          programarReconectar();
        }
      };
    } catch (err) {
      console.error('Error creando WebSocket:', err);
      setErrorConexion('No se pudo iniciar la conexión con el chatbot.');
      setEstadoConexion('error');
      programarReconectar();
    }
  }, [cerrarSocket, isAuthenticated, manejarMensaje, programarReconectar]);

  const enviarMensaje = useCallback((texto: string): boolean => {
    if (!texto.trim()) return false;
    const mensaje = texto.trim();

    if (wsRef.current?.readyState !== WebSocket.OPEN || !modeloListo) {
      setErrorConexion('El chatbot aún no está listo. Espera un momento e intenta de nuevo.');
      return false;
    }

    try {
      wsRef.current.send(mensaje);
      setMensajes(prev => [...prev, { texto: mensaje, emisor: 'usuario' }]);
      setErrorConexion(null);
      setEsperandoRespuesta(true);
      return true;
    } catch (err) {
      console.error('Error enviando mensaje:', err);
      setErrorConexion('No se pudo enviar el mensaje. Revisa tu conexión.');
      setEsperandoRespuesta(false);
      return false;
    }
  }, [modeloListo]);

  useEffect(() => {
    if (isAuthenticated) {
      conectar();
    } else {
      cerrarSocket();
      limpiarConversacion();
      setEstadoConexion('cerrado');
      setErrorConexion(null);
      setChatIdActual(null);
      setSatisfaccion(null);
    }

    return () => {
      cerrarSocket();
      limpiarConversacion();
    };
  }, [cerrarSocket, conectar, isAuthenticated, limpiarConversacion]);

  const value: ChatSocketContextValue = {
    mensajes,
    estadoConexion,
    errorConexion,
    modeloListo,
    esperandoRespuesta,
    chatIdActual,
    satisfaccion,
    setSatisfaccion,
    enviarMensaje,
    limpiarConversacion,
  };

  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  const context = useContext(ChatSocketContext);
  if (context === undefined) {
    throw new Error('useChatSocket debe ser usado dentro de un ChatSocketProvider');
  }
  return context;
}

