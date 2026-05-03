import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WalletContext } from '../context/WalletContext';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const Wallet = () => {
  const { user } = useContext(AuthContext);
  const { transactions, loading, requestDeposit, requestWithdrawal } = useContext(WalletContext);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [action, setAction] = useState('deposit'); // deposit or withdraw
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (action === 'deposit') {
        await requestDeposit(Number(amount), reference);
        setMsg('Deposit request submitted! Awaiting admin approval.');
      } else {
        await requestWithdrawal(Number(amount));
        setMsg('Withdrawal request submitted! Awaiting admin approval.');
      }
      setAmount('');
      setReference('');
    } catch (error) {
      setMsg(error.response?.data?.message || 'Error processing request');
    }
  };

  const handleStripeDeposit = async () => {
    if (!amount || amount < 5) return setMsg('Minimum deposit is $5');
    try {
      setMsg('Redirecting to secure payment gateway...');
      const res = await axios.post('/api/payments/create-checkout-session', { amount: Number(amount) });
      if (res.data.data.url) {
        window.location.href = res.data.data.url;
      }
    } catch (error) {
      setMsg(error.response?.data?.message || 'Error initializing payment');
    }
  };

  if (!user) return <div className="text-center mt-20 text-xl text-white">Please log in.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient">My Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Balance Card */}
        <div className="md:col-span-1">
          <div className="glass p-8 rounded-2xl border border-[var(--color-neon-teal)]/30 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-blue)]/10 rounded-full blur-3xl"></div>
            <p className="text-[var(--color-light-gray)] font-semibold mb-2">Available Balance</p>
            <h2 className="text-6xl font-bold text-white mb-6">${(user.wallet_balance || 0).toFixed(2)}</h2>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setAction('deposit')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1 ${action === 'deposit' ? 'bg-[var(--color-neon-blue)] text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                <ArrowDownRight className="w-4 h-4" /> Deposit
              </button>
              <button 
                onClick={() => setAction('withdraw')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1 ${action === 'withdraw' ? 'bg-[var(--color-neon-teal)] text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                <ArrowUpRight className="w-4 h-4" /> Withdraw
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="mt-8 glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Request {action === 'deposit' ? 'Deposit' : 'Withdrawal'}</h3>
            {msg && <div className="mb-4 text-sm text-[var(--color-neon-blue)] bg-white/5 p-3 rounded-lg border border-white/10">{msg}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-light-gray)] mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  min="1"
                  required 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)]"
                />
              </div>
              {action === 'deposit' && (
                <div>
                  <label className="block text-sm text-[var(--color-light-gray)] mb-1">Reference / Screenshot Link (Optional)</label>
                  <input 
                    type="text" 
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)]"
                    placeholder="Txn ID or URL"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg transition-colors border border-white/20">
                  Manual Request
                </button>
                {action === 'deposit' && (
                  <button type="button" onClick={handleStripeDeposit} className="flex-1 bg-[#635BFF] hover:bg-[#524BCC] text-white font-bold py-2 rounded-lg transition-colors border border-transparent shadow-[0_0_15px_rgba(99,91,255,0.4)]">
                    Pay with Card
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="md:col-span-2">
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Transaction History</h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No transactions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[var(--color-light-gray)] text-sm">
                    <tr>
                      <th className="p-4">Type</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map(txn => (
                      <tr key={txn._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center gap-2 text-white font-medium capitalize">
                          {txn.type === 'deposit' ? <ArrowDownRight className="w-4 h-4 text-green-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                          {txn.type}
                        </td>
                        <td className="p-4 text-white font-bold">${txn.amount.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center w-max gap-1
                            ${txn.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                              txn.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                            {txn.status === 'pending' && <Clock className="w-3 h-3" />}
                            {txn.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-[var(--color-light-gray)]">
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Wallet;
