import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Flame, Star, Zap, Trophy, Rocket } from 'lucide-react';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Action', 'Puzzle', 'Racing', 'Sports', 'Arcade', 'Strategy'];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get('/api/games?limit=48');
        setGames(res.data.data.games);
      } catch (error) {
        console.error('Failed to fetch games', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const filteredGames = activeCategory === 'All' 
    ? games 
    : games.filter(g => g.category === activeCategory);

  const featuredGame = games[0];

  return (
    <div className="min-h-screen pb-20 animate-fade-in -mt-16">
      {/* Hero Section */}
      {!loading && featuredGame ? (
        <section className="relative h-[80vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src={featuredGame.thumbnail} alt="Featured" className="w-full h-full object-cover blur-[2px] scale-105 opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] via-[var(--color-dark-bg)]/60 to-transparent" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start pt-16">
            <div className="inline-flex items-center space-x-2 bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] px-4 py-1.5 rounded-full text-xs font-black mb-6 border border-[var(--color-neon-blue)]/30 backdrop-blur-md">
              <Flame size={14} className="animate-pulse" /> <span>TRENDING NOW</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
              LEVEL UP YOUR <br />
              <span className="text-gradient">GAMING WORLD</span>
            </h1>
            <p className="text-xl text-[var(--color-light-gray)] max-w-2xl mb-10 leading-relaxed font-medium">
              Join the elite community of browser gamers. Play 150+ premium HTML5 games with zero downloads, high-speed performance, and absolute security.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to={`/game/${featuredGame._id}`} 
                className="bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-teal)] text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(102,252,241,0.5)] flex items-center space-x-2"
              >
                <Zap fill="currentColor" size={24} />
                <span>PLAY {featuredGame.title.toUpperCase()}</span>
              </Link>
              <button className="glass px-10 py-5 rounded-2xl font-black text-white hover:bg-white/10 transition-colors border-white/10">
                BROWSE ALL
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[80vh] bg-gray-900/20 animate-pulse" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        
        {/* Category Pills */}
        <div className="flex space-x-3 overflow-x-auto pb-10 no-scrollbar pt-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-8 py-4 rounded-2xl font-black transition-all border-2 text-sm tracking-wide ${
                activeCategory === cat 
                ? 'bg-[var(--color-neon-blue)] text-gray-900 border-transparent shadow-[0_0_30px_rgba(102,252,241,0.4)] scale-105' 
                : 'glass text-gray-400 border-white/5 hover:border-white/20'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
            <Star className="text-[var(--color-neon-blue)] w-10 h-10" fill="currentColor" />
            {activeCategory === 'All' ? 'PROMOTED TITLES' : `${activeCategory.toUpperCase()} GAMES`}
          </h2>
          <div className="h-[2px] flex-grow mx-8 bg-gradient-to-r from-[var(--color-neon-blue)]/50 to-transparent rounded-full hidden md:block" />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 aspect-[3/4] rounded-3xl border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredGames.map((game) => (
              <Link 
                key={game._id} 
                to={`/game/${game._id}`} 
                className="group relative rounded-3xl overflow-hidden glass-hover block border border-white/5 hover:border-[var(--color-neon-teal)]/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
              >
                <div className="aspect-[3/4] w-full bg-gray-900">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy" 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-base font-black text-white mb-1 group-hover:text-[var(--color-neon-blue)] transition-colors line-clamp-1">
                    {game.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-tighter text-[var(--color-neon-teal)] font-black opacity-80 group-hover:opacity-100">
                      {game.category}
                    </span>
                    <div className="flex items-center text-[10px] text-white/50 font-bold gap-1 bg-white/5 px-2 py-1 rounded-md">
                      <Zap size={10} className="text-yellow-500" fill="currentColor" /> {Math.floor(game.popularity / 100)}k
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Community Callout */}
        <section className="mt-32 glass rounded-[40px] p-16 border border-white/10 relative overflow-hidden text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--color-neon-blue)]/10 rounded-full blur-[120px]" />
           <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--color-neon-teal)]/10 rounded-full blur-[120px]" />
           <Rocket size={64} className="mx-auto text-[var(--color-neon-blue)] mb-8 animate-pulse" />
           <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
             READY TO ENTER THE <br />
             <span className="text-gradient">NEONPLAY SQUAD?</span>
           </h2>
           <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-medium">
             Unlock exclusive perks, save your game progress, compete in high-stakes leaderboards, and manage your wallet balance seamlessly.
           </p>
           <Link to="/login" className="inline-block bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-[var(--color-neon-blue)] hover:scale-105 transition-all shadow-2xl">
              CREATE YOUR FREE ACCOUNT
           </Link>
        </section>

      </div>
    </div>
  );
};

export default Home;

