import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin' && password === 'password123') {
      onLogin();
      navigate('/usuarios');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-[#d3d3d3] flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button className="w-full bg-red-600 hover:bg-red-700" type="submit">
              Ingresar
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-700">
            ¿No tienes una cuenta? <a href="#" className="text-red-600 hover:underline">Regístrate</a>
          </div>
          <div className="mt-1 text-center text-xs text-gray-500">
            <a href="#" className="hover:underline">Recuperar Contraseña</a>
          </div>
        </div>
      </div>
    </div>
  );
}; 