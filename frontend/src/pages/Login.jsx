import React, { useState, useContext } from 'react';
import { ShieldCheck, Gamepad2, Phone, Lock, User, Ghost, ArrowRight, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login, register, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login(phoneNumber, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await register({ phoneNumber, password, confirmPassword, name, inviteCode: inviteCode.trim() || null });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/login-success',
      },
    });
    if (error) setError(error.message);
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      name: 'Guest Player',
      isGuest: true,
      role: 'user',
      wallet_balance: 0
    };
    setUser(guestUser);
    localStorage.setItem('neonplay_guest', JSON.stringify(guestUser));
    const dest = from === '/dashboard' ? '/' : from;
    navigate(dest, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-dark-bg)] relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--color-accent-primary)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[var(--color-accent-secondary)]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-[var(--color-dark-surface)] rounded-2xl p-8 border border-white/5 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 bg-[var(--color-accent-primary)] rounded-xl mb-4 shadow-lg shadow-[var(--color-accent-primary)]/30 hover:scale-105 transition-transform">
            <Gamepad2 className="text-white" size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{isLogin ? 'Welcome Back' : 'Create an Account'}</h1>
          <p className="text-sm text-gray-400 font-medium">{isLogin ? 'Log in to continue your progress' : 'Join thousands of gamers today'}</p>
        </div>

        {message && !error && (
          <div className="mb-6 p-4 bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20 rounded-xl text-[var(--color-accent-primary)] text-sm font-medium text-center flex items-center justify-center gap-2">
            <ShieldCheck size={18} /> {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Display Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-medium text-sm focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors" size={18} />
              <input 
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-medium text-sm focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-medium text-sm focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors" size={18} />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-medium text-sm focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Invite Code (Optional)</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-medium text-sm focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>
            </>
          )}

          {isLogin && (
            <div className="text-right mt-1">
              <Link to="/forgot-password" title="Recover Account" className="text-sm font-medium text-gray-400 hover:text-[var(--color-accent-primary)] transition-colors">Forgot Password?</Link>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--color-accent-primary)] text-white mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-500 transition-colors disabled:opacity-50 shadow-md shadow-indigo-500/20"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs font-medium text-gray-500 uppercase">Or continue with</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 bg-[var(--color-dark-bg)] border border-white/10 py-2.5 rounded-xl hover:bg-white/5 transition-colors font-medium text-sm text-gray-300"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
            Google
          </button>

          <button 
            onClick={handleGuestLogin}
            className="flex items-center justify-center gap-2 bg-[var(--color-dark-bg)] border border-white/10 py-2.5 rounded-xl hover:bg-white/5 transition-colors font-medium text-sm text-gray-300"
          >
            <Ghost size={16} />
            Guest
          </button>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-[var(--color-accent-primary)] hover:underline font-semibold"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
