
import React, { useState, useEffect } from 'react';

const QUESTION_POOL = [
    { q: "Which planet is known as the Red Planet?", a: ["Earth", "Mars", "Jupiter", "Venus"], c: 1 },
    { q: "What is the capital of France?", a: ["London", "Berlin", "Paris", "Madrid"], c: 2 },
    { q: "Which animal is the largest mammal in the world?", a: ["Elephant", "Blue Whale", "Giraffe", "Shark"], c: 1 },
    { q: "Who painted the Mona Lisa?", a: ["Picasso", "Van Gogh", "Da Vinci", "Rembrandt"], c: 2 },
    { q: "What is the hardest natural substance on Earth?", a: ["Gold", "Iron", "Diamond", "Steel"], c: 2 },
    { q: "How many continents are there on Earth?", a: ["5", "6", "7", "8"], c: 2 },
    { q: "Which element has the chemical symbol 'O'?", a: ["Gold", "Oxygen", "Silver", "Iron"], c: 1 },
    { q: "What is the smallest prime number?", a: ["0", "1", "2", "3"], c: 2 },
    { q: "In which year did the Titanic sink?", a: ["1905", "1912", "1920", "1935"], c: 1 },
    { q: "What is the currency of Japan?", a: ["Won", "Yuan", "Yen", "Dollar"], c: 2 },
    { q: "Which gas do plants absorb from the atmosphere?", a: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], c: 1 },
    { q: "What is the largest organ in the human body?", a: ["Heart", "Brain", "Skin", "Liver"], c: 2 },
    { q: "Who wrote 'Romeo and Juliet'?", a: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], c: 1 },
    { q: "What is the speed of light?", a: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"], c: 0 },
    { q: "Which ocean is the largest?", a: ["Atlantic", "Indian", "Arctic", "Pacific"], c: 3 },
    { q: "What is the square root of 64?", a: ["6", "7", "8", "9"], c: 2 },
    { q: "Which country is home to the Kangaroo?", a: ["India", "Australia", "Brazil", "South Africa"], c: 1 },
    { q: "What is the boiling point of water in Celsius?", a: ["50°C", "90°C", "100°C", "120°C"], c: 2 },
    { q: "Who was the first person to walk on the moon?", a: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "Michael Collins"], c: 1 },
    { q: "What is the most spoken language in the world?", a: ["English", "Spanish", "Hindi", "Mandarin Chinese"], c: 3 },
    { q: "Which organ pumps blood throughout the human body?", a: ["Lungs", "Brain", "Heart", "Stomach"], c: 2 },
    { q: "What is the chemical symbol for Gold?", a: ["Ag", "Au", "Fe", "Pb"], c: 1 },
    { q: "Which planet is closest to the Sun?", a: ["Venus", "Mars", "Mercury", "Earth"], c: 2 },
    { q: "What is the capital city of Italy?", a: ["Venice", "Milan", "Rome", "Florence"], c: 2 },
    { q: "How many strings does a standard violin have?", a: ["3", "4", "5", "6"], c: 1 },
    { q: "What is the main ingredient in guacamole?", a: ["Tomato", "Onion", "Avocado", "Pepper"], c: 2 },
    { q: "In which city are the Pyramids of Giza located?", a: ["Cairo", "Luxor", "Alexandria", "Giza"], c: 0 },
    { q: "Who is known as the 'Father of Computers'?", a: ["Alan Turing", "Charles Babbage", "Steve Jobs", "Bill Gates"], c: 1 },
    { q: "Which bone is the longest in the human body?", a: ["Skull", "Rib", "Femur", "Spine"], c: 2 },
    { q: "What is the capital of Canada?", a: ["Toronto", "Vancouver", "Montreal", "Ottawa"], c: 3 },
    { q: "What do you call a baby kangaroo?", a: ["Cub", "Joey", "Calf", "Foal"], c: 1 },
    { q: "Which is the tallest mountain in the world?", a: ["K2", "Mount Everest", "Kilimanjaro", "Denali"], c: 1 }
];

const Quiz: React.FC = () => {
    const [questions, setQuestions] = useState<typeof QUESTION_POOL>([]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [started, setStarted] = useState(false);

    // Function to shuffle and select questions
    const initializeQuiz = () => {
        const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
        // Select 10 random questions for each session
        const selected = shuffled.slice(0, 10).map(q => {
            // Also shuffle the answers for each question
            const answers = [...q.a];
            const correctAnswerText = q.a[q.c];
            const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
            const newCorrectIdx = shuffledAnswers.indexOf(correctAnswerText);
            return {
                ...q,
                a: shuffledAnswers,
                c: newCorrectIdx
            };
        });
        setQuestions(selected);
        setCurrent(0);
        setScore(0);
        setFinished(false);
        setStarted(true);
    };

    const handleAnswer = (idx: number) => {
        if (idx === questions[current].c) setScore(s => s + 1);
        
        if (current + 1 < questions.length) {
            setCurrent(current + 1);
        } else {
            setFinished(true);
        }
    };

    const reset = () => {
        initializeQuiz();
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-6 touch-none">
            {!started ? (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="text-7xl mb-6">🧠</div>
                    <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">Mega Quiz Challenge</h2>
                    <p className="text-slate-400 mb-8 max-w-sm">Test your knowledge with 10 random questions from our massive library!</p>
                    <button onClick={initializeQuiz} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all active:scale-95">
                        START CHALLENGE
                    </button>
                </div>
            ) : !finished ? (
                <div className="w-full max-w-md animate-in slide-in-from-right duration-300">
                    <div className="mb-8">
                        <div className="flex justify-between text-xs text-blue-400 font-bold mb-2 uppercase tracking-widest">
                            <span>Question {current + 1} of {questions.length}</span>
                            <span>Score: {score}</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out" 
                                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 mb-6 shadow-xl">
                        <h3 className="text-2xl font-bold text-white leading-tight">{questions[current].q}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {questions[current].a.map((opt, i) => (
                            <button 
                                key={`${current}-${i}`}
                                onClick={() => handleAnswer(i)}
                                className="w-full p-5 text-left bg-slate-800 hover:bg-blue-600 hover:border-blue-400 text-slate-200 hover:text-white rounded-2xl border border-slate-700 transition-all active:scale-[0.97] group flex items-center gap-4"
                            >
                                <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-blue-500 flex items-center justify-center font-bold text-xs">
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="font-semibold">{opt}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center animate-in zoom-in duration-500">
                    <div className="text-7xl mb-4">🏆</div>
                    <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">CHALLENGE COMPLETE</h2>
                    <p className="text-slate-400 mb-8 text-lg">You scored <span className="text-blue-400 font-black text-3xl">{score}</span> out of {questions.length}</p>
                    
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8 inline-block">
                        <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-1">Performance Rank</p>
                        <p className="text-xl font-black text-emerald-400">
                            {score === 10 ? "PERFECT SCORE!" : score >= 8 ? "GENIUS LEVEL" : score >= 5 ? "GREAT JOB" : "KEEP LEARNING"}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button onClick={reset} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all active:scale-95">
                            NEW CHALLENGE
                        </button>
                    </div>
                </div>
            )}
            
            {started && !finished && (
                <button 
                    onClick={() => { setStarted(false); setFinished(false); }} 
                    className="mt-12 text-slate-600 hover:text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                >
                    Quit Challenge
                </button>
            )}
        </div>
    );
};

export default Quiz;
