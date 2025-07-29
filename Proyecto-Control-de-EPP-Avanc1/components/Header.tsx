import React from 'react';
import CatalogIcon from './icons/CatalogIcon';

const Header = () => {
    return (
        <header className="relative z-20 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Catálogo de EPP"
              title="Catálogo de EPP"
              className="absolute top-0 right-5 mt-6 flex flex-col items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:bg-slate-100 transition-all duration-300 transform hover:-translate-y-1"
            >
              <CatalogIcon className="w-8 h-8 text-[#f97216]" />
              <span className="font-semibold text-xs text-gray-700">Catálogo de EPP</span>
            </a>
            <div className="max-w-screen-xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-wider uppercase">
                   CONTROL DE EPP
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mt-2">Departamento de SST</p>
            </div>
        </header>
    );
};

export default Header;