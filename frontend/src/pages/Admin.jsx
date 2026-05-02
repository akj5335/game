import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [pendingTxns, setPendingTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await axios.get('/api/wallet/admin/pending');
      setPendingTxns(res.data.data.transactions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPending();
    }
  }, [user]);

  const handleAction = async (id, action) => {
    try {
      await axios.patch(`/api/wallet/admin/${action}/${id}`);
      fetchPending();
    } catch (error) {
      alert('Error processing transaction: ' + (error.response?.data?.message || ''));
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-center mt-20 text-red-500 text-xl font-bold">Unauthorized Access</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="w-10 h-10 text-red-500" />
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-red-500/5">
          <h3 className="text-xl font-bold text-white">Pending Transactions</h3>
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">{pendingTxns.length} Pending</span>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : pendingTxns.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-semibold">No pending requests.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-[var(--color-light-gray)] text-sm">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingTxns.map(txn => (
                  <tr key={txn._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white">
                      <div className="font-semibold">{txn.userId.name}</div>
                      <div className="text-xs text-gray-400">{txn.userId.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`capitalize font-bold ${txn.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="p-4 text-white font-bold">${txn.amount.toFixed(2)}</td>
                    <td className="p-4 text-sm text-gray-400 max-w-[200px] truncate">
                      {txn.reference || '-'}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => handleAction(txn._id, 'approve')}
                        className="bg-green-500/20 text-green-400 p-2 rounded-lg hover:bg-green-500/30 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleAction(txn._id, 'reject')}
                        className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
