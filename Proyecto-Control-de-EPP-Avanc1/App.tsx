import React, { useState } from 'react';
import Layout from './components/Layout';
import Button from './components/NeonButton';
import PasswordModal from './components/PasswordModal';
import RequestScreen from './components/RequestScreen';
import DeliveryScreen from './components/DeliveryScreen';
import InventoryScreen from './components/InventoryScreen';
import ConsultationScreen from './components/ConsultationScreen';
import Toast from './components/Toast';
import RequestIcon from './components/icons/RequestIcon';
import DeliveryIcon from './components/icons/DeliveryIcon';
import InventoryIcon from './components/icons/InventoryIcon';
import ConsultationIcon from './components/icons/ConsultationIcon';
import { Screen, ToastMessage } from './types';
import { PASSWORDS } from './constants';
import { useInventory } from './context/InventoryContext';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [accessAttempt, setAccessAttempt] = useState<Screen | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { state, loginApprover, findApproverById } = useInventory();
  
  if (state.isLoading) {
      return (
          <div className="fixed inset-0 bg-white flex flex-col justify-center items-center">
              <svg className="animate-spin h-12 w-12 text-[#f97216]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg font-semibold text-gray-700">Cargando datos...</p>
          </div>
      );
  }

  if (state.error) {
    return (
        <div className="fixed inset-0 bg-red-50 flex flex-col justify-center items-center p-4">
           <div className="text-center">
            <h2 className="text-2xl font-bold text-red-700">Error Inesperado</h2>
            <p className="mt-2 text-red-600">{state.error}</p>
            <p className="mt-4 text-sm text-gray-500">Ha ocurrido un error inesperado. Por favor, recargue la página.</p>
           </div>
        </div>
    )
  }

  const handleNavClick = (screen: Screen) => {
    const staticPassword = PASSWORDS[screen];
    // Any screen that needs dynamic validation or has a static password will trigger the modal
    if (screen === Screen.DELIVERY || screen === Screen.INVENTORY || staticPassword) {
      setAccessAttempt(screen);
    } else {
      setCurrentScreen(screen);
    }
  };

  const handlePasswordSuccess = (password: string) => {
    // For the delivery screen, log in the approver to use their details later
    if (accessAttempt === Screen.DELIVERY) {
      const approver = findApproverById(password);
      if (approver) {
          loginApprover(approver);
      }
    }
    
    if (accessAttempt) {
      setCurrentScreen(accessAttempt);
      setAccessAttempt(null);
    }
  };

  const getValidationFunction = (screen: Screen) => {
    // Both Delivery and Inventory screens use the dynamic approver list for validation
    if (screen === Screen.DELIVERY || screen === Screen.INVENTORY) {
        return (password: string) => !!findApproverById(password);
    }
    // Other screens fall back to the static password list
    return (password: string) => password === PASSWORDS[screen];
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const newToast: ToastMessage = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
  };

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.REQUEST:
        return <RequestScreen onBack={() => setCurrentScreen(Screen.HOME)} showToast={showToast} />;
      case Screen.DELIVERY:
        return <DeliveryScreen onBack={() => setCurrentScreen(Screen.HOME)} showToast={showToast} />;
      case Screen.CONSULTA_DE_DOTACION:
        return <ConsultationScreen onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.INVENTORY:
        return <InventoryScreen onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.HOME:
      default:
        return (
          <div className="w-full max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <NavCard
                title={Screen.REQUEST}
                icon={<RequestIcon />}
                onClick={() => handleNavClick(Screen.REQUEST)}
              />
              <NavCard
                title={Screen.DELIVERY}
                icon={<DeliveryIcon />}
                onClick={() => handleNavClick(Screen.DELIVERY)}
                notificationCount={state.requests.length}
              />
              <NavCard
                title={Screen.CONSULTA_DE_DOTACION}
                icon={<ConsultationIcon />}
                onClick={() => handleNavClick(Screen.CONSULTA_DE_DOTACION)}
              />
              <NavCard
                title={Screen.INVENTORY}
                icon={<InventoryIcon />}
                onClick={() => handleNavClick(Screen.INVENTORY)}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="pt-24 pb-12 md:pt-32 md:pb-24">
         {renderScreen()}
      </div>
      {accessAttempt && (
        <PasswordModal
          screen={accessAttempt}
          validatePassword={getValidationFunction(accessAttempt)}
          onSuccess={handlePasswordSuccess}
          onClose={() => setAccessAttempt(null)}
        />
      )}
      <div className="fixed bottom-5 right-5 space-y-3 z-[100]">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </Layout>
  );
};

interface NavCardProps {
  title: string;
  icon: React.ReactElement<{ className?: string }>;
  onClick: () => void;
  notificationCount?: number;
}

const NavCard = ({ title, icon, onClick, notificationCount = 0 }: NavCardProps) => (
  <div
    onClick={onClick}
    className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center group"
  >
    {notificationCount > 0 && (
      <div className="absolute top-2 right-2">
        <div className="absolute w-8 h-8 rounded-full bg-red-400 animate-ping opacity-75"></div>
        <div className="relative w-8 h-8 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center border-2 border-white">
          {notificationCount}
        </div>
      </div>
    )}
    <div className="text-[#f97216] w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { className: "w-full h-full" })}
    </div>
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
  </div>
);


export default App;