import React from 'react';

export interface Game {
    id: string;
    title: string;
    description: string;
    instructions: string;
    category: string;
    icon: string;
    // Fix: Add React import to resolve the React.FC namespace
    component: React.FC<any>;
}

export interface GameState {
    score: number;
    isGameOver: boolean;
    isStarted: boolean;
}