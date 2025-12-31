
import React, { useRef, useEffect, useState, useCallback } from 'react';

const BrickBreaker: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'over' | 'win'>('start');
    const [score, setScore] = useState(0);

    const stateRef = useRef({
        ballX: 0,
        ballY: 0,
        ballDX: 4,
        ballDY: -4,
        paddleX: 0,
        bricks: [] as any[],
        frame: 0,
        keys: {} as { [key: string]: boolean },
        paddleWidth: 80,
        paddleHeight: 12,
        ballRadius: 7,
        brickRowCount: 4,
        brickColumnCount: 6,
        brickWidth: 55,
        brickHeight: 20,
        brickPadding: 8,
        brickOffsetTop: 40,
        brickOffsetLeft: 12,
    });

    const initBricks = useCallback(() => {
        const state = stateRef.current;
        const newBricks = [];
        for (let c = 0; c < state.brickColumnCount; c++) {
            newBricks[c] = [];
            for (let r = 0; r < state.brickRowCount; r++) {
                newBricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        state.bricks = newBricks;
    }, []);

    const resetGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const state = stateRef.current;
        state.ballX = canvas.width / 2;
        state.ballY = canvas.height - 40;
        state.ballDX = 3 + Math.random() * 2;
        state.ballDY = -4;
        state.paddleX = (canvas.width - state.paddleWidth) / 2;
        initBricks();
        setScore(0);
        setGameState('playing');
    }, [initBricks]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationId: number;

        const handleKeyDown = (e: KeyboardEvent) => {
            const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'a', 'd'];
            if (gameKeys.includes(e.key)) {
                e.preventDefault();
            }
            stateRef.current.keys[e.key] = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => stateRef.current.keys[e.key] = false;
        
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const state = stateRef.current;
            if (relativeX > 0 && relativeX < canvas.width) {
                state.paddleX = relativeX - state.paddleWidth / 2;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        canvas.addEventListener('mousemove', handleMouseMove);

        const loop = () => {
            if (gameState !== 'playing') return;

            const state = stateRef.current;
            
            // Clear and Background
            ctx.fillStyle = '#0f172a'; // slate-900
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Paddle Movement (Keyboard)
            if (state.keys['ArrowLeft'] || state.keys['a']) state.paddleX -= 7;
            if (state.keys['ArrowRight'] || state.keys['d']) state.paddleX += 7;
            
            // Constrain Paddle
            if (state.paddleX < 0) state.paddleX = 0;
            if (state.paddleX > canvas.width - state.paddleWidth) state.paddleX = canvas.width - state.paddleWidth;

            // Draw Bricks
            let activeBricks = 0;
            for (let c = 0; c < state.brickColumnCount; c++) {
                for (let r = 0; r < state.brickRowCount; r++) {
                    const b = state.bricks[c][r];
                    if (b.status === 1) {
                        activeBricks++;
                        const brickX = (c * (state.brickWidth + state.brickPadding)) + state.brickOffsetLeft;
                        const brickY = (r * (state.brickHeight + state.brickPadding)) + state.brickOffsetTop;
                        b.x = brickX;
                        b.y = brickY;
                        
                        // Brick visual
                        ctx.fillStyle = `hsl(${210 + r * 20}, 80%, 60%)`;
                        ctx.beginPath();
                        ctx.roundRect(brickX, brickY, state.brickWidth, state.brickHeight, 4);
                        ctx.fill();
                        
                        // Reflection
                        ctx.fillStyle = 'rgba(255,255,255,0.1)';
                        ctx.fillRect(brickX, brickY, state.brickWidth, 2);

                        // Collision Detection
                        if (state.ballX > brickX && state.ballX < brickX + state.brickWidth && 
                            state.ballY > brickY && state.ballY < brickY + state.brickHeight) {
                            state.ballDY = -state.ballDY;
                            b.status = 0;
                            setScore(s => s + 20);
                        }
                    }
                }
            }

            if (activeBricks === 0) {
                setGameState('win');
                return;
            }

            // Draw Paddle
            ctx.fillStyle = '#10b981'; // emerald-500
            ctx.beginPath();
            ctx.roundRect(state.paddleX, canvas.height - state.paddleHeight - 5, state.paddleWidth, state.paddleHeight, 6);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(state.paddleX + 10, canvas.height - state.paddleHeight - 2, state.paddleWidth - 20, 2);

            // Draw Ball
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fff';
            ctx.beginPath();
            ctx.arc(state.ballX, state.ballY, state.ballRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Ball Physics & Wall Collision
            if (state.ballX + state.ballDX > canvas.width - state.ballRadius || state.ballX + state.ballDX < state.ballRadius) {
                state.ballDX = -state.ballDX;
            }
            if (state.ballY + state.ballDY < state.ballRadius) {
                state.ballDY = -state.ballDY;
            } else if (state.ballY + state.ballDY > canvas.height - state.ballRadius - 10) {
                // Paddle Collision
                if (state.ballX > state.paddleX && state.ballX < state.paddleX + state.paddleWidth) {
                    state.ballDY = -Math.abs(state.ballDY);
                    // Add some spin/direction change based on where it hit the paddle
                    const hitPoint = (state.ballX - (state.paddleX + state.paddleWidth / 2)) / (state.paddleWidth / 2);
                    state.ballDX = hitPoint * 5;
                } else if (state.ballY + state.ballDY > canvas.height) {
                    setGameState('over');
                    return;
                }
            }

            state.ballX += state.ballDX;
            state.ballY += state.ballDY;

            animationId = requestAnimationFrame(loop);
        };

        if (gameState === 'playing') {
            animationId = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [gameState]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 select-none touch-none">
            <div className="flex justify-between w-full max-w-[400px] text-white mb-4 px-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Score</span>
                    <span className="text-2xl font-black text-blue-400 leading-none">{score}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Status</span>
                    <span className={`text-sm font-bold leading-none ${gameState === 'playing' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {gameState.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="relative border-4 border-slate-700 bg-slate-800 p-1.5 rounded-2xl shadow-2xl overflow-hidden">
                <canvas 
                    ref={canvasRef} 
                    width={400} 
                    height={400} 
                    className="bg-slate-900 rounded-lg max-w-full cursor-none touch-none" 
                />

                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm z-10">
                        {gameState === 'start' && (
                            <>
                                <div className="text-6xl mb-4 animate-bounce">🧱</div>
                                <h2 className="text-3xl font-black text-white mb-1 italic tracking-tighter">BRICK BREAKER</h2>
                                <p className="text-slate-400 text-[10px] mb-8 uppercase tracking-[0.3em] font-bold">Classic Arcade Action</p>
                                <button onClick={resetGame} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black shadow-lg shadow-blue-900 transition-all hover:bg-blue-500 active:scale-95">START GAME</button>
                            </>
                        )}
                        {gameState === 'over' && (
                            <>
                                <h2 className="text-4xl font-black text-red-500 mb-2 italic">GAME OVER</h2>
                                <div className="bg-white/5 rounded-2xl p-4 mb-6 min-w-[140px] border border-white/10">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Final Score</p>
                                    <p className="text-4xl font-black text-white">{score}</p>
                                </div>
                                <button onClick={resetGame} className="bg-white text-slate-900 px-10 py-3 rounded-xl font-black hover:bg-slate-100 transition-all shadow-xl active:scale-95">TRY AGAIN</button>
                            </>
                        )}
                        {gameState === 'win' && (
                            <>
                                <div className="text-6xl mb-4">🏆</div>
                                <h2 className="text-4xl font-black text-emerald-400 mb-2 italic">VICTORY!</h2>
                                <p className="text-slate-300 mb-6">Board cleared! Excellent work.</p>
                                <button onClick={resetGame} className="bg-emerald-600 text-white px-10 py-3 rounded-xl font-black hover:bg-emerald-500 transition-all shadow-xl active:scale-95">PLAY AGAIN</button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                    Use <span className="text-slate-300">Mouse</span> or <span className="text-slate-300">Arrow Keys</span> to Move
                </p>
                <div className="flex gap-2 md:hidden">
                   <button 
                        onPointerDown={() => stateRef.current.keys['ArrowLeft'] = true}
                        onPointerUp={() => stateRef.current.keys['ArrowLeft'] = false}
                        className="w-16 h-12 bg-slate-800 border-2 border-slate-700 rounded-xl text-white font-bold"
                    >←</button>
                    <button 
                        onPointerDown={() => stateRef.current.keys['ArrowRight'] = true}
                        onPointerUp={() => stateRef.current.keys['ArrowRight'] = false}
                        className="w-16 h-12 bg-slate-800 border-2 border-slate-700 rounded-xl text-white font-bold"
                    >→</button>
                </div>
            </div>
        </div>
    );
};

export default BrickBreaker;
