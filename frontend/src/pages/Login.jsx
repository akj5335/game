import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-md w-full glass p-8 rounded-2xl border border-[var(--color-neon-teal)]/30 shadow-[0_0_30px_rgba(69,162,158,0.15)]">
        <div className="text-center mb-8">
          <Gamepad2 className="w-12 h-12 text-[var(--color-neon-blue)] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-[var(--color-light-gray)]">Level up your gaming experience</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-light-gray)] mb-1">Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                placeholder="Gamer Tag"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-light-gray)] mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-light-gray)] mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-teal)] text-gray-900 font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all duration-300"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[var(--color-neon-blue)] hover:text-white transition-colors text-sm font-semibold"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
