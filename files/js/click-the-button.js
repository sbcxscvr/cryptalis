let score = 0;
const button = document.querySelector(".button");
const scoreElement = document.querySelector(".score");

button.addEventListener("click", () => {
    score++;
    scoreElement.textContent = `Score: ${score}`;
    moveButton();
});

function moveButton() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const randomX = Math.random() * (screenWidth - 100);
    const randomY = Math.random() * (screenHeight - 50);
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
}

moveButton();