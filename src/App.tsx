import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, type ReactElement } from 'react';
import { Login } from './pages/Login';
import { Usuarios } from './pages/Usuarios';
import { Documentos } from './pages/Documentos';
import { RecursosRA } from './pages/RecursosRA';
import { PreguntasFrecuentes } from './pages/PreguntasFrecuentes';

function RequireAuth({ children, isAuth }: { children: ReactElement, isAuth: boolean }) {
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuth(true)} />} />
        <Route path="/usuarios" element={
          <RequireAuth isAuth={isAuth}>
            <Usuarios />
          </RequireAuth>
        } />
        <Route path="/documentos" element={
          <RequireAuth isAuth={isAuth}>
            <Documentos />
          </RequireAuth>
        } />
        <Route path="/recursos-ra" element={
          <RequireAuth isAuth={isAuth}>
            <RecursosRA />
          </RequireAuth>
        } />
        <Route path="/preguntas-frecuentes" element={
          <RequireAuth isAuth={isAuth}>
            <PreguntasFrecuentes />
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
