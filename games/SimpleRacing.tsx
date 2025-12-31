
import React, { useRef, useEffect, useState } from 'react';

const SimpleRacing: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);
    
    // Use refs for game state that shouldn't trigger re-renders or effect restarts
    const gameStateRef = useRef({
        playerX: 0,
        enemies: [] as any[],
        frame: 0,
        speed: 5,
        keys: {} as {[key: string]: boolean}
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initial setup
        const carW = 30;
        const carH = 50;
        const playerY = canvas.height - 80;
        gameStateRef.current.playerX = canvas.width / 2 - 15;
        gameStateRef.current.enemies = [];
        gameStateRef.current.frame = 0;
        gameStateRef.current.speed = 5;

        const handleKeyDown = (e: KeyboardEvent) => {
            const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'w', 's', 'a', 'd', ' '];
            if (gameKeys.includes(e.key)) {
                e.preventDefault();
            }
            gameStateRef.current.keys[e.key] = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => gameStateRef.current.keys[e.key] = false;

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let animationId: number;

        const loop = () => {
            if (!started || gameOver) return;
            
            const state = gameStateRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            state.frame++;

            // Road drawing
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();

            // Movement
            if (state.keys['ArrowLeft'] && state.playerX > 0) state.playerX -= 5;
            if (state.keys['ArrowRight'] && state.playerX < canvas.width - carW) state.playerX += 5;

            // Player Car
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(state.playerX, playerY, carW, carH);
            ctx.fillStyle = '#fff';
            ctx.fillRect(state.playerX + 5, playerY + 5, 5, 10);
            ctx.fillRect(state.playerX + 20, playerY + 5, 5, 10);

            // Spawn Enemies
            if (state.frame % 60 === 0) {
                state.enemies.push({ 
                    x: Math.random() * (canvas.width - carW), 
                    y: -carH, 
                    color: `hsl(${Math.random() * 360}, 70%, 50%)` 
                });
            }

            // Update Enemies
            let collisionOccurred = false;
            state.enemies = state.enemies.filter(en => {
                en.y += state.speed;
                ctx.fillStyle = en.color;
                ctx.fillRect(en.x, en.y, carW, carH);

                // Collision Detection
                if (state.playerX < en.x + carW && state.playerX + carW > en.x && playerY < en.y + carH && playerY + carH > en.y) {
                    collisionOccurred = true;
                }

                // Score Counting - only if game is still active
                if (en.y > canvas.height) {
                    if (!collisionOccurred) {
                        setScore(s => s + 10);
                    }
                    return false;
                }
                return true;
            });

            if (collisionOccurred) {
                setGameOver(true);
                return; // Stop the loop immediately
            }

            // Update speed based on current score
            state.speed = 5 + Math.floor(state.frame / 1000); 

            animationId = requestAnimationFrame(loop);
        };

        if (started && !gameOver) {
            animationId = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [started, gameOver]);

    const reset = () => {
        setScore(0);
        setGameOver(false);
        setStarted(true);
        // Explicitly reset ref values for immediate effect
        gameStateRef.current.enemies = [];
        gameStateRef.current.frame = 0;
        gameStateRef.current.speed = 5;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 select-none touch-none">
            <div className="absolute top-4 left-4 text-white font-black z-10 text-xl">Score: {score}</div>
            <div className="relative border-x-8 border-slate-600 bg-slate-800 shadow-2xl overflow-hidden rounded-lg">
                <canvas ref={canvasRef} width={300} height={450} className="max-w-full" />
                
                {!started && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm">
                        <h2 className="text-3xl font-black text-blue-500 mb-4 tracking-tighter italic">NITRO RACING</h2>
                        <button onClick={() => setStarted(true)} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold text-white transition-colors shadow-lg active:scale-95">START ENGINE</button>
                        <p className="mt-4 text-xs text-slate-400 font-bold uppercase tracking-widest">Use Left/Right Arrows</p>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center text-center p-4 backdrop-blur-md">
                        <h2 className="text-3xl font-black text-white mb-2 italic uppercase tracking-widest">Crashed!</h2>
                        <p className="text-white text-xl mb-6">Final Score: {score}</p>
                        <button onClick={reset} className="bg-white text-red-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg active:scale-95">RETRY</button>
                    </div>
                )}
            </div>
            
            <div className="mt-6 md:hidden flex gap-4">
                <button 
                    onMouseDown={() => gameStateRef.current.keys['ArrowLeft'] = true}
                    onMouseUp={() => gameStateRef.current.keys['ArrowLeft'] = false}
                    onTouchStart={(e) => { e.preventDefault(); gameStateRef.current.keys['ArrowLeft'] = true; }}
                    onTouchEnd={(e) => { e.preventDefault(); gameStateRef.current.keys['ArrowLeft'] = false; }}
                    className="bg-slate-700 p-8 rounded-full text-white text-3xl active:bg-blue-600 select-none shadow-xl border-4 border-slate-600"
                >←</button>
                <button 
                    onMouseDown={() => gameStateRef.current.keys['ArrowRight'] = true}
                    onMouseUp={() => gameStateRef.current.keys['ArrowRight'] = false}
                    onTouchStart={(e) => { e.preventDefault(); gameStateRef.current.keys['ArrowRight'] = true; }}
                    onTouchEnd={(e) => { e.preventDefault(); gameStateRef.current.keys['ArrowRight'] = false; }}
                    className="bg-slate-700 p-8 rounded-full text-white text-3xl active:bg-blue-600 select-none shadow-xl border-4 border-slate-600"
                >→</button>
            </div>
        </div>
    );
};

export default SimpleRacing;
