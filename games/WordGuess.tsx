
import React, { useState, useEffect } from 'react';

const WORDS = ["GALAXY", "CODING", "GAMING", "ROBOT", "PIXEL", "PYTHON", "REACT", "CANVAS"];

const WordGuess: React.FC = () => {
    const [word, setWord] = useState("");
    const [guessed, setGuessed] = useState<string[]>([]);
    const [mistakes, setMistakes] = useState(0);
    const maxMistakes = 6;

    useEffect(() => {
        newGame();
    }, []);

    const newGame = () => {
        setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
        setGuessed([]);
        setMistakes(0);
    };

    const handleGuess = (letter: string) => {
        if (guessed.includes(letter) || mistakes >= maxMistakes || isWin) return;
        setGuessed([...guessed, letter]);
        if (!word.includes(letter)) setMistakes(m => m + 1);
    };

    const isWin = word !== "" && word.split('').every(l => guessed.includes(l));

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-6 text-white">
            <div className="mb-12 text-center">
                <div className="flex justify-center gap-2 mb-8">
                    {word.split('').map((l, i) => (
                        <span key={i} className="w-10 h-12 border-b-4 border-blue-500 text-3xl font-black flex items-center justify-center">
                            {guessed.includes(l) ? l : ''}
                        </span>
                    ))}
                </div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Mistakes: <span className="text-red-400">{mistakes} / {maxMistakes}</span>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-sm mb-8">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => (
                    <button 
                        key={l}
                        onClick={() => handleGuess(l)}
                        disabled={guessed.includes(l)}
                        className={`w-8 h-10 rounded text-sm font-bold transition-all ${
                            guessed.includes(l) 
                            ? (word.includes(l) ? 'bg-emerald-600 opacity-50' : 'bg-red-600 opacity-50') 
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                    >
                        {l}
                    </button>
                ))}
            </div>

            {(isWin || mistakes >= maxMistakes) && (
                <div className="text-center bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className={`text-2xl font-black mb-2 ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isWin ? 'Correct!' : 'Game Over!'}
                    </h3>
                    <p className="text-slate-400 mb-4">The word was: <span className="text-white font-bold">{word}</span></p>
                    <button onClick={newGame} className="bg-blue-600 px-6 py-2 rounded-lg font-bold">Play Again</button>
                </div>
            )}
        </div>
    );
};

export default WordGuess;
