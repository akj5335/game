import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Maximize2, Monitor, Layout, ArrowLeft, Info, Trophy, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';

const GamePlay = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [pendingSub, setPendingSub] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setGame(data);
        
        // Save to recently played
        const recent = JSON.parse(localStorage.getItem('neonplay_recent') || '[]');
        const filtered = recent.filter(g => g.id !== id);
        localStorage.setItem('neonplay_recent', JSON.stringify([
          { id: data.id, title: data.title, thumbnail: data.thumbnail },
          ...filtered
        ].slice(0, 10)));

        // If game is premium and user is logged in, check for pending subscription
        if (data.is_premium && user?.id) {
          const { data: subData } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .eq('status', 'pending_manual')
            .single();
          
          if (subData) {
            setPendingSub(true);
          }
        }

      } catch (error) {
        console.error('Failed to fetch game details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
    
    // Scroll to top when game changes
    window.scrollTo(0, 0);
  }, [id, user]);

  const toggleFullScreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[var(--color-neon-blue)]/20 border-t-[var(--color-neon-blue)] rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-black text-[var(--color-neon-blue)] animate-pulse tracking-widest uppercase">Initializing Neural Link...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[var(--color-dark-bg)]">
        <p className="text-4xl font-black text-red-500 mb-6 uppercase tracking-tighter">ERROR: DATA CORRUPTED</p>
        <p className="text-gray-400 mb-8 max-w-md">The requested game module could not be located in the grid.</p>
        <Link to="/" className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[var(--color-neon-blue)] transition-colors">
          Return to Hub
        </Link>
      </div>
    );
  }

  if (game.is_premium) {
    const isSubscribed = user?.is_subscribed;
    const isExpired = user?.subscription_expiry ? new Date(user.subscription_expiry) < new Date() : true;
    
    if (!isSubscribed || isExpired) {
      if (pendingSub) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)] px-4">
            <div className="text-center p-10 glass rounded-[2.5rem] max-w-lg border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.1)]">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
                <span className="text-yellow-500">WAITING</span> FOR APPROVAL
              </h2>
              <p className="text-gray-400 font-bold mb-8 leading-relaxed">
                Your manual payment is currently under review by our admin. Premium access will be granted shortly.
              </p>
              <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="text-center">
                <Link to="/" className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  Return to Free Games
                </Link>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)] px-4">
          <div className="text-center p-10 glass rounded-[2.5rem] max-w-lg border border-[var(--color-neon-blue)]/30 shadow-[0_0_50px_rgba(102,252,241,0.1)]">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
              <span className="text-[var(--color-neon-blue)]">PREMIUM</span> GAME
            </h2>
            <p className="text-gray-400 font-bold mb-8 leading-relaxed">
              This game is reserved for NeonPlay Elite members. Subscribe to unlock this and all other premium titles instantly.
            </p>
            <Link to="/subscription" className="w-full inline-block bg-[var(--color-neon-blue)] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(102,252,241,0.4)]">
              Unlock Elite Access
            </Link>
            <div className="mt-6 text-center">
              <Link to="/" className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                Return to Free Games
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className={`min-h-screen pb-20 pt-24 animate-fade-in ${theaterMode ? 'bg-black' : 'bg-[var(--color-dark-bg)]'}`}>
      <div className={`${theaterMode ? 'max-w-full px-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        
        {/* Breadcrumbs / Back button */}
        {!theaterMode && (
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm uppercase tracking-widest">Back to Grid</span>
            </Link>
            <div className="flex items-center gap-4">
               <button className="p-2 text-gray-500 hover:text-[var(--color-neon-blue)] transition-colors"><Share2 size={20} /></button>
               <button className="p-2 text-gray-500 hover:text-yellow-500 transition-colors"><Trophy size={20} /></button>
            </div>
          </div>
        )}

        <div className={`flex flex-col ${theaterMode ? 'gap-0' : 'lg:flex-row gap-12'}`}>
          
          {/* Game Area */}
          <div className="flex-1">
            <div className={`relative w-full ${theaterMode ? 'h-[85vh]' : 'aspect-video rounded-[2rem]'} bg-black overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border ${theaterMode ? 'border-b border-white/10' : 'border-white/5'}`}>
              
              {/* Controls Overlay (Floating) */}
              <div className="absolute top-6 right-6 flex items-center gap-3 z-30 opacity-0 hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => setTheaterMode(!theaterMode)}
                  className="p-3 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-[var(--color-neon-blue)] hover:text-black transition-all border border-white/10"
                  title="Theater Mode"
                >
                  <Layout size={20} />
                </button>
                <button 
                  onClick={toggleFullScreen}
                  className="p-3 bg-black/60 backdrop-blur-md rounded-xl text-white hover:bg-[var(--color-neon-blue)] hover:text-black transition-all border border-white/10"
                  title="Fullscreen"
                >
                  <Maximize2 size={20} />
                </button>
              </div>

              {/* Loading / Ad Overlay */}
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-20 backdrop-blur-xl">
                  <div className="flex flex-col items-center text-center max-w-sm px-6">
                    <div className="w-20 h-20 border-4 border-[var(--color-neon-teal)]/20 border-t-[var(--color-neon-blue)] rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(102,252,241,0.2)]"></div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">Securing Neural Link...</h2>
                    <p className="text-gray-500 text-xs mb-8 font-bold tracking-widest uppercase opacity-60">Handshaking with game server</p>
                    
                    {/* Mock Ad Slot */}
                    <div className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse"></div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 relative z-10 font-black">Sponsored Data</p>
                      <div className="w-full h-full flex items-center justify-center font-black text-[var(--color-neon-blue)] text-xs relative z-10">
                        NEONPLAY PREMIUM - 0% LATENCY
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                src={game.iframe_url}
                title={game.title}
                sandbox="allow-scripts allow-same-origin allow-popups"
                allow="autoplay; fullscreen"
                className={`w-full h-full border-0 transition-opacity duration-1000 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIframeLoaded(true)}
              ></iframe>
            </div>

            <div className={`mt-10 ${theaterMode ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' : ''}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/2 p-8 rounded-[2rem] border border-white/5 glass">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10">
                      <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter uppercase italic leading-none">{game.title}</h1>
                      <div className="flex items-center gap-3">
                        <span className="bg-[var(--color-neon-teal)]/20 text-[var(--color-neon-blue)] px-4 py-1.5 rounded-xl text-xs font-black border border-[var(--color-neon-teal)]/50 tracking-widest uppercase">
                          {game.category}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 text-xs font-black uppercase tracking-widest">
                           <Monitor size={14} /> Desktop Optimized
                        </div>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => setTheaterMode(!theaterMode)}
                    className={`flex-1 md:flex-none flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-black text-sm tracking-widest transition-all uppercase border ${
                      theaterMode 
                      ? 'bg-[var(--color-neon-blue)] text-black border-transparent' 
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Layout className="w-5 h-5" />
                    <span>{theaterMode ? 'Exit Theater' : 'Theater Mode'}</span>
                  </button>
                  <button 
                    onClick={toggleFullScreen}
                    className="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-white text-black hover:bg-[var(--color-neon-blue)] px-8 py-4 rounded-xl font-black text-sm tracking-widest transition-all uppercase"
                  >
                    <Maximize2 className="w-5 h-5" />
                    <span>Fullscreen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {!theaterMode && (
            <div className="w-full lg:w-96 space-y-8">
              <div className="glass p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-white/5"><Info size={80} /></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-6 text-white tracking-tighter uppercase italic">Control Manual</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Movement</span>
                       <span className="text-xs font-black text-white px-2 py-1 rounded bg-white/10">WASD / ARROWS</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Action</span>
                       <span className="text-xs font-black text-white px-2 py-1 rounded bg-white/10">SPACE / CLICK</span>
                    </div>
                  </div>
                  <p className="mt-8 text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider">
                    Click the game screen to focus input. For the most responsive experience, we recommend using Theater or Fullscreen mode.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[var(--color-neon-blue)]/20 to-purple-500/20 p-8 rounded-[2.5rem] border border-[var(--color-neon-blue)]/30">
                <h4 className="font-black text-white mb-4 uppercase italic tracking-tighter text-xl">High Performance Notice</h4>
                <p className="text-xs text-[var(--color-neon-blue)] font-bold uppercase leading-relaxed tracking-widest">
                  This game is running via industrial-grade tunneling. Ensure your hardware acceleration is enabled for maximum FPS.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GamePlay;
