import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  doc,
  setDoc,
  getDoc
} from '../firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isGuest: boolean;
  phoneNumber?: string;
  userType?: string;
  accountStatus?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronize Auth state with Firebase and restore session immediately
  useEffect(() => {
    // 1. Instant local session restore
    const savedUser = localStorage.getItem('zenith_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // 2. Safety timeout: never stay stuck on loading screen longer than 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // 3. Listen to Firebase auth changes
    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      clearTimeout(timer);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'Users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          let profile: UserProfile;
          if (docSnap.exists()) {
            const data = docSnap.data();
            profile = {
              uid: fbUser.uid,
              email: fbUser.email || data.email || '',
              displayName: fbUser.displayName || data.fullName || 'Authorized User',
              photoURL: fbUser.photoURL || data.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
              isGuest: false,
              phoneNumber: fbUser.phoneNumber || data.phoneNumber || '',
              userType: data.userType || 'Customer',
              accountStatus: data.accountStatus || 'active'
            };
          } else {
            profile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Authorized User',
              photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
              isGuest: false,
              phoneNumber: fbUser.phoneNumber || '',
            };
            await setDoc(userDocRef, {
              uid: fbUser.uid,
              fullName: profile.displayName,
              email: profile.email,
              phoneNumber: profile.phoneNumber,
              profilePhoto: profile.photoURL,
              userType: 'Customer',
              isVerified: true,
              accountStatus: 'active',
              createdAt: Date.now(),
              lastLogin: Date.now()
            }, { merge: true });
          }
          
          setUser(profile);
          localStorage.setItem('zenith_user', JSON.stringify(profile));
        } catch (e) {
          console.error('Firestore document fetch error', e);
        }
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // 1. Strict Real Email & Password Login via Firebase Auth
  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error('Firebase Email Login Error:', err);
      throw new Error(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Strict Real Email & Password Registration via Firebase Auth
  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = res.user.uid;
      await setDoc(doc(db, 'Users', uid), {
        uid,
        fullName: name,
        email,
        phoneNumber: '',
        profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
        userType: 'Customer',
        isVerified: true,
        accountStatus: 'active',
        createdAt: Date.now(),
        lastLogin: Date.now()
      });
    } catch (err: any) {
      console.error('Firebase Registration Error:', err);
      throw new Error(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Strict Real Google OAuth Sign-In via Firebase Auth
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Firebase Google Sign-In Error:', err);
      throw new Error(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Strict Real Phone SMS OTP Dispatch via Firebase Auth & reCAPTCHA
  const loginWithOtp = async (phone: string) => {
    setLoading(true);
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {}
        });
      }
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      localStorage.setItem('zenith_temp_phone', phone);
    } catch (err: any) {
      console.error('Firebase Phone OTP Error:', err);
      throw new Error(err.message || 'Failed to send SMS OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Strict Real SMS OTP Verification
  const verifyOtp = async (code: string) => {
    setLoading(true);
    try {
      if (window.confirmationResult) {
        await window.confirmationResult.confirm(code);
      } else {
        throw new Error('Verification session expired. Please request a new OTP.');
      }
    } catch (err: any) {
      console.error('Firebase OTP Verification Error:', err);
      throw new Error(err.message || 'Invalid SMS OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Reset Password Link Email
  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Firebase Password Reset Error:', err);
      throw new Error(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  // 7. Secure Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('zenith_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060813] text-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow mb-4 border border-white/10 animate-pulse">
          <img src="./logo.png" alt="Life OS" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-xl font-extrabold text-white tracking-wider">Life OS</h1>
        <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest mt-1">Plan • Track • Achieve</p>
        <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 font-mono">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
          <span>Loading Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithOtp,
        verifyOtp,
        resetPassword,
        logout,
      }}
    >
      {children}
      <div id="recaptcha-container"></div>
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
