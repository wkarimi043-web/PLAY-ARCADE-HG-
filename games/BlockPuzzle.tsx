
import React, { useState, useEffect, useRef } from 'react';

const COLS = 10;
const ROWS = 20;
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // J
    [[0, 0, 1], [1, 1, 1]], // L
];

const COLORS = [
    '#60a5fa', // Blue (I)
    '#fbbf24', // Amber (O)
    '#a78bfa', // Purple (T)
    '#4ade80', // Green (S)
    '#f87171', // Red (Z)
    '#38bdf8', // Sky (J)
    '#fb923c'  // Orange (L)
];

const BlockPuzzle: React.FC = () => {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);
    const [nextPieceIdx, setNextPieceIdx] = useState(0);

    const stateRef = useRef({
        grid: Array(ROWS).fill(0).map(() => Array(COLS).fill(0)),
        pos: { x: 4, y: 0 },
        activeShape: SHAPES[0],
        colorIdx: 0,
        nextIdx: Math.floor(Math.random() * SHAPES.length),
        lastTick: 0,
        dropInterval: 800,
        frame: 0
    });

    useEffect(() => {
        const saved = localStorage.getItem('block-puzzle-high-score');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const collide = (xOffset: number, yOffset: number, shape = stateRef.current.activeShape, position = stateRef.current.pos) => {
        const { grid } = stateRef.current;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const newX = position.x + x + xOffset;
                    const newY = position.y + y + yOffset;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const merge = () => {
        const { grid, pos, activeShape, colorIdx } = stateRef.current;
        activeShape.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val && pos.y + y >= 0) {
                    grid[pos.y + y][pos.x + x] = colorIdx + 1;
                }
            });
        });
    };

    const clearLines = () => {
        const { grid } = stateRef.current;
        let linesCleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (grid[y].every(cell => cell !== 0)) {
                grid.splice(y, 1);
                grid.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++;
            }
        }
        if (linesCleared > 0) {
            const points = [0, 100, 300, 500, 800][linesCleared] * level;
            setScore(prev => {
                const newScore = prev + points;
                if (newScore > highScore) {
                    setHighScore(newScore);
                    localStorage.setItem('block-puzzle-high-score', newScore.toString());
                }
                const newLevel = Math.floor(newScore / 1000) + 1;
                if (newLevel !== level) {
                    setLevel(newLevel);
                    stateRef.current.dropInterval = Math.max(100, 800 - (newLevel - 1) * 70);
                }
                return newScore;
            });
        }
    };

    const spawn = () => {
        const state = stateRef.current;
        state.activeShape = SHAPES[state.nextIdx];
        state.colorIdx = state.nextIdx;
        state.nextIdx = Math.floor(Math.random() * SHAPES.length);
        setNextPieceIdx(state.nextIdx);
        
        state.pos = { x: Math.floor(COLS / 2) - Math.floor(state.activeShape[0].length / 2), y: 0 };
        
        if (collide(0, 0)) {
            setGameOver(true);
        }
    };

    const move = (dx: number, dy: number) => {
        if (!collide(dx, dy)) {
            stateRef.current.pos.x += dx;
            stateRef.current.pos.y += dy;
            return true;
        }
        if (dy > 0) {
            merge();
            clearLines();
            spawn();
        }
        return false;
    };

    const rotate = () => {
        const shape = stateRef.current.activeShape;
        const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
        
        // Basic SRS Wall Kicks
        const kicks = [0, 1, -1, 2, -2];
        for (const kick of kicks) {
            if (!collide(kick, 0, rotated)) {
                stateRef.current.pos.x += kick;
                stateRef.current.activeShape = rotated;
                return;
            }
        }
    };

    useEffect(() => {
        if (!started || gameOver) return;

        let animationId: number;
        const loop = (time: number) => {
            const state = stateRef.current;
            if (!state.lastTick) state.lastTick = time;
            const delta = time - state.lastTick;

            if (delta > state.dropInterval) {
                move(0, 1);
                state.lastTick = time;
            }

            state.frame++;
            animationId = requestAnimationFrame(loop);
        };

        animationId = requestAnimationFrame(loop);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver || !started) return;
            switch (e.key) {
                case 'ArrowLeft': move(-1, 0); break;
                case 'ArrowRight': move(1, 0); break;
                case 'ArrowDown': move(0, 1); break;
                case 'ArrowUp': rotate(); break;
                case ' ': // Hard Drop
                    while (move(0, 1));
                    break;
            }
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [started, gameOver, level]);

    const startGame = () => {
        stateRef.current.grid = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
        stateRef.current.lastTick = 0;
        stateRef.current.dropInterval = 800;
        setScore(0);
        setLevel(1);
        setGameOver(false);
        setStarted(true);
        spawn();
    };

    const getGhostY = () => {
        let ghostY = stateRef.current.pos.y;
        while (!collide(0, ghostY - stateRef.current.pos.y + 1)) {
            ghostY++;
        }
        return ghostY;
    };

    const getDisplayGrid = () => {
        const { grid, pos, activeShape, colorIdx } = stateRef.current;
        const display = grid.map(row => [...row]);
        const ghostY = getGhostY();
        
        // Draw Ghost
        activeShape.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val && ghostY + y >= 0) {
                    display[ghostY + y][pos.x + x] = -1; // -1 for ghost
                }
            });
        });

        // Draw Active
        activeShape.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val && pos.y + y >= 0) {
                    display[pos.y + y][pos.x + x] = colorIdx + 1;
                }
            });
        });
        return display;
    };

    const displayGrid = started ? getDisplayGrid() : stateRef.current.grid;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-4 select-none touch-none">
            
            <div className="flex gap-6 items-start">
                {/* Score & Level Sidebar */}
                <div className="hidden md:flex flex-col gap-4">
                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl min-w-[120px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">High Score</p>
                        <h3 className="text-xl font-black text-amber-400">{highScore}</h3>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl min-w-[120px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Score</p>
                        <h3 className="text-2xl font-black text-blue-400">{score}</h3>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl min-w-[120px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Level</p>
                        <h3 className="text-2xl font-black text-emerald-400">{level}</h3>
                    </div>
                </div>

                {/* Main Game Board */}
                <div className="relative border-4 border-slate-700 bg-slate-800 p-1.5 rounded-2xl shadow-2xl">
                    <div className="grid grid-cols-10 gap-px bg-slate-900 rounded-lg overflow-hidden border border-slate-950">
                        {displayGrid.map((row, y) => row.map((cell, x) => (
                            <div 
                                key={`${x}-${y}`} 
                                className="w-[18px] h-[18px] md:w-6 md:h-6 relative overflow-hidden transition-colors duration-150"
                                style={{ 
                                    backgroundColor: cell > 0 ? COLORS[cell - 1] : cell === -1 ? 'rgba(255,255,255,0.05)' : 'rgba(15, 23, 42, 0.4)',
                                    border: cell > 0 ? `1px solid rgba(0,0,0,0.2)` : cell === -1 ? '1px dashed rgba(255,255,255,0.1)' : 'none'
                                }}
                            >
                                {cell > 0 && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                                )}
                            </div>
                        )))}
                    </div>

                    {(!started || gameOver) && (
                        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-6 backdrop-blur-md rounded-xl z-20">
                            {gameOver ? (
                                <>
                                    <h2 className="text-4xl font-black text-red-500 mb-2 italic tracking-tighter">GAME OVER</h2>
                                    <div className="bg-white/5 rounded-2xl p-4 mb-6 min-w-[160px] border border-white/10">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Final Score</p>
                                        <p className="text-4xl font-black">{score}</p>
                                    </div>
                                    <button onClick={startGame} className="bg-blue-600 text-white px-12 py-3 rounded-xl font-black hover:bg-blue-500 transition-all shadow-lg active:scale-95">RETRY</button>
                                </>
                            ) : (
                                <>
                                    <div className="text-6xl mb-4 animate-bounce">🧊</div>
                                    <h2 className="text-4xl font-black mb-1 tracking-tighter italic">BLOCK PUZZLE</h2>
                                    <p className="text-slate-400 text-[10px] mb-8 uppercase tracking-[0.2em] font-bold">Clear the lines to survive</p>
                                    <button onClick={startGame} className="bg-blue-600 text-white px-12 py-4 rounded-xl font-black shadow-lg hover:bg-blue-500 transition-all active:scale-95">START GAME</button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Sidebar: Next Piece */}
                <div className="hidden lg:flex flex-col gap-4">
                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Next Up</p>
                        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-20 h-20">
                            {started && SHAPES[nextPieceIdx].map((row, y) => row.map((val, x) => (
                                <div 
                                    key={`next-${x}-${y}`}
                                    className="w-4 h-4 rounded-sm"
                                    style={{ 
                                        backgroundColor: val ? COLORS[nextPieceIdx] : 'transparent',
                                        gridColumn: x + 1,
                                        gridRow: y + 1
                                    }}
                                />
                            )))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Stats Bar */}
            <div className="flex md:hidden gap-4 mt-4 w-full justify-center">
                <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-center">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Score</p>
                    <p className="text-lg font-black text-blue-400">{score}</p>
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-center">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Level</p>
                    <p className="text-lg font-black text-emerald-400">{level}</p>
                </div>
            </div>

            {/* Mobile Touch Controls */}
            <div className="mt-8 grid grid-cols-4 gap-4 md:hidden">
                <button 
                    onPointerDown={(e) => { e.preventDefault(); move(-1, 0); }} 
                    className="w-14 h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg active:bg-blue-600 active:scale-90 transition-all"
                >
                    ←
                </button>
                <button 
                    onPointerDown={(e) => { e.preventDefault(); rotate(); }} 
                    className="w-14 h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg active:bg-blue-600 active:scale-90 transition-all"
                >
                    ↻
                </button>
                <button 
                    onPointerDown={(e) => { e.preventDefault(); move(0, 1); }} 
                    className="w-14 h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg active:bg-blue-600 active:scale-90 transition-all"
                >
                    ↓
                </button>
                <button 
                    onPointerDown={(e) => { e.preventDefault(); move(1, 0); }} 
                    className="w-14 h-14 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg active:bg-blue-600 active:scale-90 transition-all"
                >
                    →
                </button>
            </div>

            <p className="hidden md:block mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                <span className="text-slate-300">Arrows</span> to move & rotate • <span className="text-slate-300">Space</span> to hard drop
            </p>
        </div>
    );
};

export default BlockPuzzle;
