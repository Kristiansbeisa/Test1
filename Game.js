var object = document.getElementById('Cilveeks');
var container = document.getElementById('MainField');
const obstacles = document.querySelectorAll('.obstacle');
const randomMovers = document.querySelectorAll('.RandomMover');
const step = 3;
const randomMoverStep = 1.2; // Samazināts ātrums priekš nejaušā kvadrāta
const detectionRadius = 150;

const startPosition = {
    left: parseInt(window.getComputedStyle(object).getPropertyValue('left')),
    top: parseInt(window.getComputedStyle(object).getPropertyValue('top'))
};

const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false
};

let randomMoverDirections = Array.from(randomMovers).map(() => ({
    x: Math.random() < 0.5 ? -1 : 1,
    y: Math.random() < 0.5 ? -1 : 1
}));

function checkCollision(newLeft, newTop) {
    const objectRect = {
        left: newLeft,
        top: newTop,
        right: newLeft + object.clientWidth,
        bottom: newTop + object.clientHeight
    };

    for (const obstacle of obstacles) {
        const obstacleRect = obstacle.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const obstacleLeft = obstacleRect.left - containerRect.left;
        const obstacleTop = obstacleRect.top - containerRect.top;
        const obstacleRight = obstacleLeft + obstacle.clientWidth - 3;
        const obstacleBottom = obstacleTop + obstacle.clientHeight - 3;

        if (
            objectRect.right > obstacleLeft &&
            objectRect.left < obstacleRight &&
            objectRect.bottom > obstacleTop &&
            objectRect.top < obstacleBottom
        ) {
            return true;
        }
    }
    return false;
}

function checkCollision2() {
    const teleporters = document.querySelectorAll('.teleport1');
    teleporters.forEach((teleporter, index) => {
        const rect1 = object.getBoundingClientRect();
        const rect2 = teleporter.getBoundingClientRect();
        if (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        ) {
            resetSquare(index);
            return;
        }
    });
}

function resetSquare(teleporter) {
    if (teleporter === 0) {
        object.style.top = 160 + 'px';
        object.style.left = 100 + 'px';
        return;
    }
    /* Ieeja alā */
    else if (teleporter === 1) {
        container = document.getElementById('CaveField');
        object = document.getElementById('Cilveeks1')
        document.getElementById('MainField').style.display = 'none';
        document.getElementById('CaveField').style.display = 'block';
        object.style.top = 650 + 'px';
        object.style.left = 350 + 'px';

        return;
    }
    /* Ieeja mājā */
    else if (teleporter === 2) {
        container = document.getElementById('HomeField');
        object = document.getElementById('Cilveeks2')
        document.getElementById('MainField').style.display = 'none';
        document.getElementById('HomeField').style.display = 'block';
        object.style.top = 770 + 'px';
        object.style.left = 360 + 'px';
        return;
        /* Izeja no mājas */
    }
    else if (teleporter === 3) {
        container = document.getElementById('MainField');
        object = document.getElementById('Cilveeks')
        document.getElementById('MainField').style.display = 'block';
        document.getElementById('HomeField').style.display = 'none';
        object.style.top = 150 + 'px';
        object.style.left = 100 + 'px';
        return;
    }
        /* Izeja no alas */
    else if (teleporter === 4) {
        container = document.getElementById('MainField');
        object = document.getElementById('Cilveeks')
        document.getElementById('MainField').style.display = 'block';
        document.getElementById('CaveField').style.display = 'none';
        object.style.top = 450 + 'px';
        object.style.left = 750 + 'px';
        return;
    }
}

function checkRandomMoverCollisionWithObstacles(newLeft, newTop, mover) {
    const randomMoverRect = {
        left: newLeft,
        top: newTop,
        right: newLeft + mover.clientWidth,
        bottom: newTop + mover.clientHeight
    };

    for (const obstacle of obstacles) {
        const obstacleRect = obstacle.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const obstacleLeft = obstacleRect.left - containerRect.left;
        const obstacleTop = obstacleRect.top - containerRect.top;
        const obstacleRight = obstacleLeft + obstacle.clientWidth;
        const obstacleBottom = obstacleTop + obstacle.clientHeight;

        if (
            randomMoverRect.right > obstacleLeft &&
            randomMoverRect.left < obstacleRight &&
            randomMoverRect.bottom > obstacleTop &&
            randomMoverRect.top < obstacleBottom
        ) {
            return true; // Sadursme ar šķērsli
        }
    }
    return false; // Nav sadursmes
}

// Kustības funkcija visiem nejaušajiem objektiem
function moveRandomMovers() {
    randomMovers.forEach((mover, index) => {
        const left = parseInt(window.getComputedStyle(mover).getPropertyValue('left'));
        const top = parseInt(window.getComputedStyle(mover).getPropertyValue('top'));

        let newLeft = left + randomMoverDirections[index].x * randomMoverStep;
        let newTop = top + randomMoverDirections[index].y * randomMoverStep;

        // Pārbauda laukuma robežas
        if (newLeft < 0 || newLeft + mover.clientWidth > container.clientWidth) {
            randomMoverDirections[index].x *= -1; // Maina virzienu
        }
        if (newTop < 0 || newTop + mover.clientHeight > container.clientHeight) {
            randomMoverDirections[index].y *= -1; // Maina virzienu
        }

        // Pārbauda sadursmi ar šķēršļiem
        if (checkRandomMoverCollisionWithObstacles(newLeft, newTop, mover)) {
            // Maina virzienu, ja notiek sadursme ar šķērsli
            randomMoverDirections[index].x *= -1;
            randomMoverDirections[index].y *= -1;
        } else {
            // Ja nav sadursmes, tad pārvieto kvadrātu
            mover.style.left = newLeft + 'px';
            mover.style.top = newTop + 'px';
        }

        // Pārbauda, vai lietotāja kvadrāts atrodas noteiktā attālumā
        followPlayerIfInRange(mover, index);
    });

    requestAnimationFrame(moveRandomMovers); // Atkārtoti izsauc kustības funkciju
}

// Funkcija, kas aprēķina attālumu starp kvadrātiem un, ja attālums ir mazāks par "detectionRadius", sāk sekot lietotājam
function followPlayerIfInRange(mover, index) {
    const playerRect = object.getBoundingClientRect();
    const randomMoverRect = mover.getBoundingClientRect();

    const distanceX = playerRect.left - randomMoverRect.left;
    const distanceY = playerRect.top - randomMoverRect.top;

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < detectionRadius) {
        // Maina virzienu, lai kustētos lietotāja kvadrāta virzienā
        if (distanceX !== 0) randomMoverDirections[index].x = distanceX / Math.abs(distanceX); // Normē virzienu x
        if (distanceY !== 0) randomMoverDirections[index].y = distanceY / Math.abs(distanceY); // Normē virzienu y
    }
}

// Funkcija sadursmes pārbaudei ar nejauši kustīgajiem kvadrātiem
function checkRandomMoversCollision() {
    randomMovers.forEach(mover => {
        const rect1 = object.getBoundingClientRect();
        const rect2 = mover.getBoundingClientRect();

        if (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        ) {
            // Teleportē, ja saduras ar nejauši kustīgo kvadrātu
            resetSquare(3); // Teleportē uz noteiktu vietu
        }
    });
}

function move() {
    const left = parseInt(window.getComputedStyle(object).getPropertyValue('left'));
    const top = parseInt(window.getComputedStyle(object).getPropertyValue('top'));

    let newLeft = left;
    let newTop = top;

    if (keysPressed.w && top > 0 || keysPressed.ArrowUp && top > 0) {
        newTop -= step;
        if (checkCollision(newLeft, newTop)) {
            newTop += step;
        }
    }
    if (keysPressed.s && top + object.clientHeight < container.clientHeight || keysPressed.ArrowDown && top + object.clientHeight < container.clientHeight) {
        newTop += step;
        if (checkCollision(newLeft, newTop)) {
            newTop -= step;
        }
    }
    if (keysPressed.a && left > 0 || keysPressed.ArrowLeft && left > 0) {
        newLeft -= step;
        if (checkCollision(newLeft, newTop)) {
            newLeft += step;
        }
    }
    if (keysPressed.d && left + object.clientWidth < container.clientWidth || keysPressed.ArrowRight && left + object.clientWidth < container.clientWidth) {
        newLeft += step;
        if (checkCollision(newLeft, newTop)) {
            newLeft -= step;
        }
    }

    object.style.left = newLeft + 'px';
    object.style.top = newTop + 'px';
    checkRandomMoversCollision();
    checkCollision2();
    requestAnimationFrame(move);
}


document.addEventListener('keydown', function (event) {
    if (event.key in keysPressed) {
        keysPressed[event.key] = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key in keysPressed) {
        keysPressed[event.key] = false;
    }
});
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function changeRandomMoverDirections() {
    randomMovers.forEach((mover, index) => {
        randomMoverDirections[index].x = Math.random() < 0.5 ? -1 : 1;
        randomMoverDirections[index].y = Math.random() < 0.5 ? -1 : 1;
    });
}

setInterval(changeRandomMoverDirections, 3000);

move();
moveRandomMovers();
document.getElementById('MainField').style.display = 'block';
document.getElementById('CaveField').style.display = 'none';
document.getElementById('HomeField').style.display = 'none';

document.getElementById('upButton').addEventListener('mousedown', () => keysPressed.ArrowUp = true);
document.getElementById('upButton').addEventListener('mouseup', () => keysPressed.ArrowUp = false);
document.getElementById('leftButton').addEventListener('mousedown', () => keysPressed.ArrowLeft = true);
document.getElementById('leftButton').addEventListener('mouseup', () => keysPressed.ArrowLeft = false);
document.getElementById('downButton').addEventListener('mousedown', () => keysPressed.ArrowDown = true);
document.getElementById('downButton').addEventListener('mouseup', () => keysPressed.ArrowDown = false);
document.getElementById('rightButton').addEventListener('mousedown', () => keysPressed.ArrowRight = true);
document.getElementById('rightButton').addEventListener('mouseup', () => keysPressed.ArrowRight = false);

function Hidebuttons() {
    var Buttonshowcheck = document.getElementById("buttonshowcheck");
    var upbut = document.getElementById("upButton")
    var downbut = document.getElementById("downButton")
    var leftbut = document.getElementById("leftButton")
    var rightbut = document.getElementById("rightButton")
    if (Buttonshowcheck.checked == true) {
        upbut.style.display = "block";
        downbut.style.display = "block";
        leftbut.style.display = "block";
        rightbut.style.display = "block";
    } else {
        upbut.style.display = "none";
        downbut.style.display = "none";
        leftbut.style.display = "none";
        rightbut.style.display = "none";
    }
}

function addButtonListeners(buttonId, key) {
    const button = document.getElementById(buttonId);

    button.addEventListener('mousedown', () => keysPressed[key] = true);
    button.addEventListener('mouseup', () => keysPressed[key] = false);
    button.addEventListener('mouseleave', () => keysPressed[key] = false);

    button.addEventListener('touchstart', () => {
        keysPressed[key] = true;
        event.preventDefault();
    });
    button.addEventListener('touchend', () => {
        keysPressed[key] = false;
        event.preventDefault();
    });
}

addButtonListeners('upButton', 'ArrowUp');
addButtonListeners('leftButton', 'ArrowLeft');
addButtonListeners('downButton', 'ArrowDown');
addButtonListeners('rightButton', 'ArrowRight');