
import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  message: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const baseClasses = 'fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white font-bold z-50 transform transition-all duration-300 flex items-center';
  const typeClasses = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[message.type]}`}>
      {message.type === 'success' && (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )}
       {message.type === 'error' && (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )}
      {message.message}
    </div>
  );
};

export default Toast;