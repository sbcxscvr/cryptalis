const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: "blue",
    speed: 5,
};

let obstacles = [];
let obstacleSpeed = 3;
let score = 0;
let gameOver = false;

const keys = { a: false, d: false };

function createObstacle() {
    const width = Math.random() * 100 + 30;
    const x = Math.random() * (canvas.width - width);
    obstacles.push({ x: x, y: -50, width: width, height: 20, color: "red" });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    obstacles.forEach((obs) => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

function checkCollision() {
    for (let obs of obstacles) {
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }
    }
}

function movePlayer() {
    if (keys.a && player.x > 0) player.x -= player.speed;
    if (keys.d && player.x + player.width < canvas.width) player.x += player.speed;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        movePlayer();

        obstacles.forEach((obs) => (obs.y += obstacleSpeed));

        obstacles = obstacles.filter((obs) => {
            if (obs.y > canvas.height) {
                score++;
                return false;
            }
            return true;
        });

        if (Math.random() < 0.02) createObstacle();

        drawPlayer();
        drawObstacles();
        checkCollision();

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Score: ${score}`, 10, 30);

        requestAnimationFrame(update);
    } else {
        ctx.fillStyle = "black";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);

        ctx.font = "30px Arial";
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 60);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "a") keys.a = true;
    if (e.key.toLowerCase() === "d") keys.d = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "a") keys.a = false;
    if (e.key.toLowerCase() === "d") keys.d = false;
});

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");

["touchstart", "mousedown"].forEach((event) => {
    leftButton.addEventListener(event, (e) => {
        e.preventDefault();
        keys.a = true;
    });
    rightButton.addEventListener(event, (e) => {
        e.preventDefault();
        keys.d = true;
    });
});

["touchend", "mouseup", "touchcancel"].forEach((event) => {
    leftButton.addEventListener(event, (e) => {
        e.preventDefault();
        keys.a = false;
    });
    rightButton.addEventListener(event, (e) => {
        e.preventDefault();
        keys.d = false;
    });
});

update();