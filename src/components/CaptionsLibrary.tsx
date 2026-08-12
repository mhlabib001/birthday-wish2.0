import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_BANGLA_CAPTIONS, TARGET_NAME, SENDER_NAME } from '../data/banglaCaptions';
import { BirthdayCaption } from '../types';
import { Copy, Check, Sparkles, Heart, Filter } from 'lucide-react';

export const CaptionsLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'সবকটি ক্যাপশন' },
    { id: 'emotional', label: 'আবেগময় 💖' },
    { id: 'sweet', label: 'মিষ্টি ও কিউট 🧁' },
    { id: 'poetic', label: 'কাব্যিক 🌺' },
    { id: 'lifeline', label: 'লাইফলাইন 💫' },
  ];

  const filteredCaptions =
    selectedCategory === 'all'
      ? ALL_BANGLA_CAPTIONS
      : ALL_BANGLA_CAPTIONS.filter((cap) => cap.category === selectedCategory);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(`${text}\n\n— Wished by ${SENDER_NAME} for ${TARGET_NAME}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden my-8">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-pink-400 uppercase tracking-[0.3em] text-xs font-bold mb-2 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <span>Gallery • Premium Bangla Birthday Captions 📜</span>
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-300">
          {TARGET_NAME} এর জন্য সেরা বার্থডে ক্যাপশন
        </h2>
        <p className="text-indigo-200/80 text-xs sm:text-sm mt-2">
          তোমার পছন্দের ক্যাপশনটি সিলেক্ট করো এবং এক ক্লিকে কপি করো!
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            id={`filter-cat-${cat.id}`}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 border border-white/20 text-white font-bold shadow-lg'
                : 'bg-white/10 border border-white/10 text-indigo-200 hover:bg-white/15'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Caption Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCaptions.map((cap) => (
          <motion.div
            key={cap.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-indigo-900/30 border border-white/10 rounded-3xl p-5 hover:border-pink-500/40 transition-all flex flex-col justify-between group shadow-lg backdrop-blur-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                  <span>{cap.emoji}</span>
                  <span>{cap.title}</span>
                </span>

                <button
                  onClick={() => handleCopy(cap.id, cap.text)}
                  id={`copy-btn-${cap.id}`}
                  className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-pink-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  {copiedId === cap.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-indigo-100 text-sm sm:text-base leading-relaxed font-serif py-1 italic">
                "{cap.text}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200/70 font-mono">
              <span className="flex items-center gap-1 text-pink-400">
                <Heart className="w-3 h-3 fill-pink-400" />
                For {TARGET_NAME}
              </span>
              <span className="text-pink-300 font-semibold">{SENDER_NAME}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
