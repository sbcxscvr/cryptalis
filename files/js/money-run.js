let scene, camera, renderer;
let player;
const floors = [];
const walls = [];
const FLOOR_WIDTH = 100;
const FLOOR_LENGTH = 100;
const WALL_HEIGHT = 3;
const WALL_THICKNESS = 1;
let money = 0;
const portals = [];
const NUM_PORTALS = 30;
const SPAWN_DISTANCE = 200;

const keys = { a: false, d: false };
const moveSpeed = 0.3;
const forwardSpeed = 0.28;
const hud = document.getElementById("hud");

let lastFloorIndex = 0;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 6, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);

    for (let i = 0; i < 5; i++) {
        const zPos = -i * FLOOR_LENGTH;
        addFloorSegment(zPos);
        addWallSegment(zPos);
    }
    lastFloorIndex = -4;

    const playerGeo = new THREE.BoxGeometry(1, 1, 1);
    const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(playerGeo, playerMat);
    player.position.y = 0.5;
    player.position.z = 0;
    scene.add(player);

    for (let i = 0; i < NUM_PORTALS; i++) {
        spawnPortal(true);
    }

    window.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
    window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));
    window.addEventListener("resize", onResize);

    setupMobileControls();
}

function addFloorSegment(zPos) {
    const floorGeo = new THREE.PlaneGeometry(FLOOR_WIDTH, FLOOR_LENGTH);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = zPos;
    scene.add(floor);
    floors.push(floor);
}

function addWallSegment(zPos) {
    const wallGeo = new THREE.BoxGeometry(WALL_THICKNESS, WALL_HEIGHT, FLOOR_LENGTH);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x888888 });

    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.position.set(-FLOOR_WIDTH / 2 - WALL_THICKNESS / 2, WALL_HEIGHT / 2, zPos);
    scene.add(leftWall);
    walls.push(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.position.set(FLOOR_WIDTH / 2 + WALL_THICKNESS / 2, WALL_HEIGHT / 2, zPos);
    scene.add(rightWall);
    walls.push(rightWall);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function spawnPortal(initial = false) {
    const value = Math.random() < 0.5 ? getRandomInt(-300, -50) : getRandomInt(50, 300);
    const color = value > 0 ? 0x00ffcc : 0xff0033;

    const geo = new THREE.TorusGeometry(1, 0.2, 16, 100);
    const mat = new THREE.MeshStandardMaterial({ color });
    const portal = new THREE.Mesh(geo, mat);
    portal.rotation.x = Math.PI / 2;

    portal.position.x = (Math.random() - 0.5) * (FLOOR_WIDTH - 10);
    portal.position.z = initial
        ? -Math.random() * SPAWN_DISTANCE - 10
        : player.position.z - Math.random() * 100 - 100;
    portal.position.y = 1;

    const label = createTextSprite((value > 0 ? "+" : "") + value + "$", value > 0 ? "lime" : "red");
    label.position.set(portal.position.x, portal.position.y + 1.5, portal.position.z);

    portal.userData = { value, touched: false, label };

    portals.push(portal);
    scene.add(portal);
    scene.add(label);
}

function createTextSprite(message, color) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 128;
    context.font = "bold 48px Arial";
    context.fillStyle = color;
    context.textAlign = "center";
    context.fillText(message, canvas.width / 2, 80);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2.5, 1.25, 1);
    return sprite;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setupMobileControls() {
    const btnLeft = document.getElementById("btn-left");
    const btnRight = document.getElementById("btn-right");

    function pressLeft() {
        keys.a = true;
    }
    function releaseLeft() {
        keys.a = false;
    }
    function pressRight() {
        keys.d = true;
    }
    function releaseRight() {
        keys.d = false;
    }

    btnLeft.addEventListener("mousedown", pressLeft);
    btnLeft.addEventListener("mouseup", releaseLeft);
    btnLeft.addEventListener("mouseleave", releaseLeft);
    btnRight.addEventListener("mousedown", pressRight);
    btnRight.addEventListener("mouseup", releaseRight);
    btnRight.addEventListener("mouseleave", releaseRight);

    btnLeft.addEventListener("touchstart", (e) => {
        e.preventDefault();
        pressLeft();
    });
    btnLeft.addEventListener("touchend", (e) => {
        e.preventDefault();
        releaseLeft();
    });
    btnRight.addEventListener("touchstart", (e) => {
        e.preventDefault();
        pressRight();
    });
    btnRight.addEventListener("touchend", (e) => {
        e.preventDefault();
        releaseRight();
    });
}

function update() {
    let newX = player.position.x;
    if (keys.a) newX -= moveSpeed;
    if (keys.d) newX += moveSpeed;

    const minX = -FLOOR_WIDTH / 2 + 0.5;
    const maxX = FLOOR_WIDTH / 2 - 0.5;

    if (newX < minX) newX = minX;
    if (newX > maxX) newX = maxX;

    player.position.x = newX;
    player.position.z -= forwardSpeed;

    if (player.position.z - lastFloorIndex * FLOOR_LENGTH < FLOOR_LENGTH * 2) {
        lastFloorIndex--;
        const zPos = lastFloorIndex * FLOOR_LENGTH;
        addFloorSegment(zPos);
        addWallSegment(zPos);
    }

    camera.position.z = player.position.z + 8;
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 6;
    camera.lookAt(player.position.x, player.position.y + 1, player.position.z - 4);

    portals.forEach((portal) => {
        const label = portal.userData.label;
        label.position.set(portal.position.x, portal.position.y + 1.5, portal.position.z);
        label.lookAt(camera.position);

        if (!portal.userData.touched && player.position.distanceTo(portal.position) < 2) {
            portal.userData.touched = true;
            money += portal.userData.value;

            const sign = portal.userData.value > 0 ? "+" : "";
            const text = document.createElement("div");
            text.innerText = `${sign}${portal.userData.value}$`;
            text.style.position = "absolute";
            text.style.left = "50%";
            text.style.top = "40%";
            text.style.transform = "translate(-50%, -50%)";
            text.style.color = portal.userData.value > 0 ? "lime" : "red";
            text.style.fontSize = "30px";
            text.style.fontFamily = "Arial";
            text.style.zIndex = 20;
            document.body.appendChild(text);
            setTimeout(() => document.body.removeChild(text), 1000);

            scene.remove(portal);
            scene.remove(label);
            portals.splice(portals.indexOf(portal), 1);
            spawnPortal();
        }

        if (portal.position.z > player.position.z + 10) {
            scene.remove(portal);
            scene.remove(portal.userData.label);
            portals.splice(portals.indexOf(portal), 1);
            spawnPortal();
        }
    });

    hud.textContent = `💰 Money: ${money}$`;
}

function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

init();
animate();