
import React, { useState, useEffect } from 'react';
import { Game } from '../types';

interface GameDisplayProps {
    game: Game;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ game }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [showInstructions, setShowInstructions] = useState(true);

    // Reset state when game changes
    useEffect(() => {
        setIsPaused(false);
        setShowInstructions(true);
    }, [game.id]);

    return (
        <div className="flex flex-col gap-4 md:gap-6">
            {/* Main Arcade Cabinet UI */}
            <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] md:border-[12px] border-slate-800 relative group">
                
                {/* Header / HUD - Persistent on mobile, Hover on desktop */}
                <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-30 px-4 md:px-6 flex items-center justify-between pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-xl md:text-2xl">{game.icon}</span>
                        <h2 className="text-white text-xs md:text-base font-black tracking-tighter uppercase italic truncate max-w-[120px] md:max-w-none">
                            {game.title}
                        </h2>
                    </div>
                    <div className="flex gap-2 md:gap-4 pointer-events-auto">
                         <button 
                            onClick={() => setIsSoundOn(!isSoundOn)}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all text-xs md:text-base"
                            title={isSoundOn ? "Mute Sound" : "Unmute Sound"}
                        >
                            {isSoundOn ? '🔊' : '🔇'}
                        </button>
                        <button 
                            onClick={() => setIsPaused(!isPaused)}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all text-xs md:text-base"
                        >
                            {isPaused ? '▶️' : '⏸️'}
                        </button>
                    </div>
                </div>

                {/* Game Canvas Container - Responsive Aspect Ratio */}
                <div className="aspect-square sm:aspect-video bg-slate-950 relative flex items-center justify-center overflow-hidden touch-none select-none outline-none group" tabIndex={0}>
                    <div className="w-full h-full flex items-center justify-center p-2 md:p-4">
                        <game.component isPaused={isPaused} isSoundOn={isSoundOn} />
                    </div>

                    {/* Overlay: Instructions on Start */}
                    {showInstructions && !isPaused && (
                        <div className="absolute inset-0 z-40 bg-slate-900/95 md:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-8 text-center animate-in fade-in duration-500">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl mb-4 md:mb-6 shadow-xl shadow-blue-500/20">
                                {game.icon}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">{game.title}</h2>
                            <p className="text-slate-400 max-w-sm mb-6 md:mb-8 text-xs md:text-sm leading-relaxed line-clamp-3 md:line-clamp-none">
                                {game.description}
                            </p>
                            <button 
                                onClick={() => setShowInstructions(false)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-lg shadow-blue-900/40 transition-all hover:scale-105 active:scale-95"
                            >
                                START PLAYING
                            </button>
                        </div>
                    )}

                    {/* Overlay: Pause Screen */}
                    {isPaused && (
                        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in zoom-in duration-300">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 md:mb-8 italic tracking-tighter">PAUSED</h2>
                            <button 
                                onClick={() => setIsPaused(false)}
                                className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
                            >
                                RESUME
                            </button>
                        </div>
                    )}
                </div>

                {/* Arcade Bottom Trim */}
                <div className="h-2 md:h-4 bg-slate-800 w-full" />
            </div>

            {/* Game Meta Content */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                <div className="md:col-span-2 space-y-4 md:space-y-6">
                    <section className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            <h3 className="text-lg md:text-xl font-bold text-slate-800">Overview</h3>
                        </div>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            {game.description}
                        </p>
                    </section>

                    <section className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                            <h3 className="text-lg md:text-xl font-bold text-slate-800">Controls</h3>
                        </div>
                        <div className="text-slate-600 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                {game.instructions.split('\n').map((line, idx) => (
                                    <div key={idx} className="flex gap-3 bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100 text-xs md:text-sm font-medium">
                                        <span className="text-blue-500 font-bold">0{idx + 1}</span>
                                        {line.replace('• ', '')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <section className="bg-blue-600 p-6 md:p-8 rounded-2xl md:rounded-[2rem] text-white shadow-xl shadow-blue-200">
                        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2">
                            <span>💡</span> Pro Tips
                        </h3>
                        <ul className="space-y-2 md:space-y-3 text-xs md:text-sm font-medium opacity-90">
                            <li>• Stay focused and watch the timer!</li>
                            <li>• Beat your personal high score.</li>
                            <li>• Share your results with friends!</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default GameDisplay;
