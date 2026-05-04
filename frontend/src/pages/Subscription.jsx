import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, Zap, Crown, Shield } from 'lucide-react';

const Subscription = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (planId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('neonplay_token');
      
      // Create Razorpay Order
      const { data: orderData } = await axios.post(
        '/api/subscriptions/create-order',
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderData.data;

      // Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Make sure to add this to .env
        amount: order.amount,
        currency: order.currency,
        name: 'NeonPlay Premium',
        description: order.planName,
        order_id: order.orderId,
        handler: async function (response) {
          try {
            // Verify Payment
            const { data: verifyData } = await axios.post(
              '/api/subscriptions/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local user state
            setUser({
              ...user,
              is_subscribed: verifyData.data.is_subscribed,
              subscription_expiry: verifyData.data.subscription_expiry
            });

            alert('Subscription activated successfully!');
            navigate(-1); // Go back to the game they were trying to play
          } catch (err) {
            console.error('Verification Error:', err);
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: user.name,
          contact: user.phone_number
        },
        theme: {
          color: '#66fcf1'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error(response.error);
        alert('Payment failed. Please try again.');
      });
      rzp.open();

    } catch (err) {
      console.error('Checkout Error:', err);
      alert(err.response?.data?.message || 'Failed to initiate checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[var(--color-dark-bg)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-6">
          UNLOCK <span className="text-gradient">PREMIUM</span> ACCESS
        </h1>
        <p className="text-xl text-gray-400 font-bold tracking-widest max-w-2xl mx-auto">
          Get unlimited access to our elite catalog of premium games, zero latency tunneling, and an ad-free experience.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Basic Plan */}
        <div className="glass rounded-[2rem] p-8 border border-white/5 relative flex flex-col group hover:border-[var(--color-neon-blue)]/50 transition-colors">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-wider mb-2">Basic Monthly</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[var(--color-neon-blue)] tracking-tighter">₹49</span>
              <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">/ month</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-gray-300 font-bold tracking-wide">
              <Check className="text-[var(--color-neon-blue)]" size={20} /> Access to Basic Premium Games
            </li>
            <li className="flex items-center gap-3 text-gray-300 font-bold tracking-wide">
              <Check className="text-[var(--color-neon-blue)]" size={20} /> Ad-Free Experience
            </li>
            <li className="flex items-center gap-3 text-gray-500 font-bold tracking-wide opacity-50">
              <Check className="text-gray-500" size={20} /> Zero Latency Servers
            </li>
          </ul>

          <button 
            onClick={() => handleSubscribe('monthly_49')}
            disabled={loading}
            className="w-full py-4 rounded-xl border-2 border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] font-black uppercase tracking-widest hover:bg-[var(--color-neon-blue)] hover:text-black transition-all"
          >
            Select Basic
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-br from-[var(--color-neon-blue)]/10 to-[var(--color-neon-teal)]/10 rounded-[2rem] p-8 border-2 border-[var(--color-neon-blue)] relative flex flex-col shadow-[0_0_50px_rgba(102,252,241,0.15)] transform md:-translate-y-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-teal)] text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-[var(--color-neon-blue)]/30">
            <Crown size={14} /> Recommended
          </div>

          <div className="mb-8 mt-4">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-wider mb-2">Elite Monthly</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white tracking-tighter">₹99</span>
              <span className="text-[var(--color-neon-blue)] font-bold uppercase tracking-widest text-sm">/ month</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white font-bold tracking-wide">
              <Check className="text-[var(--color-neon-blue)]" size={20} /> Access to ALL Premium Games
            </li>
            <li className="flex items-center gap-3 text-white font-bold tracking-wide">
              <Check className="text-[var(--color-neon-blue)]" size={20} /> Ad-Free Experience
            </li>
            <li className="flex items-center gap-3 text-white font-bold tracking-wide">
              <Zap className="text-[var(--color-neon-blue)]" fill="currentColor" size={20} /> Zero Latency VIP Servers
            </li>
            <li className="flex items-center gap-3 text-white font-bold tracking-wide">
              <Shield className="text-[var(--color-neon-blue)]" size={20} /> Priority Support
            </li>
          </ul>

          <button 
            onClick={() => handleSubscribe('monthly_99')}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-teal)] text-black font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--color-neon-blue)]/20"
          >
            {loading ? 'Processing...' : 'Subscribe Elite'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Subscription;
