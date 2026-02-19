import { saveScore, updateStatistics } from '../storage.js';

const TILE_INSIGHTS = {
  4: [
    "Tile 4 unlocked: 4 kilometers is the average depth of Earth's oceans.",
    "Tile 4 unlocked: There are 4 fundamental forces in nature: gravity, electromagnetism, strong nuclear, and weak nuclear.",
    "Tile 4 unlocked: The human heart has 4 chambers: left atrium, right atrium, left ventricle, and right ventricle.",
    "Tile 4 unlocked: DNA has 4 nucleotide bases: adenine, thymine, guanine, and cytosine.",
    "Tile 4 unlocked: The solar system has 4 terrestrial planets: Mercury, Venus, Earth, and Mars."
  ],
  8: [
    "Tile 8 unlocked: Sunlight takes about 8 minutes to reach Earth.",
    "Tile 8 unlocked: There are 8 planets in our solar system (including Pluto's reclassification).",
    "Tile 8 unlocked: An octagon has 8 sides and is used in stop signs worldwide.",
    "Tile 8 unlocked: The atomic number of oxygen is 8, making it essential for life.",
    "Tile 8 unlocked: A byte consists of 8 bits, the fundamental unit of digital information."
  ],
  16: [
    "Tile 16 unlocked: Sixteen engineering disciplines earn ABET accreditation.",
    "Tile 16 unlocked: The hexadecimal number system uses 16 digits (0-9, A-F).",
    "Tile 16 unlocked: There are 16 ounces in a pound in the imperial system.",
    "Tile 16 unlocked: The International Space Station orbits Earth about 16 times each day.",
    "Tile 16 unlocked: A standard computer word is often 16 bits (2 bytes)."
  ],
  32: [
    "Tile 32 unlocked: Water freezes at 32 degrees Fahrenheit.",
    "Tile 32 unlocked: There are 32 teams in the National Football League.",
    "Tile 32 unlocked: The atomic number of sulfur is 32, essential for life processes.",
    "Tile 32 unlocked: A 32-bit processor can handle 4 billion different memory addresses.",
    "Tile 32 unlocked: The human spine typically has 32 vertebrae."
  ],
  64: [
    "Tile 64 unlocked: DNA translation uses 64 different codons.",
    "Tile 64 unlocked: A chessboard has 64 squares in an 8x8 grid.",
    "Tile 64 unlocked: The Commodore 64 was one of the best-selling home computers.",
    "Tile 64 unlocked: There are 64 hexagrams in the I Ching, an ancient Chinese divination system.",
    "Tile 64 unlocked: A 64-bit processor can address 18 quintillion bytes of memory."
  ],
  128: [
    "Tile 128 unlocked: Seven bits give 128 digital states.",
    "Tile 128 unlocked: The ASCII character set originally had 128 characters.",
    "Tile 128 unlocked: A 128-bit encryption key provides extremely strong security.",
    "Tile 128 unlocked: The Nintendo 128 was a proposed but never released console.",
    "Tile 128 unlocked: There are 128 fluid ounces in a US gallon."
  ],
  256: [
    "Tile 256 unlocked: True-color images store 256 levels per channel.",
    "Tile 256 unlocked: The RGB color model uses 256 values (0-255) for each color.",
    "Tile 256 unlocked: A 256-bit encryption key is considered quantum-resistant.",
    "Tile 256 unlocked: The original Game Boy had a 256-color palette.",
    "Tile 256 unlocked: There are 256 possible values in an 8-bit unsigned integer."
  ],
  512: [
    "Tile 512 unlocked: Early disk sectors stored 512 bytes each.",
    "Tile 512 unlocked: The PlayStation 2 had 512 MB of RAM.",
    "Tile 512 unlocked: A 512-bit hash function provides strong cryptographic security.",
    "Tile 512 unlocked: The original IBM PC had a 512 KB memory limit.",
    "Tile 512 unlocked: There are 512 bytes in a standard disk sector."
  ],
  1024: [
    "Tile 1024 unlocked: A kilobyte contains 1024 bytes in binary systems.",
    "Tile 1024 unlocked: The year 1024 AD saw significant historical events in Europe.",
    "Tile 1024 unlocked: A 1024-bit RSA key provides strong encryption security.",
    "Tile 1024 unlocked: The Commodore 64 had 1024 bytes of RAM.",
    "Tile 1024 unlocked: There are 1024 megabytes in a gigabyte (binary)."
  ],
  2048: [
    "Tile 2048 unlocked: Powers of two steer digital signal processing.",
    "Tile 2048 unlocked: The year 2048 will be a leap year in the Gregorian calendar.",
    "Tile 2048 unlocked: A 2048-bit encryption key provides military-grade security.",
    "Tile 2048 unlocked: The PlayStation 5 has 2048-bit encryption for security.",
    "Tile 2048 unlocked: There are 2048 bytes in 2 kilobytes of memory."
  ]
};

const STEM_FACTS = [
  "The International Space Station orbits Earth about 16 times each day.",
  "Saturn's moon Titan has lakes made of liquid methane and ethane.",
  "LEDs convert about 80 percent of electrical energy into light.",
  "Graphene is a single layer of carbon atoms arranged in a hexagonal lattice.",
  "The speed of light in vacuum is approximately 299,792 kilometers per second.",
  "A nanometer is one billionth of a meter, roughly the width of a DNA strand.",
  "Supercomputers can execute quadrillions of calculations per second.",
  "Solar flares release energy equivalent to millions of hydrogen bombs.",
  "The first programmable computer, ENIAC, weighed about 30 tons.",
  "DNA from all humans is 99.9 percent identical.",
  "Earth's core is as hot as the surface of the sun, about 5,500 degrees Celsius.",
  "Wind turbines can stretch blades longer than a Boeing 747 wing.",
  "The Large Hadron Collider spans a 27 kilometer ring beneath France and Switzerland.",
  "Mars rovers use plutonium-powered generators to survive the cold nights.",
  "3D printers can build complex structures layer by layer from digital models.",
  "The Fibonacci sequence appears in sunflower seed spirals and pinecones.",
  "Auroras occur when solar wind particles excite atoms in Earth's atmosphere.",
  "Battery energy density has more than tripled since the 1990s.",
  "A light-year measures distance, roughly 9.46 trillion kilometers.",
  "Octopuses have three hearts and blue blood due to copper-based hemocyanin.",
  "Quantum computers exploit superposition to analyze many states at once.",
  "Seismographs detect earthquakes by measuring ground vibrations.",
  "The Hubble Space Telescope has made over 1.5 million observations.",
  "Reusable rockets reduce launch costs by landing booster stages safely.",
  "Bioengineers grow organoids, miniature organs, for medical research.",
  "Chemical engineers use catalysts to speed reactions without being consumed.",
  "Sound travels about four times faster in water than in air.",
  "Lightning can heat air to roughly 30,000 degrees Celsius.",
  "Robotic exoskeletons assist workers by augmenting human strength.",
  "The ozone layer absorbs harmful ultraviolet radiation from the sun.",
  "Nanorobots are being designed to deliver drugs directly to tumors.",
  "Hydroelectric dams generate electricity from flowing water.",
  "Stem cells can differentiate into specialized tissues for healing.",
  "Geneticists use CRISPR to edit DNA with high precision.",
  "Smart grids balance electrical supply and demand in real time.",
  "A teaspoon of a neutron star would weigh billions of tons.",
  "Volcanic lightning forms when ash particles collide and exchange charge.",
  "Bioluminescent organisms create light through chemical reactions.",
  "Thermal cameras visualize heat by capturing infrared radiation.",
  "Lidar sensors map terrain using pulses of laser light.",
  "Geodesic domes distribute stress evenly across their structure.",
  "Airplanes fly due to pressure differences described by Bernoulli's principle.",
  "The James Webb Space Telescope observes infrared light from distant galaxies.",
  "Deep ocean hydrothermal vents support ecosystems without sunlight.",
  "Machine learning algorithms find patterns in large data sets.",
  "Tardigrades can survive extreme temperatures, radiation, and vacuum.",
  "Wireless charging relies on magnetic fields to transfer energy.",
  "Electric cars convert over 70 percent of battery energy into motion.",
  "Color-changing materials called thermochromics respond to temperature.",
  "Satellites use reaction wheels to adjust their orientation in space.",
  "Metamaterials manipulate waves to create cloaking effects.",
  "Doppler radar measures storm rotation to spot tornado formation.",
  "Photosynthesis efficiency in plants is around three to six percent.",
  "Engineers design wind tunnels to test aerodynamics before flight.",
  "A bit is the smallest unit of digital information, representing zero or one.",
  "Thermoplastics can be reheated and remolded multiple times.",
  "Hydrogen fuel cells produce electricity with water as the only byproduct.",
  "Smartphones contain more computing power than the Apollo guidance computers.",
  "Materials scientists study alloys to balance strength and flexibility.",
  "The human brain contains about 86 billion neurons.",
  "Atmospheric pressure at sea level is roughly 101,325 Pascals.",
  "Biometric sensors authenticate identity using traits like fingerprints.",
  "Semiconductors conduct electricity better than insulators but worse than metals.",
  "Plasma is the fourth state of matter, found in stars and lightning.",
  "GPS satellites must account for relativity to provide accurate positions.",
  "Solar sails propel spacecraft using photon momentum.",
  "Cryogenic storage preserves biological samples at ultra-low temperatures.",
  "An ecosystem includes all living and nonliving elements in a region.",
  "Data compression reduces file size by removing redundant information.",
  "Ultrasound imaging uses high-frequency sound waves to map tissues.",
  "Battery recycling can recover lithium, cobalt, and nickel for reuse.",
  "A kilowatt-hour measures energy equal to using 1000 watts for one hour.",
  "Saturn's rings are mostly made of water ice particles.",
  "Bioreactors cultivate cells under controlled conditions for research.",
  "The Richter scale is logarithmic, so each whole number jump is ten times stronger.",
  "Engineers use finite element analysis to simulate how structures bear loads.",
  "The troposphere holds about 80 percent of Earth's atmospheric mass.",
  "Vantablack absorbs 99.96 percent of visible light, making surfaces look flat.",
  "Ocean tides are primarily driven by the gravitational pull of the moon.",
  "Laser cutters focus light to vaporize materials with high precision.",
  "Batteries store energy through redox reactions at their electrodes.",
  "Water desalination removes salt to make seawater drinkable.",
  "Drones use gyroscopes to maintain stability during flight.",
  "Carbon fiber composites are strong yet lightweight for aerospace.",
  "Scientists classify exoplanets using the light dips from transits.",
  "A solar eclipse happens when the moon moves between Earth and the sun.",
  "Engineers design prosthetics that translate muscle signals into motion.",
  "Microgravity causes astronauts to lose bone density over time.",
  "Seagrass meadows absorb carbon dioxide faster than tropical forests.",
  "Blockchain technology records transactions in linked, tamper-resistant blocks.",
  "The aurora borealis is most common near Earth's magnetic poles.",
  "Automated weather stations collect temperature, humidity, and wind data.",
  "Earth's magnetic field protects life by deflecting charged particles.",
  "Optical fibers transmit data as pulses of light over long distances.",
  "Robotics engineers integrate sensors, actuators, and controllers to automate tasks.",
  "Marine biologists use remotely operated vehicles to explore deep-sea ecosystems.",
  "AI-powered microscopes can highlight cells undergoing division in real time.",
  "Saccharomyces cerevisiae yeast drives fermentation in bread and biofuel production.",
  "Thermoelectric generators convert heat differences directly into electricity.",
  "Astronaut suits provide pressurized life support for spacewalks.",
];

function createFactIterator() {
  const indices = STEM_FACTS.map((_, idx) => idx);
  let cursor = 0;

  function shuffle() {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }

  shuffle();

  return function nextFact() {
    if (cursor >= indices.length) {
      cursor = 0;
      shuffle();
    }
    const fact = STEM_FACTS[indices[cursor]];
    cursor += 1;
    return fact;
  };
}

const nextFact = createFactIterator();

// Track which insights have been shown to avoid immediate repetition
const shownInsights = new Map();

function getRandomInsight(tileValue) {
  const insights = TILE_INSIGHTS[tileValue];
  if (!insights) return null;
  
  // Get previously shown insights for this tile value
  const previousInsights = shownInsights.get(tileValue) || [];
  
  // If we've shown all insights, reset the tracking
  if (previousInsights.length >= insights.length) {
    shownInsights.set(tileValue, []);
  }
  
  // Find insights that haven't been shown recently
  const availableInsights = insights.filter((_, index) => !previousInsights.includes(index));
  
  // If all insights have been shown, use any insight
  const insightIndex = availableInsights.length > 0 
    ? insights.indexOf(availableInsights[Math.floor(Math.random() * availableInsights.length)])
    : Math.floor(Math.random() * insights.length);
  
  // Track this insight as shown
  const currentShown = shownInsights.get(tileValue) || [];
  shownInsights.set(tileValue, [...currentShown, insightIndex]);
  
  return insights[insightIndex];
}

const GRID_SIZE = 4;
const START_TILES = 2;

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function getEmptyCells(board) {
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 0) {
        cells.push([row, col]);
      }
    }
  }
  return cells;
}

function addRandomTile(board) {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return board;
  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  board[row][col] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function compressRow(row) {
  const filtered = row.filter((value) => value !== 0);
  const newRow = [];
  let scoreGain = 0;
  const merges = [];
  let skip = false;
  for (let i = 0; i < filtered.length; i++) {
    if (skip) {
      skip = false;
      continue;
    }
    if (filtered[i] === filtered[i + 1]) {
      const mergedValue = filtered[i] * 2;
      newRow.push(mergedValue);
      scoreGain += mergedValue;
      merges.push(mergedValue);
      skip = true;
    } else {
      newRow.push(filtered[i]);
    }
  }
  while (newRow.length < GRID_SIZE) {
    newRow.push(0);
  }
  return { row: newRow, scoreGain, merges };
}

function transpose(board) {
  const newBoard = createEmptyGrid();
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      newBoard[row][col] = board[col][row];
    }
  }
  return newBoard;
}

function reverseRows(board) {
  return board.map((row) => [...row].reverse());
}

function moveLeft(board) {
  let score = 0;
  const newBoard = [];
  const merges = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    const { row: newRow, scoreGain, merges: rowMerges } = compressRow(board[row]);
    newBoard.push(newRow);
    score += scoreGain;
    merges.push(...rowMerges);
  }
  return { board: newBoard, score, merges };
}

function move(board, direction) {
  let workingBoard = cloneBoard(board);
  let result;
  switch (direction) {
    case "left":
      result = moveLeft(workingBoard);
      break;
    case "right":
      workingBoard = reverseRows(workingBoard);
      result = moveLeft(workingBoard);
      result.board = reverseRows(result.board);
      break;
    case "up":
      workingBoard = transpose(workingBoard);
      result = moveLeft(workingBoard);
      result.board = transpose(result.board);
      break;
    case "down":
      workingBoard = transpose(workingBoard);
      workingBoard = reverseRows(workingBoard);
      result = moveLeft(workingBoard);
      result.board = reverseRows(result.board);
      result.board = transpose(result.board);
      break;
    default:
      return { board, score: 0, moved: false, merges: [] };
  }
  const moved = JSON.stringify(result.board) !== JSON.stringify(board);
  return { board: result.board, score: result.score, moved, merges: result.merges };
}

function isGameWon(board) {
  return board.some((row) => row.some((value) => value >= 2048));
}

function isGameOver(board) {
  if (getEmptyCells(board).length > 0) return false;
  for (const direction of ["left", "right", "up", "down"]) {
    const { moved } = move(board, direction);
    if (moved) return false;
  }
  return true;
}

function getTileColor(value) {
  // Light theme tile palette - vibrant and clear
  const palette = {
    0: "#e5e7eb",    // gray-200 - empty
    2: "#dbeafe",    // blue-100
    4: "#bfdbfe",    // blue-200
    8: "#93c5fd",    // blue-300
    16: "#60a5fa",   // blue-400
    32: "#3b82f6",   // blue-500
    64: "#2563eb",   // blue-600
    128: "#7c3aed",  // purple-600
    256: "#9333ea",  // purple-500
    512: "#c026d3",  // fuchsia-600
    1024: "#db2777", // pink-600
    2048: "#059669", // emerald-600 - victory!
  };
  return palette[value] || "#ef4444";
}

function getTileTextColor(value) {
  // Dark text for light tiles, white for dark tiles
  if (value <= 8) return "#1f2937";
  return "#ffffff";
}

export function mount(root) {
  root.innerHTML = `
    <section class="stem2048" aria-label="Fusion 2048 stem game">
      <div class="stem2048__top-bar">
        <div>
          <h3>Reach 2048 to unlock the fusion lab!</h3>
          <p class="stem2048__help">Swipe or use arrow keys. Each merge reveals a STEM insight.</p>
        </div>
        <div class="stem2048__scores">
          <div class="stem2048__badge" aria-live="polite">
            <span>Score</span>
            <strong id="stem2048Score">0</strong>
          </div>
          <div class="stem2048__badge" aria-live="polite">
            <span>Best</span>
            <strong id="stem2048Best">0</strong>
          </div>
        </div>
        <div class="stem2048__actions">
          <button class="stem2048__btn" id="stem2048NewGame">New Game</button>
        </div>
      </div>
      <div class="stem2048__board-wrapper">
        <div class="stem2048__board">
          <div class="stem2048__grid" id="stem2048Grid" role="application" aria-label="2048 grid">
            ${Array.from({ length: GRID_SIZE * GRID_SIZE })
              .map(() => '<div class="stem2048__cell"></div>')
              .join("")}
          </div>
          <div class="stem2048__overlay hidden" id="stem2048Overlay">
            <div>
              <h3 id="stem2048OverlayTitle">Great job!</h3>
              <p id="stem2048OverlayText"></p>
              <button class="stem2048__btn" id="stem2048OverlayButton">Play again</button>
            </div>
          </div>
        </div>
        <aside class="stem2048__feed">
          <h4>STEM Insights</h4>
          <div class="stem2048__facts" id="stem2048Facts"></div>
        </aside>
      </div>
    </section>
  `;

  const gridEl = root.querySelector("#stem2048Grid");
  const scoreEl = root.querySelector("#stem2048Score");
  const bestEl = root.querySelector("#stem2048Best");
  const factsEl = root.querySelector("#stem2048Facts");
  const newGameButton = root.querySelector("#stem2048NewGame");
  const overlay = root.querySelector("#stem2048Overlay");
  const overlayTitle = root.querySelector("#stem2048OverlayTitle");
  const overlayText = root.querySelector("#stem2048OverlayText");
  const overlayButton = root.querySelector("#stem2048OverlayButton");

  let board = createEmptyGrid();
  let score = 0;
  let bestScore = Number(localStorage.getItem("stem2048-best") || 0);
  let gameStartTime = Date.now();
  let playTime = 0;
  let touchStart = null;
  const factLog = [];

  bestEl.textContent = bestScore;

  function updateBoard() {
    const cells = Array.from(gridEl.children);
    cells.forEach((cell) => (cell.innerHTML = ""));
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const value = board[row][col];
        if (value === 0) continue;
        const tile = document.createElement("div");
        tile.className = "stem2048__tile";
        tile.style.background = getTileColor(value);
        tile.style.color = getTileTextColor(value);
        tile.innerHTML = `<span>${value}</span>`;
        tile.style.transform = "scale(1.05)";
        requestAnimationFrame(() => {
          tile.style.transform = "scale(1)";
        });
        cells[row * GRID_SIZE + col].appendChild(tile);
      }
    }
    scoreEl.textContent = score;
    if (score > bestScore) {
      bestScore = score;
      bestEl.textContent = bestScore;
      localStorage.setItem("stem2048-best", bestScore);
    }
  }

  function addFact(mergedValue) {
    const insight = getRandomInsight(mergedValue);
    const fact = nextFact();
    const combined = insight ? `${insight} ${fact}` : fact;
    factLog.unshift({ value: mergedValue, text: combined });
    while (factLog.length > 4) {
      factLog.pop();
    }
    factsEl.innerHTML = factLog
      .map(
        (item) => `
        <div class="stem2048__fact">
          <strong>${item.value}</strong>
          <span>${item.text}</span>
        </div>`
      )
      .join("");
  }

  function refreshFacts() {
    factLog.length = 0;
    // Reset insight tracking for new game
    shownInsights.clear();
    factsEl.innerHTML = `<div class="stem2048__fact">
        <strong>Welcome!</strong>
        <span>Merge tiles to discover diverse STEM insights! Each number reveals different fascinating facts.</span>
      </div>`;
  }

  async function startGame() {
    // Save previous game stats if score > 0
    if (score > 0) {
      playTime = Math.floor((Date.now() - gameStartTime) / 1000);
      await saveScore('stem2048', score);
      await updateStatistics('stem2048', {
        score,
        playTime,
        result: isGameWon(board) ? 'win' : 'loss'
      });
    }

    board = createEmptyGrid();
    score = 0;
    gameStartTime = Date.now();
    playTime = 0;
    refreshFacts();
    for (let i = 0; i < START_TILES; i++) {
      addRandomTile(board);
    }
    updateBoard();
    overlay.classList.add("hidden");
  }

  function handleMove(direction) {
    const { board: newBoard, score: scoreGain, moved, merges } = move(board, direction);
    if (!moved) return;
    board = addRandomTile(newBoard);
    score += scoreGain;
    updateBoard();
    merges.forEach(addFact);

    if (isGameWon(board)) {
      overlay.classList.remove("hidden");
      overlayTitle.textContent = "Fusion Achieved!";
      overlayText.textContent = "You created a 2048 tile and powered the reactor. Keep going to set new records.";
    } else if (isGameOver(board)) {
      overlay.classList.remove("hidden");
      overlayTitle.textContent = "Systems Offline";
      overlayText.textContent = "No more moves left. Start a new session and push the reactor further!";
    }
  }

  function handleKeydown(event) {
    const key = event.key;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "a", "d", "w", "s"].includes(key)) {
      event.preventDefault();
      const mapping = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
        a: "left",
        d: "right",
        w: "up",
        s: "down",
      };
      handleMove(mapping[key]);
    }
  }

  function handleTouchStart(event) {
    const [touch] = event.changedTouches;
    touchStart = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    if (!touchStart) return;
    const [touch] = event.changedTouches;
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (Math.max(absX, absY) < 30) {
      touchStart = null;
      return;
    }
    if (absX > absY) {
      handleMove(deltaX > 0 ? "right" : "left");
    } else {
      handleMove(deltaY > 0 ? "down" : "up");
    }
    touchStart = null;
  }

  window.addEventListener("keydown", handleKeydown);
  gridEl.addEventListener("touchstart", handleTouchStart, { passive: true });
  gridEl.addEventListener("touchend", handleTouchEnd, { passive: true });
  newGameButton.addEventListener("click", startGame);
  overlayButton.addEventListener("click", startGame);

  startGame();

  return {
    destroy() {
      window.removeEventListener("keydown", handleKeydown);
      gridEl.removeEventListener("touchstart", handleTouchStart);
      gridEl.removeEventListener("touchend", handleTouchEnd);
      newGameButton.removeEventListener("click", startGame);
      overlayButton.removeEventListener("click", startGame);
    },
  };
}
