import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Gamepad2, User as UserIcon, Wallet, LogOut, Search, Ghost, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-[var(--color-dark-bg)]/90 backdrop-blur-lg border-b border-white/5 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button className="lg:hidden text-gray-400 hover:text-white">
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-[var(--color-accent-primary)] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Gamepad2 className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight hidden sm:block">NeonPlay</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl px-8">
            <form onSubmit={handleSearch} className="w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent-primary)] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search for games..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-dark-surface)] border border-white/10 rounded-full py-2 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all placeholder:text-gray-500"
              />
            </form>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {!user.isGuest && (
                  <Link to="/wallet" className="hidden sm:flex items-center gap-2 bg-[var(--color-dark-surface)] px-3 py-1.5 rounded-full border border-white/5 hover:border-white/20 transition-all">
                    <Wallet className="text-[var(--color-accent-secondary)]" size={16} />
                    <span className="font-semibold text-white text-sm">${user.wallet_balance || 0}</span>
                  </Link>
                )}
                
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden bg-[var(--color-dark-surface)] flex items-center justify-center group-hover:border-[var(--color-accent-primary)] transition-all">
                      {user.isGuest ? (
                        <Ghost className="text-gray-400" size={18} />
                      ) : (
                        <img 
                          src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>
                  </Link>
                  <button 
                    onClick={logout} 
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    title="Log Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-[var(--color-accent-primary)] text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-indigo-400 transition-colors shadow-sm"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
