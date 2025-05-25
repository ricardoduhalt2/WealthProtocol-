import { useState } from 'react';
import { motion } from 'framer-motion';

const ParticlesBackground = () => {
  const [particles] = useState(() => {
    // Crear partículas una sola vez al montar
    const colors = [
      '#FF6B6B', // Rojo
      '#4ECDC4', // Turquesa
      '#45B7D1', // Azul claro
      '#96CEB4', // Verde menta
      '#FFEEAD'  // Amarillo claro
    ];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 20 + Math.random() * 20,
      delay: Math.random() * -10
    }));
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: 0.8,
            zIndex: 0,
          }}
          animate={{
            x: [
              0,
              (Math.random() - 0.5) * 100,
              (Math.random() - 0.5) * 100,
              0
            ],
            y: [
              0,
              (Math.random() - 0.5) * 100,
              (Math.random() - 0.5) * 100,
              0
            ],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesBackground;
