
import React, { useState, useEffect, useRef } from 'react';

const Clicker: React.FC = () => {
    const [points, setPoints] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [cost, setCost] = useState(25);
    const [clicks, setClicks] = useState(0);
    const [floaters, setFloaters] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('clicker-pro-points');
        if (saved) setPoints(parseInt(saved));
    }, []);

    const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
        const value = multiplier;
        setPoints(p => {
            const next = p + value;
            localStorage.setItem('clicker-pro-points', next.toString());
            return next;
        });
        setClicks(c => c + 1);

        // Calculate click position for floating text
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            const newFloater = { id: Date.now(), x, y, value };
            setFloaters(prev => [...prev, newFloater]);
            setTimeout(() => {
                setFloaters(prev => prev.filter(f => f.id !== newFloater.id));
            }, 1000);
        }
    };

    const buyUpgrade = () => {
        if (points >= cost) {
            setPoints(p => p - cost);
            setMultiplier(m => m + 1);
            setCost(c => Math.floor(c * 1.8));
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-8 relative overflow-hidden select-none">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-6 gap-8">
                {Array(24).fill(0).map((_, i) => (
                    <div key={i} className="text-4xl">🍪</div>
                ))}
            </div>

            <div className="text-center mb-12 relative z-10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Arcade Tokens</p>
                <h2 className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                    {points.toLocaleString()}
                </h2>
                <div className="mt-4 flex gap-4 justify-center">
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-500/30">
                        POWER: x{multiplier}
                    </span>
                    <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold border border-slate-700">
                        TOTAL CLICKS: {clicks}
                    </span>
                </div>
            </div>

            <div className="relative group">
                {/* Floating Texts */}
                {floaters.map(f => (
                    <div 
                        key={f.id} 
                        className="absolute pointer-events-none text-blue-400 font-black text-2xl animate-out fade-out slide-out-to-top-20 duration-1000"
                        style={{ left: f.x - 20, top: f.y - 40 }}
                    >
                        +{f.value}
                    </div>
                ))}

                <button 
                    onMouseDown={handleClick}
                    onTouchStart={handleClick}
                    className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_20px_60px_rgba(30,64,175,0.4)] flex items-center justify-center text-8xl transform transition-all active:scale-90 hover:scale-105 group"
                >
                    <div className="absolute inset-0 rounded-full border-8 border-white/10 group-hover:border-white/20 transition-all" />
                    <span className="drop-shadow-xl animate-pulse group-active:animate-none">🍪</span>
                </button>
            </div>

            <div className="mt-16 w-full max-w-sm space-y-4 relative z-10">
                <button 
                    onClick={buyUpgrade}
                    disabled={points < cost}
                    className={`w-full p-6 rounded-[2rem] flex items-center justify-between transition-all group ${
                        points >= cost 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 active:scale-95' 
                        : 'bg-slate-800 text-slate-500 border border-slate-700 opacity-50 cursor-not-allowed'
                    }`}
                >
                    <div className="text-left">
                        <p className="font-black text-sm uppercase tracking-widest">Upgrade Production</p>
                        <p className="text-xs font-bold opacity-70">Requires {cost.toLocaleString()} tokens</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${points >= cost ? 'bg-white/20' : 'bg-slate-900'}`}>
                        ⚡
                    </div>
                </button>
                
                <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    Tip: Higher multiplier gives more tokens per click
                </p>
            </div>
        </div>
    );
};

export default Clicker;
