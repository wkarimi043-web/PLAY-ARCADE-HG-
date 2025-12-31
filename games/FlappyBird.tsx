
import React, { useRef, useEffect, useState } from 'react';

interface GameProps {
    isPaused?: boolean;
    isSoundOn?: boolean;
}

const FlappyBird: React.FC<GameProps> = ({ isPaused = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('flappy-wings-highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const stateRef = useRef({
        birdY: 200,
        birdDY: 0,
        pipes: [] as any[],
        frame: 0,
        gravity: 0.45,
        jump: -7.5,
        birdSize: 24,
        pipeWidth: 55,
        pipeGap: 140,
        cloudX: 0
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const handleAction = (e?: any) => {
            if (e && e.preventDefault) e.preventDefault();
            if (!started) setStarted(true);
            else if (!gameOver && !isPaused) stateRef.current.birdDY = stateRef.current.jump;
        };

        const handleKey = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                handleAction();
            }
        };

        window.addEventListener('keydown', handleKey);
        canvas.addEventListener('mousedown', handleAction);
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleAction(); }, { passive: false });

        const loop = () => {
            if (!started || gameOver || isPaused) {
                if (!isPaused) animationId = requestAnimationFrame(loop);
                return;
            }

            const state = stateRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            state.frame++;

            // --- DRAW BACKGROUND ---
            const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            skyGrad.addColorStop(0, '#38bdf8');
            skyGrad.addColorStop(1, '#bae6fd');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Animated Clouds (Parallax)
            state.cloudX -= 0.5;
            if (state.cloudX < -200) state.cloudX = 0;
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.arc(state.cloudX + i * 200 + 50, 80 + (i % 2) * 40, 30, 0, Math.PI * 2);
                ctx.arc(state.cloudX + i * 200 + 80, 80 + (i % 2) * 40, 40, 0, Math.PI * 2);
                ctx.arc(state.cloudX + i * 200 + 110, 80 + (i % 2) * 40, 30, 0, Math.PI * 2);
                ctx.fill();
            }

            // Bird physics
            state.birdDY += state.gravity;
            state.birdY += state.birdDY;

            // --- DRAW PIPES ---
            if (state.frame % 90 === 0) {
                const minH = 60;
                const maxH = canvas.height - state.pipeGap - 60;
                const h = Math.random() * (maxH - minH) + minH;
                state.pipes.push({ x: canvas.width, h, passed: false });
            }

            state.pipes = state.pipes.filter(p => {
                p.x -= 3; 
                
                // Pipe Styles
                ctx.fillStyle = '#22c55e';
                ctx.strokeStyle = '#14532d';
                ctx.lineWidth = 3;
                
                // Top Pipe
                ctx.fillRect(p.x, 0, state.pipeWidth, p.h);
                ctx.strokeRect(p.x, -5, state.pipeWidth, p.h + 5);
                ctx.fillStyle = 'rgba(255,255,255,0.2)'; // Highlight
                ctx.fillRect(p.x + 5, 0, 10, p.h);

                // Bottom Pipe
                const bottomY = p.h + state.pipeGap;
                ctx.fillStyle = '#22c55e';
                ctx.fillRect(p.x, bottomY, state.pipeWidth, canvas.height - bottomY);
                ctx.strokeRect(p.x, bottomY, state.pipeWidth, canvas.height - bottomY + 5);
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.fillRect(p.x + 5, bottomY, 10, canvas.height - bottomY);

                // Collision
                const bR = state.birdSize / 2 - 4;
                const birdBox = { x: 50 - bR, y: state.birdY - bR, w: bR * 2, h: bR * 2 };
                if (birdBox.x + birdBox.w > p.x && birdBox.x < p.x + state.pipeWidth) {
                    if (birdBox.y < p.h || birdBox.y + birdBox.h > bottomY) {
                        setGameOver(true);
                    }
                }

                if (p.x + state.pipeWidth < 50 && !p.passed) {
                    p.passed = true;
                    setScore(s => {
                        const next = s + 1;
                        if (next > highScore) {
                            setHighScore(next);
                            localStorage.setItem('flappy-wings-highscore', next.toString());
                        }
                        return next;
                    });
                }
                return p.x > -state.pipeWidth - 50;
            });

            // --- DRAW BIRD ---
            ctx.save();
            ctx.translate(50, state.birdY);
            ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.birdDY * 0.08)));
            
            // Wing flap animation
            const wingY = Math.sin(state.frame * 0.4) * 5;
            
            // Body
            ctx.fillStyle = '#facc15';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Wing
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.ellipse(-5, wingY, 10, 6, -0.2, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(7, -4, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(9, -4, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Beak
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(22, 3);
            ctx.lineTo(12, 6);
            ctx.fill();
            ctx.restore();

            if (state.birdY + state.birdSize > canvas.height || state.birdY < 0) {
                setGameOver(true);
            }

            animationId = requestAnimationFrame(loop);
        };

        animationId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKey);
        };
    }, [started, gameOver, isPaused]);

    const reset = () => {
        stateRef.current = {
            ...stateRef.current,
            birdY: 200, birdDY: 0, pipes: [], frame: 0
        };
        setScore(0);
        setGameOver(false);
        setStarted(true);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 overflow-hidden relative select-none">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-6xl font-black z-30 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] italic">
                {score}
            </div>
            
            <div className="relative border-[10px] border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
                <canvas ref={canvasRef} width={400} height={500} className="bg-sky-400 max-w-full cursor-pointer" />
                
                {gameOver && (
                    <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center text-white p-4 backdrop-blur-md animate-in fade-in duration-300">
                        <h2 className="text-5xl font-black mb-1 italic tracking-tighter">CRASHED!</h2>
                        <div className="flex gap-8 mb-8 mt-4">
                            <div className="text-center">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Score</p>
                                <p className="text-4xl font-black">{score}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Best</p>
                                <p className="text-4xl font-black text-amber-400">{highScore}</p>
                            </div>
                        </div>
                        <button onClick={reset} className="bg-white hover:bg-slate-100 text-red-900 px-12 py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95">RETRY</button>
                    </div>
                )}
            </div>
            
            <p className="mt-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-60">Tap to Jump • Avoid the Pipes</p>
        </div>
    );
};

export default FlappyBird;
