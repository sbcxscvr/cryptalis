function randomPlates(count = 13) {
    const plates = [];
    const used = new Set();
    while (plates.length < count) {
        const num = String(Math.floor(Math.random() * 98) + 2);
        if (!used.has(num)) {
            used.add(num);
            plates.push({
                id: plates.length + 1,
                number: num,
                normalColor: [
                    Math.floor(Math.random() * 180 + 50),
                    Math.floor(Math.random() * 180 + 50),
                    Math.floor(Math.random() * 180 + 50),
                ],
                bgColor: [
                    Math.floor(Math.random() * 180 + 50),
                    Math.floor(Math.random() * 180 + 50),
                    Math.floor(Math.random() * 180 + 50),
                ],
            });
        }
    }
    return plates;
}

const platesData = randomPlates();

let currentIndex = 0;
const userAnswers = new Array(platesData.length).fill(null);
const canvas = document.getElementById("plateCanvas");
const ctx = canvas.getContext("2d");
const DPR = window.devicePixelRatio || 1;
const size = 600;
canvas.width = size * DPR;
canvas.height = size * DPR;
canvas.style.width = "";
ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

const startScreen = document.getElementById("startScreen");
const testScreen = document.getElementById("testScreen");
const resultsScreen = document.getElementById("results");
const choicesEl = document.getElementById("choices");
const stepText = document.getElementById("stepText");
const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const scoreText = document.getElementById("scoreText");
const perPlate = document.getElementById("perPlate");

function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}

function drawPlateToCtx(ctx, data) {
    const mask = document.createElement("canvas");
    mask.width = size;
    mask.height = size;
    const mctx = mask.getContext("2d");
    mctx.fillStyle = "white";
    mctx.fillRect(0, 0, size, size);
    mctx.fillStyle = "black";
    mctx.font = "bold 320px sans-serif";
    mctx.textAlign = "center";
    mctx.textBaseline = "middle";
    mctx.fillText(data.number, size / 2, size / 2 + 10);

    const maskData = mctx.getImageData(0, 0, size, size).data;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, size, size);

    const dotRadius = 8;
    for (let y = dotRadius; y < size; y += dotRadius * 3) {
        for (let x = dotRadius; x < size; x += dotRadius * 3) {
            const px = Math.floor(x + (Math.random() - 0.5) * 2);
            const py = Math.floor(y + (Math.random() - 0.5) * 2);
            const offset = (py * size + px) * 4;
            const isNumber = maskData[offset] < 128;
            const jitterX = (Math.random() - 0.5) * dotRadius * 0.9;
            const jitterY = (Math.random() - 0.5) * dotRadius * 0.9;
            const r = dotRadius * (0.6 + Math.random() * 0.9);
            ctx.beginPath();
            ctx.arc(x + jitterX, y + jitterY, r, 0, Math.PI * 2);
            const col = isNumber ? data.normalColor : data.bgColor;
            const brightness = 0.85 + (Math.random() * 0.3 - 0.15);
            ctx.fillStyle =
                "rgb(" +
                clamp(Math.floor(col[0] * brightness), 0, 255) +
                "," +
                clamp(Math.floor(col[1] * brightness), 0, 255) +
                "," +
                clamp(Math.floor(col[2] * brightness), 0, 255) +
                ")";
            ctx.fill();
        }
    }
}

function showPlate(idx) {
    currentIndex = idx;
    const data = platesData[idx];
    drawPlateToCtx(ctx, data);

    stepText.textContent = `Plate ${idx + 1} of ${platesData.length}`;
    const pct = Math.round((idx / platesData.length) * 100);
    progressBar.style.width = pct + "%";
    progressPercent.textContent = pct + "%";

    const opts = new Set();
    opts.add(data.number);
    opts.add("No number");
    while (opts.size < 5) {
        opts.add(String(Math.floor(Math.random() * 90) + 1));
    }
    const arr = Array.from(opts)
        .filter((x) => x !== null)
        .sort(() => Math.random() - 0.5);

    choicesEl.innerHTML = "";
    arr.forEach((opt) => {
        const b = document.createElement("button");
        b.className = "btn choice";
        b.type = "button";
        b.textContent = opt;
        b.dataset.value = opt;
        if (userAnswers[idx] === opt) b.classList.add("selected");
        b.addEventListener("click", () => {
            choicesEl.querySelectorAll("button.choice").forEach((x) => x.classList.remove("selected"));
            b.classList.add("selected");
            userAnswers[idx] = opt;
        });
        choicesEl.appendChild(b);
    });

    document.getElementById("prevBtn").disabled = idx === 0;
    document.getElementById("nextBtn").textContent = idx === platesData.length - 1 ? "Finish" : "Next";
}

function finishTest() {
    let correctCount = 0;
    const per = [];
    platesData.forEach((p, i) => {
        const ans = userAnswers[i];
        const ok = ans === p.number;
        if (ok) correctCount++;
        per.push({ index: i + 1, number: p.number, answer: ans, correct: ok });
    });

    testScreen.hidden = true;
    resultsScreen.hidden = false;
    scoreText.textContent = `You got ${correctCount} out of ${platesData.length} correct.`;
    perPlate.innerHTML = "";
    per.forEach((row) => {
        const div = document.createElement("div");
        div.className = "resultRow";
        const left = document.createElement("div");
        left.innerHTML = `<strong>Plate ${row.index}</strong> — Correct: ${row.number}`;
        const right = document.createElement("div");
        right.innerHTML = row.answer
            ? row.correct
                ? "✅ correct"
                : `❌ ${row.answer}`
            : '<span class="muted">No answer</span>';
        div.appendChild(left);
        div.appendChild(right);
        perPlate.appendChild(div);
    });

    const interp = document.createElement("p");
    interp.style.marginTop = "10px";
    if (correctCount >= Math.max(10, platesData.length - 2))
        interp.innerHTML =
            "<strong>Interpretation:</strong> Likely no significant red-green color vision deficiency.";
    else if (correctCount >= 5)
        interp.innerHTML =
            "<strong>Interpretation:</strong> Possible mild color vision deficiency — consider a professional test.";
    else
        interp.innerHTML =
            "<strong>Interpretation:</strong> Strong indication of red-green color vision deficiency. Please seek medical advice.";
    perPlate.appendChild(interp);

    const resultObj = {
        date: new Date().toISOString(),
        total: platesData.length,
        correct: correctCount,
        plates: per,
    };
    const blob = new Blob([JSON.stringify(resultObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const dl = document.getElementById("downloadBtn");
    dl.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "colorblind_result.json";
        a.click();
    };
}

document.getElementById("startBtn").addEventListener("click", () => {
    startScreen.hidden = true;
    testScreen.hidden = false;
    resultsScreen.hidden = true;
    showPlate(0);
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentIndex > 0) {
        showPlate(currentIndex - 1);
    }
});

document.getElementById("nextBtn").addEventListener("click", () => {
    if (!userAnswers[currentIndex]) {
        if (!confirm("You have not selected an answer. Do you want to continue?")) return;
    }
    if (currentIndex < platesData.length - 1) {
        showPlate(currentIndex + 1);
    } else {
        finishTest();
    }
});

document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
});

document.addEventListener("keydown", (e) => {
    if (testScreen.hidden) return;
    if (e.key === "ArrowRight") document.getElementById("nextBtn").click();
    if (e.key === "ArrowLeft") document.getElementById("prevBtn").click();
    if (e.key >= "0" && e.key <= "9") {
        const ch = e.key;
        const btn = Array.from(choicesEl.querySelectorAll("button.choice")).find((b) =>
            b.textContent.startsWith(ch),
        );
        if (btn) btn.click();
    }
});