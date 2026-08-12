import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, RefreshCw, Scissors, Heart, Award } from 'lucide-react';
import { CANDLE_CAPTIONS, TARGET_NAME, SENDER_NAME } from '../data/banglaCaptions';
import { BirthdayCaption } from '../types';
import { playBlowSound, playCheerSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const CandleBlowGame: React.FC = () => {
  const [candles, setCandles] = useState(
    CANDLE_CAPTIONS.map((cap, idx) => ({
      id: idx,
      isLit: true,
      caption: cap,
    }))
  );

  const [activeCaption, setActiveCaption] = useState<BirthdayCaption | null>(null);
  const [isCakeCut, setIsCakeCut] = useState(false);

  const handleCandleClick = (index: number) => {
    if (!candles[index].isLit) return;

    // Play blow sound
    playBlowSound();

    // Toggle candle state
    setCandles((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, isLit: false } : item))
    );

    // Set active caption popup
    setActiveCaption(candles[index].caption);

    // Mini confetti sparkle
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6'],
    });
  };

  const handleRelightAll = () => {
    setCandles((prev) => prev.map((item) => ({ ...item, isLit: true })));
    setActiveCaption(null);
    setIsCakeCut(false);
  };

  const handleCutCake = () => {
    setIsCakeCut(true);
    playCheerSound();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
    });
  };

  const allBlownOut = candles.every((c) => !c.isLit);

  return (
    <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden my-8">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-pink-400 uppercase tracking-[0.3em] text-xs font-bold mb-2 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <span>Task 01 • Candle Ceremony 🕯️</span>
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-300">
          মোমবাতি নেভাও চমক পাও!
        </h2>
        <p className="text-indigo-200/80 text-xs sm:text-sm mt-2">
          একটি একটি করে মোমবাতিতে ক্লিক করে নেভাও। প্রতিটি নেভালে পাবে সুন্দর বাংলা বার্থডে ক্যাপশন ও সাউন্ড এফেক্ট!
        </p>
      </div>

      {/* Main Interactive Cake Stage */}
      <div className="flex flex-col items-center justify-center my-6 relative min-h-[300px]">
        {/* Candles Group */}
        <div className="flex items-end justify-center gap-4 sm:gap-8 z-20 mb-[-12px]">
          {candles.map((candle, idx) => (
            <div
              key={candle.id}
              onClick={() => handleCandleClick(idx)}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Flame Effect */}
              <div className="h-10 flex items-center justify-center">
                {candle.isLit ? (
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.9, 1, 0.9],
                      rotate: [-3, 3, -3],
                    }}
                    transition={{
                      duration: 0.6 + idx * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative flex items-center justify-center"
                  >
                    <div className="absolute w-6 h-6 bg-amber-400/40 rounded-full blur-md" />
                    <Flame className="w-7 h-7 text-amber-400 fill-amber-300 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className="text-xs text-slate-400 font-bold"
                  >
                    💨 ধূম্র...
                  </motion.div>
                )}
              </div>

              {/* Candle Body */}
              <div
                className={`w-3 sm:w-4 h-16 sm:h-20 rounded-t-md shadow-md transition-all ${
                  candle.isLit
                    ? 'bg-gradient-to-b from-pink-400 via-purple-400 to-indigo-500 group-hover:brightness-125'
                    : 'bg-slate-700 opacity-60'
                }`}
              >
                {/* Stripe Details */}
                <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.3)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0.3)_75%,transparent_75%)] bg-[length:12px_12px]" />
              </div>

              <span className="text-[10px] text-slate-400 mt-1 font-mono">
                {candle.isLit ? 'ট্যাপ করুন' : 'নেভানো'}
              </span>
            </div>
          ))}
        </div>

        {/* Multi-tier Birthday Cake Illustration */}
        <div className="relative w-64 sm:w-80 flex flex-col items-center">
          {/* Top Tier */}
          <div className="w-48 sm:w-60 h-16 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 rounded-t-3xl border-t-4 border-amber-200/50 shadow-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-4 bg-white/40 rounded-b-full" />
            <span className="text-white/90 text-xs font-black tracking-widest font-serif uppercase">
              Happy Birthday Kusum
            </span>
          </div>

          {/* Middle Tier */}
          <div className="w-56 sm:w-72 h-16 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 border-t-2 border-pink-300/40 flex items-center justify-around relative overflow-hidden shadow-xl">
            <span className="text-amber-300 text-lg">🍓</span>
            <span className="text-amber-300 text-lg">🌸</span>
            <span className="text-amber-300 text-lg">🎂</span>
            <span className="text-amber-300 text-lg">🌸</span>
            <span className="text-amber-300 text-lg">🍓</span>
          </div>

          {/* Cake Base Tray */}
          <div className="w-64 sm:w-80 h-5 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 rounded-full shadow-2xl border border-amber-400/50 flex items-center justify-center">
            <span className="text-[10px] text-slate-900 font-bold tracking-widest">
              13 AUGUST 2007 • MST. KUSUM KHATUN
            </span>
          </div>

          {/* Cake Cut Cutline effect */}
          {isCakeCut && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center rounded-2xl"
            >
              <div className="bg-amber-400 text-slate-950 font-black text-sm px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
                <Scissors className="w-5 h-5" />
                <span>কেক কাটা সম্পন্ন হয়েছে! 🍰</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        <button
          onClick={handleRelightAll}
          id="relight-candles-btn"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-pink-200 text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-pink-400" />
          <span>মোমবাতিগুলো আবার জ্বালাও</span>
        </button>

        <button
          onClick={handleCutCake}
          id="cut-cake-btn"
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 border border-white/20 text-white text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 transition-all cursor-pointer"
        >
          <Scissors className="w-4 h-4" />
          <span>কেক কাটো 🍰</span>
        </button>
      </div>

      {/* Unlocked Animated Caption Display Modal/Card */}
      <AnimatePresence>
        {activeCaption && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="mt-8 bg-indigo-900/30 border border-pink-500/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2 text-pink-300 font-bold text-sm sm:text-base">
                <span>{activeCaption.emoji}</span>
                <span>{activeCaption.title}</span>
              </div>
              <span className="text-xs text-pink-300 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 font-medium">
                Unwrapped!
              </span>
            </div>

            <p className="text-white text-base sm:text-xl font-serif italic leading-relaxed text-center py-2 font-medium">
              "{activeCaption.text}"
            </p>

            {activeCaption.englishTranslation && (
              <p className="text-indigo-200/60 text-xs italic text-center mt-1">
                {activeCaption.englishTranslation}
              </p>
            )}

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200/80 font-mono">
              <span className="flex items-center gap-1 text-pink-300">
                <Sparkles className="w-3.5 h-3.5" />
                Special Wish for Kusum
              </span>
              <span className="text-pink-300 font-semibold">{activeCaption.authorTag}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All candles blown milestone alert */}
      {allBlownOut && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-center text-pink-200 text-sm font-medium backdrop-blur-md"
        >
          🏆 সবকটি মোমবাতি নেভানো সম্পন্ন! এবার নিচের গেমগুলো খেলে আরও নতুন সব সারপ্রাইজ ও লাইফলাইন ক্যাপশন আনলক করো!
        </motion.div>
      )}
    </div>
  );
};
