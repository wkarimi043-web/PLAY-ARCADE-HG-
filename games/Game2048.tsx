
import React, { useState, useEffect, useCallback } from 'react';

const Game2048: React.FC = () => {
    const [grid, setGrid] = useState<number[][]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const addRandom = useCallback((g: number[][]) => {
        let empty = [];
        for(let r=0; r<4; r++) for(let c=0; c<4; c++) if(g[r][c] === 0) empty.push({r, c});
        if(empty.length) {
            const {r, c} = empty[Math.floor(Math.random() * empty.length)];
            g[r][c] = Math.random() > 0.1 ? 2 : 4;
            return true;
        }
        return false;
    }, []);

    const init = useCallback(() => {
        let newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
        addRandom(newGrid);
        addRandom(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
    }, [addRandom]);

    const move = useCallback((dir: string) => {
        setGrid(prev => {
            let next = prev.map(r => [...r]);
            let moved = false;
            let currentScore = 0;

            const rotateGrid = (g: number[][]) => {
                return g[0].map((_, i) => g.map(row => row[i]).reverse());
            };

            // Normalize move to left
            let rotations = 0;
            if (dir === 'up') rotations = 3;
            if (dir === 'right') rotations = 2;
            if (dir === 'down') rotations = 1;

            for (let i = 0; i < rotations; i++) next = rotateGrid(next);

            // Logic for moving left
            for (let r = 0; r < 4; r++) {
                let row = next[r].filter(v => v !== 0);
                for (let c = 0; c < row.length - 1; c++) {
                    if (row[c] === row[c+1]) {
                        row[c] *= 2;
                        currentScore += row[c];
                        row.splice(c + 1, 1);
                        moved = true;
                    }
                }
                const newRow = row.concat(Array(4 - row.length).fill(0));
                if (JSON.stringify(next[r]) !== JSON.stringify(newRow)) moved = true;
                next[r] = newRow;
            }

            // Rotate back
            for (let i = 0; i < (4 - rotations) % 4; i++) next = rotateGrid(next);

            if (moved) {
                addRandom(next);
                setScore(s => s + currentScore);
            }
            
            return next;
        });
    }, [addRandom]);

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (gameOver) return;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                move(e.key.replace('Arrow', '').toLowerCase());
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [move, gameOver]);

    const getTileColor = (val: number) => {
        switch(val) {
            case 2: return 'bg-slate-200 text-slate-800';
            case 4: return 'bg-slate-100 text-slate-800';
            case 8: return 'bg-orange-200 text-slate-800';
            case 16: return 'bg-orange-300 text-white';
            case 32: return 'bg-orange-400 text-white';
            case 64: return 'bg-orange-500 text-white';
            case 128: return 'bg-yellow-200 text-slate-800 shadow-[0_0_10px_rgba(255,255,0,0.5)]';
            case 256: return 'bg-yellow-300 text-slate-800 shadow-[0_0_15px_rgba(255,255,0,0.6)]';
            case 512: return 'bg-yellow-400 text-white';
            case 1024: return 'bg-yellow-500 text-white';
            case 2048: return 'bg-emerald-500 text-white animate-pulse';
            default: return 'bg-slate-700';
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4">
            <div className="flex justify-between w-full max-w-xs text-white mb-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter">2048</h2>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400">Join the numbers</p>
                </div>
                <div className="text-right">
                    <div className="bg-slate-800 px-4 py-1 rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold">SCORE</p>
                        <p className="text-xl font-black text-blue-400">{score}</p>
                    </div>
                    <button onClick={init} className="mt-2 text-xs text-blue-400 hover:underline">New Game</button>
                </div>
            </div>

            <div className="relative bg-slate-800 p-3 rounded-2xl shadow-2xl border-4 border-slate-700">
                <div className="grid grid-cols-4 gap-3">
                    {grid.length > 0 && grid.map((row, r) => row.map((val, c) => (
                        <div key={`${r}-${c}`} className={`w-14 h-14 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-xl md:text-3xl font-black transition-all duration-100 transform ${getTileColor(val)} ${val !== 0 ? 'scale-100 shadow-lg' : 'scale-100 opacity-20'}`}>
                            {val !== 0 ? val : ''}
                        </div>
                    )))}
                </div>

                {gameOver && (
                    <div className="absolute inset-0 bg-slate-900/80 rounded-xl flex flex-col items-center justify-center text-center p-4">
                        <h3 className="text-2xl font-black text-white mb-2">GAME OVER</h3>
                        <button onClick={init} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">Try Again</button>
                    </div>
                )}
            </div>

            <div className="mt-8 md:hidden grid grid-cols-3 gap-2">
                <div />
                <button onClick={() => move('up')} className="bg-slate-700 p-4 rounded-xl text-white">↑</button>
                <div />
                <button onClick={() => move('left')} className="bg-slate-700 p-4 rounded-xl text-white">←</button>
                <button onClick={() => move('down')} className="bg-slate-700 p-4 rounded-xl text-white">↓</button>
                <button onClick={() => move('right')} className="bg-slate-700 p-4 rounded-xl text-white">→</button>
            </div>
            
            <p className="hidden md:block text-slate-500 text-xs mt-6 font-medium">Use your <span className="text-slate-300">Arrow Keys</span> to join the tiles!</p>
        </div>
    );
};

export default Game2048;
