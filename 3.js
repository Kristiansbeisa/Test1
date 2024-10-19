const object = document.getElementById('Cilveeks');
    const container = document.getElementById('MainField');
    const obstacles = document.querySelectorAll('.obstacle');
    const step = 3;

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
            const obstacleRight = obstacleLeft + obstacle.clientWidth -3;
            const obstacleBottom = obstacleTop + obstacle.clientHeight -3;

            if (
                objectRect.right > obstacleLeft &&
                objectRect.left < obstacleRight &&
                objectRect.bottom > obstacleTop &&
                objectRect.top < obstacleBottom
            )
             {
                return true;
            }
        }
        return false;
    }

    function checkCollision2() {
        const obstacles = document.querySelectorAll('.teleport1');
        obstacles.forEach(obstacle => {
            const rect1 = object.getBoundingClientRect();
            const rect2 = obstacle.getBoundingClientRect();
    
            if (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            ) {
                resetSquare();
            }
        });
    }
    
    function resetSquare() {
        object.style.top = 160 + 'px';
        object.style.left = 100 + 'px';
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
        checkCollision2();
        requestAnimationFrame(move);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key in keysPressed) {
            keysPressed[event.key] = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key in keysPressed) {
            keysPressed[event.key] = false;
        }
    });

    requestAnimationFrame(move);