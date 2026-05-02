import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Maximize2 } from 'lucide-react';

const GamePlay = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`/api/games/${id}`);
        setGame(res.data.data.game);
      } catch (error) {
        console.error('Failed to fetch game details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  const toggleFullScreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center"><p className="text-xl text-[var(--color-neon-blue)] animate-pulse">Loading Game Data...</p></div>;
  }

  if (!game) {
    return <div className="p-8 text-center"><p className="text-xl text-red-500">Game not found.</p></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Game Area */}
        <div className="flex-1">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_20px_rgba(102,252,241,0.2)] border border-[var(--color-neon-teal)]/30">
            
            {/* Loading Overlay */}
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-[var(--color-neon-teal)] border-t-[var(--color-neon-blue)] rounded-full animate-spin mb-4"></div>
                  <h2 className="text-xl font-bold text-gradient">Initializing Game Environment...</h2>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={game.iframeUrl}
              title={game.title}
              sandbox="allow-scripts allow-same-origin allow-popups"
              allow="autoplay; fullscreen"
              className={`w-full h-full border-0 transition-opacity duration-1000 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIframeLoaded(true)}
            ></iframe>
          </div>

          <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 glass">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
              <span className="bg-[var(--color-neon-teal)]/20 text-[var(--color-neon-blue)] px-3 py-1 rounded-full text-sm font-semibold border border-[var(--color-neon-teal)]/50">
                {game.category}
              </span>
            </div>
            <button 
              onClick={toggleFullScreen}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/10"
            >
              <Maximize2 className="w-5 h-5" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80">
          <div className="glass p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-gradient">How to Play</h3>
            <p className="text-[var(--color-light-gray)] text-sm mb-6">
              Click the game screen to interact. Use your mouse or keyboard as required by the game. Enter fullscreen mode for the best experience.
            </p>
            
            <div className="bg-[var(--color-dark-bg)] p-4 rounded-lg border border-[var(--color-neon-teal)]/30">
              <h4 className="font-semibold text-white mb-2">Notice</h4>
              <p className="text-xs text-gray-400">If the game fails to load, please ensure you are not using a strict adblocker, as some games require scripts to run.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GamePlay;
