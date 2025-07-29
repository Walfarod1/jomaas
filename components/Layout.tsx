import React, { ReactNode } from 'react';
import Header from './Header';
import GeometricPattern from './GeometricPattern';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GeometricPattern position="top-left" />
      
      <Header />
      
      <main className="relative z-10">
        {children}
      </main>

      <GeometricPattern position="bottom-right" />

      <footer className="text-center text-xs text-gray-500 py-4 relative z-10 bg-white">
        Compañía de Galletas Pozuelo - Desarrollado por pzwadelgado
      </footer>
    </div>
  );
};

export default Layout;