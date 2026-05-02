import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldCheck, Wallet, Gamepad2, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="text-center mt-20 text-white">Please log in.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-80">
          <div className="glass p-6 rounded-2xl border border-[var(--color-neon-teal)]/30 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-teal)]/10 rounded-full blur-3xl"></div>
            
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-neon-teal)] p-[2px] mx-auto mb-4">
              <div className="w-full h-full bg-[var(--color-dark-bg)] rounded-full flex items-center justify-center text-3xl font-bold text-white uppercase">
                {user.name.substring(0, 2)}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-[var(--color-light-gray)] text-sm mb-6">{user.email}</p>
            
            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 font-semibold py-2 rounded-lg border border-red-500/30 hover:bg-red-500/20 transition-colors mb-4">
                <ShieldCheck className="w-5 h-5" /> Admin Panel
              </Link>
            )}

            <div className="text-left space-y-3 mt-6">
              <Link to="/wallet" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 text-white"><Wallet className="text-[var(--color-neon-blue)]" /> Wallet</div>
                <span className="font-bold text-[var(--color-neon-teal)]">${user.walletBalance.toFixed(2)}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="glass p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Gamepad2 className="text-[var(--color-neon-blue)]" /> Recently Played
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Dummy Recently Played - In a real app this would come from a backend User Activity service */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-500 text-sm">
                  Placeholder
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
