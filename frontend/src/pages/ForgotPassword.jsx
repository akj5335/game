import React, { useState } from 'react';
import { Mail, ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) throw error;
      setMessage('Recovery link sent! Please check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-dark-bg)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-neon-blue)]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-md w-full glass rounded-[3rem] p-10 border border-white/5 shadow-2xl relative z-10">
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        <div className="text-center mb-10">
          <Zap className="text-[var(--color-neon-blue)] mx-auto mb-6" size={40} fill="currentColor" />
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2 italic uppercase">RECOVER <span className="text-gradient">ACCESS</span></h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest leading-relaxed">Enter your email to receive a recovery link</p>
        </div>

        {message ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <p className="text-white font-bold mb-6">{message}</p>
            <Link to="/login" className="block w-full bg-white text-black py-4 rounded-xl font-black text-xs tracking-widest hover:bg-[var(--color-neon-blue)] transition-all">
              RETURN TO GRID
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-[var(--color-neon-blue)] transition-all active:scale-95 disabled:opacity-50 shadow-[0_10px_30px_rgba(102,252,241,0.1)]"
            >
              {loading ? 'SENDING...' : 'SEND RECOVERY LINK'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
