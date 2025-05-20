import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Login } from './pages/Login';
import { Usuarios } from './pages/Usuarios';

function RequireAuth({ children, isAuth }: { children: JSX.Element, isAuth: boolean }) {
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
