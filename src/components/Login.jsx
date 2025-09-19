import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular delay de autenticación
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Usuario o contraseña incorrectos');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-galicia-light-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo del Banco Galicia */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-galicia-blue rounded-full mb-4">
            <span className="text-white text-xl font-bold">G</span>
          </div>
          <h1 className="text-2xl font-bold text-galicia-blue">Banco Galicia</h1>
          <p className="text-galicia-gray mt-1 text-sm">Home Banking</p>
        </div>

        {/* Formulario de login */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-galicia-blue mb-6 text-center">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-galicia-gray mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-galicia-gray w-4 h-4" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-galicia-border rounded-lg focus:ring-2 focus:ring-galicia-blue focus:border-transparent text-sm"
                  placeholder="Ingrese su usuario"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-galicia-gray mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-galicia-gray w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-galicia-border rounded-lg focus:ring-2 focus:ring-galicia-blue focus:border-transparent text-sm"
                  placeholder="Ingrese su contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-galicia-gray hover:text-galicia-blue"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-galicia-gray">
              Demo: Usuario y contraseña: <strong>Fei</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-galicia-gray">
          <p>© 2024 Banco Galicia. Todos los derechos reservados.</p>
          <p className="mt-1">Versión Demo - Solo para presentación</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
