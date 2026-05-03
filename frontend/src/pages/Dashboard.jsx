import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldCheck, Wallet, Gamepad2, Gift, PlayCircle, Clock } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [recentGames, setRecentGames] = useState([]);
  const [rewardLoading, setRewardLoading] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');

  useEffect(() => {
    // Load recently played from localStorage
    const saved = localStorage.getItem('neonplay_recent');
    if (saved) {
      setRecentGames(JSON.parse(saved).slice(0, 6));
    }
  }, []);

  const handleClaimDaily = async () => {
    setRewardLoading(true);
    try {
      const res = await axios.post('/api/rewards/daily');
      setUser(prev => ({ ...prev, walletBalance: res.data.data.walletBalance }));
      setRewardMsg(`Success: ${res.data.message}`);
    } catch (err) {
      setRewardMsg(err.response?.data?.message || 'Failed to claim reward');
    } finally {
      setRewardLoading(false);
      setTimeout(() => setRewardMsg(''), 4000);
    }
  };

  const handleWatchAd = async () => {
    setRewardLoading(true);
    // Mocking an ad watch delay
    setTimeout(async () => {
      try {
        const res = await axios.post('/api/rewards/ad-watch');
        setUser(prev => ({ ...prev, walletBalance: res.data.data.walletBalance }));
        setRewardMsg(`Success: ${res.data.message}`);
      } catch (err) {
        setRewardMsg('Failed to claim ad reward');
      } finally {
        setRewardLoading(false);
        setTimeout(() => setRewardMsg(''), 4000);
      }
    }, 2000);
  };

  if (!user) return <div className="text-center mt-20 text-white">Please log in.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="glass p-8 rounded-3xl border border-[var(--color-neon-blue)]/20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-neon-blue)]/10 rounded-full blur-3xl"></div>
            
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--color-neon-blue)] to-[var(--color-neon-teal)] p-1 mx-auto mb-6 shadow-[0_0_30px_rgba(102,252,241,0.2)]">
              <div className="w-full h-full bg-[var(--color-dark-bg)] rounded-full flex items-center justify-center text-4xl font-black text-white uppercase">
                {(user.name || user.user_metadata?.name || '??').substring(0, 2)}
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-white mb-1 tracking-tight">{user.name || user.user_metadata?.name || 'Anonymous'}</h2>
            <p className="text-[var(--color-light-gray)] font-bold text-sm mb-8 opacity-60">{user.phone_number || user.email}</p>
            
            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center justify-center gap-2 w-full bg-purple-500/10 text-purple-400 font-black py-4 rounded-2xl border border-purple-500/20 hover:bg-purple-500/20 transition-all mb-6">
                <ShieldCheck className="w-6 h-6" /> ADMIN CONSOLE
              </Link>
            )}

            <div className="space-y-4">
              <Link to="/wallet" className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[var(--color-neon-blue)]/30 transition-all group">
                <div className="flex items-center gap-4 text-white font-bold">
                  <Wallet className="text-[var(--color-neon-blue)] group-hover:scale-110 transition-transform" /> 
                  WALLET
                </div>
                <span className="font-black text-2xl text-[var(--color-neon-blue)]">${(user.wallet_balance || 0).toFixed(2)}</span>
              </Link>
            </div>
          </div>

          {/* Quick Actions / Rewards */}
          <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Daily Rewards</h4>
            
            {rewardMsg && (
              <div className={`p-4 rounded-xl text-xs font-bold text-center mb-4 border ${rewardMsg.includes('Success') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {rewardMsg}
              </div>
            )}

            <button 
              onClick={handleClaimDaily}
              disabled={rewardLoading}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 hover:border-yellow-500/40 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <Gift className="text-yellow-500 group-hover:rotate-12 transition-transform" />
                <div className="text-left">
                  <p className="text-white font-black text-sm">Daily Bonus</p>
                  <p className="text-[10px] text-yellow-500/70 font-bold uppercase">Claim $5.00</p>
                </div>
              </div>
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <PlayCircle size={18} className="text-yellow-500" />
              </div>
            </button>

            <button 
              onClick={handleWatchAd}
              disabled={rewardLoading}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-[var(--color-neon-blue)]/10 to-[var(--color-neon-teal)]/10 border border-white/5 hover:border-[var(--color-neon-blue)]/30 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <PlayCircle className="text-[var(--color-neon-blue)] group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-white font-black text-sm">Watch & Earn</p>
                  <p className="text-[10px] text-[var(--color-neon-blue)]/70 font-bold uppercase">Get $0.50 per ad</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="glass p-10 rounded-[2.5rem] border border-white/5 min-h-[500px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight">
                <Clock className="text-[var(--color-neon-blue)]" size={32} /> RECENTLY PLAYED
              </h3>
              <div className="h-[2px] flex-grow mx-8 bg-gradient-to-r from-[var(--color-neon-blue)]/30 to-transparent rounded-full" />
            </div>
            
            {recentGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {recentGames.map((game) => (
                  <Link 
                    key={game.id} 
                    to={`/game/${game.id}`} 
                    className="group relative rounded-2xl overflow-hidden glass-hover block border border-white/5 transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="aspect-[3/4] w-full bg-gray-900">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/400x600/0b0c10/66fcf1?text=${encodeURIComponent(game.title)}`;
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-sm font-bold text-white group-hover:text-[var(--color-neon-blue)] transition-colors line-clamp-1">
                        {game.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-6">
                <div className="p-8 rounded-full bg-white/5 text-gray-600">
                  <Gamepad2 size={64} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-400 mb-2">No recently played games</h4>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">Start playing your favorite titles and they'll appear here for quick access!</p>
                </div>
                <Link to="/" className="text-[var(--color-neon-blue)] font-black text-sm tracking-widest border-b-2 border-[var(--color-neon-blue)]/30 pb-1">
                  EXPLORE GAMES
                </Link>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
