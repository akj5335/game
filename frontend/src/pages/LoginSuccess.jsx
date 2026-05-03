import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // We need to sync this with AuthContext
      // Re-fetching the user profile would be best
      window.location.href = '/dashboard';
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[var(--color-dark-bg)]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-black tracking-widest animate-pulse uppercase">Syncing Neural Identity...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;
