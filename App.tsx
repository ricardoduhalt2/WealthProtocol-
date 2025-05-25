
import React, { useState, useEffect } from 'react';
import OrdinalsPage from './components/OrdinalsPage';
import Navbar from './components/Navbar';
import ChidoPage from './components/ChidoPage';
import ParticlesBackground from './components/ParticlesBackground';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check in case the page is loaded with a hash
    handleHashChange(); 

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  let pageContent;
  if (currentPage === '#/chido') {
    pageContent = <ChidoPage />;
  } else { // Default to marketplace for '#/' or any other hash
    pageContent = <OrdinalsPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-800 text-slate-100 font-sans flex flex-col relative">
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}>
        <ParticlesBackground />
      </div>
      <header className="py-8 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400">
            Ordinal Marketplace
          </span>
        </h1>
        <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
          Discover unique Ordinal NFTs from the exclusive Wealth Protocol collection.
        </p>
      </header>
      
      <Navbar currentPath={currentPage} />

      <main className="flex-grow">
        {pageContent}
      </main>
      
      <footer className="text-center py-8 mt-12 border-t border-slate-700">
        <p className="text-sm text-slate-500">&copy; ${new Date().getFullYear()} Wealth Protocol. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;