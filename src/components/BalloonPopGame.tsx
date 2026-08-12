import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BALLOON_MESSAGES, TARGET_NAME, SENDER_NAME } from '../data/banglaCaptions';
import { playPopSound, playCheerSound } from '../utils/soundEffects';
import { Award, Trophy, RefreshCw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BalloonItem {
  id: number;
  color: string;
  x: number; // percentage
  speed: number;
  message: string;
  isPopped: boolean;
}

const BALLOON_COLORS = [
  'from-pink-500 to-rose-600',
  'from-purple-500 to-indigo-600',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-emerald-600',
  'from-sky-400 to-blue-600',
  'from-fuchsia-500 to-pink-600',
];

export const BalloonPopGame: React.FC = () => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const initBalloons = () => {
    const list: BalloonItem[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      x: 10 + Math.random() * 80,
      speed: 6 + Math.random() * 4,
      message: BALLOON_MESSAGES[i % BALLOON_MESSAGES.length],
      isPopped: false,
    }));
    setBalloons(list);
    setScore(0);
    setLastMessage(null);
  };

  useEffect(() => {
    initBalloons();
  }, []);

  const handlePopBalloon = (id: number, message: string) => {
    playPopSound();
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPopped: true } : b))
    );
    setLastMessage(message);
    setScore((prev) => {
      const newScore = prev + 1;
      if (newScore === 5) {
        playCheerSound();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      return newScore;
    });
  };

  return (
    <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden my-8">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-pink-400 uppercase tracking-[0.3em] text-xs font-bold mb-2 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <span>Task 03 • Balloon Pop Challenge 🎈</span>
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-300">
          বেলুন ফোটাও এবং সারপ্রাইজ বার্তা পাও!
        </h2>
        <p className="text-indigo-200/80 text-xs sm:text-sm mt-2">
          উপরে ভেসে থাকা রঙিন বেলুনগুলোতে ক্লিক করে ফোটাও। প্রতিটি বেলুনের ভেতরে লুকিয়ে আছে মিষ্টি কমপ্লিমেন্ট!
        </p>
      </div>

      {/* Score Tracker */}
      <div className="flex items-center justify-between bg-indigo-900/30 border border-indigo-400/20 rounded-2xl px-5 py-3 mb-6">
        <div className="flex items-center gap-2 text-sm font-bold text-pink-300">
          <Trophy className="w-5 h-5 text-pink-400" />
          <span>ফোড়ানো বেলুন: {score} / 8</span>
        </div>

        <button
          onClick={initBalloons}
          id="reset-balloons-btn"
          className="flex items-center gap-1.5 text-xs text-indigo-200 hover:text-white transition-colors cursor-pointer bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>নতুন বেলুন আনো</span>
        </button>
      </div>

      {/* Interactive Balloon Canvas Area */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-indigo-950/40 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center">
        {balloons.map((b) => (
          <AnimatePresence key={b.id}>
            {!b.isPopped && (
              <motion.div
                initial={{ y: '120%' }}
                animate={{ y: '-130%' }}
                transition={{
                  duration: b.speed,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                onClick={() => handlePopBalloon(b.id, b.message)}
                style={{ left: `${b.x}%` }}
                className="absolute cursor-pointer select-none group"
              >
                {/* Balloon Body */}
                <div
                  className={`w-14 h-18 sm:w-16 sm:h-20 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-b ${b.color} shadow-lg group-hover:scale-110 transition-transform relative flex items-center justify-center`}
                >
                  <div className="absolute top-2 left-3 w-3 h-5 bg-white/40 rounded-full rotate-45" />
                  <span className="text-white text-[10px] font-bold opacity-80 group-hover:opacity-100">
                    POP!
                  </span>
                </div>
                {/* Balloon String */}
                <div className="w-0.5 h-10 bg-white/30 mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {/* Popped Message Pop-up overlay inside box */}
        {lastMessage && (
          <motion.div
            key={lastMessage}
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="absolute bottom-4 inset-x-4 bg-indigo-900/90 border border-pink-500/40 rounded-2xl p-4 text-center shadow-2xl z-20 backdrop-blur-xl"
          >
            <span className="text-pink-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              {lastMessage}
            </span>
          </motion.div>
        )}
      </div>

      {/* Achievement Reward Banner */}
      {score >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-between text-pink-200 text-xs sm:text-sm font-semibold backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-pink-400 shrink-0" />
            <span>অভিনন্দন! তুমি "Birthday Queen Kusum" ব্যাজ অর্জন করেছো! 👑</span>
          </div>
          <span className="text-xs text-pink-300 font-mono">Wished by {SENDER_NAME}</span>
        </motion.div>
      )}
    </div>
  );
};
