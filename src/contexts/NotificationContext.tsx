import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { SystemNotifications } from '../components/SystemNotifications';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  description?: string;
}

export interface Notification extends NotificationPayload {
  id: string;
}

interface NotificationContextValue {
  notify: (payload: NotificationPayload, duration?: number) => string;
  notifySuccess: (title: string, description?: string, duration?: number) => string;
  notifyError: (title: string, description?: string, duration?: number) => string;
  notifyInfo: (title: string, description?: string, duration?: number) => string;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const notify = useCallback(
    (payload: NotificationPayload, duration = 4500) => {
      const id = createId();
      setNotifications((prev) => [...prev, { ...payload, id }]);
      if (duration > 0) {
        const scheduleRemoval =
          typeof window !== 'undefined' && typeof window.setTimeout === 'function'
            ? window.setTimeout
            : setTimeout;
        scheduleRemoval(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      notify,
      notifySuccess: (title, description, duration) =>
        notify({ type: 'success', title, description }, duration),
      notifyError: (title, description, duration) =>
        notify({ type: 'error', title, description }, duration),
      notifyInfo: (title, description, duration) =>
        notify({ type: 'info', title, description }, duration),
      dismiss
    }),
    [notify, dismiss]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <SystemNotifications notifications={notifications} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe utilizarse dentro de NotificationProvider');
  }
  return context;
}

