import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Award, Heart, ShieldCheck, Crown, Gift } from 'lucide-react';
import { LIFELINE_CARDS, TARGET_NAME, SENDER_NAME } from '../data/banglaCaptions';
import { LifelineCard } from '../types';
import { playWheelClickSound, playCheerSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const LifelineWheelGame: React.FC = () => {
  const [selectedLifeline, setSelectedLifeline] = useState<LifelineCard | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedLifeline(null);

    // Play wheel tick audio sequence
    let count = 0;
    const interval = setInterval(() => {
      playWheelClickSound();
      count++;
      if (count > 15) clearInterval(interval);
    }, 120);

    // Calculate rotation
    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const randomIndex = Math.floor(Math.random() * LIFELINE_CARDS.length);
      const won = LIFELINE_CARDS[randomIndex];
      setSelectedLifeline(won);
      playCheerSound();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 2200);
  };

  return (
    <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden my-8">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-pink-400 uppercase tracking-[0.3em] text-xs font-bold mb-2 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <span>Task 02 • Surprise Lifeline Wheel 🎡</span>
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-300">
          স্পিন করো এবং জন্মদিনের লাইফলাইন পাও!
        </h2>
        <p className="text-indigo-200/80 text-xs sm:text-sm mt-2">
          ভাগ্যচাকা ঘুরিয়ে {TARGET_NAME} এর জন্য বিশেষ জন্মদিনের সিক্রেট লাইফলাইন ও কমপ্লিমেন্ট কার্ড জিতো।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-6">
        {/* Interactive Spin Wheel Container */}
        <div className="flex flex-col items-center justify-center relative">
          {/* Wheel Pointer */}
          <div className="absolute top-0 z-20 -mt-3 text-pink-400 font-bold text-2xl filter drop-shadow-md">
            ▼
          </div>

          {/* Glowing Wheel Visual */}
          <motion.div
            style={{ transform: `rotate(${rotation}deg)` }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-pink-400/80 shadow-[0_0_30px_rgba(236,72,153,0.3)] relative overflow-hidden flex items-center justify-center bg-indigo-950/80"
          >
            {/* Wheel Segments */}
            {LIFELINE_CARDS.map((card, idx) => {
              const angle = (360 / LIFELINE_CARDS.length) * idx;
              return (
                <div
                  key={card.id}
                  style={{ transform: `rotate(${angle}deg)` }}
                  className="absolute w-full h-full flex justify-center pt-2 origin-center text-[10px] font-bold text-pink-200"
                >
                  <span className="bg-indigo-900/90 px-2 py-0.5 rounded border border-pink-500/30 shadow">
                    {card.badge}
                  </span>
                </div>
              );
            })}

            {/* Wheel Center Hub */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 border-2 border-white shadow-xl flex items-center justify-center z-10 text-white font-black text-xs text-center p-1">
              LIFELINE
            </div>
          </motion.div>

          {/* Spin Trigger Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSpinning}
            onClick={handleSpinWheel}
            id="spin-wheel-btn"
            className="mt-6 flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 border border-white/20 text-white font-extrabold text-sm sm:text-base shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
          >
            <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'চাকা ঘুরছে...' : 'চাকা ঘোরাও 🎰'}</span>
          </motion.button>
        </div>

        {/* Lifeline Prize / Caption Card Display */}
        <div className="flex flex-col items-center justify-center min-h-[260px]">
          <AnimatePresence mode="wait">
            {selectedLifeline ? (
              <motion.div
                key={selectedLifeline.id}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`w-full bg-gradient-to-br ${selectedLifeline.color} p-1 rounded-3xl shadow-2xl`}
              >
                <div className="bg-indigo-950/90 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-extrabold">
                      {selectedLifeline.badge}
                    </span>
                    <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 font-serif">
                    {selectedLifeline.title}
                  </h3>

                  <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                    "{selectedLifeline.description}"
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200/80 font-mono">
                    <span className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-3.5 h-3.5 fill-pink-400" />
                      Gift for Kusum
                    </span>
                    <span className="text-pink-300 font-semibold">{SENDER_NAME}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center p-8 border border-white/10 rounded-3xl w-full bg-white/5 backdrop-blur-md">
                <Gift className="w-12 h-12 text-pink-400 mx-auto mb-3 animate-pulse" />
                <h4 className="text-base font-bold text-white font-serif">
                  এখনও কোনো লাইফলাইন আনলক হয়নি
                </h4>
                <p className="text-indigo-200/70 text-xs mt-1">
                  বামপাশের চাকা ঘুরিয়ে {TARGET_NAME} এর জন্য বিশেষ জন্মদিনের সারপ্রাইজ উপহার আনলক করো!
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
