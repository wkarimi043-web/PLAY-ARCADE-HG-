
import React, { useState } from 'react';

interface HeaderProps {
    onNavigate: (view: 'home' | 'games' | 'about' | 'contact' | 'privacy' | 'terms' | 'cookies') => void;
    activeView: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activeView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNav = (view: any) => {
        onNavigate(view);
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div 
                    className="flex items-center gap-2 cursor-pointer" 
                    onClick={() => handleNav('home')}
                >
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200">
                        P
                    </div>
                    <span className="text-lg font-black tracking-tight text-slate-800">PLAY ARCADE HQ</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
                    <button 
                        onClick={() => handleNav('home')}
                        className={`hover:text-blue-600 transition-colors ${activeView === 'home' ? 'text-blue-600' : ''}`}
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => handleNav('games')}
                        className={`hover:text-blue-600 transition-colors ${activeView === 'games' ? 'text-blue-600' : ''}`}
                    >
                        All Games
                    </button>
                    <button 
                        onClick={() => handleNav('about')}
                        className={`hover:text-blue-600 transition-colors ${activeView === 'about' ? 'text-blue-600' : ''}`}
                    >
                        About
                    </button>
                    <button 
                        onClick={() => handleNav('contact')}
                        className="bg-slate-800 text-white px-5 py-2 rounded-full hover:bg-slate-700 transition-all shadow-md active:scale-95"
                    >
                        Contact
                    </button>
                </nav>

                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-50 bg-white animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col p-6 gap-2">
                        <button 
                            onClick={() => handleNav('home')}
                            className={`p-4 rounded-xl text-left font-bold ${activeView === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                        >
                            🏠 Home
                        </button>
                        <button 
                            onClick={() => handleNav('games')}
                            className={`p-4 rounded-xl text-left font-bold ${activeView === 'games' ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                        >
                            🎮 All Games
                        </button>
                        <button 
                            onClick={() => handleNav('about')}
                            className={`p-4 rounded-xl text-left font-bold ${activeView === 'about' ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                        >
                            ℹ️ About Us
                        </button>
                        <button 
                            onClick={() => handleNav('contact')}
                            className={`p-4 rounded-xl text-left font-bold ${activeView === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                        >
                            📧 Contact
                        </button>
                        <div className="h-px bg-slate-100 my-4" />
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <button onClick={() => handleNav('privacy')} className="text-xs text-slate-400 font-bold uppercase text-left">Privacy</button>
                            <button onClick={() => handleNav('terms')} className="text-xs text-slate-400 font-bold uppercase text-left">Terms</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
