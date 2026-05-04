import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Medal, Star } from 'lucide-react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get('/api/games/leaderboard');
        setLeaders(res.data.data.leaders);
      } catch (err) {
        console.error('Leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (loading) return null;

  return (
    <div className="glass rounded-[2rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Trophy size={120} className="text-[var(--color-neon-blue)]" />
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-yellow-500/20 rounded-xl">
          <Trophy className="text-yellow-500" size={24} />
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">GLOBAL LEADERS</h3>
      </div>

      <div className="space-y-4">
        {Array.isArray(leaders) && leaders.map((leader, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
              index === 0 
              ? 'bg-yellow-500/10 border-yellow-500/20' 
              : index === 1 
              ? 'bg-gray-300/10 border-gray-300/20' 
              : index === 2 
              ? 'bg-orange-500/10 border-orange-500/20' 
              : 'bg-white/2 border-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center font-black text-sm">
                {index === 0 ? <Medal className="text-yellow-500" /> : index + 1}
              </div>
              <div>
                <p className="text-white font-bold text-sm uppercase tracking-wide">{leader.name}</p>
                <p className="text-[10px] text-gray-500 font-bold">{(leader.referral_count || leader.referralCount || 0)} REFERRALS</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[var(--color-neon-blue)] font-black text-lg">
                ${(leader.wallet_balance || leader.walletBalance || 0).toFixed(2)}
              </p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">WALLET</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 text-center">
        <p className="text-xs text-gray-500 font-medium">Rankings update every 60 seconds</p>
      </div>
    </div>
  );
};

export default Leaderboard;
