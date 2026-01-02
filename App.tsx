import React, { useState, useMemo, useEffect } from 'react';
import { Game } from './types.ts';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import GameList from './components/GameList.tsx';
import GameDisplay from './components/GameDisplay.tsx';
import ContactForm from './components/ContactForm.tsx';
import LegalPage from './components/LegalPage.tsx';
import SearchBar from './components/SearchBar.tsx';
import { GAMES_REGISTRY } from './games/Registry.ts';

type ViewType = 'home' | 'games' | 'about' | 'contact' | 'privacy' | 'terms' | 'cookies';

const App: React.FC = () => {
    const [activeGame, setActiveGame] = useState<Game>(GAMES_REGISTRY[0]); 
    const [view, setView] = useState<ViewType>('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                setScrollProgress((window.scrollY / totalHeight) * 100);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSelectGame = (game: Game) => {
        setActiveGame(game);
        setView('home');
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
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
        <div id="play-arcade-hq-inner-root" className="min-h-screen flex flex-col bg-gray-50 text-slate-800 transition-colors duration-500 overflow-x-hidden no-select">
            {/* Scroll Progress Bar */}
            <div 
                className="fixed top-0 left-0 h-[2px] md:h-1 bg-blue-600 z-[70] transition-all duration-150 ease-out pointer-events-none" 
                style={{ width: `${scrollProgress}%` }}
            />

            <Header onNavigate={handleNavigate} activeView={view} />
            
            <main className="flex-grow container mx-auto px-3 md:px-4 py-4 md:py-8">
                {view === 'home' && (
                    <div className="flex flex-col gap-6 md:gap-12 animate-in fade-in duration-700 slide-in-from-bottom-2">
                        <section className="max-w-5xl mx-auto w-full reveal-item">
                            <div className="flex items-center justify-between mb-2 md:mb-3 px-1">
                                <h2 className="text-[9px] md:text-sm font-bold uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                                    Live Arcade
                                </h2>
                                <span className="text-[9px] md:text-xs text-slate-400 font-medium truncate ml-2">Playing: {activeGame.title}</span>
                            </div>
                            <GameDisplay game={activeGame} />
                        </section>

                        <section className="w-full reveal-item stagger-1" id="game-list-section">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 md:mb-6">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className="w-1 h-5 md:h-8 bg-blue-500 rounded-full"></span>
                                    <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">
                                        Collection
                                    </h3>
                                </div>
                                <div className="w-full md:w-auto md:min-w-[320px]">
                                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl md:rounded-[2rem] p-3 md:p-8 shadow-sm border border-slate-100 transition-all duration-300">
                                {filteredGames.length > 0 ? (
                                    <GameList 
                                        games={filteredGames} 
                                        onSelect={handleSelectGame} 
                                        activeId={activeGame.id}
                                        layout="grid"
                                    />
                                ) : (
                                    <div className="py-10 md:py-20 text-center">
                                        <div className="text-3xl md:text-5xl mb-3">🔍</div>
                                        <h4 className="text-base md:text-xl font-bold text-slate-800 mb-2">No games found</h4>
                                        <button 
                                            onClick={() => setSearchQuery('')}
                                            className="text-xs md:text-sm text-blue-600 font-bold hover:underline"
                                        >
                                            Browse all titles
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {view === 'games' && (
                    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl md:text-3xl font-black mb-4 md:mb-8 text-center text-slate-800 italic uppercase">All Games</h2>
                        <div className="max-w-xl mx-auto mb-6 md:mb-10">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>
                        <div className="reveal-item">
                            <GameList 
                                games={filteredGames} 
                                onSelect={handleSelectGame} 
                                activeId={activeGame.id}
                                layout="grid"
                            />
                        </div>
                    </div>
                )}

                {view === 'about' && (
                    <div className="max-w-3xl mx-auto py-4 md:py-10 animate-in fade-in duration-500">
                        <h2 className="text-xl md:text-3xl font-black mb-4 md:mb-6 text-slate-800 uppercase italic">About Us</h2>
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-3 md:space-y-4 reveal-item">
                            <p className="text-sm md:text-lg leading-relaxed">
                                Play Arcade HQ is a dedicated gaming hub for instant-play HTML5 browser games. No installation, no updates, just gaming.
                            </p>
                            <p className="text-xs md:text-base leading-relaxed">
                                Our platform is built for speed and compatibility, ensuring a smooth experience across mobile, tablet, and desktop environments.
                            </p>
                        </div>
                    </div>
                )}

                {view === 'contact' && (
                    <div className="max-w-2xl mx-auto py-4 md:py-10 w-full animate-in fade-in duration-500">
                        <ContactForm />
                    </div>
                )}

                {(view === 'privacy' || view === 'terms' || view === 'cookies') && (
                    <div className="animate-in fade-in duration-500">
                        <LegalPage type={view} onBack={() => handleNavigate('home')} />
                    </div>
                )}
            </main>

            <Footer onNavigate={handleNavigate} />

            {/* Floating Back to Top - Optimized for mobile tap */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 z-50 p-4 md:p-4 bg-blue-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 ${
                    showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
                aria-label="Back to Top"
            >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </div>
    );
};

export default App;