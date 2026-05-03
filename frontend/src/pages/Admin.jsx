import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, DollarSign, Activity, TrendingUp, Search, Edit3, ShieldAlert } from 'lucide-react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/stats')
      ]);
      setUsers(usersRes.data.data.users);
      setStats(statsRes.data.data.stats);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceUpdate = async (userId, type) => {
    if (!adjustAmount || isNaN(adjustAmount)) return;
    try {
      await axios.patch(`/api/admin/users/${userId}/balance`, {
        amount: Number(adjustAmount),
        type
      });
      setAdjustAmount('');
      setEditingUser(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phoneNumber.includes(searchTerm)
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--color-neon-blue)]">Initializing Admin Neural Link...</div>;

  return (
    <div className="min-h-screen p-8 pt-24 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">NEURAL COMMAND</h1>
            <p className="text-[var(--color-neon-teal)] font-bold flex items-center gap-2">
              <Activity size={16} /> SYSTEM STATUS: OPERATIONAL
            </p>
          </div>
          {stats && (
            <div className="flex gap-4">
              <StatCard icon={<Users />} label="PLAYERS" value={stats.totalUsers} color="blue" />
              <StatCard icon={<DollarSign />} label="PLATFORM LIQUIDITY" value={`$${stats.totalPlatformLiquidity.toFixed(2)}`} color="teal" />
              <StatCard icon={<TrendingUp />} label="ADMINS" value={stats.activeAdmins} color="purple" />
            </div>
          )}
        </header>

        {/* User Management Table */}
        <div className="glass rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
            <h2 className="text-2xl font-black text-white tracking-tight">PLAYER ROSTER</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or phone..." 
                className="bg-[var(--color-dark-bg)] border border-white/10 rounded-xl pl-12 pr-6 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs font-black uppercase tracking-widest">
                  <th className="px-8 py-5">Player</th>
                  <th className="px-8 py-5">Phone</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5 text-right">Wallet Balance</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{user._id}</div>
                    </td>
                    <td className="px-8 py-6 font-medium text-gray-300">{user.phoneNumber}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-[var(--color-neon-blue)] text-lg">
                      ${user.walletBalance.toFixed(2)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-2 hover:bg-[var(--color-neon-blue)]/10 rounded-lg text-[var(--color-neon-blue)] transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Balance Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
          <div className="max-w-md w-full glass p-8 rounded-[2.5rem] border border-[var(--color-neon-blue)]/30 animate-scale-up">
            <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">ADJUST CREDIT</h3>
            <p className="text-gray-400 mb-8 font-medium">Modifying balance for <span className="text-[var(--color-neon-blue)] font-black">{editingUser.name}</span></p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">AMOUNT (USD)</label>
                <input 
                  type="number" 
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-2xl px-6 py-4 text-white text-2xl font-black focus:outline-none focus:border-[var(--color-neon-blue)]"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleBalanceUpdate(editingUser._id, 'credit')}
                  className="bg-green-500 text-white font-black py-4 rounded-xl hover:bg-green-600 transition-colors shadow-lg"
                >
                  RAISE (+)
                </button>
                <button 
                  onClick={() => handleBalanceUpdate(editingUser._id, 'debit')}
                  className="bg-red-500 text-white font-black py-4 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                  LOOSE (-)
                </button>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="w-full text-gray-500 font-bold hover:text-white transition-colors"
              >
                CANCEL COMMAND
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-6 min-w-[200px]">
    <div className={`p-4 rounded-2xl ${color === 'blue' ? 'bg-blue-500/20 text-blue-400' : color === 'teal' ? 'bg-teal-500/20 text-teal-400' : 'bg-purple-500/20 text-purple-400'}`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</div>
      <div className="text-2xl font-black text-white">{value}</div>
    </div>
  </div>
);

export default Admin;
