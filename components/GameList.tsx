
import React from 'react';
import { Game } from '../types';

interface GameListProps {
    games: Game[];
    onSelect: (game: Game) => void;
    activeId: string;
    layout?: 'sidebar' | 'grid' | 'horizontal';
}

const GameList: React.FC<GameListProps> = ({ games, onSelect, activeId, layout = 'sidebar' }) => {
    // Horizontal layout for mobile scrolling if needed in specific sections
    if (layout === 'horizontal') {
        return (
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {games.map(game => (
                    <button
                        key={game.id}
                        onClick={() => onSelect(game)}
                        className={`flex-shrink-0 w-40 p-4 rounded-2xl border transition-all ${
                            activeId === game.id 
                            ? 'bg-blue-50 border-blue-200 shadow-inner' 
                            : 'bg-white border-slate-100 hover:border-blue-200'
                        }`}
                    >
                        <div className="text-3xl mb-2">{game.icon}</div>
                        <h4 className="text-sm font-bold text-slate-800 text-left line-clamp-1">{game.title}</h4>
                    </button>
                ))}
            </div>
        );
    }

    // Grid layout for "Grid Loyalty" (consistent, professional 2D arrangement)
    if (layout === 'grid') {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {games.map(game => (
                    <button
                        key={game.id}
                        onClick={() => onSelect(game)}
                        className={`relative flex flex-col items-center text-center p-5 rounded-3xl border transition-all duration-300 group ${
                            activeId === game.id 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 scale-105 z-10' 
                            : 'bg-white border-slate-100 text-slate-700 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'
                        }`}
                    >
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl md:text-5xl mb-4 transition-transform group-hover:scale-110 ${
                            activeId === game.id ? 'bg-white/20' : 'bg-slate-50'
                        }`}>
                            {game.icon}
                        </div>
                        <h4 className={`font-black text-sm md:text-base leading-tight mb-1 line-clamp-1 ${
                            activeId === game.id ? 'text-white' : 'text-slate-800'
                        }`}>
                            {game.title}
                        </h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            activeId === game.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {game.category}
                        </span>
                        
                        {activeId === game.id && (
                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md animate-bounce">
                                PLAYING
                            </div>
                        )}
                    </button>
                ))}
            </div>
        );
    }

    // Classic sidebar list layout
    return (
        <div className="space-y-3">
            {games.map(game => (
                <button
                    key={game.id}
                    onClick={() => onSelect(game)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all group ${
                        activeId === game.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                        activeId === game.id ? 'bg-white/20' : 'bg-slate-100'
                    }`}>
                        {game.icon}
                    </div>
                    <div className="text-left overflow-hidden">
                        <div className={`font-bold text-sm truncate ${activeId === game.id ? 'text-white' : 'text-slate-800'}`}>
                            {game.title}
                        </div>
                        <div className={`text-[10px] uppercase font-bold tracking-widest opacity-60 ${activeId === game.id ? 'text-white' : 'text-blue-500'}`}>
                            {game.category}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default GameList;
