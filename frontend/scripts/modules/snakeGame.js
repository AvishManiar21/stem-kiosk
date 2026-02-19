import { saveScore, updateStatistics } from '../storage.js';

/**
 * Classic Snake Game
 */

const GRID_WIDTH = 20;  // Fewer columns to keep board size
const GRID_HEIGHT = 16; // Fewer rows to keep board size
const CELL_SIZE = 50;   // Extra large cells
const INITIAL_SPEED = 200;  // Slower speed (higher = slower)
const SPEED_INCREMENT = 2;

export function mount(container) {
    let canvas, ctx;
    let snake, food, direction, nextDirection, score, gameLoop, speed;
    let isGameOver = false;
    let gameStartTime = Date.now();
    let playTime = 0;

    function init() {
        container.innerHTML = `
      <div class="snake-game">
        <div class="snake-game__header">
          <h3>Snake Game</h3>
          <div class="snake-game__score">
            <span>Current Score:</span>
            <strong id="snakeScore">0</strong>
          </div>
          <button class="snake-game__btn" id="snakeRestart">New Game</button>
        </div>
        <div class="snake-game__canvas-wrapper">
          <canvas id="snakeCanvas" width="${GRID_WIDTH * CELL_SIZE}" height="${GRID_HEIGHT * CELL_SIZE}"></canvas>
          <div class="snake-game__overlay hidden" id="snakeOverlay">
            <h3>Game Over!</h3>
            <p>Score: <span id="finalScore">0</span></p>
            <p class="snake-game__hint">Check Statistics & Leaderboard to see your ranking!</p>
            <button class="snake-game__btn snake-game__btn--large" id="snakePlayAgain">Play Again</button>
          </div>
        </div>
        <div class="snake-game__controls">
          <p>Use arrow keys or WASD to control the snake</p>
          <div class="snake-game__touch-controls">
            <button class="snake-game__arrow" id="snakeUp">↑</button>
            <div class="snake-game__arrow-row">
              <button class="snake-game__arrow" id="snakeLeft">←</button>
              <button class="snake-game__arrow" id="snakeDown">↓</button>
              <button class="snake-game__arrow" id="snakeRight">→</button>
            </div>
          </div>
        </div>
      </div>
    `;

        canvas = document.getElementById('snakeCanvas');
        ctx = canvas.getContext('2d');

        document.getElementById('snakeRestart').addEventListener('click', startGame);
        document.getElementById('snakePlayAgain').addEventListener('click', startGame);

        // Touch controls
        document.getElementById('snakeUp').addEventListener('click', () => changeDirection('UP'));
        document.getElementById('snakeDown').addEventListener('click', () => changeDirection('DOWN'));
        document.getElementById('snakeLeft').addEventListener('click', () => changeDirection('LEFT'));
        document.getElementById('snakeRight').addEventListener('click', () => changeDirection('RIGHT'));

        // Keyboard controls
        document.addEventListener('keydown', handleKeyPress);

        startGame();
    }

    function startGame() {
        snake = [{ x: 10, y: 10 }];
        direction = 'RIGHT';
        nextDirection = 'RIGHT';
        score = 0;
        speed = INITIAL_SPEED;
        isGameOver = false;
        gameStartTime = Date.now();
        playTime = 0;

        document.getElementById('snakeScore').textContent = '0';
        document.getElementById('snakeOverlay').classList.add('hidden');

        spawnFood();

        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(update, speed);
    }

    function update() {
        if (isGameOver) return;

        direction = nextDirection;
        const head = { ...snake[0] };

        // Move head
        switch (direction) {
            case 'UP': head.y--; break;
            case 'DOWN': head.y++; break;
            case 'LEFT': head.x--; break;
            case 'RIGHT': head.x++; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
            endGame();
            return;
        }

        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('snakeScore').textContent = score;
            spawnFood();

            // Increase speed slightly
            if (speed > 50) {
                speed -= SPEED_INCREMENT;
                clearInterval(gameLoop);
                gameLoop = setInterval(update, speed);
            }
        } else {
            snake.pop();
        }

        draw();
    }

    function draw() {
        // Clear canvas with dark background
        ctx.fillStyle = '#0a0f1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw subtle grid
        ctx.strokeStyle = '#1a2332';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= GRID_WIDTH; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i <= GRID_HEIGHT; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(canvas.width, i * CELL_SIZE);
            ctx.stroke();
        }


        // Draw food as apple
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(
            food.x * CELL_SIZE + CELL_SIZE / 2,
            food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 4,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Apple stem
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(
            food.x * CELL_SIZE + CELL_SIZE / 2 - 2,
            food.y * CELL_SIZE + CELL_SIZE / 4,
            4,
            8
        );

        // Draw snake with rounded segments
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Head - bright green with eyes
                ctx.fillStyle = '#4ade80';
                ctx.strokeStyle = '#16a34a';
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.arc(
                    segment.x * CELL_SIZE + CELL_SIZE / 2,
                    segment.y * CELL_SIZE + CELL_SIZE / 2,
                    CELL_SIZE / 2 - 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.stroke();

                // Eyes
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(
                    segment.x * CELL_SIZE + CELL_SIZE / 2 - 8,
                    segment.y * CELL_SIZE + CELL_SIZE / 2 - 5,
                    5,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.beginPath();
                ctx.arc(
                    segment.x * CELL_SIZE + CELL_SIZE / 2 + 8,
                    segment.y * CELL_SIZE + CELL_SIZE / 2 - 5,
                    5,
                    0,
                    Math.PI * 2
                );
                ctx.fill();

                // Pupils
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(
                    segment.x * CELL_SIZE + CELL_SIZE / 2 - 8,
                    segment.y * CELL_SIZE + CELL_SIZE / 2 - 5,
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.beginPath();
                ctx.arc(
                    segment.x * CELL_SIZE + CELL_SIZE / 2 + 8,
                    segment.y * CELL_SIZE + CELL_SIZE / 2 - 5,
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else {
                // Body - darker green
                ctx.fillStyle = '#22c55e';
                ctx.strokeStyle = '#16a34a';
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.arc(
                    segment.x * CELL_SIZE + CELL_SIZE / 2,
                    segment.y * CELL_SIZE + CELL_SIZE / 2,
                    CELL_SIZE / 2 - 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.stroke();
            }
        });

        ctx.shadowBlur = 0;
    }

    function spawnFood() {
        do {
            food = {
                x: Math.floor(Math.random() * GRID_WIDTH),
                y: Math.floor(Math.random() * GRID_HEIGHT)
            };
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    }

    function changeDirection(newDirection) {
        // Prevent reversing
        if (
            (newDirection === 'UP' && direction !== 'DOWN') ||
            (newDirection === 'DOWN' && direction !== 'UP') ||
            (newDirection === 'LEFT' && direction !== 'RIGHT') ||
            (newDirection === 'RIGHT' && direction !== 'LEFT')
        ) {
            nextDirection = newDirection;
        }
    }

    function handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                changeDirection('UP');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                changeDirection('DOWN');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                changeDirection('LEFT');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                changeDirection('RIGHT');
                break;
        }
    }

    async function endGame() {
        isGameOver = true;
        clearInterval(gameLoop);

        // Calculate play time
        playTime = Math.floor((Date.now() - gameStartTime) / 1000);

        // Save score to leaderboard and statistics
        if (score > 0) {
            await saveScore('snakeGame', score);
            await updateStatistics('snakeGame', {
                score,
                playTime,
                result: 'loss' // Snake game doesn't have a "win" condition
            });
        }

        document.getElementById('finalScore').textContent = score;
        document.getElementById('snakeOverlay').classList.remove('hidden');
    }

    function destroy() {
        if (gameLoop) clearInterval(gameLoop);
        document.removeEventListener('keydown', handleKeyPress);
    }

    init();

    return { destroy };
}
