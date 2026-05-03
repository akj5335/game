import React, { useState } from 'react';
import { Lock, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Password updated successfully!');
      setTimeout(() => navigate('/login'), 3000);
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
        <div className="text-center mb-10">
          <Zap className="text-[var(--color-neon-blue)] mx-auto mb-6" size={40} fill="currentColor" />
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2 italic uppercase">NEW <span className="text-gradient">CREDENTIALS</span></h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest leading-relaxed">Secure your identity with a new access code</p>
        </div>

        {message ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <p className="text-white font-bold mb-4">{message}</p>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-neon-blue)] transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="NEW PASSWORD" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:border-[var(--color-neon-blue)] transition-all placeholder:text-gray-600"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-neon-blue)] transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="CONFIRM NEW PASSWORD" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:border-[var(--color-neon-blue)] transition-all placeholder:text-gray-600"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-[var(--color-neon-blue)] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
              <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
