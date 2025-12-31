
import React, { useState, useEffect } from 'react';

const BalloonPop: React.FC = () => {
    const [score, setScore] = useState(0);
    const [balloons, setBalloons] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBalloons(prev => [
                ...prev,
                { id: Date.now(), x: Math.random() * 80 + 10, y: 110, color: `hsl(${Math.random() * 360}, 70%, 60%)` }
            ]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const move = setInterval(() => {
            setBalloons(prev => prev.map(b => ({ ...b, y: b.y - 1 })).filter(b => b.y > -20));
        }, 20);
        return () => clearInterval(move);
    }, []);

    const pop = (id: number) => {
        setScore(s => s + 1);
        setBalloons(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div className="w-full h-full bg-sky-400 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-4 left-4 z-20 text-white font-black drop-shadow-md text-2xl">SCORE: {score}</div>
            {balloons.map(b => (
                <button 
                    key={b.id}
                    onClick={() => pop(b.id)}
                    className="absolute w-12 h-16 rounded-[50%] flex items-center justify-center cursor-pointer transition-transform active:scale-150"
                    style={{ left: `${b.x}%`, top: `${b.y}%`, backgroundColor: b.color }}
                >
                    <div className="w-0.5 h-10 bg-white/30 absolute -bottom-8 left-1/2"></div>
                </button>
            ))}
        </div>
    );
};

export default BalloonPop;
