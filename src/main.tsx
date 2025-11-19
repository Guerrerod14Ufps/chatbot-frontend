import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ChatSocketProvider } from './contexts/ChatSocketContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <ChatSocketProvider>
          <App />
        </ChatSocketProvider>
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>
);
