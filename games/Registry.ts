
import { Game } from '../types';
import Snake from './Snake';
import TicTacToe from './TicTacToe';
import MemoryMatch from './MemoryMatch';
import Clicker from './Clicker';
import WhackAMole from './WhackAMole';
import Quiz from './Quiz';
import MathPuzzle from './MathPuzzle';
import ColorMatch from './ColorMatch';
import WordGuess from './WordGuess';
import Sudoku from './Sudoku';
import BrickBreaker from './BrickBreaker';
import CatchObjects from './CatchObjects';
import Game2048 from './Game2048';
import BlockPuzzle from './BlockPuzzle';
import BalloonPop from './BalloonPop';
import Maze from './Maze';
import EndlessRunner from './EndlessRunner';
import FlappyBird from './FlappyBird';
import BubbleShooter from './BubbleShooter';
import SimpleRacing from './SimpleRacing';

export const GAMES_REGISTRY: Game[] = [
    {
        id: 'snake',
        title: 'Snake Pro',
        description: 'The classic arcade hit! Navigate the snake to eat food and grow longer. Avoid hitting the walls or your own tail. How high can you score?',
        instructions: '• Use ARROW KEYS or WASD to turn\n• On Mobile: SWIPE in the direction you want to turn\n• Collect green food to grow and gain points\n• Don\'t hit the edges or yourself!',
        category: 'Classic Arcade',
        icon: '🐍',
        component: Snake
    },
    {
        id: 'tictactoe',
        title: 'Tic-Tac-Toe',
        description: 'A simple yet strategic board game for all ages. Play against the AI and try to get three in a row!',
        instructions: '• Click any empty square to place your mark (X)\n• AI will automatically place its mark (O)\n• Get 3 marks in a horizontal, vertical, or diagonal line to win!',
        category: 'Board Game',
        icon: '❌',
        component: TicTacToe
    },
    {
        id: 'memory',
        title: 'Memory Card Match',
        description: 'Test your concentration and memory skills. Flip cards to find matching pairs with as few moves as possible.',
        instructions: '• Click a card to flip it over\n• Click another card to find a match\n• If they match, they stay up\n• If not, they flip back after a second\n• Match all pairs to win!',
        category: 'Brain Training',
        icon: '🎴',
        component: MemoryMatch
    },
    {
        id: 'clicker',
        title: 'Cookie Clicker Pro',
        description: 'An addictive incremental game. Click the main item to earn points and unlock powerful upgrades.',
        instructions: '• Click the main object to earn points\n• Use points to buy upgrades in the shop\n• Upgrades increase your points per click!',
        category: 'Casual',
        icon: '🍪',
        component: Clicker
    },
    {
        id: 'whack',
        title: 'Whack-a-Mole',
        description: 'Fast-paced reaction game. Moles are popping up everywhere! Whack them before they hide back in their holes.',
        instructions: '• Click/Tap the moles as they appear\n• Don\'t miss! You have limited time\n• Be quick, they hide faster as you score more!',
        category: 'Reflex',
        icon: '🔨',
        component: WhackAMole
    },
    {
        id: 'quiz',
        title: 'General Knowledge Quiz',
        description: 'Challenge your intellect with a variety of interesting questions. How many can you get right in a row?',
        instructions: '• Read the question carefully\n• Choose one of the four options\n• Correct answers give points\n• See your final score at the end!',
        category: 'Educational',
        icon: '❓',
        component: Quiz
    },
    {
        id: 'math',
        title: 'Math Challenge',
        description: 'Sharpen your mental arithmetic skills. Solve as many equations as possible before time runs out.',
        instructions: '• Solve the equation shown\n• Type or click the correct answer\n• Answer as many as you can within 60 seconds!',
        category: 'Brain Training',
        icon: '➕',
        component: MathPuzzle
    },
    {
        id: 'color',
        title: 'Color Matcher',
        description: 'A test of focus. Match the color name with the actual text color to win. It\'s harder than it looks!',
        instructions: '• Does the COLOR NAME match the TEXT COLOR?\n• Click TRUE or FALSE\n• Be fast, the timer is ticking!',
        category: 'Reflex',
        icon: '🎨',
        component: ColorMatch
    },
    {
        id: 'word',
        title: 'Word Guesser',
        description: 'A fun vocabulary game. Guess the secret word one letter at a time. Classic hangman-style mechanics.',
        instructions: '• Guess letters to fill in the blanks\n• You have limited incorrect guesses\n• Use clues to figure out the word!',
        category: 'Puzzle',
        icon: '📝',
        component: WordGuess
    },
    {
        id: 'sudoku',
        title: 'Sudoku Lite',
        description: 'The ultimate number logic puzzle. Fill the grid so that every row, column, and subgrid contains all digits.',
        instructions: '• Fill empty cells with numbers 1-9\n• No duplicates in any row, column, or 3x3 block\n• Click a cell and then choose a number!',
        category: 'Logic',
        icon: '🔢',
        component: Sudoku
    },
    {
        id: 'brick',
        title: 'Brick Breaker',
        description: 'Classic arcade brick-busting action. Use the paddle to bounce the ball and destroy all layers of bricks.',
        instructions: '• Use ARROW KEYS or MOUSE to move the paddle\n• Don\'t let the ball fall off the bottom\n• Break all bricks to clear the level!',
        category: 'Classic Arcade',
        icon: '🧱',
        component: BrickBreaker
    },
    {
        id: 'catch',
        title: 'Falling Catcher',
        description: 'Catch the falling fruits and avoid the bombs! A simple and fun game for everyone.',
        instructions: '• Move your basket LEFT and RIGHT\n• Catch falling fruits for points\n• Avoid bombs at all costs!',
        category: 'Casual',
        icon: '🍎',
        component: CatchObjects
    },
    {
        id: '2048',
        title: '2048 Game',
        description: 'Join the numbers and get to the 2048 tile! A legendary mathematical puzzle game.',
        instructions: '• Use ARROW KEYS to slide tiles\n• Same numbers merge into one when they touch\n• Reach 2048 to win!',
        category: 'Puzzle',
        icon: '🎲',
        component: Game2048
    },
    {
        id: 'block',
        title: 'Block Puzzle',
        description: 'Fit the falling blocks together to create solid lines and clear the board. Retro vibes!',
        instructions: '• ARROW KEYS to move and rotate\n• DOWN to speed up drop\n• Clear full lines to score points!',
        category: 'Puzzle',
        icon: '🧊',
        component: BlockPuzzle
    },
    {
        id: 'balloon',
        title: 'Balloon Pop',
        description: 'Tap the balloons as they float up! A colorful and relaxing game perfect for a quick break.',
        instructions: '• Click/Tap rising balloons\n• Different colors give different points\n• Don\'t let too many escape!',
        category: 'Casual',
        icon: '🎈',
        component: BalloonPop
    },
    {
        id: 'maze',
        title: 'Maze Runner',
        description: 'Find your way through complex labyrinths. Every second counts in this exploration game.',
        instructions: '• Use ARROW KEYS to navigate\n• Find the exit at the opposite corner\n• Complete as fast as possible!',
        category: 'Logic',
        icon: '🌀',
        component: Maze
    },
    {
        id: 'runner',
        title: 'Endless Run',
        description: 'Run as far as you can while jumping over obstacles. An infinite challenge for high-score seekers.',
        instructions: '• SPACE or CLICK to jump\n• Timing is everything!\n• Speed increases over time!',
        category: 'Reflex',
        icon: '🏃',
        component: EndlessRunner
    },
    {
        id: 'flappy',
        title: 'Flappy Wings',
        description: 'Flap your way through the pipes. One of the most challenging reflex games ever made.',
        instructions: '• Click or press SPACE to flap\n• Navigate through the gaps\n• Don\'t hit the pipes or the ground!',
        category: 'Classic Arcade',
        icon: '🐦',
        component: FlappyBird
    },
    {
        id: 'bubble',
        title: 'Bubble Blast',
        description: 'Aim and shoot bubbles to match 3 or more of the same color and clear the board.',
        instructions: '• Click/Tap to shoot a bubble\n• Match 3+ bubbles to pop them\n• Clear all bubbles to advance!',
        category: 'Puzzle',
        icon: '🫧',
        component: BubbleShooter
    },
    {
        id: 'racing',
        title: 'Nitro Racing',
        description: 'Top-down racing at its finest. Overtake cars and stay on the track to become the champion.',
        instructions: '• LEFT/RIGHT to steer\n• Avoid other cars\n• Collect fuel to keep going!',
        category: 'Racing',
        icon: '🏎️',
        component: SimpleRacing
    }
];
