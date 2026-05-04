import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Play } from 'lucide-react';

const GameCard = ({ game }) => {
  return (
    <Link 
      to={`/game/${game.id}`} 
      className="group relative flex flex-col bg-[var(--color-dark-surface)] rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--color-accent-primary)]/20"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-900 overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          loading="lazy" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x300/111827/6366f1?text=${encodeURIComponent(game.title)}`;
          }}
        />
        {/* Play Now Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-[var(--color-accent-primary)] rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play fill="currentColor" className="text-white ml-1" size={20} />
          </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-base font-bold text-white group-hover:text-[var(--color-accent-primary)] transition-colors line-clamp-1">
          {game.title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-white/5 rounded-md">
            {game.category}
          </span>
          <div className="flex items-center text-xs text-gray-400 font-medium gap-1">
            <Zap size={12} className="text-[var(--color-accent-warning)]" fill="currentColor" /> 
            {Math.floor(game.popularity / 100)}k
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
