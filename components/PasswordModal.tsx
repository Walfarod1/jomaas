import React, { useState, useEffect, useRef } from 'react';
import Button from './NeonButton';
import { Screen } from '../types';

interface PasswordModalProps {
  screen: Screen;
  onSuccess: (password: string) => void;
  onClose: () => void;
  validatePassword: (password: string) => boolean;
}

const PasswordModal = ({ screen, onSuccess, onClose, validatePassword }: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword(password)) {
      onSuccess(password);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className={`p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all ${error ? 'animate-shake' : ''}`}>
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-2">Acceso Restringido</h2>
        <p className="text-center text-gray-500 mb-6">Introduzca la clave para: <span className="font-bold text-gray-700">{screen}</span></p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-lg text-center text-2xl text-gray-700 tracking-widest focus:border-[#f97216] focus:ring-[#f97216] focus:outline-none transition-colors"
            placeholder="****"
          />
          {error && <p className="text-red-500 text-center mt-2 font-semibold">Clave Incorrecta</p>}
          <div className="flex justify-around mt-8">
            <Button type="button" variant="primary" onClick={onClose} className="w-2/5">
              Cancelar
            </Button>
            <Button type="submit" variant="secondary" className="w-2/5">
              Entrar
            </Button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake {
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default PasswordModal;