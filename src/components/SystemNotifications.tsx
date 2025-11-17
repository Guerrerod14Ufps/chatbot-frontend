import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import type { ComponentType } from 'react';
import type { Notification } from '../contexts/NotificationContext';

const TYPE_STYLES: Record<
  Notification['type'],
  { container: string; accent: string; Icon: ComponentType<{ className?: string }> }
> = {
  success: {
    container: 'bg-white text-gray-900 border border-green-100 shadow-green-100/70',
    accent: 'bg-green-500',
    Icon: CheckCircle
  },
  error: {
    container: 'bg-white text-gray-900 border border-red-100 shadow-red-100/70',
    accent: 'bg-red-500',
    Icon: AlertOctagon
  },
  info: {
    container: 'bg-white text-gray-900 border border-blue-100 shadow-blue-100/70',
    accent: 'bg-blue-500',
    Icon: Info
  },
  warning: {
    container: 'bg-white text-gray-900 border border-amber-100 shadow-amber-100/70',
    accent: 'bg-amber-500',
    Icon: AlertTriangle
  }
};

interface SystemNotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function SystemNotifications({ notifications, onDismiss }: SystemNotificationsProps) {
  return (
    <div className="pointer-events-none fixed top-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {notifications.map((notification) => {
          const { container, accent, Icon } = TYPE_STYLES[notification.type];
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto relative overflow-hidden rounded-2xl px-5 py-4 shadow-xl backdrop-blur ${container}`}
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
              <div className="flex items-start gap-3 pr-6">
                <span className={`mt-0.5 rounded-full p-1 text-white ${accent}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{notification.title}</p>
                  {notification.description && (
                    <p className="mt-1 text-xs text-gray-500">{notification.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Cerrar notificación"
                  className="absolute top-3 right-3 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  onClick={() => onDismiss(notification.id)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

