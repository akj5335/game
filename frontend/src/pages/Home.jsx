import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Clock, TrendingUp, Grid, PlaySquare, Swords, Car, Trophy, Gamepad2, BrainCircuit } from 'lucide-react';
import GameCard from '../components/GameCard';
import { supabase } from '../lib/supabase';

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
      isActive 
      ? 'bg-[var(--color-accent-primary)] text-white shadow-md shadow-[var(--color-accent-primary)]/20' 
      : 'text-gray-400 hover:bg-[var(--color-dark-surface)] hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Home');
  const [recentGames, setRecentGames] = useState([]);
  const location = useLocation();

  const categories = [
    { name: 'Home', icon: Grid },
    { name: 'New Games', icon: Flame },
    { name: 'Action', icon: Swords },
    { name: 'Racing', icon: Car },
    { name: 'Sports', icon: Trophy },
    { name: 'Puzzle', icon: BrainCircuit },
    { name: 'Arcade', icon: Gamepad2 },
  ];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .limit(60);
        
        if (error) throw error;
        setGames(data);
      } catch (error) {
        console.error('Failed to fetch games', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();

    const saved = localStorage.getItem('neonplay_recent');
    if (saved) setRecentGames(JSON.parse(saved).slice(0, 5));
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filteredGames = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery);
    if (!matchesSearch) return false;
    
    if (activeCategory === 'Home' || activeCategory === 'New Games') return true;
    return g.category === activeCategory;
  });

  const featuredGames = games.slice(0, 2); // Top 2 featured games
  const popularGames = games.slice(2, 14);

  return (
    <div className="min-h-screen pt-16 bg-[var(--color-dark-bg)]">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 p-6 border-r border-white/5 overflow-y-auto no-scrollbar fixed h-[calc(100vh-4rem)]">
          <div className="space-y-2">
            {categories.map(cat => (
              <SidebarItem 
                key={cat.name} 
                icon={cat.icon} 
                label={cat.name} 
                isActive={activeCategory === cat.name && !searchQuery} 
                onClick={() => {
                  setActiveCategory(cat.name);
                  // clear search if any by navigating to /
                  if(searchQuery) window.history.replaceState({}, '', '/');
                }}
              />
            ))}
          </div>

          <div className="mt-10">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Your Games</h4>
            {recentGames.length > 0 ? (
              <div className="space-y-3">
                {recentGames.slice(0, 3).map((game) => (
                  <Link key={game.id} to={`/game/${game.id}`} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[var(--color-dark-surface)] transition-colors group">
                    <img src={game.thumbnail} alt={game.title} className="w-8 h-8 rounded object-cover" />
                    <span className="text-sm text-gray-300 font-medium group-hover:text-white line-clamp-1">{game.title}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600 px-4">No recent games played.</p>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6 md:p-8 overflow-y-auto">
          
          {searchQuery ? (
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-white mb-6">Search Results for "{searchQuery}"</h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredGames.map(game => <GameCard key={game.id} game={game} />)}
              </div>
              {filteredGames.length === 0 && <p className="text-gray-400">No games found.</p>}
            </div>
          ) : activeCategory === 'Home' ? (
            <>
              {/* Featured Section (Hero Grid) */}
              {loading ? (
                <div className="h-64 sm:h-80 bg-[var(--color-dark-surface)] animate-pulse rounded-2xl mb-10" />
              ) : featuredGames.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {featuredGames.map(game => (
                    <Link key={game.id} to={`/game/${game.id}`} className="relative h-64 sm:h-80 rounded-2xl overflow-hidden group">
                      <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <span className="bg-[var(--color-accent-primary)] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-lg shadow-indigo-500/30">FEATURED</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{game.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                           <span className="flex items-center gap-1"><PlaySquare size={16} /> Play Now</span>
                           <span className="flex items-center gap-1"><Flame size={16} className="text-orange-500"/> Hot</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Continue Playing */}
              {recentGames.length > 0 && (
                <section className="mb-12">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <Clock className="text-[var(--color-accent-primary)]" size={24} /> Continue Playing
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {recentGames.map((game) => (
                      <Link key={game.id} to={`/game/${game.id}`} className="flex-shrink-0 w-32 sm:w-40 group">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/5 group-hover:border-[var(--color-accent-primary)]/50 transition-colors mb-2">
                          <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <p className="text-sm font-semibold text-gray-300 group-hover:text-white line-clamp-1">{game.title}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Popular Games Grid */}
              <section className="mb-12">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <TrendingUp className="text-[var(--color-accent-secondary)]" size={24} /> Popular Games
                </h3>
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-[var(--color-dark-surface)] aspect-[4/3] rounded-2xl"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {popularGames.map(game => <GameCard key={game.id} game={game} />)}
                  </div>
                )}
              </section>
              
              {/* All Games Grid */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Grid className="text-gray-400" size={24} /> All Games
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {games.slice(14).map(game => <GameCard key={game.id} game={game} />)}
                </div>
              </section>
            </>
          ) : (
            // Category View
            <section className="mb-12">
              <h1 className="text-3xl font-bold text-white mb-8">{activeCategory} Games</h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredGames.length > 0 ? (
                  filteredGames.map(game => <GameCard key={game.id} game={game} />)
                ) : (
                  <p className="text-gray-400 col-span-full">No games available in this category.</p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
