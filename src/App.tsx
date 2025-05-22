import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { RecuperarPassword } from './pages/RecuperarPassword';
import { Usuarios } from './pages/Usuarios';
import { Documentos } from './pages/Documentos';
import { RecursosRA } from './pages/RecursosRA';
import { PreguntasFrecuentes } from './pages/PreguntasFrecuentes';
import { Estadisticas } from './pages/Estadisticas';
import { Chatbot } from './pages/Chatbot';
import { Categorias } from './pages/Categorias';
import { useAuth } from './contexts/AuthContext';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import VerifyEmail from './pages/VerifyEmail';

function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documentos"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Documentos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recursos-ra"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RecursosRA />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preguntas-frecuentes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PreguntasFrecuentes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estadisticas"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Estadisticas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Categorias />
            </ProtectedRoute>
          }
        />
        <Route path="/users/reset-password-confirm" element={<ResetPasswordConfirm />} />
        <Route path="/users/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
