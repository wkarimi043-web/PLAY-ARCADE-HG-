
import React, { useRef, useEffect, useState } from 'react';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#a855f7'];
const RADIUS = 15;
const ROWS = 8;
const COLS = 12;

interface Bubble {
    x: number;
    y: number;
    row: number;
    col: number;
    color: string;
    active: boolean;
}

const BubbleShooter: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let bubbles: Bubble[] = [];
        let nextBubbleColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        let activeBubble: any = null;

        // Initialize grid
        const initGrid = () => {
            bubbles = [];
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const offset = (r % 2) * RADIUS;
                    bubbles.push({
                        x: c * (RADIUS * 2) + RADIUS + offset,
                        y: r * (RADIUS * 1.8) + RADIUS,
                        row: r,
                        col: c,
                        color: COLORS[Math.floor(Math.random() * COLORS.length)],
                        active: r < 5 // Only fill top 5 rows
                    });
                }
            }
        };

        initGrid();

        const getNeighbors = (bubble: Bubble) => {
            return bubbles.filter(b => {
                if (!b.active || b === bubble) return false;
                const dist = Math.sqrt((bubble.x - b.x) ** 2 + (bubble.y - b.y) ** 2);
                return dist < RADIUS * 2.2;
            });
        };

        const popRecursive = (startBubble: Bubble, color: string, matches: Set<Bubble>) => {
            matches.add(startBubble);
            const neighbors = getNeighbors(startBubble);
            neighbors.forEach(n => {
                if (n.color === color && !matches.has(n)) {
                    popRecursive(n, color, matches);
                }
            });
        };

        const handleInput = (e: MouseEvent) => {
            if (activeBubble || gameOver) return;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const dx = mouseX - canvas.width / 2;
            const dy = mouseY - (canvas.height - 30);
            const angle = Math.atan2(dy, dx);

            activeBubble = {
                x: canvas.width / 2,
                y: canvas.height - 30,
                color: nextBubbleColor,
                dx: Math.cos(angle) * 8,
                dy: Math.sin(angle) * 8
            };
            nextBubbleColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };

        canvas.addEventListener('mousedown', handleInput);
        canvas.addEventListener('mousemove', handleMouseMove);

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Aiming Line
            if (!activeBubble && !gameOver) {
                const startX = canvas.width / 2;
                const startY = canvas.height - 30;
                const dx = mousePos.x - startX;
                const dy = mousePos.y - startY;
                const angle = Math.atan2(dy, dx);
                
                ctx.setLineDash([5, 5]);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(startX + Math.cos(angle) * 100, startY + Math.sin(angle) * 100);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Draw Grid
            bubbles.forEach(b => {
                if (!b.active) return;
                
                // Bubble highlight/gradient
                const grad = ctx.createRadialGradient(b.x - 4, b.y - 4, 2, b.x, b.y, RADIUS);
                grad.addColorStop(0, '#fff');
                grad.addColorStop(0.2, b.color);
                grad.addColorStop(1, '#000');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(b.x, b.y, RADIUS - 1, 0, Math.PI * 2);
                ctx.fill();
            });

            // Active Bubble
            if (activeBubble) {
                activeBubble.x += activeBubble.dx;
                activeBubble.y += activeBubble.dy;

                // Walls
                if (activeBubble.x < RADIUS || activeBubble.x > canvas.width - RADIUS) activeBubble.dx *= -1;
                
                // Ceiling collision
                if (activeBubble.y < RADIUS) {
                    // Find closest slot
                    let closest = bubbles[0];
                    let minDist = Infinity;
                    bubbles.filter(b => !b.active && b.row === 0).forEach(b => {
                        const d = Math.sqrt((activeBubble.x - b.x)**2 + (activeBubble.y - b.y)**2);
                        if (d < minDist) { minDist = d; closest = b; }
                    });
                    closest.active = true;
                    closest.color = activeBubble.color;
                    activeBubble = null;
                }

                if (activeBubble) {
                    ctx.fillStyle = activeBubble.color;
                    ctx.beginPath();
                    ctx.arc(activeBubble.x, activeBubble.y, RADIUS, 0, Math.PI * 2);
                    ctx.fill();

                    // Collision with existing bubbles
                    for (let b of bubbles) {
                        if (!b.active) continue;
                        const dist = Math.sqrt((activeBubble.x - b.x)**2 + (activeBubble.y - b.y)**2);
                        if (dist < RADIUS * 1.7) {
                            // Find nearest empty slot to stick to
                            let nearestEmpty: Bubble | null = null;
                            let emptyDist = Infinity;
                            bubbles.filter(slot => !slot.active).forEach(slot => {
                                const d = Math.sqrt((activeBubble.x - slot.x)**2 + (activeBubble.y - slot.y)**2);
                                if (d < emptyDist) { emptyDist = d; nearestEmpty = slot; }
                            });

                            if (nearestEmpty) {
                                (nearestEmpty as Bubble).active = true;
                                (nearestEmpty as Bubble).color = activeBubble.color;
                                
                                // Recursive pop check
                                const matches = new Set<Bubble>();
                                popRecursive(nearestEmpty, (nearestEmpty as Bubble).color, matches);
                                
                                if (matches.size >= 3) {
                                    matches.forEach(m => m.active = false);
                                    setScore(s => s + (matches.size * 50));
                                    
                                    // Drop orphan bubbles
                                    // A bit heavy, but ensures clean board
                                    const connectedToCeiling = new Set<Bubble>();
                                    const checkConnected = (b: Bubble) => {
                                        if (connectedToCeiling.has(b)) return;
                                        connectedToCeiling.add(b);
                                        getNeighbors(b).forEach(n => checkConnected(n));
                                    };
                                    bubbles.filter(b => b.active && b.row === 0).forEach(b => checkConnected(b));
                                    bubbles.forEach(b => {
                                        if (b.active && !connectedToCeiling.has(b)) b.active = false;
                                    });
                                }
                            }
                            activeBubble = null;
                            break;
                        }
                    }
                }
            }

            // Launcher base
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height, 50, 0, Math.PI * 2);
            ctx.fill();

            // Current Bubble
            const grad = ctx.createRadialGradient(canvas.width / 2 - 4, canvas.height - 34, 2, canvas.width / 2, canvas.height - 30, RADIUS);
            grad.addColorStop(0, '#fff');
            grad.addColorStop(0.2, nextBubbleColor);
            grad.addColorStop(1, '#000');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height - 30, RADIUS, 0, Math.PI * 2);
            ctx.fill();

            if (bubbles.filter(b => b.active && b.y > canvas.height - 100).length > 0) {
                setGameOver(true);
            }

            requestAnimationFrame(loop);
        };

        const animId = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(animId);
            canvas.removeEventListener('mousedown', handleInput);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [gameOver]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-white text-2xl font-black z-10 drop-shadow-lg">
                Score: <span className="text-blue-400">{score}</span>
            </div>
            
            <div className="relative">
                <canvas 
                    ref={canvasRef} 
                    width={380} 
                    height={420} 
                    className="bg-slate-800 border-x-4 border-t-4 border-slate-700 shadow-2xl rounded-t-3xl max-w-full cursor-crosshair" 
                />
                
                {gameOver && (
                    <div className="absolute inset-0 bg-slate-900/90 rounded-t-3xl flex flex-col items-center justify-center text-center p-6 z-20">
                        <h2 className="text-4xl font-black text-red-500 mb-2">GAME OVER</h2>
                        <p className="text-white text-xl mb-6">Final Score: {score}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-xl transition-all active:scale-95"
                        >
                            PLAY AGAIN
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full max-w-[380px] bg-slate-800 p-4 rounded-b-3xl border-x-4 border-b-4 border-slate-700 flex flex-col items-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Aim & Shoot</p>
                <p className="text-slate-500 text-[10px] mt-1">Match 3 or more of the same color to pop!</p>
            </div>
        </div>
    );
};

export default BubbleShooter;
