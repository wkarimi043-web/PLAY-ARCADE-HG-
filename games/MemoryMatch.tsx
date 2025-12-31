
import React, { useState, useEffect } from 'react';

const ICONS = ['🔥', '⭐', '💎', '🍀', '🍎', '🌙', '☀️', '⚡'];

const MemoryMatch: React.FC = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [solved, setSolved] = useState<number[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        const shuffled = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, id) => ({ id, icon }));
        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setDisabled(false);
    };

    const handleClick = (id: number) => {
        if (disabled || flipped.includes(id) || solved.includes(id)) return;

        if (flipped.length === 1) {
            setDisabled(true);
            setFlipped([...flipped, id]);
            setMoves(m => m + 1);

            if (cards[flipped[0]].icon === cards[id].icon) {
                setSolved([...solved, flipped[0], id]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        } else {
            setFlipped([id]);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4">
            <div className="mb-6 flex justify-between w-full max-w-xs text-white">
                <span className="font-bold">Moves: {moves}</span>
                <button onClick={initGame} className="text-blue-400 hover:underline">New Game</button>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {cards.map(card => (
                    <button
                        key={card.id}
                        onClick={() => handleClick(card.id)}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-xl text-3xl flex items-center justify-center transition-all duration-300 transform ${
                            flipped.includes(card.id) || solved.includes(card.id) 
                            ? 'bg-blue-600 rotate-0' 
                            : 'bg-slate-700 rotate-180'
                        }`}
                    >
                        {(flipped.includes(card.id) || solved.includes(card.id)) ? card.icon : '❓'}
                    </button>
                ))}
            </div>

            {solved.length === cards.length && cards.length > 0 && (
                <div className="mt-8 text-center">
                    <p className="text-2xl font-bold text-emerald-400 mb-2">Great Memory!</p>
                    <p className="text-slate-400">Cleared in {moves} moves</p>
                </div>
            )}
        </div>
    );
};

export default MemoryMatch;
