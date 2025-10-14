let score = 0;
let timeLeft = 30;
const circle = document.getElementById("circle");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");

function moveCircle() {
    const x = Math.random() * (window.innerWidth - 80);
    const y = Math.random() * (window.innerHeight - 80);
    circle.style.left = x + "px";
    circle.style.top = y + "px";
}

circle.addEventListener("click", () => {
    score++;
    scoreText.textContent = "Score: " + score;
    moveCircle();
});

function countdown() {
    const timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = "Time: " + timeLeft + "s";
        if (timeLeft <= 0) {
            clearInterval(timer);
            circle.style.display = "none";
            timerText.textContent = "Time over!";
            alert("Game Over! Your Score: " + score);
        }
    }, 1000);
}

moveCircle();
countdown();