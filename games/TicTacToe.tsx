
import React, { useState } from 'react';

const TicTacToe: React.FC = () => {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [winner, setWinner] = useState<string | null>(null);
    const [isDraw, setIsDraw] = useState(false);

    const checkWinner = (squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i: number) => {
        if (board[i] || winner || isDraw) return;
        
        const newBoard = [...board];
        newBoard[i] = 'X';
        setBoard(newBoard);

        const win = checkWinner(newBoard);
        if (win) {
            setWinner(win);
            return;
        }

        if (newBoard.every(sq => sq !== null)) {
            setIsDraw(true);
            return;
        }

        // AI Turn
        setTimeout(() => {
            const emptyIndices = newBoard.map((v, idx) => v === null ? idx : null).filter(v => v !== null) as number[];
            if (emptyIndices.length > 0) {
                const aiMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                newBoard[aiMove] = 'O';
                setBoard([...newBoard]);
                const winAfterAi = checkWinner(newBoard);
                if (winAfterAi) setWinner(winAfterAi);
            }
        }, 300);
    };

    const reset = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setIsDraw(false);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4">
            <h2 className="text-2xl font-bold text-white mb-6">Tic-Tac-Toe vs AI</h2>
            
            <div className="grid grid-cols-3 gap-3 w-72 h-72">
                {board.map((val, i) => (
                    <button 
                        key={i}
                        onClick={() => handleClick(i)}
                        className={`w-full h-full rounded-xl text-4xl font-black flex items-center justify-center transition-all ${
                            val === 'X' ? 'text-blue-400 bg-slate-800' : 
                            val === 'O' ? 'text-red-400 bg-slate-800' : 'bg-slate-800/50 hover:bg-slate-700'
                        }`}
                    >
                        {val}
                    </button>
                ))}
            </div>

            <div className="mt-8 text-center h-12">
                {winner ? (
                    <p className="text-xl font-bold text-emerald-400">Winner: {winner === 'X' ? 'Player (You)' : 'AI'}</p>
                ) : isDraw ? (
                    <p className="text-xl font-bold text-slate-400">It's a Draw!</p>
                ) : (
                    <p className="text-slate-400">Your Turn (X)</p>
                )}
            </div>

            <button onClick={reset} className="mt-4 bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-500 transition-all">Reset Game</button>
        </div>
    );
};

export default TicTacToe;
