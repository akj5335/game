import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/wallet/history');
      setTransactions(res.data.data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const requestDeposit = async (amount, reference) => {
    const res = await axios.post('/api/wallet/deposit', { amount, reference });
    await fetchTransactions();
    return res.data;
  };

  const requestWithdrawal = async (amount) => {
    const res = await axios.post('/api/wallet/withdraw', { amount });
    await fetchTransactions();
    return res.data;
  };

  return (
    <WalletContext.Provider value={{ transactions, loading, requestDeposit, requestWithdrawal, fetchTransactions }}>
      {children}
    </WalletContext.Provider>
  );
};
