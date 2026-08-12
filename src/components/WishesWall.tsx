import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  db,
  handleFirestoreError,
  OperationType,
  testConnection
} from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { MessageSquareHeart, Send, Sparkles, User as UserIcon, LogIn, Heart, CheckCircle2 } from 'lucide-react';
import { TARGET_NAME } from '../data/banglaCaptions';

export interface WishItem {
  id: string;
  senderName: string;
  message: string;
  emoji?: string;
  userId: string;
  userEmail?: string;
  createdAt: any;
}

const EMOJI_OPTIONS = ['💖', '🎂', '🌟', '🌺', '🎈', '🎉', '🎁', '✨', '🌸', '👑'];

export const WishesWall: React.FC = () => {
  const { user, loginWithGoogle, ensureSignedIn } = useAuth();
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💖');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Validate connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  // Set default sender name if Google signed in
  useEffect(() => {
    if (user?.displayName && !senderName) {
      setSenderName(user.displayName);
    }
  }, [user]);

  // Real-time listener for wishes collection
  useEffect(() => {
    const wishesRef = collection(db, 'wishes');
    const q = query(wishesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const wishList: WishItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as WishItem[];
        setWishes(wishList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'wishes');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      // Ensure user is signed in (Google or anonymous)
      const currentUser = await ensureSignedIn();
      const wishId = `wish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newWish = {
        senderName: senderName.trim().substring(0, 100),
        message: message.trim().substring(0, 1000),
        emoji: selectedEmoji,
        userId: currentUser.uid,
        userEmail: currentUser.email || 'anonymous',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'wishes', wishId), newWish);

      setMessage('');
      setSuccessMessage('তোমার উইশটি ওয়াল-এ পোস্ট করা হয়েছে! 💖');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Failed to submit wish:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden my-12">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-pink-400 uppercase tracking-[0.3em] text-xs font-bold mb-2 flex items-center justify-center gap-2">
          <MessageSquareHeart className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>Real-time Guestbook • Firebase Live Wall</span>
        </p>
        <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-300">
          {TARGET_NAME} এর বার্থডে উইশ ও মেসেজ ওয়াল 💌
        </h2>
        <p className="text-indigo-200/80 text-xs sm:text-sm mt-2">
          কুসুমের জন্মদিনে তোমার সুন্দর বার্তাটি লেখে দাও। এটি লাইভ ফায়ারবেসে সংরক্ষিত থাকবে!
        </p>
      </div>

      {/* Google Login Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-indigo-950/40 border border-white/10 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User Avatar" className="w-9 h-9 rounded-full border border-pink-400" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 font-bold text-sm">
              <UserIcon className="w-5 h-5" />
            </div>
          )}
          <div>
            <p className="text-xs text-indigo-200 font-medium">
              {user?.displayName ? (
                <span className="text-white font-bold flex items-center gap-1.5">
                  {user.displayName} <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
                </span>
              ) : (
                'অতিথি হিসেবে যুক্ত আছেন'
              )}
            </p>
            <p className="text-[10px] text-indigo-200/60">
              {user?.email || 'গুগল দিয়ে লগইন করলে ছবিতে তোমার প্রোফাইল দেখাবে'}
            </p>
          </div>
        </div>

        {!user?.email && (
          <button
            onClick={() => loginWithGoogle()}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>গুগল দিয়ে লগইন করো</span>
          </button>
        )}
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 space-y-4">
        <div>
          <label className="block text-xs font-bold text-indigo-200 mb-1.5">
            তোমার নাম:
          </label>
          <input
            type="text"
            required
            maxLength={100}
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="যেমন: শুভাকাঙ্ক্ষী বা বন্ধুর নাম..."
            className="w-full bg-indigo-950/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-indigo-300/40 focus:outline-none focus:border-pink-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-indigo-200 mb-1.5">
            তোমার বিশেষ উইশ বা বার্তা:
          </label>
          <textarea
            required
            rows={3}
            maxLength={1000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="কুসুমের জন্মদিনে তোমার মনের সুন্দর বার্তাটি লেখে দাও..."
            className="w-full bg-indigo-950/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-indigo-300/40 focus:outline-none focus:border-pink-400 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-indigo-200 mb-1.5">
            ইমোজি সিলেক্ট করো:
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                  selectedEmoji === emoji
                    ? 'bg-pink-500/30 border-2 border-pink-400 scale-110'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-extrabold text-sm shadow-xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'পোস্ট হচ্ছে...' : 'উইশ পাঠাও 💌'}</span>
          </button>

          {successMessage && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold text-emerald-400 flex items-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </motion.p>
          )}
        </div>
      </form>

      {/* Wishes Display Wall */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-pink-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>লাইভ উইশ সমূহ ({wishes.length})</span>
        </h3>

        {wishes.length === 0 ? (
          <div className="text-center py-8 bg-white/5 border border-white/10 rounded-2xl">
            <Heart className="w-8 h-8 text-pink-400/40 mx-auto mb-2 animate-bounce" />
            <p className="text-xs text-indigo-200/70">
              এখনও কোনো উইশ পোস্ট করা হয়নি। প্রথম উইশটি তুমিই পোস্ট করো!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-1">
            <AnimatePresence>
              {wishes.map((w) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-indigo-900/30 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-pink-500/40 transition-all shadow-md backdrop-blur-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-sm text-pink-300 flex items-center gap-1.5">
                        <span>{w.emoji || '💖'}</span>
                        <span>{w.senderName}</span>
                      </span>
                      <span className="text-[10px] text-indigo-200/50 font-mono">
                        {w.createdAt ? new Date(w.createdAt).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'short'
                        }) : 'আজ'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed italic">
                      "{w.message}"
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-indigo-200/60">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                      <span>Birthday Wish</span>
                    </span>
                    <span className="text-pink-300/80 font-mono">For {TARGET_NAME}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
