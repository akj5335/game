import React, { useState, useContext } from 'react';
import { ShieldCheck, Zap, Rocket, Mail, Lock, User, Ghost, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, register, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ email, password, name });
        alert('Verification email sent! Please check your inbox.');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
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
    // Guest login sets a temporary user state
    const guestUser = {
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      name: 'Guest Player',
      isGuest: true,
      role: 'user',
      wallet_balance: 0
    };
    setUser(guestUser);
    localStorage.setItem('neonplay_guest', JSON.stringify(guestUser));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-dark-bg)] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-neon-blue)]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-neon-teal)]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-md w-full glass rounded-[3rem] p-10 border border-white/5 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-neon-teal)] rounded-2xl p-0.5 mx-auto mb-6 shadow-[0_0_30px_rgba(102,252,241,0.2)]">
            <div className="w-full h-full bg-[var(--color-dark-bg)] rounded-[inherit] flex items-center justify-center">
              <Zap className="text-[var(--color-neon-blue)]" size={32} fill="currentColor" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2 italic uppercase">NEONPLAY <span className="text-gradient">{isLogin ? 'AUTH' : 'JOIN'}</span></h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">{isLogin ? 'Enter the grid' : 'Create your digital identity'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-neon-blue)] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="DISPLAY NAME" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:border-[var(--color-neon-blue)] transition-all placeholder:text-gray-600"
                required
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-neon-blue)] transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:border-[var(--color-neon-blue)] transition-all placeholder:text-gray-600"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-neon-blue)] transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="PASSWORD" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:border-[var(--color-neon-blue)] transition-all placeholder:text-gray-600"
              required
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <Link to="/forgot-password" title="Recover Account" className="text-[10px] font-black text-gray-500 hover:text-[var(--color-neon-blue)] uppercase tracking-widest transition-colors">Forgot Access Code?</Link>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-[var(--color-neon-blue)] transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : (isLogin ? 'INITIATE LOGIN' : 'CREATE ACCOUNT')}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">OR CONNECT VIA</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">GMAIL</span>
          </button>

          <button 
            onClick={handleGuestLogin}
            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <Ghost className="text-gray-400 group-hover:text-white transition-colors" size={18} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">GUEST</span>
          </button>
        </div>

        <p className="mt-10 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
          {isLogin ? "New to the grid?" : "Already initialized?"} 
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-[var(--color-neon-blue)] hover:underline"
          >
            {isLogin ? 'CREATE IDENTITY' : 'EXECUTE LOGIN'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
