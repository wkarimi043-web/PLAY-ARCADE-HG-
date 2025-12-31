
import React, { useState, useEffect, useCallback } from 'react';

// A collection of starting puzzles (0 represents empty)
const PUZZLES = [
    "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    "000260701680070090190004500820100040004602900050003028009300074040050036703018000",
    "020608000580009700000040000370000500600000004008000013000020000009800036000306090",
    "000000000000003085001020000000507000004000100090000000500000073002010000000040009"
];

const Sudoku: React.FC = () => {
    const [grid, setGrid] = useState<number[][]>(Array(9).fill(0).map(() => Array(9).fill(0)));
    const [initial, setInitial] = useState<boolean[][]>(Array(9).fill(false).map(() => Array(9).fill(false)));
    const [selected, setSelected] = useState<{r: number, c: number} | null>(null);
    const [mistakes, setMistakes] = useState<Set<string>>(new Set());
    const [isWon, setIsWon] = useState(false);

    const loadPuzzle = useCallback(() => {
        const raw = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
        const newGrid = Array(9).fill(0).map(() => Array(9).fill(0));
        const newInitial = Array(9).fill(false).map(() => Array(9).fill(false));
        
        for (let i = 0; i < 81; i++) {
            const r = Math.floor(i / 9);
            const c = i % 9;
            const val = parseInt(raw[i]);
            newGrid[r][c] = val;
            newInitial[r][c] = val !== 0;
        }
        
        setGrid(newGrid);
        setInitial(newInitial);
        setSelected(null);
        setMistakes(new Set());
        setIsWon(false);
    }, []);

    useEffect(() => {
        loadPuzzle();
    }, [loadPuzzle]);

    const checkMistakes = (currentGrid: number[][]) => {
        const newMistakes = new Set<string>();
        
        // Rows and Cols
        for (let i = 0; i < 9; i++) {
            const rowMap = new Map();
            const colMap = new Map();
            for (let j = 0; j < 9; j++) {
                // Check Row
                if (currentGrid[i][j] !== 0) {
                    if (rowMap.has(currentGrid[i][j])) {
                        newMistakes.add(`${i}-${j}`);
                        newMistakes.add(`${i}-${rowMap.get(currentGrid[i][j])}`);
                    }
                    rowMap.set(currentGrid[i][j], j);
                }
                // Check Col
                if (currentGrid[j][i] !== 0) {
                    if (colMap.has(currentGrid[j][i])) {
                        newMistakes.add(`${j}-${i}`);
                        newMistakes.add(`${colMap.get(currentGrid[j][i])}-${i}`);
                    }
                    colMap.set(currentGrid[j][i], j);
                }
            }
        }

        // Squares
        for (let block = 0; block < 9; block++) {
            const blockMap = new Map();
            const startR = Math.floor(block / 3) * 3;
            const startC = (block % 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const r = startR + i;
                    const c = startC + j;
                    const val = currentGrid[r][c];
                    if (val !== 0) {
                        if (blockMap.has(val)) {
                            newMistakes.add(`${r}-${c}`);
                            const [prevR, prevC] = blockMap.get(val);
                            newMistakes.add(`${prevR}-${prevC}`);
                        }
                        blockMap.set(val, [r, c]);
                    }
                }
            }
        }
        
        setMistakes(newMistakes);

        // Win check
        const isFull = currentGrid.every(row => row.every(cell => cell !== 0));
        if (isFull && newMistakes.size === 0) setIsWon(true);
    };

    const handleInput = (num: number) => {
        if (!selected || initial[selected.r][selected.c] || isWon) return;
        
        const newGrid = grid.map(row => [...row]);
        newGrid[selected.r][selected.c] = num;
        setGrid(newGrid);
        checkMistakes(newGrid);
    };

    const isRelated = (r: number, c: number) => {
        if (!selected) return false;
        if (selected.r === r && selected.c === c) return false;
        const sameRow = selected.r === r;
        const sameCol = selected.c === c;
        const sameBlock = Math.floor(selected.r / 3) === Math.floor(r / 3) && 
                         Math.floor(selected.c / 3) === Math.floor(c / 3);
        return sameRow || sameCol || sameBlock;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 select-none touch-none">
            <div className="mb-6 flex justify-between w-full max-w-[360px] items-end">
                <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter">SUDOKU PRO</h2>
                    <p className="text-[10px] uppercase font-bold text-blue-500 tracking-widest">Logic Challenge</p>
                </div>
                <button onClick={loadPuzzle} className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                    NEW GAME
                </button>
            </div>

            {/* Main Sudoku Grid */}
            <div className="bg-slate-800 p-1 rounded-xl shadow-2xl border-2 border-slate-700 relative">
                <div className="grid grid-cols-9 bg-slate-700 gap-px border border-slate-700">
                    {grid.map((row, r) => row.map((val, c) => {
                        const isSel = selected?.r === r && selected?.c === c;
                        const isRel = isRelated(r, c);
                        const isErr = mistakes.has(`${r}-${c}`);
                        const isInit = initial[r][c];
                        const isSameNum = selected && val !== 0 && val === grid[selected.r][selected.c] && !isSel;
                        
                        // Formatting borders for 3x3 sections
                        const borderR = (c + 1) % 3 === 0 && c < 8 ? 'border-r-2 border-slate-900' : '';
                        const borderB = (r + 1) % 3 === 0 && r < 8 ? 'border-b-2 border-slate-900' : '';

                        return (
                            <button
                                key={`${r}-${c}`}
                                onClick={() => setSelected({r, c})}
                                className={`
                                    w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-bold transition-all
                                    ${isSel ? 'bg-blue-600 text-white z-10' : 
                                      isSameNum ? 'bg-blue-900/60 text-white' :
                                      isRel ? 'bg-slate-800/80 text-slate-300' : 
                                      'bg-slate-800 text-slate-400'}
                                    ${isErr ? 'text-red-400' : ''}
                                    ${isInit ? 'text-white font-black opacity-100' : 'font-medium'}
                                    ${borderR} ${borderB}
                                    hover:bg-slate-700
                                `}
                            >
                                {val !== 0 ? val : ''}
                            </button>
                        );
                    }))}
                </div>

                {isWon && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm rounded-lg animate-in fade-in duration-500 z-30">
                        <div className="text-5xl mb-4">✨</div>
                        <h2 className="text-3xl font-black text-emerald-400 mb-2 italic uppercase">PUZZLE SOLVED</h2>
                        <button onClick={loadPuzzle} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-500 transition-all active:scale-95">PLAY AGAIN</button>
                    </div>
                )}
            </div>

            {/* Number Pad */}
            <div className="mt-8 w-full max-w-[360px]">
                <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                        <button
                            key={n}
                            onClick={() => handleInput(n)}
                            className={`
                                h-12 rounded-xl font-black text-xl transition-all active:scale-90 shadow-lg
                                ${n === 0 ? 'bg-slate-700 text-slate-400 col-span-1' : 'bg-blue-600 text-white hover:bg-blue-500'}
                            `}
                        >
                            {n === 0 ? '⌫' : n}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 opacity-60">
                <span>1. Select Cell</span>
                <span>2. Pick Number</span>
            </div>
        </div>
    );
};

export default Sudoku;
