'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isDevAuth?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithDevPasskey: (passkey: string) => Promise<{ success: boolean; error?: string }>;
  getIdToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
  signInWithEmail: async () => ({ success: false }),
  signInWithGoogle: async () => ({ success: false }),
  signInWithDevPasskey: async () => ({ success: false }),
  getIdToken: async () => null,
  signOut: async () => {},
});

const DEV_AUTH_STORAGE_KEY = 'sc_cockpit_admin_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fbUserRef = useRef<User | null>(null);
  const cachedTokenRef = useRef<string | null>(null);

  const syncFirebaseTokenCookie = async (fbUser: User): Promise<string | null> => {
    try {
      const token = await fbUser.getIdToken();
      cachedTokenRef.current = token;
      if (typeof document !== 'undefined' && token) {
        document.cookie = `sc_cockpit_auth=${token}; path=/; SameSite=Lax`;
      }
      return token;
    } catch (err) {
      console.warn('Failed to sync Firebase ID token:', err);
      return null;
    }
  };

  useEffect(() => {
    // 1. If Firebase is active and initialized
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser: User | null) => {
        fbUserRef.current = fbUser;
        if (fbUser) {
          await syncFirebaseTokenCookie(fbUser);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
          });
        } else {
          cachedTokenRef.current = null;
          // Check if dev fallback is stored
          checkDevSession();
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // 2. Dev mode session check
      checkDevSession();
      setLoading(false);
    }
  }, []);

  const checkDevSession = () => {
    if (typeof window !== 'undefined') {
      const devAuth = sessionStorage.getItem(DEV_AUTH_STORAGE_KEY);
      if (devAuth === 'true') {
        cachedTokenRef.current = 'dev-passkey-admin2026';
        document.cookie = 'sc_cockpit_auth=dev-passkey-admin2026; path=/; SameSite=Lax';
        setUser({
          uid: 'dev-admin-uid',
          email: 'admin@settlementcheck.co.uk',
          displayName: 'Site Administrator',
          isDevAuth: true,
        });
      } else {
        setUser(null);
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!isFirebaseConfigured || !auth) {
      return { success: false, error: 'Firebase is not yet configured with project API credentials.' };
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      fbUserRef.current = cred.user;
      await syncFirebaseTokenCookie(cred.user);
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to authenticate with Firebase' };
    }
  };

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      return { success: false, error: 'Firebase is not yet configured with project API credentials.' };
    }
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      fbUserRef.current = cred.user;
      await syncFirebaseTokenCookie(cred.user);
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google authentication failed' };
    }
  };

  const signInWithDevPasskey = async (passkey: string) => {
    // Allows administrator access while awaiting Firebase credential deployment
    const clean = passkey.trim();
    if (clean === 'admin2026' || clean === '568912' || clean === 'settlementcheck') {
      cachedTokenRef.current = 'dev-passkey-admin2026';
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(DEV_AUTH_STORAGE_KEY, 'true');
        document.cookie = 'sc_cockpit_auth=dev-passkey-admin2026; path=/; SameSite=Lax';
      }
      setUser({
        uid: 'dev-admin-uid',
        email: 'admin@settlementcheck.co.uk',
        displayName: 'Site Administrator',
        isDevAuth: true,
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid administrator passkey.' };
  };

  const getIdToken = async (): Promise<string | null> => {
    const activeFbUser = auth?.currentUser || fbUserRef.current;
    if (activeFbUser) {
      const token = await syncFirebaseTokenCookie(activeFbUser);
      if (token) return token;
    }
    if (cachedTokenRef.current) {
      return cachedTokenRef.current;
    }
    if (typeof window !== 'undefined') {
      const devAuth = sessionStorage.getItem(DEV_AUTH_STORAGE_KEY);
      if (devAuth === 'true') {
        return 'dev-passkey-admin2026';
      }
    }
    return null;
  };

  const signOut = async () => {
    fbUserRef.current = null;
    cachedTokenRef.current = null;
    if (auth && isFirebaseConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout error', e);
      }
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(DEV_AUTH_STORAGE_KEY);
      document.cookie = 'sc_cockpit_auth=; path=/; max-age=0; SameSite=Lax';
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isFirebaseConfigured,
        signInWithEmail,
        signInWithGoogle,
        signInWithDevPasskey,
        getIdToken,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
