import React from 'react';
import { Game } from '../types.ts';

interface GameListProps {
    games: Game[];
    onSelect: (game: Game) => void;
    activeId: string;
    layout?: 'sidebar' | 'grid' | 'horizontal';
}

const GameList: React.FC<GameListProps> = ({ games, onSelect, activeId, layout = 'sidebar' }) => {
    // Grid layout - Enhanced for better mobile-first responsiveness
    if (layout === 'grid') {
        return (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {games.map((game, idx) => (
                    <button
                        key={game.id}
                        onClick={() => onSelect(game)}
                        className={`relative flex flex-col items-center text-center p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all duration-300 group reveal-item no-select active:scale-95 ${
                            activeId === game.id 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 z-10' 
                            : 'bg-white border-slate-100 text-slate-700 hover:border-blue-300 hover:shadow-md'
                        }`}
                        style={{ animationDelay: `${(idx % 8) * 0.04}s` }}
                    >
                        <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center text-3xl md:text-5xl mb-3 transition-transform duration-500 group-hover:rotate-3 ${
                            activeId === game.id ? 'bg-white/20' : 'bg-slate-50'
                        }`}>
                            {game.icon}
                        </div>
                        <h4 className={`font-black text-[11px] md:text-base leading-tight mb-1 line-clamp-1 w-full ${
                            activeId === game.id ? 'text-white' : 'text-slate-800'
                        }`}>
                            {game.title}
                        </h4>
                        <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            activeId === game.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {game.category.split(' ')[0]}
                        </span>
                        
                        {activeId === game.id && (
                            <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-md md:hidden">
                                LIVE
                            </div>
                        )}
                    </button>
                ))}
            </div>
        );
    }

    // Default sidebar/compact list
    return (
        <div className="space-y-2">
            {games.map((game, idx) => (
                <button
                    key={game.id}
                    onClick={() => onSelect(game)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all group reveal-item active:scale-[0.98] ${
                        activeId === game.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                        : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                    }`}
                    style={{ animationDelay: `${idx * 0.03}s` }}
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        activeId === game.id ? 'bg-white/20' : 'bg-slate-100'
                    }`}>
                        {game.icon}
                    </div>
                    <div className="text-left overflow-hidden">
                        <div className={`font-bold text-xs truncate ${activeId === game.id ? 'text-white' : 'text-slate-800'}`}>
                            {game.title}
                        </div>
                        <div className={`text-[9px] uppercase font-bold tracking-widest opacity-60 ${activeId === game.id ? 'text-white' : 'text-blue-500'}`}>
                            {game.category}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default GameList;