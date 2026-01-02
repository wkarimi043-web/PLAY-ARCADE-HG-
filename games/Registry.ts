import { Game } from '../types.ts';
import Snake from './Snake.tsx';
import TicTacToe from './TicTacToe.tsx';
import MemoryMatch from './MemoryMatch.tsx';
import Clicker from './Clicker.tsx';
import WhackAMole from './WhackAMole.tsx';
import Quiz from './Quiz.tsx';
import MathPuzzle from './MathPuzzle.tsx';
import ColorMatch from './ColorMatch.tsx';
import WordGuess from './WordGuess.tsx';
import Sudoku from './Sudoku.tsx';
import BrickBreaker from './BrickBreaker.tsx';
import CatchObjects from './CatchObjects.tsx';
import Game2048 from './Game2048.tsx';
import BlockPuzzle from './BlockPuzzle.tsx';
import BalloonPop from './BalloonPop.tsx';
import Maze from './Maze.tsx';
import EndlessRunner from './EndlessRunner.tsx';
import FlappyBird from './FlappyBird.tsx';
import BubbleShooter from './BubbleShooter.tsx';
import SimpleRacing from './SimpleRacing.tsx';

export const GAMES_REGISTRY: Game[] = [
    {
        id: 'snake',
        title: 'Snake Pro',
        description: 'The classic arcade hit! Navigate the snake to eat food and grow longer. Avoid hitting the walls or your own tail.',
        instructions: '• Use ARROW KEYS or WASD to turn\n• On Mobile: SWIPE in the direction you want to turn\n• Collect green food to grow and gain points\n• Don\'t hit the edges or yourself!',
        category: 'Classic Arcade',
        icon: '🐍',
        component: Snake,
        seoData: {
            longDescription: 'Experience the ultimate version of the classic Nokia Snake game. Snake Pro at Play Arcade HQ brings back the nostalgic gameplay with modern 60FPS performance and responsive controls. Whether you are playing on a desktop with a keyboard or on a mobile device with swipe gestures, our version is optimized for zero-latency. This unblocked game is perfect for quick breaks at school or work, offering an endless challenge that tests your reflexes and spatial awareness.',
            features: [
                'Responsive Swipe Controls for Mobile',
                'High-Performance Canvas Rendering',
                'Global High Score Tracking (Local)',
                'Classic 8-bit Sound Effects',
                'Progressive Difficulty Scaling'
            ],
            faq: [
                { question: 'Is Snake Pro free to play?', answer: 'Yes, Snake Pro is 100% free and requires no downloads or registration.' },
                { question: 'Can I play this unblocked at school?', answer: 'Play Arcade HQ uses lightweight HTML5 technology which often works on restricted networks.' }
            ],
            keywords: ['free snake game', 'unblocked snake', 'browser arcade', 'nokia snake online']
        }
    },
    {
        id: '2048',
        title: '2048 Master',
        description: 'Join the numbers and get to the 2048 tile! A legendary mathematical puzzle game for brain training.',
        instructions: '• Use ARROW KEYS to slide tiles\n• Same numbers merge into one when they touch\n• Reach 2048 to win!',
        category: 'Puzzle',
        icon: '🎲',
        component: Game2048,
        seoData: {
            longDescription: '2048 Master is the premier version of the world-famous mathematical puzzle. Your goal is simple but the strategy is deep: slide numbered tiles on a 4x4 grid to combine them. When two tiles with the same number touch, they merge into one! Can you reach the legendary 2048 tile? This version features smooth animations, an auto-save score system, and a clean, distraction-free interface optimized for both landscape and portrait modes.',
            features: [
                'Smooth 2D Animations',
                'Undo Last Move Support',
                'High Score Persistence',
                'Dark Mode Optimized Interface',
                'Educational Math Logic'
            ],
            faq: [
                { question: 'What is the highest possible tile in 2048?', answer: 'While the goal is 2048, skilled players can reach 4096, 8192, and beyond!' },
                { question: 'Is there a trick to winning 2048?', answer: 'A common strategy is to keep your highest number tile in one of the corners.' }
            ],
            keywords: ['2048 game online', 'math puzzles browser', '2048 unblocked', 'logic games']
        }
    },
    {
        id: 'brick',
        title: 'Brick Breaker',
        description: 'Classic arcade brick-busting action. Use the paddle to bounce the ball and destroy all layers of bricks.',
        instructions: '• Use ARROW KEYS or MOUSE to move the paddle\n• Don\'t let the ball fall off the bottom\n• Break all bricks to clear the level!',
        category: 'Classic Arcade',
        icon: '🧱',
        component: BrickBreaker,
        seoData: {
            longDescription: 'Relive the golden age of arcade gaming with our Brick Breaker. Inspired by legends like Breakout and Arkanoid, this HTML5 game features multi-layered brick patterns and physics-based ball bouncing. We have optimized the collision detection to feel crisp and fair, ensuring that your skill with the paddle is the only thing that matters. Perfect for retro gaming enthusiasts looking for a quick, unblocked session in their browser.',
            features: [
                'Classic Retro Aesthetics',
                'Precise Paddle Physics',
                'Increasing Ball Speed Challenges',
                'Desktop and Tablet Optimized',
                'Vibrant Visual Feedback'
            ],
            faq: [
                { question: 'How many levels are in Brick Breaker?', answer: 'Our version features an endless level cycle with increasing difficulty and speed.' },
                { question: 'Can I use my mouse to control the paddle?', answer: 'Yes! Our game supports both mouse movement and keyboard arrow keys.' }
            ],
            keywords: ['brick breaker unblocked', 'retro breakout game', 'classic arcade bricks', 'atari style games']
        }
    },
    {
        id: 'quiz',
        title: 'Knowledge Pro Quiz',
        description: 'Challenge your intellect with a variety of interesting questions. How many can you get right?',
        instructions: '• Read the question carefully\n• Choose one of the four options\n• Correct answers give points\n• See your final score at the end!',
        category: 'Educational',
        icon: '❓',
        component: Quiz,
        seoData: {
            longDescription: 'Test your IQ and general knowledge with our Trivia Quiz Master. Featuring a database of hundreds of questions spanning geography, science, history, and pop culture, this educational game is perfect for students and lifelong learners. Each session generates a random set of 10 questions to keep the experience fresh. Boost your brain power and see if you can achieve a perfect score!',
            features: [
                'Randomized Question Selection',
                'Instant Feedback on Answers',
                'Performance Ranking System',
                'Wide Range of Trivia Categories',
                'Educational for All Ages'
            ],
            faq: [
                { question: 'Are the questions different every time?', answer: 'Yes, our quiz engine selects 10 random questions from a large pool for every new session.' },
                { question: 'Can I use this for school practice?', answer: 'Absolutely! It covers many general knowledge topics found in school curriculums.' }
            ],
            keywords: ['trivia quiz online', 'general knowledge games', 'educational unblocked games', 'iq test browser']
        }
    },
    {
        id: 'tictactoe',
        title: 'Tic-Tac-Toe',
        description: 'A simple yet strategic board game. Play against our smart AI and try to get three in a row!',
        instructions: '• Click any empty square to place your mark (X)\n• AI will automatically place its mark (O)\n• Get 3 marks in a line to win!',
        category: 'Board Game',
        icon: '❌',
        component: TicTacToe
    },
    {
        id: 'memory',
        title: 'Memory Card Match',
        description: 'Test your concentration and memory skills. Flip cards to find matching pairs with as few moves as possible.',
        instructions: '• Click a card to flip it over\n• Click another card to find a match\n• Match all pairs to win!',
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
        description: 'Fast-paced reaction game. Moles are popping up everywhere! Whack them before they hide back.',
        instructions: '• Click/Tap the moles as they appear\n• Don\'t miss! You have limited time\n• Be quick, they hide faster as you score more!',
        category: 'Reflex',
        icon: '🔨',
        component: WhackAMole
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
        id: 'catch',
        title: 'Falling Catcher',
        description: 'Catch the falling fruits and avoid the bombs! A simple and fun game for everyone.',
        instructions: '• Move your basket LEFT and RIGHT\n• Catch falling fruits for points\n• Avoid bombs at all costs!',
        category: 'Casual',
        icon: '🍎',
        component: CatchObjects
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