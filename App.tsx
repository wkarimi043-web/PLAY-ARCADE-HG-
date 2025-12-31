
import React, { useState, useMemo } from 'react';
import { Game } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import GameList from './components/GameList';
import GameDisplay from './components/GameDisplay';
import ContactForm from './components/ContactForm';
import LegalPage from './components/LegalPage';
import SearchBar from './components/SearchBar';
import { GAMES_REGISTRY } from './games/Registry';

type ViewType = 'home' | 'games' | 'about' | 'contact' | 'privacy' | 'terms' | 'cookies';

const App: React.FC = () => {
    const [activeGame, setActiveGame] = useState<Game>(GAMES_REGISTRY[0]); 
    const [view, setView] = useState<ViewType>('home');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSelectGame = (game: Game) => {
        setActiveGame(game);
        setView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNavigate = (newView: ViewType) => {
        setView(newView);
        setSearchQuery(''); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredGames = useMemo(() => {
        if (!searchQuery.trim()) return GAMES_REGISTRY;
        const query = searchQuery.toLowerCase().trim();
        return GAMES_REGISTRY.filter(game => 
            game.title.toLowerCase().includes(query) || 
            game.category.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    return (
        <div id="play-arcade-hq-inner-root" className="min-h-screen flex flex-col bg-gray-50 text-slate-800">
            <Header onNavigate={handleNavigate} activeView={view} />
            
            <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
                {view === 'home' && (
                    <div className="flex flex-col gap-8 md:gap-12">
                        <section className="max-w-5xl mx-auto w-full">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                    Featured Arcade Game
                                </h2>
                                <span className="text-[10px] md:text-xs text-slate-400 font-medium truncate ml-2">Playing: {activeGame.title}</span>
                            </div>
                            <GameDisplay game={activeGame} />
                        </section>

                        <section className="w-full">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-6 md:h-8 bg-blue-500 rounded-full"></span>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                                        Browse Arcade Collection
                                    </h3>
                                </div>
                                <div className="w-full md:w-auto md:min-w-[320px]">
                                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-sm border border-slate-100">
                                {filteredGames.length > 0 ? (
                                    <GameList 
                                        games={filteredGames} 
                                        onSelect={handleSelectGame} 
                                        activeId={activeGame.id}
                                        layout="grid"
                                    />
                                ) : (
                                    <div className="py-12 md:py-20 text-center">
                                        <div className="text-4xl md:text-5xl mb-4">🔍</div>
                                        <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-2">No games found</h4>
                                        <button 
                                            onClick={() => setSearchQuery('')}
                                            className="mt-4 text-blue-600 font-bold hover:underline"
                                        >
                                            View all games
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {view === 'games' && (
                    <div className="w-full">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-slate-800">Arcade Collection</h2>
                        
                        <div className="max-w-xl mx-auto mb-8 md:mb-10">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>

                        {filteredGames.length > 0 ? (
                            <GameList 
                                games={filteredGames} 
                                onSelect={handleSelectGame} 
                                activeId={activeGame.id}
                                layout="grid"
                            />
                        ) : (
                            <div className="py-20 text-center bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className="text-5xl mb-4">🔍</div>
                                <h4 className="text-xl font-bold text-slate-800 mb-2">No results found</h4>
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-all"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {view === 'about' && (
                    <div className="max-w-3xl mx-auto py-6 md:py-10">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800">About Play Arcade HQ</h2>
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                            <p className="text-base md:text-lg">
                                Welcome to Play Arcade HQ, the ultimate destination for family-friendly, high-performance HTML5 browser games.
                            </p>
                            <p>
                                Our mission is to provide the best unblocked games and arcade experiences that run smoothly on any device. We focus on speed, accessibility, and fun.
                            </p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-8">
                            <h3 className="font-bold text-blue-800 mb-2 italic">Why Play Here?</h3>
                            <ul className="list-disc list-inside text-blue-700 space-y-2 text-sm md:text-base">
                                <li>Instant play - Zero waiting time</li>
                                <li>Mobile-ready touch controls</li>
                                <li>Safe, clean gaming environment</li>
                                <li>Optimized for all connections</li>
                            </ul>
                        </div>
                    </div>
                )}

                {view === 'contact' && (
                    <div className="max-w-2xl mx-auto py-6 md:py-10 w-full">
                        <ContactForm />
                    </div>
                )}

                {(view === 'privacy' || view === 'terms' || view === 'cookies') && (
                    <LegalPage type={view} onBack={() => handleNavigate('home')} />
                )}
            </main>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default App;
