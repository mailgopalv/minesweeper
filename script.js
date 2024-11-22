const rows = 10;
const cols = 10;
const mineCount = 10;
let grid = [];
let mineCounter = mineCount;
let timer = 0;
let interval;

// Initialize the game
function initializeGame() {
  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = "";
  gridElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
  grid = createGrid(rows, cols, mineCount);
  mineCounter = mineCount;
  timer = 0;
  document.getElementById("mine-counter").textContent = `Mines: ${mineCount}`;
  document.getElementById("timer").textContent = `Time: ${timer}s`;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = `Time: ${timer}s`;
  }, 1000);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleLeftClick);
      cell.addEventListener("contextmenu", handleRightClick);
      gridElement.appendChild(cell);
    }
  }
}

// Create the grid with mines and numbers
function createGrid(rows, cols, mineCount) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Place mines
  let placedMines = 0;
  while (placedMines < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (grid[row][col] === 0) {
      grid[row][col] = "M";
      placedMines++;
      updateNumbers(grid, row, col);
    }
  }
  return grid;
}

// Update numbers around a mine
function updateNumbers(grid, row, col) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] !== "M"
      ) {
        grid[newRow][newCol]++;
      }
    }
  }
}

// Handle left-click on a cell
function handleLeftClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  if (grid[row][col] === "M") {
    revealMines();
    alert("Game Over!");
    clearInterval(interval);
  } else {
    revealCell(row, col);
    checkWin();
  }
}

// Handle right-click on a cell
function handleRightClick(event) {
  event.preventDefault();
  const cell = event.target;
  if (!cell.classList.contains("revealed")) {
    if (cell.classList.contains("flag")) {
      cell.classList.remove("flag");
      mineCounter++;
    } else {
      cell.classList.add("flag");
      mineCounter--;
    }
    document.getElementById("mine-counter").textContent = `Mines: ${mineCounter}`;
  }
}

// Reveal a cell
function revealCell(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell || cell.classList.contains("revealed")) return;
  
    cell.classList.add("revealed");
  
    const value = grid[row][col];
  
    if (value === "M") {
      cell.innerHTML = "💣"; // Display bomb emoji
      cell.style.backgroundColor = "#ff4500"; // Red color for bombs
    } else if (value > 0) {
      cell.textContent = value; // Show the number of adjacent mines
      cell.style.backgroundColor = "blue"; // Light blue for number cells
    } else {
      // For empty cells (value === 0), change the background color
      cell.style.backgroundColor = "white"; // Light aqua color for empty cells
      // Reveal adjacent cells
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(row + i, col + j);
        }
      }
    }
  }

// Reveal all mines
function revealMines() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === "M") {
        const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
        cell.classList.add("mine");
        cell.innerHTML = "💣"; // Display a fun bomb icon
      }
    }
  }
}

// Check for win
function checkWin() {
  let revealedCount = 0;
  document.querySelectorAll(".cell").forEach(cell => {
    if (cell.classList.contains("revealed")) revealedCount++;
  });
  if (revealedCount === rows * cols - mineCount) {
    alert("You Win!");
    clearInterval(interval);
  }
}

// Restart the game
document.getElementById("restart").addEventListener("click", initializeGame);

// Initialize the game on load
window.onload = initializeGame;
