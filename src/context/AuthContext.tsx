import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isGuest: boolean;
  phoneNumber?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  loginAsGuest: () => void;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for session
    const savedUser = localStorage.getItem('zenith_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing session user', e);
      }
    }
    setLoading(false);
  }, []);

  const loginWithEmail = async (email: string, _: string) => {
    setLoading(true);
    try {
      // Mock logic - can connect to firebase auth when configured
      const mockUser: UserProfile = {
        uid: 'user_' + Date.now(),
        email: email,
        displayName: email.split('@')[0].toUpperCase(),
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
        isGuest: false,
      };
      setUser(mockUser);
      localStorage.setItem('zenith_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, _: string, name: string) => {
    setLoading(true);
    try {
      const mockUser: UserProfile = {
        uid: 'user_' + Date.now(),
        email: email,
        displayName: name || email.split('@')[0],
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
        isGuest: false,
      };
      setUser(mockUser);
      localStorage.setItem('zenith_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const mockUser: UserProfile = {
        uid: 'google_' + Date.now(),
        email: 'developer.google@gmail.com',
        displayName: 'Google Dev User',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
        isGuest: false,
      };
      setUser(mockUser);
      localStorage.setItem('zenith_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const loginWithOtp = async (phone: string) => {
    setLoading(true);
    try {
      // Simulate sending OTP SMS code
      setVerificationId('mock_ver_id_123456');
      localStorage.setItem('zenith_temp_phone', phone);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);
    try {
      if (code === '123456' || verificationId) {
        const phone = localStorage.getItem('zenith_temp_phone') || '+1234567890';
        const mockUser: UserProfile = {
          uid: 'otp_' + Date.now(),
          email: `${phone.replace('+', '')}@zenithlife.com`,
          displayName: `Phone User (${phone.slice(-4)})`,
          photoURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120',
          isGuest: false,
          phoneNumber: phone,
        };
        setUser(mockUser);
        localStorage.setItem('zenith_user', JSON.stringify(mockUser));
        localStorage.removeItem('zenith_temp_phone');
      } else {
        throw new Error('Invalid OTP Code');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      uid: 'guest_user',
      email: 'guest@zenithlife.local',
      displayName: 'Guest User',
      photoURL: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120',
      isGuest: true,
    };
    setUser(guestUser);
    localStorage.setItem('zenith_user', JSON.stringify(guestUser));
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      console.log(`Password reset link sent to ${email}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zenith_user');
  };

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
        loginAsGuest,
        resetPassword,
        logout,
      }}
    >
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
