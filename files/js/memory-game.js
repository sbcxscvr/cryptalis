const baseSymbols = [
    "🍎",
    "🍌",
    "🍇",
    "🍓",
    "🍍",
    "🥝",
    "🍉",
    "🍒",
    "🍋",
    "🥥",
    "🍑",
    "🍐",
    "🥭",
    "🥕",
    "🌽",
    "🍆",
    "🌶",
    "🥔",
];
let symbols = [...baseSymbols, ...baseSymbols];

for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
}

const grid = document.getElementById("grid");
let first = null,
    second = null;
let lock = false;

symbols.forEach((sym) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = sym;
    card.onclick = () => flip(card);
    grid.appendChild(card);
});

function flip(card) {
    if (lock || card.classList.contains("flipped")) return;

    card.textContent = card.dataset.symbol;
    card.classList.add("flipped");

    if (!first) {
        first = card;
    } else {
        second = card;
        lock = true;

        if (first.dataset.symbol === second.dataset.symbol) {
            first.classList.add("matched");
            second.classList.add("matched");
            resetCards();
        } else {
            setTimeout(() => {
                first.textContent = "";
                second.textContent = "";
                first.classList.remove("flipped");
                second.classList.remove("flipped");
                resetCards();
            }, 1000);
        }
    }
}

function resetCards() {
    first = null;
    second = null;
    lock = false;
}