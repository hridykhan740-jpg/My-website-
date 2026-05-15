import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle, isUserAdmin } from './firebase';
import { db } from './firebase';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Track visitor
        try {
          const visitorRef = doc(db, 'visitors', user.uid);
          const visitorDoc = await getDoc(visitorRef);
          
          if (!visitorDoc.exists()) {
            await setDoc(visitorRef, {
              email: user.email,
              name: user.displayName,
              photo: user.photoURL,
              firstVisit: serverTimestamp(),
              lastVisit: serverTimestamp(),
              visitCount: 1,
              device: navigator.userAgent
            });
            // Increment total visitor count
            await setDoc(doc(db, 'stats', 'totals'), {
              visitorCount: increment(1)
            }, { merge: true });
          } else {
            await setDoc(visitorRef, {
              lastVisit: serverTimestamp(),
              visitCount: increment(1),
              device: navigator.userAgent
            }, { merge: true });
          }
        } catch (error) {
          console.error("Error tracking visitor:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin: isUserAdmin(user?.email), 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
