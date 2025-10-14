let playerScore = 0;
let computerScore = 0;

const choicesImages = {
    rock: "../../assets/rock.png",
    paper: "../../assets/paper.png",
    scissors: "../../assets/scissors.png",
};

function play(playerChoice) {
    const choices = ["rock", "paper", "scissors"];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    const resultDiv = document.getElementById("result");
    const playerScoreSpan = document.getElementById("playerScore");
    const computerScoreSpan = document.getElementById("computerScore");
    const playerChoiceImg = document.getElementById("playerChoice");
    const computerChoiceImg = document.getElementById("computerChoice");
    const playerChoiceContainer = document.getElementById("playerChoiceContainer");
    const computerChoiceContainer = document.getElementById("computerChoiceContainer");
    const choiceContainer = document.getElementById("choiceContainer");

    playerChoiceImg.style.display = "block";
    computerChoiceImg.style.display = "block";

    resultDiv.style.animation = "none";
    choiceContainer.style.animation = "none";
    playerChoiceContainer.style.animation = "none";
    computerChoiceContainer.style.animation = "none";

    playerChoiceImg.src = choicesImages[playerChoice];
    computerChoiceImg.src = choicesImages[computerChoice];

    setTimeout(() => {
        resultDiv.style.animation = "fadeIn 1s forwards";
        choiceContainer.style.animation = "fadeIn 1s forwards";
    }, 50);

    const playerBtn = document.getElementById(`${playerChoice}Btn`);
    playerBtn.classList.add("player-choice");
    setTimeout(() => {
        playerBtn.classList.remove("player-choice");
    }, 500);

    if (playerChoice === computerChoice) {
        resultDiv.textContent = `It's a tie! You both chose ${playerChoice}.`;
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        playerScore++;
        resultDiv.textContent = `You win! ${playerChoice} beats ${computerChoice}.`;
    } else {
        computerScore++;
        resultDiv.textContent = `You lose! ${computerChoice} beats ${playerChoice}.`;
    }

    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
}