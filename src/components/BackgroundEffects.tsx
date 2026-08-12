import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
}

export const BackgroundEffects: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    // Generate twinkling stars
    const newStars: Star[] = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
    setStars(newStars);

    // Floating heart emojis
    const heartEmojis = ['💖', '✨', '🌸', '🎈', '⭐', '🌺', '💕'];
    const newHearts: FloatingHeart[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 16 + 14,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 8,
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Immersive UI Deep Glow Spheres */}
      <div className="absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-pink-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-amber-200 rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: '0 0 6px rgba(251, 191, 36, 0.8)',
          }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Gentle Floating Emojis */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-opacity-70 select-none"
          style={{
            left: `${heart.x}%`,
            bottom: '-10%',
            fontSize: `${heart.size}px`,
          }}
          animate={{
            y: ['0vh', '-115vh'],
            x: [0, Math.sin(heart.id) * 30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: 'linear',
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  );
};
