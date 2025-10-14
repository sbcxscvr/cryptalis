"use strict";
const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const jumpBtn = document.getElementById("jumpBtn");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

let W = 0,
    H = 0;
let running = false;
let gameOver = false;
let started = false;
let last = 0;

const state = {
    camX: 0,
    speed: 380,
    gravity: 2200,
    jumpVel: -820,
    floorY: 0,
    t: 0,
    score: 0,
    best: Number(localStorage.getItem("dashcube_best") || 0),
};
const player = {
    x: 120,
    y: 0,
    w: 42,
    h: 42,
    vy: 0,
    grounded: false,
    rot: 0,
};
const spikes = [];
const particles = [];

function resize() {
    W = Math.floor(window.innerWidth * DPR);
    H = Math.floor(window.innerHeight * DPR);
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = Math.floor(W / DPR) + "px";
    canvas.style.height = Math.floor(H / DPR) + "px";
    state.floorY = Math.floor(H * 0.78);
}

function reset() {
    spikes.length = 0;
    particles.length = 0;
    state.camX = 0;
    state.t = 0;
    state.score = 0;
    player.y = state.floorY - player.h;
    player.vy = 0;
    player.rot = 0;
    player.grounded = true;
    spawnInitialSpikes();
}

function spawnInitialSpikes() {
    let x = 600;
    for (let i = 0; i < 12; i++) {
        const gap = 320 + Math.random() * 260;
        const count = 1 + (Math.random() < 0.3 ? 1 : 0);
        for (let k = 0; k < count; k++) spikes.push(makeSpike(x + k * 48));
        x += gap;
    }
}

function makeSpike(x) {
    return {
        x,
        y: state.floorY,
        w: 48,
        h: 48,
        hitbox: {
            x: 8,
            y: -44,
            w: 32,
            h: 44,
        },
    };
}

function jump() {
    if (started && !gameOver && player.grounded) {
        player.vy = state.jumpVel;
        player.grounded = false;
    }
}

function update(dt) {
    state.t += dt;
    state.camX += state.speed * dt;
    if (!player.grounded) {
        player.vy += state.gravity * dt;
        player.y += player.vy * dt;
        player.rot += 6.0 * dt;
        if (player.y + player.h >= state.floorY) {
            player.y = state.floorY - player.h;
            player.vy = 0;
            player.grounded = true;
            player.rot = 0;
        }
    }
    const viewLeft = state.camX - 200,
        viewRight = state.camX + W + 200;
    for (let i = spikes.length - 1; i >= 0; i--) {
        const s = spikes[i];
        if (s.x < viewLeft) {
            spikes.splice(i, 1);
            continue;
        }
        if (s.x > viewRight) continue;
        if (rectHit(player, worldToScreen(s, s.hitbox))) {
            onCrash();
            break;
        }
    }
    maybeSpawnSpikes(viewRight);
    state.score = Math.floor(state.camX / 10);
    scoreEl.textContent = "Score: " + state.score;
    bestEl.textContent = "Best: " + state.best;
}

function worldToScreen(s, hb) {
    return {
        x: Math.floor((s.x - state.camX) * DPR) + hb.x * DPR,
        y: Math.floor(s.y * DPR) + hb.y * DPR,
        w: hb.w * DPR,
        h: hb.h * DPR,
    };
}

function rectHit(a, b) {
    const ap = {
        x: player.x * DPR,
        y: player.y * DPR,
        w: player.w * DPR,
        h: player.h * DPR,
    };
    return ap.x < b.x + b.w && ap.x + ap.w > b.x && ap.y < b.y + b.h && ap.y + ap.h > b.y;
}

function maybeSpawnSpikes(viewRight) {
    let farthest = 0;
    for (const s of spikes) {
        if (s.x > farthest) farthest = s.x;
    }
    if (farthest < state.camX + W * 1.2) {
        let x = Math.max(farthest + 260, state.camX + W);
        for (let i = 0; i < 8; i++) {
            const gap = 280 + Math.random() * 320;
            const count = Math.random() < 0.25 ? 2 : 1;
            for (let k = 0; k < count; k++) spikes.push(makeSpike(x + k * 48));
            x += gap;
        }
    }
}

function onCrash() {
    running = false;
    gameOver = true;
    state.best = Math.max(state.best, state.score);
    localStorage.setItem("dashcube_best", String(state.best));
    menu.style.display = "flex";
    startBtn.textContent = "Retry";
}

function drawBackground() {
    ctx.fillStyle = "#11132a";
    ctx.fillRect(0, H * 0.35, W, H);
}

function drawFloor() {
    ctx.fillStyle = "#11142c";
    ctx.fillRect(0, state.floorY, W, H - state.floorY);
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x * DPR + (player.w * DPR) / 2, player.y * DPR + (player.h * DPR) / 2);
    ctx.rotate(player.rot);
    ctx.fillStyle = "#39d0ff";
    ctx.fillRect(-(player.w * DPR) / 2, -(player.h * DPR) / 2, player.w * DPR, player.h * DPR);
    ctx.restore();
}

function drawSpikes() {
    ctx.save();
    ctx.translate(-Math.floor(state.camX * DPR), 0);
    for (const s of spikes) {
        ctx.beginPath();
        const x = Math.floor(s.x * DPR),
            y = Math.floor(s.y * DPR),
            w = s.w * DPR,
            h = s.h * DPR;
        ctx.moveTo(x, y);
        ctx.lineTo(x + w / 2, y - h);
        ctx.lineTo(x + w, y);
        ctx.closePath();
        ctx.fillStyle = "#f7c948";
        ctx.fill();
    }
    ctx.restore();
}

function frame(ts) {
    if (!last) last = ts;
    const dt = Math.min(0.032, (ts - last) / 1000);
    last = ts;
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawFloor();
    if (running) update(dt);
    drawSpikes();
    drawPlayer();
    requestAnimationFrame(frame);
}
startBtn.addEventListener("click", () => {
    menu.style.display = "none";
    started = true;
    gameOver = false;
    reset();
    running = true;
});
backBtn.addEventListener("click", () => {
    running = false;
    started = false;
    gameOver = false;
    menu.style.display = "flex";
    startBtn.textContent = "Start Game";
});
canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    jump();
});
jumpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    jump();
});
window.addEventListener("keydown", (e) => {
    if (["Space", "ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();
        jump();
    }
});
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", resize);
resize();
reset();
requestAnimationFrame(frame);
canvas.focus();