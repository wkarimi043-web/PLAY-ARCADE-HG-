
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MathPuzzle: React.FC = () => {
    const [problem, setProblem] = useState({ q: '', a: 0 });
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameActive, setGameActive] = useState(false);
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
    const inputRef = useRef<HTMLInputElement>(null);

    const generateProblem = useCallback(() => {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let n1 = 0, n2 = 0, ans = 0;

        if (op === '+') {
            n1 = Math.floor(Math.random() * 50) + 1;
            n2 = Math.floor(Math.random() * 50) + 1;
            ans = n1 + n2;
        } else if (op === '-') {
            n1 = Math.floor(Math.random() * 50) + 20;
            n2 = Math.floor(Math.random() * n1) + 1;
            ans = n1 - n2;
        } else if (op === '*') {
            n1 = Math.floor(Math.random() * 12) + 2;
            n2 = Math.floor(Math.random() * 10) + 1;
            ans = n1 * n2;
        }

        setProblem({ q: `${n1} ${op} ${n2}`, a: ans });
        setUserInput('');
    }, []);

    useEffect(() => {
        if (gameActive && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameActive, timeLeft]);

    // Handle input change with auto-check
    const handleInputChange = (val: string) => {
        setUserInput(val);
        
        // Convert to number for comparison
        const numVal = parseInt(val);
        
        if (!isNaN(numVal) && numVal === problem.a) {
            // Correct Answer!
            setScore(s => s + 1);
            setFeedback('correct');
            setTimeout(() => setFeedback('none'), 300);
            generateProblem();
        }
    };

    const start = () => {
        setScore(0);
        setTimeLeft(60);
        setGameActive(true);
        setFeedback('none');
        generateProblem();
        // Focus input after a short delay to ensure DOM is ready
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    // Prevent scrolling
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', ' '].includes(e.key) && gameActive) {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [gameActive]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-6 text-white select-none touch-none">
            {!gameActive ? (
                <div className="text-center animate-in zoom-in duration-500">
                    <div className="text-7xl mb-6">🧮</div>
                    <h2 className="text-4xl font-black mb-2 italic tracking-tighter uppercase text-blue-400">MATH BLITZ</h2>
                    <p className="text-slate-400 mb-8 max-w-xs mx-auto">Solve as many as you can in 60 seconds. No need to press Enter!</p>
                    
                    {timeLeft === 0 && (
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Session Score</p>
                            <p className="text-5xl font-black text-white">{score}</p>
                        </div>
                    )}
                    
                    <button 
                        onClick={start} 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95"
                    >
                        {timeLeft === 0 ? 'PLAY AGAIN' : 'START CHALLENGE'}
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md text-center animate-in fade-in duration-300">
                    <div className="flex justify-between mb-12">
                        <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                            <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-tighter">Score</span>
                            <span className="text-2xl font-black text-blue-400">{score}</span>
                        </div>
                        <div className={`bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 ${timeLeft <= 10 ? 'border-red-500 animate-pulse' : ''}`}>
                            <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-tighter">Time Left</span>
                            <span className={`text-2xl font-black ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
                        </div>
                    </div>

                    <div className={`transition-all duration-200 transform ${feedback === 'correct' ? 'scale-110 text-emerald-400' : 'scale-100'}`}>
                        <div className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Calculate This</div>
                        <div className="text-7xl font-black mb-12 tracking-tighter drop-shadow-2xl">
                            {problem.q} = ?
                        </div>
                    </div>

                    <div className="relative group">
                        <input 
                            ref={inputRef}
                            type="number" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={userInput}
                            onChange={(e) => handleInputChange(e.target.value)}
                            className={`w-full bg-slate-800 border-4 rounded-3xl p-6 text-center text-5xl font-black focus:outline-none transition-all ${
                                feedback === 'correct' ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-700 focus:border-blue-500'
                            }`}
                            placeholder="???"
                        />
                        {feedback === 'correct' && (
                            <div className="absolute -top-4 -right-4 bg-emerald-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl animate-bounce shadow-lg">
                                ✓
                            </div>
                        )}
                    </div>
                    
                    <p className="mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-60">
                        Type the answer to proceed instantly
                    </p>
                </div>
            )}
        </div>
    );
};

export default MathPuzzle;
