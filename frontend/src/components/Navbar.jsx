import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Gamepad2, User, Wallet, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="NeonPlay Logo" className="w-8 h-8 rounded-md" />
            <span className="text-2xl font-bold text-gradient tracking-tight">NeonPlay</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/wallet" className="flex items-center space-x-1 hover:text-[var(--color-neon-teal)] transition-colors">
                  <Wallet className="w-5 h-5" />
                  <span className="font-semibold text-[var(--color-neon-blue)]">${user.walletBalance}</span>
                </Link>
                <Link to="/dashboard" className="flex items-center space-x-1 hover:text-[var(--color-neon-teal)] transition-colors">
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                </Link>
                <button onClick={logout} className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-[var(--color-neon-blue)] text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-[var(--color-neon-teal)] transition-colors">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
