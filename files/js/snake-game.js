const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 600;

let snake = [{ x: 9 * box, y: 9 * box }];
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
};
let score = 0;
let gameOver = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = "lime";
    snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, box, box));

    document.getElementById("score").textContent = "Score: " + score;
}

function update() {
    if (gameOver) return;

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver = true;
        alert("Game Over! Score: " + score);
        return;
    }

    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver = true;
            alert("Game Over! Score: " + score);
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box,
        };
    } else {
        snake.pop();
    }

    draw();
}

document.addEventListener("keydown", (e) => {
    if ((e.key === "a" || e.key === "A") && direction !== "RIGHT") direction = "LEFT";
    if ((e.key === "d" || e.key === "D") && direction !== "LEFT") direction = "RIGHT";
    if ((e.key === "w" || e.key === "W") && direction !== "DOWN") direction = "UP";
    if ((e.key === "s" || e.key === "S") && direction !== "UP") direction = "DOWN";
});

setInterval(update, 150);