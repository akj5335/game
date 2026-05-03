import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Gamepad2, User as UserIcon, Wallet, LogOut, Zap, Ghost } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-neon-teal)] rounded-xl p-0.5 shadow-[0_0_20px_rgba(102,252,241,0.2)] group-hover:scale-110 transition-transform">
              <div className="w-full h-full bg-[var(--color-dark-bg)] rounded-[inherit] flex items-center justify-center">
                <Zap className="text-[var(--color-neon-blue)]" size={20} fill="currentColor" />
              </div>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic">Neon<span className="text-gradient">Play</span></span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {!user.isGuest && (
                  <Link to="/wallet" className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:border-[var(--color-neon-teal)]/50 transition-all">
                    <Wallet className="text-[var(--color-neon-teal)]" size={18} />
                    <span className="font-black text-white text-sm">${user.wallet_balance || 0}</span>
                  </Link>
                )}
                
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">
                        {user.isGuest ? 'Temporary' : (user.role || 'Player')}
                      </p>
                      <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[var(--color-neon-blue)] transition-colors">
                        {user.user_metadata?.name || user.name || 'Anonymous'}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden bg-white/5 flex items-center justify-center group-hover:border-[var(--color-neon-blue)] transition-all">
                      {user.isGuest ? (
                        <Ghost className="text-gray-500" size={20} />
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
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Terminate Session"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-xs tracking-widest hover:bg-[var(--color-neon-blue)] transition-all shadow-[0_10px_20px_rgba(0,0,0,0.2)] uppercase"
              >
                Access Grid
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
