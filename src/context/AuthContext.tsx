import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, syncUserWithFirestore } from '../services/FirebaseService';

interface AuthContextType {
  user: FirebaseUser | null;
  tier: 'free' | 'premium';
  isPremium: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tier: 'free',
  isPremium: false,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [tier, setTier] = useState<'free' | 'premium'>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userTier = await syncUserWithFirestore(currentUser);
        setTier(userTier as 'free' | 'premium');
      } else {
        setTier('free');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, tier, isPremium: tier === 'premium', loading }}>
      {children}
    </AuthContext.Provider>
  );
};
