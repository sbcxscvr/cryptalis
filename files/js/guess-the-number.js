const secret = Math.floor(Math.random() * 100) + 1;

function checkGuess() {
    const guess = Number(document.getElementById("guess").value);
    const message = document.getElementById("message");

    if (!guess || guess < 1 || guess > 100) {
        message.textContent = "Please enter a number between 1 and 100!";
        message.className = "";
        return;
    }

    if (guess < secret) {
        message.textContent = "Too small!";
        message.className = "low";
    } else if (guess > secret) {
        message.textContent = "Too high!";
        message.className = "high";
    } else {
        message.textContent = "Correct Answer!";
        message.className = "correct";
    }
}