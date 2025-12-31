
import React, { useState, useEffect, useCallback } from 'react';

const COLORS = [
    { name: 'RED', hex: '#ef4444', border: 'border-red-500', text: 'text-red-500' },
    { name: 'BLUE', hex: '#3b82f6', border: 'border-blue-500', text: 'text-blue-500' },
    { name: 'GREEN', hex: '#10b981', border: 'border-green-500', text: 'text-green-500' },
    { name: 'YELLOW', hex: '#eab308', border: 'border-yellow-500', text: 'text-yellow-500' },
    { name: 'PURPLE', hex: '#a855f7', border: 'border-purple-500', text: 'text-purple-500' },
    { name: 'ORANGE', hex: '#f97316', border: 'border-orange-500', text: 'text-orange-500' }
];

const ColorMatch: React.FC = () => {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [current, setCurrent] = useState({ name: '', color: '', isMatch: false });
    const [gameActive, setGameActive] = useState(false);
    const [gameOverReason, setGameOverReason] = useState<'time' | 'mistake' | null>(null);
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

    const nextRound = useCallback(() => {
        const nameIdx = Math.floor(Math.random() * COLORS.length);
        const colorIdx = Math.floor(Math.random() * COLORS.length);
        const isMatch = Math.random() > 0.4; // 40% chance of a real match
        
        const actualColorIdx = isMatch ? nameIdx : colorIdx;
        
        // Final sanity check for isMatch
        const reallyMatch = nameIdx === actualColorIdx;

        setCurrent({ 
            name: COLORS[nameIdx].name, 
            color: COLORS[actualColorIdx].hex,
            isMatch: reallyMatch
        });
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('colormatch-highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    useEffect(() => {
        if (gameActive && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameActive(false);
                        setGameOverReason('time');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameActive, timeLeft]);

    const handleChoice = (choice: boolean) => {
        if (!gameActive) return;

        if (choice === current.isMatch) {
            const points = 10 + (streak * 2);
            setScore(s => s + points);
            setStreak(s => s + 1);
            setFeedback('correct');
            // Add a little time back for correct answers to keep the pace up
            setTimeLeft(t => Math.min(30, t + 1));
            setTimeout(() => setFeedback('none'), 200);
            nextRound();
        } else {
            // Instant Game Over on mistake
            setStreak(0);
            setFeedback('wrong');
            setGameActive(false);
            setGameOverReason('mistake');
        }
    };

    const start = () => {
        setScore(0);
        setStreak(0);
        setTimeLeft(20);
        setGameActive(true);
        setGameOverReason(null);
        setFeedback('none');
        nextRound();
    };

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('colormatch-highscore', score.toString());
        }
    }, [score, highScore]);

    return (
        <div className={`w-full h-full flex flex-col items-center justify-center transition-colors duration-200 p-6 select-none touch-none ${
            feedback === 'correct' ? 'bg-emerald-950/30' : 
            feedback === 'wrong' ? 'bg-red-950/30' : 'bg-slate-900'
        }`}>
            {!gameActive ? (
                <div className="text-center animate-in zoom-in duration-500">
                    <div className="text-7xl mb-6">
                        {gameOverReason === 'mistake' ? '💥' : gameOverReason === 'time' ? '⏰' : '👁️‍🗨️'}
                    </div>
                    <h2 className="text-4xl font-black mb-2 italic tracking-tighter uppercase text-white">
                        {gameOverReason === 'mistake' ? 'GAME OVER!' : 'STROOP TEST'}
                    </h2>
                    
                    {gameOverReason === 'mistake' ? (
                        <p className="text-red-400 font-bold mb-8 uppercase tracking-widest animate-pulse">
                            You chose wrong!
                        </p>
                    ) : (
                        <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm">
                            Does the <span className="text-white font-bold underline decoration-blue-500">WORD</span> match the <span className="text-white font-bold underline decoration-emerald-500">COLOR</span> of the text?
                        </p>
                    )}
                    
                    {(gameOverReason !== null) && (
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8 flex gap-8 justify-center">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Score</p>
                                <p className="text-3xl font-black text-white">{score}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">High Score</p>
                                <p className="text-3xl font-black text-amber-400">{highScore}</p>
                            </div>
                        </div>
                    )}
                    
                    <button 
                        onClick={start} 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95"
                    >
                        {gameOverReason !== null ? 'RETRY CHALLENGE' : 'START TEST'}
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md text-center animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-12">
                        <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 min-w-[80px]">
                            <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-tighter">Score</span>
                            <span className="text-xl font-black text-blue-400">{score}</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <div className={`text-xs font-bold uppercase tracking-[0.3em] transition-all duration-300 ${streak > 0 ? 'text-amber-400 opacity-100 scale-110' : 'text-slate-600 opacity-0'}`}>
                                {streak} Streak!
                            </div>
                        </div>

                        <div className={`bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 min-w-[80px] ${timeLeft <= 5 ? 'border-red-500 animate-pulse' : ''}`}>
                            <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-tighter">Time</span>
                            <span className={`text-xl font-black ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 p-12 rounded-[3rem] border border-white/5 mb-12 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <h2 
                            className={`text-7xl md:text-8xl font-black tracking-tighter transition-transform duration-150 ${
                                feedback !== 'none' ? 'scale-110' : 'scale-100'
                            }`} 
                            style={{ color: current.color }}
                        >
                            {current.name}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 px-4">
                        <button 
                            onClick={() => handleChoice(true)} 
                            className="group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white p-6 rounded-3xl font-black text-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-90"
                        >
                            <span className="relative z-10">YES</span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button 
                            onClick={() => handleChoice(false)} 
                            className="group relative overflow-hidden bg-red-600 hover:bg-red-500 text-white p-6 rounded-3xl font-black text-2xl shadow-xl shadow-red-900/20 transition-all active:scale-90"
                        >
                            <span className="relative z-10">NO</span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                    
                    <p className="mt-12 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                        Rapid Reaction Required • Don't Miss!
                    </p>
                </div>
            )}
        </div>
    );
};

export default ColorMatch;
