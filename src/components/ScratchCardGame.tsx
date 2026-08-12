import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { SECRET_LETTER_TEXT, TARGET_NAME, SENDER_NAME } from '../data/banglaCaptions';
import { Sparkles, Heart, RefreshCw, CheckCircle2 } from 'lucide-react';
import { playCheerSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const ScratchCardGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);

  useEffect(() => {
    initCanvas();
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset state
    setIsRevealed(false);
    setScratchedPercent(0);

    // Set high resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw metallic pink/indigo scratch cover
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#ec4899');
    grad.addColorStop(0.3, '#d946ef');
    grad.addColorStop(0.6, '#8b5cf6');
    grad.addColorStop(1, '#6366f1');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern text on metallic cover
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ এখানে ঘষে সিক্রেট চিঠিটি খোলো ✨', canvas.width / 2, canvas.height / 2);
    ctx.fillText(`(Gift for ${TARGET_NAME})`, canvas.width / 2, canvas.height / 2 + 30);
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Check scratched percentage approximately
    checkPercentage();
  };

  const checkPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / 16;
    const pct = Math.floor((transparentCount / totalSampled) * 100);
    setScratchedPercent(pct);

    if (pct > 40 && !isRevealed) {
      setIsRevealed(true);
      playCheerSound();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return; // Only if mouse button is held
    const rect = e.currentTarget.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  return (
    <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden my-8">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-pink-400 uppercase tracking-[0.3em] text-xs font-bold mb-2 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <span>Task 04 • Secret Scratch Letter ✉️</span>
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-300">
          {SENDER_NAME} এর সিক্রেট চিঠি স্ক্র্যাচ করো!
        </h2>
        <p className="text-indigo-200/80 text-xs sm:text-sm mt-2">
          নিচের স্ক্র্যাচ কার্ডটির উপর হাত বা মাউস বুলিয়ে সিক্রেট বার্তাটি উন্মোচন করো।
        </p>
      </div>

      {/* Scratch Stage Container */}
      <div className="relative w-full max-w-2xl mx-auto min-h-[300px] sm:min-h-[360px] bg-indigo-900/30 border border-indigo-400/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-xl">
        {/* Hidden Letter Content beneath canvas */}
        <div className="text-white font-serif text-sm sm:text-base leading-relaxed space-y-3 z-0">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <span className="text-pink-300 font-bold text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              জন্মদিনের বিশেষ চিঠি
            </span>
            <span className="text-xs text-indigo-200/60 font-mono">From: {SENDER_NAME}</span>
          </div>

          <p className="whitespace-pre-line text-indigo-100 italic font-light">
            {SECRET_LETTER_TEXT}
          </p>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-pink-300 font-semibold font-mono">
            <span>To: {TARGET_NAME}</span>
            <span>Wished by {SENDER_NAME}</span>
          </div>
        </div>

        {/* Golden Scratch Overlay Canvas */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none rounded-3xl"
          />
        )}
      </div>

      {/* Controls & Progress */}
      <div className="flex items-center justify-between mt-6 max-w-2xl mx-auto">
        <span className="text-xs text-pink-300 font-medium">
          স্ক্র্যাচ সম্পন্ন: {scratchedPercent}%
        </span>

        <button
          onClick={initCanvas}
          id="reload-scratch-card-btn"
          className="flex items-center gap-1.5 text-xs text-indigo-200 hover:text-white transition-colors cursor-pointer bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>পুনরায় ঘষো</span>
        </button>
      </div>
    </div>
  );
};
