
import React, { useState, useEffect, useCallback } from 'react';

const SIZE = 15; // Must be odd for the generator

const Maze: React.FC = () => {
    const [maze, setMaze] = useState<number[][]>([]);
    const [player, setPlayer] = useState({ x: 1, y: 1 });
    const [won, setWon] = useState(false);
    const [started, setStarted] = useState(false);

    const generateMaze = useCallback(() => {
        const newMaze = Array(SIZE).fill(0).map(() => Array(SIZE).fill(1));
        
        const walk = (x: number, y: number) => {
            newMaze[y][x] = 0;
            const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]].sort(() => Math.random() - 0.5);
            for (const [dx, dy] of dirs) {
                const nx = x + dx, ny = y + dy;
                if (nx > 0 && nx < SIZE - 1 && ny > 0 && ny < SIZE - 1 && newMaze[ny][nx] === 1) {
                    newMaze[y + dy / 2][x + dx / 2] = 0;
                    walk(nx, ny);
                }
            }
        };
        
        walk(1, 1);
        // Ensure entrance and exit are clear
        newMaze[1][1] = 0;
        newMaze[SIZE - 2][SIZE - 2] = 0; 
        
        setMaze(newMaze);
        setPlayer({ x: 1, y: 1 });
        setWon(false);
        setStarted(true);
    }, []);

    useEffect(() => {
        generateMaze();
    }, [generateMaze]);

    const movePlayer = useCallback((dx: number, dy: number) => {
        if (won || !started) return;

        setPlayer(prev => {
            const newX = prev.x + dx;
            const newY = prev.y + dy;

            // Collision check
            if (newX >= 0 && newX < SIZE && newY >= 0 && newY < SIZE && maze[newY][newX] === 0) {
                if (newX === SIZE - 2 && newY === SIZE - 2) {
                    setWon(true);
                }
                return { x: newX, y: newY };
            }
            return prev;
        });
    }, [maze, won, started]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'w', 'W'].includes(e.key)) movePlayer(0, -1);
            if (['ArrowDown', 's', 'S'].includes(e.key)) movePlayer(0, 1);
            if (['ArrowLeft', 'a', 'A'].includes(e.key)) movePlayer(-1, 0);
            if (['ArrowRight', 'd', 'D'].includes(e.key)) movePlayer(1, 0);
            
            // Prevent scrolling with arrows
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 select-none touch-none">
            <div className="mb-4 flex flex-col items-center">
                <h2 className="text-2xl font-black text-white italic tracking-tighter">MAZE RUNNER</h2>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em]">Find the way out</p>
            </div>

            <div className="relative bg-slate-800 p-2 rounded-2xl border-4 border-slate-700 shadow-2xl">
                <div 
                    className="grid gap-px bg-slate-700"
                    style={{ 
                        gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
                        width: 'min(85vw, 350px)',
                        aspectRatio: '1/1'
                    }}
                >
                    {maze.map((row, y) => row.map((cell, x) => {
                        const isPlayer = player.x === x && player.y === y;
                        const isExit = x === SIZE - 2 && y === SIZE - 2;
                        
                        return (
                            <div 
                                key={`${x}-${y}`} 
                                className={`relative flex items-center justify-center transition-colors duration-200 ${
                                    cell === 1 ? 'bg-slate-900' : 'bg-slate-100/5'
                                }`}
                            >
                                {isExit && (
                                    <span className="text-sm md:text-lg animate-pulse z-0">🏁</span>
                                )}
                                {isPlayer && (
                                    <div className="w-4/5 h-4/5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10 animate-in zoom-in duration-200">
                                        <div className="w-full h-full bg-white/20 rounded-full animate-ping" />
                                    </div>
                                )}
                            </div>
                        );
                    }))}
                </div>

                {won && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm rounded-xl animate-in fade-in duration-500">
                        <div className="text-5xl mb-4">🏆</div>
                        <h2 className="text-3xl font-black text-white mb-2 italic">ESCAPED!</h2>
                        <p className="text-slate-400 mb-6 text-sm">You found the exit in record time.</p>
                        <button 
                            onClick={generateMaze} 
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900 transition-all active:scale-95"
                        >
                            PLAY AGAIN
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Controls */}
            <div className="mt-8 grid grid-cols-3 gap-3 md:hidden">
                <div />
                <button onClick={() => movePlayer(0, -1)} className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg active:bg-blue-600 transition-colors">↑</button>
                <div />
                <button onClick={() => movePlayer(-1, 0)} className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg active:bg-blue-600 transition-colors">←</button>
                <button onClick={() => movePlayer(0, 1)} className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg active:bg-blue-600 transition-colors">↓</button>
                <button onClick={() => movePlayer(1, 0)} className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg active:bg-blue-600 transition-colors">→</button>
            </div>

            <p className="hidden md:block mt-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Use <span className="text-slate-300">Arrow Keys</span> or <span className="text-slate-300">WASD</span> to explore
            </p>
        </div>
    );
};

export default Maze;
