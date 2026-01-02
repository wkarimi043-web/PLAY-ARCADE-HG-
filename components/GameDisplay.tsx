import React, { useState, useEffect } from 'react';
import { Game } from '../types.ts';

interface GameDisplayProps {
    game: Game;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ game }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [showInstructions, setShowInstructions] = useState(true);
    const [isTheaterMode, setIsTheaterMode] = useState(false);

    // Reset state when game changes
    useEffect(() => {
        setIsPaused(false);
        setShowInstructions(true);
    }, [game.id]);

    return (
        <div className={`flex flex-col gap-4 md:gap-10 ${isTheaterMode ? 'fixed inset-0 z-[100] bg-black p-0' : 'relative'}`}>
            {/* Theater Mode Toggle for Mobile */}
            <button 
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className={`md:hidden absolute top-4 left-4 z-[110] w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all ${isTheaterMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                ✕
            </button>

            {/* Main Arcade Cabinet UI */}
            <div className={`bg-slate-900 shadow-2xl overflow-hidden border-slate-800 relative group transition-all duration-500
                ${isTheaterMode ? 'h-full w-full rounded-0 border-0' : 'rounded-2xl md:rounded-[2.5rem] border-[4px] md:border-[12px]'}
            `}>
                
                {/* Header / HUD - Compact on mobile */}
                <div className="absolute top-0 inset-x-0 h-12 md:h-16 bg-gradient-to-b from-black/90 to-transparent z-30 px-3 md:px-6 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                        <span className="text-lg md:text-2xl">{game.icon}</span>
                        <h2 className="text-white text-[10px] md:text-base font-black tracking-tighter uppercase italic truncate max-w-[100px] md:max-w-none">
                            {game.title}
                        </h2>
                    </div>
                    <div className="flex gap-2 pointer-events-auto">
                        <button 
                            onClick={() => setIsSoundOn(!isSoundOn)}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all text-xs"
                            title={isSoundOn ? "Mute" : "Unmute"}
                        >
                            {isSoundOn ? '🔊' : '🔇'}
                        </button>
                        <button 
                            onClick={() => setIsPaused(!isPaused)}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all text-xs"
                        >
                            {isPaused ? '▶️' : '⏸️'}
                        </button>
                        {!isTheaterMode && (
                            <button 
                                onClick={() => setIsTheaterMode(true)}
                                className="md:hidden w-8 h-8 rounded-lg bg-blue-600/80 flex items-center justify-center text-white text-xs"
                            >
                                ⛶
                            </button>
                        )}
                    </div>
                </div>

                {/* Game Canvas Container - Adjust aspect ratio for mobile */}
                <div className={`bg-slate-950 relative flex items-center justify-center overflow-hidden touch-none select-none outline-none no-select
                    ${isTheaterMode ? 'h-full w-full' : 'aspect-square sm:aspect-video'}
                `} tabIndex={0}>
                    <div className="w-full h-full flex items-center justify-center p-1 md:p-4 game-canvas-container">
                        <game.component isPaused={isPaused} isSoundOn={isSoundOn} />
                    </div>

                    {/* Overlay: Instructions on Start */}
                    {showInstructions && !isPaused && (
                        <div className="absolute inset-0 z-40 bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 text-center animate-in fade-in duration-500">
                            <div className="w-12 h-12 md:w-20 md:h-20 bg-blue-600 rounded-xl md:rounded-3xl flex items-center justify-center text-2xl md:text-4xl mb-3 md:mb-6 shadow-xl shadow-blue-500/20">
                                {game.icon}
                            </div>
                            <h2 className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2 italic tracking-tighter uppercase">{game.title}</h2>
                            <p className="text-slate-400 max-w-[260px] md:max-w-sm mb-6 md:mb-8 text-[10px] md:text-sm leading-relaxed">
                                {game.description}
                            </p>
                            <button 
                                onClick={() => setShowInstructions(false)}
                                className="bg-blue-600 hover:bg-blue-500 text-white w-full max-w-[200px] md:max-w-none md:w-auto px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95"
                            >
                                PLAY NOW
                            </button>
                            <p className="mt-4 text-[9px] text-slate-500 uppercase tracking-widest font-bold md:hidden">Supports Touch & Keyboard</p>
                        </div>
                    )}

                    {/* Overlay: Pause Screen */}
                    {isPaused && (
                        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in zoom-in duration-300">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 italic tracking-tighter">PAUSED</h2>
                            <button 
                                onClick={() => setIsPaused(false)}
                                className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
                            >
                                RESUME
                            </button>
                        </div>
                    )}
                </div>

                {/* Arcade Bottom Trim - Hidden in Theater Mode */}
                {!isTheaterMode && <div className="h-1 md:h-4 bg-slate-800 w-full" />}
            </div>

            {/* Content below the game - only show if not in theater mode */}
            {!isTheaterMode && (
                <article className="grid md:grid-cols-3 gap-4 md:gap-10">
                    <div className="md:col-span-2 space-y-4 md:space-y-8">
                        {/* Compact Guide for Mobile */}
                        <section className="bg-white p-5 md:p-10 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 md:mb-6">
                                <div className="w-1 h-6 md:w-1.5 md:h-8 bg-blue-500 rounded-full" />
                                <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">Game Guide</h3>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 text-sm md:text-lg leading-relaxed">
                                    {game.seoData?.longDescription || game.description}
                                </p>
                            </div>

                            {game.seoData?.features && (
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
                                    {game.seoData.features.slice(0, 4).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                            <span className="text-blue-500 text-xs">✦</span>
                                            <span className="text-[10px] md:text-sm font-bold text-slate-700 truncate">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Instructions - Stacked on Mobile */}
                        <section className="bg-white p-5 md:p-10 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 md:mb-6">
                                <div className="w-1 h-6 md:w-1.5 md:h-8 bg-emerald-500 rounded-full" />
                                <h3 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">Controls</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {game.instructions.split('\n').map((line, idx) => (
                                    <div key={idx} className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 items-center">
                                        <span className="flex-shrink-0 w-6 h-6 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-black text-blue-600 text-[10px] shadow-sm">
                                            {idx + 1}
                                        </span>
                                        <p className="text-slate-600 text-[11px] md:text-sm font-medium">
                                            {line.replace('• ', '')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info - Hidden/Simplified on small screens */}
                    <aside className="space-y-4">
                        <section className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 md:p-8 rounded-2xl md:rounded-[2rem] text-white shadow-xl">
                            <h3 className="text-sm md:text-lg font-black mb-4 flex items-center gap-2 italic uppercase tracking-tighter">
                                <span>🎮</span> Game Info
                            </h3>
                            <div className="space-y-3 text-[11px] md:text-sm">
                                <div className="flex justify-between items-center py-1 border-b border-white/10">
                                    <span className="font-bold opacity-70 uppercase tracking-widest text-[9px]">Type</span>
                                    <span className="font-black">{game.category}</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-white/10">
                                    <span className="font-bold opacity-70 uppercase tracking-widest text-[9px]">Status</span>
                                    <span className="font-black text-emerald-300">Unblocked</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="font-bold opacity-70 uppercase tracking-widest text-[9px]">User Rating</span>
                                    <span className="font-black">5.0 ★</span>
                                </div>
                            </div>
                        </section>

                        <div className="hidden md:block bg-amber-50 border border-amber-100 p-6 rounded-[2rem]">
                            <h4 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
                                <span>💡</span> Pro Tip
                            </h4>
                            <p className="text-amber-700 text-xs leading-relaxed font-medium">
                                This game is optimized for performance. Use full-screen mode on mobile for the best experience!
                            </p>
                        </div>
                    </aside>
                </article>
            )}
        </div>
    );
};

export default GameDisplay;