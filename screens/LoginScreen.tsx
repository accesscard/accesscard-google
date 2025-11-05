import React, { useState } from 'react';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { User } from '../types';
import { api } from '../services/api';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onRegisterVenue: () => void;
  onStartRegistration: () => void;
}

const ForgotPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-[#FFFEF3]">Recuperar Contraseña</h2>
            <p className="text-gray-400 mb-6 text-sm">Esta es una simulación. En una aplicación real, aquí podrías ingresar tu correo para recibir un enlace de recuperación.</p>
            <button onClick={onClose} className="w-full py-2 bg-[#FFFEF3] text-black font-bold rounded-lg">Entendido</button>
        </div>
    </div>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegisterVenue, onStartRegistration }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLoginAttempt = async () => {
    setIsLoading(true);
    setError('');
    
    try {
        const user = await api.login(email, password);
        if (user) {
            onLogin(user);
        } else {
            throw new Error('Credenciales incorrectas. Inténtalo de nuevo.');
        }
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
    {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    <div className="min-h-screen flex flex-col justify-between p-8 bg-[#01010C] text-[#FFFEF3] overflow-hidden">
      
      <div className="flex-grow flex flex-col items-center justify-center text-center relative z-10">
        <h1 
          className="text-6xl font-black tracking-tighter"
          style={{fontFamily: 'Inter, sans-serif'}}
        >
          ACCESS+
        </h1>
        <p className="mt-4 text-lg text-white/60 max-w-xs">
          La membresía exclusiva para tus locales favoritos.
        </p>
      </div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <button
            className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/20 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
        >
            <GoogleIcon className="w-5 h-5" />
            Iniciar sesión con Google
        </button>
        <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-xs text-white/40">O</span>
            <div className="flex-grow border-t border-white/20"></div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleLoginAttempt(); }}>
          <div className="space-y-4">
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-xl placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="Correo electrónico"
                required
            />
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-xl placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="Contraseña"
                required
            />
          </div>

          <div className="text-right mt-2">
              <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-gray-400 hover:text-white hover:underline">¿Olvidaste tu contraseña?</button>
          </div>

          {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 bg-[#FFFEF3] text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-white/10 disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Login'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-400/80">
          ¿No tienes cuenta?
          <button onClick={onStartRegistration} className="font-bold text-white hover:underline ml-1">
            Comenzar
          </button>
        </p>
        <p className="mt-4 text-center text-sm text-gray-400/80">
          ¿Tienes un local? 
          <button onClick={onRegisterVenue} className="font-bold text-white hover:underline ml-1">
            Regístralo aquí
          </button>
        </p>
      </div>
    </div>
    </>
  );
};

export default LoginScreen;