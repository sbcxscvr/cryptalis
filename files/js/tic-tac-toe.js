const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;

function checkWin() {
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const combo of winCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes(null) ? null : "Tie";
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (!gameActive || board[index]) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    const winner = checkWin();

    if (winner) {
        gameActive = false;
        if (winner === "Tie") {
            message.textContent = "It's a Tie!";
        } else {
            message.textContent = `Player ${winner} Wins!`;
        }
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function restartGame() {
    board.fill(null);
    cells.forEach((cell) => (cell.textContent = ""));
    message.textContent = "";
    currentPlayer = "X";
    gameActive = true;
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);