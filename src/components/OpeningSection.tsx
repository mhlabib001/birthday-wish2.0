import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Volume2, VolumeX, Sparkles, Heart, Calendar, Clock, ChevronDown } from 'lucide-react';
import { TARGET_NAME, BIRTHDAY_DATE, SENDER_NAME } from '../data/banglaCaptions';
import { bgMusic, playCheerSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface OpeningSectionProps {
  onStartExperience: () => void;
}

export const OpeningSection: React.FC<OpeningSectionProps> = ({ onStartExperience }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false });

  // Countdown timer logic to August 13
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let targetYear = now.getFullYear();
      let birthday = new Date(targetYear, 7, 13, 0, 0, 0); // Month 7 is August (0-indexed)
      let endOfBirthday = new Date(targetYear, 7, 13, 23, 59, 59, 999);

      let targetTime: number;

      if (now.getTime() > endOfBirthday.getTime()) {
        // Birthday of this year has passed, target next year
        targetTime = new Date(targetYear + 1, 7, 13, 0, 0, 0).getTime();
      } else if (now.getTime() >= birthday.getTime() && now.getTime() <= endOfBirthday.getTime()) {
        // Today IS August 13! Count down remaining time in today's celebration
        targetTime = endOfBirthday.getTime();
      } else {
        // Before August 13 of this year
        targetTime = birthday.getTime();
      }

      const diff = targetTime - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const isToday = now.getTime() >= birthday.getTime() && now.getTime() <= endOfBirthday.getTime();

      return { days, hours, minutes, seconds, isToday };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMusic = () => {
    const active = bgMusic.toggle();
    setIsMuted(!active);
  };

  const handleOpenGift = () => {
    setIsOpen(true);
    playCheerSound();
    if (isMuted) {
      bgMusic.start();
      setIsMuted(false);
    }
    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center overflow-hidden">
      {/* Top Floating Music Toggle */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={toggleMusic}
          id="music-toggle-btn"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-pink-300 hover:bg-white/20 transition-all shadow-lg backdrop-blur-md cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-white/50" />
              <span className="text-xs font-medium">গান চালু করো</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="text-xs font-medium text-pink-300">মিউজিক চালু 🎵</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10"
      >
        {/* Top Eyebrow Badge */}
        <p className="text-pink-400 uppercase tracking-[0.4em] text-xs font-bold mb-3 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <span>Celebrating 19 Beautiful Years</span>
        </p>

        {/* Wished By Sub-badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-400/30 text-indigo-200 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Wished with Love by {SENDER_NAME}</span>
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
        </div>

        {!isOpen ? (
          /* Sealed Gift View */
          <motion.div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-300 leading-tight">
              {TARGET_NAME}
            </h1>

            <p className="text-indigo-200/90 text-sm sm:text-base max-w-lg leading-relaxed font-light">
              আজ <span className="text-pink-300 font-semibold">{TARGET_NAME}</span> এর শুভ জন্মদিন! {SENDER_NAME} এর তৈরি এই ইমারসিভ ডিজিটাল ভালোবাসার বিশেষ উপহারে তোমাকে স্বাগতম।
            </p>

            {/* Countdown Badge */}
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 my-2">
              <div className="flex items-center justify-center gap-2 text-xs text-pink-300 font-medium mb-3">
                <Calendar className="w-4 h-4 text-pink-400" />
                <span>
                  {timeLeft.isToday
                    ? 'আজই জন্মদিনের বিশেষ মাহেন্দ্রক্ষণ! 🎂'
                    : `জন্মদিন আসতে বাকি: ${BIRTHDAY_DATE}`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-indigo-900/30 border border-indigo-400/20 rounded-xl p-2">
                  <span className="block text-xl font-bold text-pink-300">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-indigo-200/60 uppercase tracking-wider">দিন</span>
                </div>
                <div className="bg-indigo-900/30 border border-indigo-400/20 rounded-xl p-2">
                  <span className="block text-xl font-bold text-pink-300">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-indigo-200/60 uppercase tracking-wider">ঘণ্টা</span>
                </div>
                <div className="bg-indigo-900/30 border border-indigo-400/20 rounded-xl p-2">
                  <span className="block text-xl font-bold text-pink-300">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-indigo-200/60 uppercase tracking-wider">মিনিট</span>
                </div>
                <div className="bg-indigo-900/30 border border-indigo-400/20 rounded-xl p-2">
                  <span className="block text-xl font-bold text-pink-300">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-indigo-200/60 uppercase tracking-wider">সেকেন্ড</span>
                </div>
              </div>
            </div>

            {/* Glowing Interactive Gift Box Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenGift}
              id="open-gift-btn"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-lg shadow-2xl hover:shadow-pink-500/30 transition-all cursor-pointer overflow-hidden mt-2 border border-white/20"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Gift className="w-6 h-6 animate-bounce text-pink-200" />
              <span>উপহারটি খুলতে ট্যাপ করো 🎂</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Unlocked Welcome View */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="text-5xl sm:text-6xl animate-bounce">🎉🎂✨</div>

            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-indigo-200 leading-tight">
              শুভ জন্মদিন! <br />
              <span className="text-pink-300 underline decoration-indigo-400 decoration-wavy underline-offset-8">
                {TARGET_NAME}
              </span>
            </h1>

            <div className="p-6 rounded-3xl bg-indigo-900/30 border border-indigo-400/20 text-indigo-100 text-sm sm:text-base leading-relaxed max-w-lg italic font-serif shadow-inner">
              "আজ তোমার জন্মদিনে হৃদয়ের গভীর থেকে অফুরন্ত শুভকামনা। মোমবাতি নেভাও, দারুণ সব গেম খেলো এবং নতুন সব রঙিন স্যারপ্রাইজ উপহার গ্রহণ করো!"
            </div>

            {/* Action Button to scroll to Middle Section */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartExperience}
              id="start-journey-btn"
              className="mt-4 flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-extrabold text-base shadow-xl border border-white/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <span>উদযাপন শুরু করো</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
