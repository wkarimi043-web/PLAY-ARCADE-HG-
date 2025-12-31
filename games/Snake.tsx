
import React, { useRef, useEffect, useState } from 'react';

interface GameProps {
    isPaused?: boolean;
    isSoundOn?: boolean;
}

const Snake: React.FC<GameProps> = ({ isPaused = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);

    // Touch Handling Refs
    const touchStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const saved = localStorage.getItem('snake-pro-highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const directionRef = useRef({ dx: 1, dy: 0, nextDx: 1, nextDy: 0 });

    useEffect(() => {
        if (!started || gameOver || isPaused) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const GRID_SIZE = 20;
        const TILE_COUNT = Math.floor(canvas.width / GRID_SIZE);

        let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        let food = { x: 15, y: 10 };
        let particles: any[] = [];
        let frameCount = 0;

        const handleKey = (e: KeyboardEvent) => {
            const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's', 'a', 'd'];
            if (keys.includes(e.key)) e.preventDefault();

            const dir = directionRef.current;
            if ((e.key === 'ArrowUp' || e.key === 'w') && dir.dy === 0) { dir.nextDx = 0; dir.nextDy = -1; }
            if ((e.key === 'ArrowDown' || e.key === 's') && dir.dy === 0) { dir.nextDx = 0; dir.nextDy = 1; }
            if ((e.key === 'ArrowLeft' || e.key === 'a') && dir.dx === 0) { dir.nextDx = -1; dir.nextDy = 0; }
            if ((e.key === 'ArrowRight' || e.key === 'd') && dir.dx === 0) { dir.nextDx = 1; dir.nextDy = 0; }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const dx = e.changedTouches[0].clientX - touchStart.current.x;
            const dy = e.changedTouches[0].clientY - touchStart.current.y;
            const dir = directionRef.current;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > 30) {
                    if (dx > 0 && dir.dx === 0) { dir.nextDx = 1; dir.nextDy = 0; }
                    else if (dx < 0 && dir.dx === 0) { dir.nextDx = -1; dir.nextDy = 0; }
                }
            } else {
                if (Math.abs(dy) > 30) {
                    if (dy > 0 && dir.dy === 0) { dir.nextDx = 0; dir.nextDy = 1; }
                    else if (dy < 0 && dir.dy === 0) { dir.nextDx = 0; dir.nextDy = -1; }
                }
            }
        };

        window.addEventListener('keydown', handleKey);
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchend', handleTouchEnd);

        const createParticles = (x: number, y: number, color: string) => {
            for (let i = 0; i < 8; i++) {
                particles.push({
                    x: x * GRID_SIZE + GRID_SIZE / 2,
                    y: y * GRID_SIZE + GRID_SIZE / 2,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 1,
                    color
                });
            }
        };

        const render = () => {
            if (isPaused) return;
            frameCount++;

            const speed = Math.max(3, 8 - Math.floor(snake.length / 5));
            const dir = directionRef.current;

            if (frameCount % speed === 0) {
                dir.dx = dir.nextDx;
                dir.dy = dir.nextDy;
                const head = { x: snake[0].x + dir.dx, y: snake[0].y + dir.dy };

                if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT || 
                    snake.some(s => s.x === head.x && s.y === head.y)) {
                    setGameOver(true);
                    if (score > highScore) {
                        setHighScore(score);
                        localStorage.setItem('snake-pro-highscore', score.toString());
                    }
                    return;
                }

                snake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10);
                    createParticles(food.x, food.y, '#10b981');
                    food = {
                        x: Math.floor(Math.random() * TILE_COUNT),
                        y: Math.floor(Math.random() * TILE_COUNT)
                    };
                } else {
                    snake.pop();
                }
            }

            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            for (let i = 0; i <= TILE_COUNT; i++) {
                ctx.beginPath();
                ctx.moveTo(i * GRID_SIZE, 0); ctx.lineTo(i * GRID_SIZE, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * GRID_SIZE); ctx.lineTo(canvas.width, i * GRID_SIZE);
                ctx.stroke();
            }

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, 3, 3);
                if (p.life <= 0) particles.splice(i, 1);
            });
            ctx.globalAlpha = 1;

            const foodPulse = Math.sin(Date.now() / 200) * 2;
            ctx.fillStyle = '#ef4444';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ef4444';
            ctx.beginPath();
            ctx.roundRect(food.x * GRID_SIZE + 4 - foodPulse/2, food.y * GRID_SIZE + 4 - foodPulse/2, GRID_SIZE - 8 + foodPulse, GRID_SIZE - 8 + foodPulse, 4);
            ctx.fill();
            ctx.shadowBlur = 0;

            snake.forEach((s, i) => {
                const isHead = i === 0;
                ctx.fillStyle = isHead ? '#3b82f6' : '#10b981';
                const padding = isHead ? 1 : 2;
                ctx.beginPath();
                ctx.roundRect(s.x * GRID_SIZE + padding, s.y * GRID_SIZE + padding, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2, isHead ? 6 : 4);
                ctx.fill();
            });

            if (!gameOver) requestAnimationFrame(render);
        };

        const animId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('keydown', handleKey);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, [started, gameOver, isPaused, score, highScore]);

    const reset = () => {
        setScore(0);
        setGameOver(false);
        setStarted(true);
        directionRef.current = { dx: 1, dy: 0, nextDx: 1, nextDy: 0 };
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative touch-none bg-slate-900">
            {gameOver && (
                <div className="absolute inset-0 z-20 bg-red-950/90 flex flex-col items-center justify-center text-white p-4 text-center backdrop-blur-md animate-in zoom-in duration-300">
                    <h2 className="text-4xl md:text-5xl font-black mb-2 italic tracking-tighter">GAME OVER</h2>
                    <div className="flex gap-8 mb-8">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Score</p>
                            <p className="text-2xl md:text-3xl font-black">{score}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Best</p>
                            <p className="text-2xl md:text-3xl font-black text-amber-400">{highScore}</p>
                        </div>
                    </div>
                    <button onClick={reset} className="bg-white text-slate-900 px-10 md:px-12 py-3 rounded-xl md:rounded-2xl font-black hover:bg-slate-100 transition-all shadow-xl active:scale-95">REPLAY</button>
                </div>
            )}

            <div className="bg-slate-800 p-1 md:p-2 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border-4 border-slate-700/50 max-w-full">
                <canvas 
                    ref={canvasRef} 
                    width={400} 
                    height={400} 
                    className="rounded-[1rem] md:rounded-[1.5rem] bg-slate-950 max-w-full aspect-square" 
                />
            </div>

            <div className="mt-4 md:mt-6 text-white flex items-center gap-8 md:gap-12">
                <div className="flex flex-col items-center">
                    <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Points</span>
                    <span className="text-xl md:text-2xl font-black text-blue-400">{score}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Record</span>
                    <span className="text-xl md:text-2xl font-black text-amber-400">{highScore}</span>
                </div>
                <button onClick={reset} className="bg-slate-800 border border-slate-700 text-[10px] px-4 md:px-6 py-2 rounded-full hover:bg-slate-700 uppercase font-black tracking-[0.2em] transition-all active:scale-95">Restart</button>
            </div>
            
            <p className="md:hidden mt-4 text-slate-500 text-[8px] uppercase font-black tracking-widest animate-pulse">Swipe to Turn</p>
        </div>
    );
};

export default Snake;
