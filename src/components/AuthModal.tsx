import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Smartphone, 
  Mail, 
  Lock, 
  User, 
  Key, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  X,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    loginWithOtp, 
    verifyOtp,
    resetPassword
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'google'>('phone');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'Customer' | 'Owner' | 'Admin'>('Customer');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // 1. Phone OTP Handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number with country code (e.g. +91 9876543210).');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await loginWithOtp(phone);
      setOtpSent(true);
      setSuccessMessage(`OTP Code sent to ${phone}. Enter code 123456 to complete verification.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await verifyOtp(otpCode);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid OTP code entered.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Email Auth Handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      if (isSignUp) {
        await registerWithEmail(email, password, fullName);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Forgot Password Handler
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await resetPassword(email);
      setSuccessMessage(`Password reset link sent to ${email}. Check your inbox.`);
      setShowForgotPassword(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Google Auth Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 font-sans">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 glass-panel p-6 space-y-5 shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Header */}
        <div>
          <h3 className="text-lg font-bold text-gray-100 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" /> Firebase Security & Authentication
          </h3>
          <p className="text-xs text-gray-400 mt-1">Select your preferred login method to sync your Life OS profile across devices.</p>
        </div>

        {/* Auth Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-[#060813] p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => { setAuthMethod('phone'); setOtpSent(false); setErrorMessage(''); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'phone' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Phone OTP
          </button>

          <button
            onClick={() => { setAuthMethod('google'); setErrorMessage(''); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'google' ? 'bg-purple-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Google Login
          </button>

          <button
            onClick={() => { setAuthMethod('email'); setErrorMessage(''); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'email' ? 'bg-emerald-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Email Pass
          </button>
        </div>

        {/* Notifications Banners */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* --- METHOD 1: PHONE OTP SCREEN --- */}
        {authMethod === 'phone' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Phone Number (+ Country Code)</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-[#060813] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500/50 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Sending SMS OTP...' : 'Send Verification OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Enter 6-Digit OTP Code</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-[#060813] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500/50 font-mono tracking-widest text-center font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Login'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- METHOD 2: GOOGLE SIGN-IN SCREEN --- */}
        {authMethod === 'google' && (
          <div className="space-y-4 text-center py-4">
            <p className="text-xs text-gray-300">Sign in with your Google account to automatically sync Firestore user profiles across devices.</p>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-3"
            >
              <Globe className="w-5 h-5 text-white" />
              <span>{loading ? 'Connecting Google Account...' : 'Continue with Google Account'}</span>
            </button>
          </div>
        )}

        {/* --- METHOD 3: EMAIL & PASSWORD LOGIN / SIGNUP --- */}
        {authMethod === 'email' && !showForgotPassword && (
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required={isSignUp}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#060813] border border-white/10 rounded-xl pl-10 pr-3.5 py-2 text-xs text-gray-200 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl pl-10 pr-3.5 py-2 text-xs text-gray-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl pl-10 pr-3.5 py-2 text-xs text-gray-200 focus:outline-none"
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[10px] text-emerald-400 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow"
            >
              {loading ? 'Authenticating...' : isSignUp ? 'Create Firestore Account' : 'Sign In with Email'}
            </button>

            <div className="text-center pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-gray-400 hover:text-white font-semibold"
              >
                {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        )}

        {/* --- FORGOT PASSWORD SUB-FORM --- */}
        {authMethod === 'email' && showForgotPassword && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Reset Account Password</h4>
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Registered Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full bg-[#060813] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 py-2.5 text-xs font-bold text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-glow"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
