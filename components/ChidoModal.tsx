import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  inscriptionId: string;
}

const ChidoModal: React.FC<ChidoModalProps> = ({ isOpen, onClose, title, inscriptionId }) => {


  const ordiscanUrl = `https://ordiscan.com/inscription/${inscriptionId}`;
  const ordiscanIframeUrl = `https://ordiscan.com/inscription/${inscriptionId}?embed=true`;

  // Particle effect state
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  
  // Generate particles on mount
  useEffect(() => {
    if (!isOpen) return;
    
    const newParticles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 2
      });
    }
    
    setParticles(newParticles);
  }, [isOpen]);

  // Animation variants for the modal
  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { 
      opacity: 1, 
      backdropFilter: 'blur(10px)',
      transition: { duration: 0.5 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number = 0) => ({
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      x: [0, (Math.random() - 0.5) * 100],
      y: [0, (Math.random() - 0.5) * 100],
      transition: {
        duration: 1.5,
        delay: i * 0.02,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    })
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chido-modal-title"
        onClick={onClose}
      >
        {/* Animated Particles Background */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              custom={particle.id}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
            />
          ))}
        </div>

        <motion.div 
          variants={modalVariants}
          className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl h-[90vh] overflow-hidden border border-slate-700/50 backdrop-blur-lg"
          style={{
            boxShadow: '0 0 40px rgba(192, 132, 252, 0.15)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <motion.div 
            variants={contentVariants}
            className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 id="chido-modal-title" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  {title}
                </h2>
                <p className="text-sm text-slate-400">Inscription #{inscriptionId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-pink-500 p-2 rounded-full transition-all duration-200 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>

          {/* Content */}
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            {/* Left side - Info */}
            <motion.div 
              variants={contentVariants}
              className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-slate-700/50 bg-slate-800/30"
            >
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">ABOUT THIS INSCRIPTION</h3>
                  <p className="text-slate-200">
                    Explore the details of this unique Bitcoin inscription on the Ordinals protocol.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400">INSCRIPTION ID</p>
                    <p className="text-sm text-slate-200 font-mono break-all">{inscriptionId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">VIEW ON</p>
                    <a 
                      href={ordiscanUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      <span>Ordiscan</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Iframe */}
            <motion.div 
              variants={contentVariants}
              className="flex-grow bg-slate-900"
            >
              <iframe
                src={ordiscanIframeUrl}
                title={`${title} on Ordiscan`}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div 
            variants={contentVariants}
            className="p-4 bg-slate-900/50 border-t border-slate-700/50 flex justify-between items-center"
          >
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs text-slate-400">Live on Bitcoin</span>
            </div>
            <a 
              href={ordiscanUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <span>View Full Details</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChidoModal;
