import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, Zap, Trophy, Rocket, Clock, TrendingUp } from 'lucide-react';
import Leaderboard from '../components/Leaderboard';
import { supabase } from '../lib/supabase';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [recentGames, setRecentGames] = useState([]);

  const categories = ['All', 'Action', 'Puzzle', 'Racing', 'Sports', 'Arcade', 'Strategy'];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .limit(48);
        
        if (error) throw error;
        setGames(data);
      } catch (error) {
        console.error('Failed to fetch games', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();

    // Load recent games
    const saved = localStorage.getItem('neonplay_recent');
    if (saved) setRecentGames(JSON.parse(saved).slice(0, 6));
  }, []);

  const filteredGames = activeCategory === 'All' 
    ? games 
    : games.filter(g => g.category === activeCategory);

  const featuredGame = games[0];

  return (
    <div className="min-h-screen pb-20 animate-fade-in pt-16 bg-[var(--color-dark-bg)]">
      {/* Hero Section */}
      {!loading && featuredGame ? (
        <section className="relative h-[85vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src={featuredGame.thumbnail} alt="Featured" className="w-full h-full object-cover blur-[1px] scale-105 opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] via-[var(--color-dark-bg)]/60 to-transparent" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start pt-16">
            <div className="inline-flex items-center space-x-2 bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] px-5 py-2 rounded-full text-xs font-black mb-8 border border-[var(--color-neon-blue)]/30 backdrop-blur-xl shadow-[0_0_20px_rgba(102,252,241,0.2)]">
              <Flame size={14} className="animate-pulse text-orange-500" /> <span>TRENDING NOW</span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-none italic uppercase">
              REDEFINE YOUR <br />
              <span className="text-gradient">PLAYFIELD</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-bold opacity-80">
              The ultimate high-performance browser gaming destination. 150+ premium titles, zero latency, and real-time rewards.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link 
                to={`/game/${featuredGame.id}`} 
                className="bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-teal)] text-gray-900 px-12 py-5 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(102,252,241,0.4)] flex items-center space-x-3 active:scale-95"
              >
                <Zap fill="currentColor" size={24} />
                <span>START PLAYING</span>
              </Link>
              <button className="glass px-12 py-5 rounded-[2rem] font-black text-white hover:bg-white/10 transition-all border border-white/10 text-xl">
                REWARDS
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[80vh] bg-gray-900/10 animate-pulse" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
        
        {/* Recently Played Section */}
        {recentGames.length > 0 && (
          <section className="mb-24 animate-fade-in">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight">
                <Clock className="text-[var(--color-neon-blue)]" size={32} /> JUMP BACK IN
              </h3>
              <div className="h-[2px] flex-grow mx-8 bg-gradient-to-r from-[var(--color-neon-blue)]/30 to-transparent rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {recentGames.map((game) => (
                <Link key={game.id} to={`/game/${game.id}`} className="group block">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--color-neon-blue)]/50 transition-all mb-3 relative">
                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                  </div>
                  <p className="text-xs font-black text-gray-400 group-hover:text-white transition-colors line-clamp-1 uppercase text-center">{game.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Games List */}
          <div className="flex-1">
            {/* Category Pills */}
            <div className="flex space-x-3 overflow-x-auto pb-12 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-8 py-4 rounded-2xl font-black transition-all border-2 text-sm tracking-widest ${
                    activeCategory === cat 
                    ? 'bg-[var(--color-neon-blue)] text-gray-900 border-transparent shadow-[0_0_30px_rgba(102,252,241,0.3)] scale-105' 
                    : 'glass text-gray-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter">
                <TrendingUp className="text-[var(--color-neon-blue)] w-10 h-10" />
                {activeCategory === 'All' ? 'ELITE SELECTIONS' : `${activeCategory.toUpperCase()} VAULT`}
              </h2>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white/5 aspect-[3/4] rounded-[2rem] border border-white/5"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredGames.map((game) => (
                  <Link 
                    key={game.id} 
                    to={`/game/${game.id}`} 
                    className="group relative rounded-[2rem] overflow-hidden glass-hover block border border-white/5 hover:border-[var(--color-neon-teal)]/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                  >
                    <div className="aspect-[3/4] w-full bg-gray-900">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        loading="lazy" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/400x600/0b0c10/66fcf1?text=${encodeURIComponent(game.title)}`;
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-lg font-black text-white mb-2 group-hover:text-[var(--color-neon-blue)] transition-colors line-clamp-1 tracking-tight">
                        {game.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-neon-teal)] font-black opacity-80">
                          {game.category}
                        </span>
                        <div className="flex items-center text-[10px] text-white/50 font-bold gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                          <Zap size={10} className="text-yellow-500" fill="currentColor" /> {Math.floor(game.popularity / 100)}k
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 space-y-12">
             <Leaderboard />
             
             {/* Ad Space Placeholder */}
             <div className="glass rounded-[2rem] border border-white/5 p-8 text-center relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Ad Placement</p>
                  <div className="aspect-square bg-black/40 rounded-2xl flex flex-col items-center justify-center p-6 border border-white/5">
                    <Trophy className="text-yellow-500 mb-4" size={48} />
                    <h4 className="text-xl font-black text-white mb-2">NEONPLAY PLUS</h4>
                    <p className="text-xs text-gray-400 font-bold leading-relaxed">Remove all ads and unlock 4K gaming experiences.</p>
                    <button className="mt-8 w-full py-4 bg-white text-black rounded-xl font-black text-xs tracking-widest hover:bg-[var(--color-neon-blue)] transition-colors">UPGRADE NOW</button>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Community Callout */}
        <section className="mt-40 glass rounded-[3rem] p-20 border border-white/10 relative overflow-hidden text-center shadow-[0_0_80px_rgba(0,0,0,0.6)]">
           <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-[var(--color-neon-blue)]/5 rounded-full blur-[150px]" />
           <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-[var(--color-neon-teal)]/5 rounded-full blur-[150px]" />
           <Rocket size={80} className="mx-auto text-[var(--color-neon-blue)] mb-10 animate-bounce" />
           <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight italic uppercase">
             JOIN THE <br />
             <span className="text-gradient">ELITE SQUAD</span>
           </h2>
           <p className="text-2xl text-gray-500 max-w-3xl mx-auto mb-12 font-bold leading-relaxed">
             Unlock high-stakes rewards, compete globally, and manage your assets with industrial-grade security.
           </p>
           <Link to="/login" className="inline-block bg-white text-black px-16 py-6 rounded-[2rem] font-black text-2xl hover:bg-[var(--color-neon-blue)] hover:scale-105 transition-all shadow-2xl uppercase tracking-tighter">
              EXECUTE SIGNUP
           </Link>
        </section>

      </div>
    </div>
  );
};

export default Home;

