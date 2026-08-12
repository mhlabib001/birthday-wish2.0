import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TARGET_NAME, BIRTHDAY_DATE, SENDER_NAME } from '../data/banglaCaptions';
import { Heart, Sparkles, Share2, Copy, Check, Code2, PartyPopper } from 'lucide-react';
import { playCheerSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const EndingSection: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleTriggerFireworks = () => {
    playCheerSound();
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section className="w-full max-w-4xl flex flex-col items-center text-center my-12 px-4">
      {/* Final Celebration Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

        <div className="text-4xl sm:text-5xl mb-4 animate-pulse">
          💖🎂🌟
        </div>

        <p className="text-pink-400 uppercase tracking-[0.4em] text-xs font-bold mb-2">
          Final Wishes • Endless Love
        </p>

        <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-300 leading-tight mb-4">
          শুভ জন্মদিন {TARGET_NAME}!
        </h2>

        <p className="text-indigo-200/90 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed italic font-light mb-8">
          "তোমার জীবনের প্রতিটি মুহূর্ত ভরিয়ে তুলুক অফুরন্ত আনন্দ, সাফল্য ও প্রশান্তিতে। আগামী দিনগুলো যেন আরও সুন্দর আর উজ্জ্বল হয়!"
        </p>

        {/* Immersive UI Credit / Signature Badge */}
        <div className="inline-flex flex-col items-center justify-center bg-gradient-to-br from-pink-600/40 to-indigo-600/40 p-6 rounded-3xl border border-white/10 shadow-2xl mb-8 min-w-[260px]">
          <span className="text-[10px] uppercase tracking-widest text-pink-300 font-bold mb-1">
            WISHED WITH LOVE BY
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            {SENDER_NAME}
          </span>
          <div className="flex items-center gap-1 text-pink-300 text-xs mt-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>Always & Forever</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleTriggerFireworks}
            id="fireworks-btn"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 border border-white/20 text-white font-extrabold text-sm shadow-xl hover:brightness-110 transition-all cursor-pointer"
          >
            <PartyPopper className="w-4 h-4 text-pink-200" />
            <span>ফায়ারওয়ার্কস ফোটাও 🎆</span>
          </button>

          <button
            onClick={handleShareLink}
            id="share-link-btn"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 border border-white/10 text-indigo-100 text-sm font-bold hover:bg-white/15 transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">লিংক কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>ওয়েবসাইট শেয়ার করো 🔗</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Mandatory Required Bottom Footer Credit */}
      <footer className="mt-12 w-full border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-pink-400" />
          <span className="text-indigo-200/80">this web developed by <span className="text-pink-300 font-bold">{SENDER_NAME}</span></span>
        </div>

        <span className="text-[10px] text-indigo-200/50 uppercase tracking-[0.2em]">
          August 13, 2007 • Infinite Wishes
        </span>
      </footer>
    </section>
  );
};
