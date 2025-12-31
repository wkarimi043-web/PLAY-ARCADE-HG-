
import React, { useState, useEffect, useRef } from 'react';

const WhackAMole: React.FC = () => {
    const [score, setScore] = useState(0);
    const [activeHole, setActiveHole] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameActive, setGameActive] = useState(false);
    const timerRef = useRef<any>(null);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setGameActive(true);
        nextMole();
    };

    const nextMole = () => {
        const randomHole = Math.floor(Math.random() * 9);
        setActiveHole(randomHole);
        const speed = Math.max(400, 1000 - (score * 10));
        timerRef.current = setTimeout(() => {
            setActiveHole(null);
            if (timeLeft > 0) setTimeout(nextMole, 200);
        }, speed);
    };

    useEffect(() => {
        let interval: any;
        if (gameActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setGameActive(false);
            setActiveHole(null);
        }
        return () => clearInterval(interval);
    }, [gameActive, timeLeft]);

    const whack = (idx: number) => {
        if (idx === activeHole) {
            setScore(s => s + 1);
            setActiveHole(null);
            clearTimeout(timerRef.current);
            setTimeout(nextMole, 50);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4">
            <div className="flex justify-between w-full max-w-xs text-white mb-6">
                <div className="font-black text-blue-400">SCORE: {score}</div>
                <div className="font-black text-red-400">TIME: {timeLeft}s</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {Array(9).fill(0).map((_, i) => (
                    <div key={i} className="relative w-20 h-20 md:w-24 md:h-24 bg-slate-800 rounded-full border-b-8 border-slate-700 overflow-hidden">
                        <button 
                            onClick={() => whack(i)}
                            className={`absolute inset-0 flex items-center justify-center text-4xl transition-all duration-100 ${
                                activeHole === i ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                            }`}
                        >
                            🐹
                        </button>
                    </div>
                ))}
            </div>

            {!gameActive && (
                <div className="mt-8 text-center">
                    {timeLeft === 0 && <p className="text-white text-xl font-bold mb-4">Final Score: {score}</p>}
                    <button onClick={startGame} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500">
                        {timeLeft === 0 ? 'Try Again' : 'Start Game'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default WhackAMole;
