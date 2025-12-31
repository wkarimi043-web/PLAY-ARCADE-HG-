
import React from 'react';

interface PlaceholderProps {
    gameTitle: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ gameTitle }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-8 text-center text-white">
            <div className="text-6xl mb-4 opacity-50">🕹️</div>
            <h2 className="text-2xl font-bold mb-2">{gameTitle}</h2>
            <p className="text-slate-400 max-w-sm mb-6">
                This game is currently being optimized for your device. Check back soon for the full version!
            </p>
            <button className="bg-blue-600 px-6 py-2 rounded-full font-bold">Coming Soon</button>
        </div>
    );
};

export default Placeholder;
