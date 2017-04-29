let canvas;
let canvasContext;

let ballX = 50;
let ballY = 50;
let speedX = 10;
let speedY = 5;

let paddle1Y = 250;
let paddle2Y = 250;
const paddleTickness = 10;
const paddleHeight = 100;

let player1 = 0;
let player2 = 0;
let winner = 3;
let showWinner = false;

calculateMousePosition = (e) => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    let mouseX = e.clientX - rect.left - root.scrollLeft;
    let mouseY = e.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

handleMouseClick = (e) => {
    if (showWinner) {
        player1 = 0;
        player2 = 0;
        showWinner = false;
    }
}

window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    const framesPerSecond = 30;
    setInterval(play, 1000 / framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove', (e) => {
        let mousePosition = calculateMousePosition(e);
        paddle1Y = mousePosition.y - (paddleHeight / 2);
    });

}

play = () => {
    move();
    draw();
}

reset = () => {

    if (player1 >= winner || player2 >= winner) {
        player1 = 0;
        player2 = 0;
        showWinner = true;
    }

    speedX = -speedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

computerMovement = () => {
    const paddle2YCenter = paddle2Y + (paddleHeight / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

move = () => {

    if (showWinner) {
        return;
    }

    computerMovement();

    ballX += speedX;
    ballY += speedY;

    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            speedX = -speedX;

            var deltaY = ballY - (paddle1Y + paddleHeight / 2);
            speedY = deltaY * 0.35;
        } else {
            player2++;
            reset();
        }
    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            speedX = -speedX;

            var deltaY = ballY - (paddle2Y + paddleHeight / 2);
            speedY = deltaY * 0.35;
        } else {
            player1++;
            reset();
        }
    }
    if (ballY < 0) {
        speedY = -speedY;
    }
    if (ballY > canvas.height) {
        speedY = -speedY;
    }
}

draw = () => {
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    if (showWinner) {
        canvasContext.fillStyle = 'white';
        if (player1 >= winner) {
            canvasContext.fillText("You Won !", 350, 200);
        } else if (player2 >= winner) {
            canvasContext.fillText("Computer Won !", 350, 200);
        }
        canvasContext.fillText("click to continue", 350, 500);
        return;
    }

    drawNet();

    drawRect(0, paddle1Y, paddleTickness, paddleHeight, 'white');
    drawRect(canvas.width - paddleTickness, paddle2Y, paddleTickness, paddleHeight, 'white');

    drawCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1, 100, 100);
    canvasContext.fillText(player2, canvas.width - 100, 100);
}

drawRect = (leftX, topY, width, height, drawColor) => {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

drawCircle = (centerX, centerY, radius, drawColor) => {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

drawNet = () => {
    for (let i = 0; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}
