
import React, { useState } from 'react';
import { User } from '../types';
import { QrCode } from '../components/QrCode';

const CardScreen: React.FC<{ user: User }> = ({ user }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-transparent text-white">
      <div className="w-full max-w-md perspective-[1000px]">
        <div
          className="relative w-full aspect-[85.6/53.98] transition-transform duration-700 [transform-style:preserve-3d] cursor-pointer"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of the card */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl p-6 flex flex-col justify-between shadow-2xl bg-black text-white overflow-hidden transform-gpu"
            style={{
              background: 'linear-gradient(145deg, #111111, #2C2C2C)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 15px rgba(251, 191, 36, 0.1)'
            }}>
             <div className="absolute inset-0 bg-repeat bg-center opacity-[0.02]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
            <div className="relative z-10 flex justify-between items-start">
              <p className="text-xl font-black tracking-tighter">ACCESS+</p>
              <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 to-amber-500"></div>
            </div>
            <div className="relative z-10 text-left">
              <p className="text-lg font-mono tracking-widest text-gray-300">**** **** **** 1234</p>
              <div className="flex justify-between items-end">
                <p className="text-sm font-semibold mt-2 uppercase">{user.name}</p>
                {/* FIX: Use optional chaining for plan properties */}
                <p className="text-lg font-bold text-amber-300">{user.plan?.level}</p>
              </div>
            </div>
          </div>

          {/* Back of the card */}
          <div className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] rounded-2xl p-4 flex flex-col items-center justify-center shadow-2xl bg-black text-white overflow-hidden transform-gpu"
            style={{
              background: 'linear-gradient(145deg, #2C2C2C, #111111)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 15px rgba(251, 191, 36, 0.1)'
            }}>
              <div className="w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600 absolute top-10"></div>
              <div className="bg-white p-2 rounded-lg shadow-lg animate-pulse-qr">
                  {/* FIX: Use correct property 'wallet_qr' and handle null case */}
                  <QrCode value={user.wallet_qr || ''} />
              </div>
              <div className="text-center mt-4">
                  <p className="font-semibold text-lg">{user.name}</p>
                  {/* FIX: Use optional chaining for plan properties */}
                  <p className="text-sm text-amber-400">{user.plan?.name}</p>
              </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center w-full max-w-md space-y-3">
        <button onClick={() => alert('Funcionalidad para agregar a Apple Wallet próximamente.')} className="w-full py-3 bg-black border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
            Añadir a Apple Wallet
        </button>
        <button onClick={() => alert('Funcionalidad para agregar a Google Wallet próximamente.')} className="w-full py-3 bg-black border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
            Añadir a Google Wallet
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Toca la tarjeta para ver tu código QR.
        </p>
      </div>


      <style>{`
        .perspective-\\[1000px\\] { perspective: 1000px; }
        .\\[transform-style\\:preserve-3d\\] { transform-style: preserve-d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        
        @keyframes pulse-qr {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.25);
          }
        }
        .animate-pulse-qr {
          animation: pulse-qr 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CardScreen;
