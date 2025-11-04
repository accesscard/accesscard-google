import React, { useState } from 'react';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { User } from '../types';
import { api } from '../services/api';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onRegisterVenue: () => void;
}

const ForgotPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Recuperar Contraseña</h2>
            <p className="text-gray-400 mb-6 text-sm">Esta es una simulación. En una aplicación real, aquí podrías ingresar tu correo para recibir un enlace de recuperación.</p>
            <button onClick={onClose} className="w-full py-2 bg-white text-black font-bold rounded-lg">Entendido</button>
        </div>
    </div>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegisterVenue }) => {
  const [isRegister, setIsRegister] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleAuthAttempt = async () => {
    setIsLoading(true);
    setError('');
    
    try {
        if (isRegister) {
            // Registration Logic
            if (!name || !email || !password) {
                throw new Error("Todos los campos son obligatorios.");
            }
            const newUser = await api.registerUser({
                name,
                email,
                password,
                role: 'user',
            });
            if (newUser) {
                onLogin(newUser); // The App component will handle the onboarding flow
            } else {
                throw new Error("No se pudo crear la cuenta.");
            }
        } else {
            // Login Logic
            const user = await api.login(email, password);
            if (user) {
                onLogin(user);
            } else {
                throw new Error('Credenciales incorrectas. Inténtalo de nuevo.');
            }
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
    <div className="min-h-screen flex flex-col justify-between p-8 bg-[#121212] text-white overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-20%] w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
         <div className="absolute top-[30%] right-[15%] w-48 h-48 bg-sky-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center text-center relative z-10">
        <h1 
          className="text-6xl font-black tracking-tighter"
          style={{fontFamily: 'Inter, sans-serif'}}
        >
          ACCESS+
        </h1>
        <p className="mt-4 text-lg text-white/60 max-w-xs">
          {isRegister ? 'Crea tu cuenta y únete al club.' : 'La membresía exclusiva para tus locales favoritos.'}
        </p>
      </div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <button
            className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all duration-300"
        >
            <GoogleIcon className="w-5 h-5" />
            {isRegister ? 'Registrarse con Google' : 'Iniciar sesión con Google'}
        </button>
        <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs text-white/30">O</span>
            <div className="flex-grow border-t border-white/10"></div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleAuthAttempt(); }}>
          <div className="space-y-4">
            {isRegister && (
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="Nombre Completo"
                required
              />
            )}
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="Correo electrónico"
                required
            />
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="Contraseña"
                required
            />
          </div>

          {!isRegister && (
              <div className="text-right mt-2">
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-gray-400 hover:text-white hover:underline">¿Olvidaste tu contraseña?</button>
              </div>
          )}

          {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-white/10 disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : (isRegister ? 'Crear Cuenta' : 'Login')}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-400/80">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button onClick={() => { setIsRegister(!isRegister); setError('')}} className="font-bold text-white hover:underline ml-1">
            {isRegister ? 'Inicia sesión' : 'Comenzar'}
          </button>
        </p>
        <p className="mt-4 text-center text-sm text-gray-400/80">
          ¿Tienes un local? 
          <button onClick={onRegisterVenue} className="font-bold text-white hover:underline ml-1">
            Regístralo aquí
          </button>
        </p>
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
    </>
  );
};

export default LoginScreen;
