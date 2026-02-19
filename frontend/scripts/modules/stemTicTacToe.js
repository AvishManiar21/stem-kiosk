// STEM-themed Tic Tac Toe
// X = Atom, O = Electron

import { saveScore, updateStatistics } from '../storage.js';

const STEM_FACTS = [
  "Atoms are the basic building blocks of matter, consisting of protons, neutrons, and electrons.",
  "Electrons orbit the nucleus of an atom in energy levels called shells.",
  "The periodic table organizes elements by atomic number and chemical properties.",
  "Chemical bonds form when atoms share or transfer electrons.",
  "Molecules are groups of atoms bonded together, like H₂O (water).",
  "Ions are atoms that have gained or lost electrons, giving them a charge.",
  "The nucleus contains protons (positive charge) and neutrons (neutral charge).",
  "Isotopes are atoms of the same element with different numbers of neutrons.",
  "Valence electrons determine an element's chemical reactivity.",
  "The atomic number equals the number of protons in an atom's nucleus.",
  "Covalent bonds occur when atoms share electrons equally.",
  "Ionic bonds form when electrons are transferred between atoms.",
  "The electron cloud model shows electrons in probability regions around the nucleus.",
  "Quantum mechanics describes the behavior of electrons at the atomic level.",
  "The periodic table's groups (columns) share similar chemical properties.",
  "Metals conduct electricity because their electrons can move freely.",
  "Noble gases have full outer electron shells, making them stable and unreactive.",
  "Chemical reactions involve the rearrangement of atoms and electrons.",
  "The mass number is the sum of protons and neutrons in an atom.",
  "Electron configuration describes how electrons are distributed in atomic orbitals."
];

function getRandomFact() {
  return STEM_FACTS[Math.floor(Math.random() * STEM_FACTS.length)];
}

function checkWinner(board) {
  const lines = [
    // Rows
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // Columns
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // Diagonals
    [0, 4, 8], [2, 4, 6]
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

function getBestMove(board, player) {
  // Simple AI: Try to win, block opponent, or take center/corner
  const opponent = player === 'X' ? 'O' : 'X';
  
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = player;
      if (checkWinner(board) === player) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  
  // Block opponent
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = opponent;
      if (checkWinner(board) === opponent) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  
  // Take center
  if (board[4] === null) return 4;
  
  // Take corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Take any available
  const available = board.map((cell, i) => cell === null ? i : null).filter(i => i !== null);
  return available[Math.floor(Math.random() * available.length)];
}

export function mount(root) {
  let board = Array(9).fill(null);
  let currentPlayer = 'X'; // Atom (X) goes first
  let gameOver = false;
  let winner = null;
  let xWins = 0;
  let oWins = 0;
  let draws = 0;
  let currentFact = getRandomFact();
  let gameMode = null; // 'multiplayer' or 'computer'
  let gameStartTime = Date.now();
  let playTime = 0;

  const container = document.createElement('div');
  container.className = 'stem-tic-tac-toe';
  container.innerHTML = `
    <div class="stem-tic-tac-toe__mode-selection" id="modeSelection">
      <h2 class="stem-tic-tac-toe__mode-title">Select Game Mode</h2>
      <div class="stem-tic-tac-toe__mode-buttons">
        <button class="stem-tic-tac-toe__mode-btn" data-mode="multiplayer">
          <div class="stem-tic-tac-toe__mode-icon">👥</div>
          <h3>Multiplayer</h3>
          <p>Play against a friend</p>
        </button>
        <button class="stem-tic-tac-toe__mode-btn" data-mode="computer">
          <div class="stem-tic-tac-toe__mode-icon">🤖</div>
          <h3>vs Computer</h3>
          <p>Play against AI</p>
        </button>
      </div>
    </div>
    
    <div class="stem-tic-tac-toe__game hidden" id="gameContainer">
      <div class="stem-tic-tac-toe__top-bar">
        <div class="stem-tic-tac-toe__scores">
          <div class="stem-tic-tac-toe__badge">
            <span>ATOM</span>
            <strong>${xWins}</strong>
          </div>
          <div class="stem-tic-tac-toe__badge">
            <span>ELECTRON</span>
            <strong>${oWins}</strong>
          </div>
          <div class="stem-tic-tac-toe__badge">
            <span>DRAWS</span>
            <strong>${draws}</strong>
          </div>
        </div>
        <div class="stem-tic-tac-toe__actions">
          <button class="stem-tic-tac-toe__btn" id="changeModeBtn">Change Mode</button>
          <button class="stem-tic-tac-toe__btn" id="resetBtn">New Game</button>
        </div>
      </div>
      
      <div class="stem-tic-tac-toe__board-wrapper">
        <div style="position: relative; width: 100%; max-width: 700px;">
          <div class="stem-tic-tac-toe__board" id="gameBoard">
            ${Array(9).fill(0).map((_, i) => `
              <button class="stem-tic-tac-toe__cell" data-index="${i}" aria-label="Cell ${i + 1}">
                <span class="stem-tic-tac-toe__mark"></span>
              </button>
            `).join('')}
          </div>
          
          <div class="stem-tic-tac-toe__overlay hidden" id="gameOverlay">
            <h3 id="overlayTitle">Game Over</h3>
            <p id="overlayMessage"></p>
            <button class="stem-tic-tac-toe__btn" id="playAgainBtn">Play Again</button>
          </div>
        </div>
        
        <div class="stem-tic-tac-toe__status" id="gameStatus">
          <div class="stem-tic-tac-toe__current-player">
            <span>Current Player:</span>
            <strong class="stem-tic-tac-toe__player-mark" id="currentPlayerMark">ATOM</strong>
          </div>
        </div>
        
        <div class="stem-tic-tac-toe__fact" id="factDisplay">
          <h4>STEM Fact</h4>
          <p>${currentFact}</p>
        </div>
      </div>
    </div>
  `;

  root.appendChild(container);

  const modeSelection = container.querySelector('#modeSelection');
  const gameContainer = container.querySelector('#gameContainer');
  const modeButtons = container.querySelectorAll('.stem-tic-tac-toe__mode-btn');
  const changeModeBtn = container.querySelector('#changeModeBtn');
  const cells = container.querySelectorAll('.stem-tic-tac-toe__cell');
  const resetBtn = container.querySelector('#resetBtn');
  const playAgainBtn = container.querySelector('#playAgainBtn');
  const overlay = container.querySelector('#gameOverlay');
  const overlayTitle = container.querySelector('#overlayTitle');
  const overlayMessage = container.querySelector('#overlayMessage');
  const currentPlayerMark = container.querySelector('#currentPlayerMark');
  const factDisplay = container.querySelector('#factDisplay p');
  const xScore = container.querySelector('.stem-tic-tac-toe__badge:first-child strong');
  const oScore = container.querySelector('.stem-tic-tac-toe__badge:nth-child(2) strong');
  const drawScore = container.querySelector('.stem-tic-tac-toe__badge:last-child strong');

  function updateDisplay() {
    cells.forEach((cell, index) => {
      const mark = cell.querySelector('.stem-tic-tac-toe__mark');
      if (board[index] === 'X') {
        mark.textContent = '⚛';
        mark.className = 'stem-tic-tac-toe__mark stem-tic-tac-toe__mark--atom';
      } else if (board[index] === 'O') {
        mark.textContent = '⚡';
        mark.className = 'stem-tic-tac-toe__mark stem-tic-tac-toe__mark--electron';
      } else {
        mark.textContent = '';
        mark.className = 'stem-tic-tac-toe__mark';
      }
    });

    currentPlayerMark.textContent = currentPlayer === 'X' ? 'ATOM' : 'ELECTRON';
    xScore.textContent = xWins;
    oScore.textContent = oWins;
    drawScore.textContent = draws;
  }

  async function makeMove(index, player) {
    if (board[index] !== null || gameOver) return false;

    board[index] = player;
    updateDisplay();

    winner = checkWinner(board);
    if (winner) {
      gameOver = true;
      playTime = Math.floor((Date.now() - gameStartTime) / 1000);

      if (winner === 'X') {
        xWins++;
        overlayTitle.textContent = 'Atom Wins!';
        overlayMessage.textContent = 'The atom has formed a stable configuration!';
        // Save score for Atom win (player)
        await saveScore('stemTicTacToe', 100);
        await updateStatistics('stemTicTacToe', {
          score: 100,
          playTime,
          result: 'win'
        });
      } else {
        oWins++;
        overlayTitle.textContent = 'Electron Wins!';
        overlayMessage.textContent = 'The electron has achieved the perfect orbit!';
        // Save score for Electron win (AI or player 2)
        if (gameMode === 'multiplayer') {
          await saveScore('stemTicTacToe', 100);
          await updateStatistics('stemTicTacToe', {
            score: 100,
            playTime,
            result: 'win'
          });
        } else {
          await updateStatistics('stemTicTacToe', {
            score: 0,
            playTime,
            result: 'loss'
          });
        }
      }
      overlay.classList.remove('hidden');
      currentFact = getRandomFact();
      factDisplay.textContent = currentFact;
      return true;
    }

    if (isBoardFull(board)) {
      gameOver = true;
      draws++;
      playTime = Math.floor((Date.now() - gameStartTime) / 1000);
      overlayTitle.textContent = 'Draw!';
      overlayMessage.textContent = 'No winner - the atoms and electrons are in equilibrium.';
      await updateStatistics('stemTicTacToe', {
        score: 50,
        playTime,
        result: 'draw'
      });
      overlay.classList.remove('hidden');
      currentFact = getRandomFact();
      factDisplay.textContent = currentFact;
      return true;
    }

    return true;
  }

  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    winner = null;
    gameStartTime = Date.now();
    playTime = 0;
    overlay.classList.add('hidden');
    updateDisplay();
  }

  function startGame(mode) {
    gameMode = mode;
    modeSelection.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    resetGame();
  }

  function changeMode() {
    gameMode = null;
    gameContainer.classList.add('hidden');
    modeSelection.classList.remove('hidden');
    resetGame();
  }

  async function handleCellClick(e) {
    if (gameOver || !gameMode) return;

    const cell = e.currentTarget;
    const index = parseInt(cell.dataset.index);

    if (await makeMove(index, currentPlayer)) {
      // In multiplayer mode, switch players
      if (gameMode === 'multiplayer') {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      } else if (gameMode === 'computer') {
        // In computer mode, AI makes move after player
        currentPlayer = 'O';
        if (!gameOver) {
          setTimeout(async () => {
            const aiMove = getBestMove([...board], 'O');
            if (aiMove !== undefined && await makeMove(aiMove, 'O')) {
              currentPlayer = 'X';
            }
          }, 500);
        }
      }
    }
  }

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      startGame(mode);
    });
  });

  changeModeBtn.addEventListener('click', changeMode);
  
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });

  resetBtn.addEventListener('click', resetGame);
  playAgainBtn.addEventListener('click', resetGame);

  return {
    destroy() {
      container.remove();
    }
  };
}
