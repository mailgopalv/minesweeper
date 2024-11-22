const rows = 10;
const cols = 10;
const mineCount = 10;
let grid = [];
let mineCounter = mineCount;
let timer = 0;
let interval;

function initializeGame() {
  const gridElement = document.getElementById("grid");
  const winMessage = document.getElementById("win-message");
  gridElement.innerHTML = "";
  winMessage.classList.add("hidden");
  grid = createGrid(rows, cols, mineCount);
  mineCounter = mineCount;
  timer = 0;
  document.getElementById("mine-counter").textContent = `🚩 Mines: ${mineCounter}`;
  document.getElementById("timer").textContent = `⏰ Time: ${timer}s`;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = `⏰ Time: ${timer}s`;
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

function handleLeftClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  if (grid[row][col] === "M") {
    revealMines();
    alert("Oops! You hit a bomb!");
    clearInterval(interval);
  } else {
    revealCell(row, col);
    checkWin();
  }
}

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
    document.getElementById("mine-counter").textContent = `🚩 Mines: ${mineCounter}`;
  }
}

function revealCell(row, col) {
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (!cell || cell.classList.contains("revealed")) return;
  cell.classList.add("revealed");
  const value = grid[row][col];
  if (value > 0) cell.textContent = value;
  if (value === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        revealCell(row + i, col + j);
      }
    }
  }
}

function checkWin() {
  const revealedCells = document.querySelectorAll(".cell.revealed").length;
  if (revealedCells === rows * cols - mineCount) {
    clearInterval(interval);
    document.getElementById("win-message").classList.remove("hidden");
  }
}

document.getElementById("restart").addEventListener("click", initializeGame);
window.onload = initializeGame;
