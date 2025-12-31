
import React, { useEffect, useRef, useState } from 'react';

const CatchObjects: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started || gameOver) return;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        let basketX = canvas.width / 2;
        const basketWidth = 60;
        const basketHeight = 10;
        let objects: any[] = [];
        let frame = 0;

        const handleMove = (e: MouseEvent) => {
            const relX = e.clientX - canvas.getBoundingClientRect().left;
            basketX = Math.max(0, Math.min(canvas.width - basketWidth, relX - basketWidth / 2));
        };
        window.addEventListener('mousemove', handleMove);

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;

            if (frame % 60 === 0) {
                objects.push({ 
                    x: Math.random() * (canvas.width - 20), 
                    y: -20, 
                    type: Math.random() > 0.2 ? 'fruit' : 'bomb' 
                });
            }

            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(basketX, canvas.height - basketHeight - 10, basketWidth, basketHeight);

            objects = objects.filter(obj => {
                obj.y += 3;
                ctx.font = '20px Arial';
                ctx.fillText(obj.type === 'fruit' ? '🍎' : '💣', obj.x, obj.y);

                if (obj.y > canvas.height - 30 && obj.x > basketX && obj.x < basketX + basketWidth) {
                    if (obj.type === 'bomb') setGameOver(true);
                    else setScore(s => s + 1);
                    return false;
                }
                return obj.y < canvas.height;
            });

            if (!gameOver) requestAnimationFrame(loop);
        };

        loop();
        return () => window.removeEventListener('mousemove', handleMove);
    }, [started, gameOver]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
            <canvas ref={canvasRef} width={400} height={400} className="bg-slate-800 rounded shadow-2xl max-w-full" />
            <div className="mt-4 text-white flex items-center gap-6">
                <p className="font-bold">Fruit: {score}</p>
                <button onClick={() => {setStarted(true); setGameOver(false); setScore(0);}} className="bg-blue-600 px-6 py-1 rounded font-bold">
                    {gameOver ? 'Reset' : started ? 'Restart' : 'Start'}
                </button>
            </div>
            {gameOver && <p className="text-red-500 font-black mt-2">BOOM! Game Over</p>}
        </div>
    );
};

export default CatchObjects;
