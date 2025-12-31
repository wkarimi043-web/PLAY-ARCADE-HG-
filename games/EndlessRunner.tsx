
import React, { useEffect, useRef, useState } from 'react';

const EndlessRunner: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);

    // Physics and Game State in Refs to prevent stale closures and ensure performance
    const stateRef = useRef({
        playerY: 0,
        playerDY: 0,
        isJumping: false,
        obstacles: [] as { x: number, w: number, h: number, passed: boolean }[],
        frame: 0,
        speed: 5,
        gravity: 0.6,
        jumpForce: -12,
        groundY: 0
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        stateRef.current.groundY = canvas.height - 40;
        stateRef.current.playerY = stateRef.current.groundY;

        let animationId: number;

        const handleJump = (e?: any) => {
            if (e && e.preventDefault) e.preventDefault();
            if (!started) {
                setStarted(true);
                return;
            }
            if (gameOver) return;

            const state = stateRef.current;
            if (!state.isJumping) {
                state.playerDY = state.jumpForce;
                state.isJumping = true;
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault(); // Prevent scrolling
                handleJump();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        canvas.addEventListener('mousedown', handleJump);
        canvas.addEventListener('touchstart', handleJump, { passive: false });

        const loop = () => {
            if (!started || gameOver) return;

            const state = stateRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            state.frame++;

            // Draw Background (Simple Parallax-like Floor)
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 5);
            ctx.lineTo(canvas.width, canvas.height - 5);
            ctx.stroke();

            // Player Physics
            state.playerY += state.playerDY;
            state.playerDY += state.gravity;

            if (state.playerY > state.groundY) {
                state.playerY = state.groundY;
                state.playerDY = 0;
                state.isJumping = false;
            }

            // Draw Player
            ctx.fillStyle = '#3b82f6';
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
            // Draw a rounded cube for the runner
            const pSize = 30;
            ctx.beginPath();
            ctx.roundRect(40, state.playerY, pSize, pSize, 8);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Difficulty Scaling
            state.speed = 5 + Math.floor(state.frame / 500);

            // Spawn Obstacles
            const spawnRate = Math.max(40, 100 - Math.floor(state.frame / 200));
            if (state.frame % spawnRate === 0) {
                const h = 30 + Math.random() * 40;
                state.obstacles.push({ x: canvas.width, w: 20, h: h, passed: false });
            }

            // Update & Draw Obstacles
            ctx.fillStyle = '#ef4444';
            state.obstacles = state.obstacles.filter(obs => {
                obs.x -= state.speed;
                
                // Draw Obstacle
                ctx.beginPath();
                ctx.roundRect(obs.x, canvas.height - obs.h, obs.w, obs.h, 4);
                ctx.fill();

                // Collision Detection
                const pLeft = 40;
                const pRight = 70;
                const pTop = state.playerY;
                const pBottom = state.playerY + 30;

                const oLeft = obs.x;
                const oRight = obs.x + obs.w;
                const oTop = canvas.height - obs.h;

                if (pRight > oLeft && pLeft < oRight && pBottom > oTop) {
                    setGameOver(true);
                }

                // Scoring
                if (obs.x + obs.w < pLeft && !obs.passed) {
                    obs.passed = true;
                    setScore(s => s + 1);
                }

                return obs.x > -obs.w;
            });

            animationId = requestAnimationFrame(loop);
        };

        animationId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', onKeyDown);
            canvas.removeEventListener('mousedown', handleJump);
            canvas.removeEventListener('touchstart', handleJump);
        };
    }, [started, gameOver]);

    const resetGame = () => {
        stateRef.current.obstacles = [];
        stateRef.current.frame = 0;
        stateRef.current.speed = 5;
        stateRef.current.playerY = stateRef.current.groundY;
        stateRef.current.playerDY = 0;
        setScore(0);
        setGameOver(false);
        setStarted(true);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 overflow-hidden relative select-none">
            <div className="absolute top-6 left-6 text-white font-black z-20 text-2xl drop-shadow-md">
                SCORE: <span className="text-blue-400">{score}</span>
            </div>

            <div className="relative border-4 border-slate-700 rounded-3xl overflow-hidden shadow-2xl bg-slate-800">
                <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={250} 
                    className="max-w-full cursor-pointer touch-none" 
                />

                {!started && (
                    <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                        <div className="text-6xl mb-4 animate-bounce">🏃</div>
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter italic">ENDLESS RUN</h2>
                        <p className="text-slate-400 mb-8 max-w-xs">Jump over the red obstacles to survive. How far can you go?</p>
                        <button 
                            onClick={() => setStarted(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black shadow-[0_4px_0_rgb(30,64,175)] transition-all active:translate-y-1 active:shadow-none"
                        >
                            START RUNNING
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center text-center p-6 backdrop-blur-md animate-in fade-in duration-500">
                        <h2 className="text-5xl font-black text-white mb-2 italic">WASTED!</h2>
                        <div className="bg-white/10 rounded-2xl p-6 mb-8 min-w-[200px]">
                            <p className="text-xs uppercase font-bold tracking-widest text-slate-300 mb-1">Final Score</p>
                            <p className="text-6xl font-black text-white">{score}</p>
                        </div>
                        <button 
                            onClick={resetGame}
                            className="bg-white hover:bg-slate-100 text-red-900 px-10 py-4 rounded-2xl font-black shadow-[0_4px_0_rgb(200,200,200)] transition-all active:translate-y-1 active:shadow-none"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                )}
            </div>

            <p className="mt-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
                Press <span className="text-slate-300">Space</span> or <span className="text-slate-300">Tap</span> to Jump
            </p>
        </div>
    );
};

export default EndlessRunner;
