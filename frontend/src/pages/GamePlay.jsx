import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Maximize2, Monitor, Layout, ArrowLeft, Info, Trophy, Share2, PlaySquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

const GamePlay = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
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

      } catch (error) {
        console.error('Failed to fetch game details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
    window.scrollTo(0, 0);
  }, [id]);

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
          <div className="w-12 h-12 border-4 border-[var(--color-accent-primary)]/30 border-t-[var(--color-accent-primary)] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-gray-400">Loading Game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[var(--color-dark-bg)]">
        <p className="text-2xl font-bold text-white mb-4">Game Not Found</p>
        <p className="text-gray-400 mb-8 max-w-md">This game might have been removed or is temporarily unavailable.</p>
        <Link to="/" className="bg-[var(--color-accent-primary)] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-indigo-500 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-16 pt-20 transition-colors duration-300 ${theaterMode ? 'bg-black' : 'bg-[var(--color-dark-bg)]'}`}>
      <div className={`${theaterMode ? 'w-full' : 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8'}`}>
        
        {/* Breadcrumbs / Actions */}
        {!theaterMode && (
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
              <span className="font-semibold text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-2">
               <button className="p-2 text-gray-400 hover:text-white transition-colors bg-[var(--color-dark-surface)] rounded-lg border border-white/5"><Share2 size={18} /></button>
               <button className="p-2 text-gray-400 hover:text-white transition-colors bg-[var(--color-dark-surface)] rounded-lg border border-white/5"><Trophy size={18} /></button>
            </div>
          </div>
        )}

        <div className={`flex flex-col ${theaterMode ? '' : 'lg:flex-row gap-8'}`}>
          
          {/* Main Game Area */}
          <div className="flex-1 w-full">
            <div className={`relative w-full ${theaterMode ? 'h-[90vh]' : 'aspect-video rounded-2xl'} bg-black overflow-hidden shadow-xl border border-white/10 group`}>
              
              {/* Controls Overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => setTheaterMode(!theaterMode)}
                  className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg text-white hover:bg-[var(--color-accent-primary)] transition-colors"
                  title="Theater Mode"
                >
                  <Layout size={18} />
                </button>
                <button 
                  onClick={toggleFullScreen}
                  className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg text-white hover:bg-[var(--color-accent-primary)] transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 size={18} />
                </button>
              </div>

              {/* Loading State */}
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827] z-20">
                  <div className="w-16 h-16 bg-[var(--color-accent-primary)]/10 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                    <PlaySquare size={32} className="text-[var(--color-accent-primary)]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[var(--color-accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[var(--color-accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[var(--color-accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                src={game.iframe_url}
                title={game.title}
                sandbox="allow-scripts allow-same-origin allow-popups"
                allow="autoplay; fullscreen"
                className={`w-full h-full border-0 transition-opacity duration-700 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIframeLoaded(true)}
              ></iframe>
            </div>

            {/* Game Info Below Player */}
            <div className={`mt-6 ${theaterMode ? 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8' : ''}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-5">
                   <img src={game.thumbnail} alt={game.title} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                   <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">{game.title}</h1>
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <span className="text-[var(--color-accent-primary)] px-2.5 py-0.5 rounded-md bg-[var(--color-accent-primary)]/10">
                          {game.category}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                           <Monitor size={14} /> Web Browser
                        </span>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setTheaterMode(!theaterMode)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-colors border ${
                      theaterMode 
                      ? 'bg-[var(--color-accent-primary)] text-white border-transparent' 
                      : 'bg-transparent text-gray-300 border-white/20 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Layout size={18} />
                    <span>Theater</span>
                  </button>
                  <button 
                    onClick={toggleFullScreen}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[var(--color-dark-surface)] text-white hover:bg-gray-700 px-6 py-2.5 rounded-full font-semibold text-sm transition-colors border border-white/10"
                  >
                    <Maximize2 size={18} />
                    <span>Fullscreen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          {!theaterMode && (
            <div className="w-full lg:w-80 space-y-6">
              <div className="bg-[var(--color-dark-surface)] p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><Info size={20} className="text-[var(--color-accent-primary)]" /> Controls</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-gray-400">Movement</span>
                     <div className="flex gap-1">
                       <span className="text-xs font-bold text-gray-300 px-2 py-1 rounded bg-white/10">WASD</span>
                       <span className="text-xs font-bold text-gray-300 px-2 py-1 rounded bg-white/10">ARROWS</span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-gray-400">Action</span>
                     <div className="flex gap-1">
                       <span className="text-xs font-bold text-gray-300 px-2 py-1 rounded bg-white/10">SPACE</span>
                       <span className="text-xs font-bold text-gray-300 px-2 py-1 rounded bg-white/10">CLICK</span>
                     </div>
                  </div>
                </div>
                <p className="mt-6 text-gray-500 text-xs font-medium leading-relaxed">
                  Click the game screen to focus input.
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
