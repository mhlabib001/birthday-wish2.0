import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<User | undefined>;
  logout: () => Promise<void>;
  ensureSignedIn: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: async () => undefined,
  logout: async () => {},
  ensureSignedIn: async () => { throw new Error('Auth not initialized'); }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const ensureSignedIn = async (): Promise<User> => {
    if (auth.currentUser) {
      return auth.currentUser;
    }
    try {
      const cred = await signInAnonymously(auth);
      return cred.user;
    } catch (err) {
      console.error('Anonymous Sign-In Error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, ensureSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
