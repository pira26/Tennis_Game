var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var speedX = 10;
var speedY = 4;

var player1 = 0;
var player2 = 0;
const winner = 3;

var showWinner = false;

var paddle1Y = 250;
var paddle2Y = 250;
const paddleThickness = 10;
const paddleHeight = 100;

function calculateMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = e.clientX - rect.left - root.scrollLeft;
    var mouseY = e.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function handleMouseClick(e) {
    if (showWinner) {
        player1 = 0;
        player2 = 0;
        showWinner = false;
    }
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(play, 1000 / framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove',
        function(e) {
            var mousePos = calculateMousePosition(e);
            paddle1Y = mousePos.y - (paddleHeight / 2);
        });
}

function play() {
    move();
    draw();
}

function reset() {
    if (player1 >= winner || player2 >= winner) {
        showWinner = true;
    }

    speedX = -speedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (paddleHeight / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    }
    else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

function move() {
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
        }
        else {
            player2++;
            reset();
        }
    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            speedX = -speedX;

            var deltaY = ballY - (paddle2Y + paddleHeight / 2);
            speedY = deltaY * 0.35;
        }
        else {
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

function draw() {

    drawRect(0, 0, canvas.width, canvas.height, 'black');

    if (showWinner) {
        canvasContext.fillStyle = 'white';
        if (player1 >= winner) {
            canvasContext.fillText("You Won !", 350, 200);
        }
        else if (player2 >= winner) {
            canvasContext.fillText("Computer Won !", 350, 200);
        }
        canvasContext.fillText("click to continue", 350, 500);
        return;
    }

    drawNet();

    drawRect(0, paddle1Y, paddleThickness, paddleHeight, 'white');

    drawRect(canvas.width - paddleThickness, paddle2Y, paddleThickness, paddleHeight, 'white');

    drawCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1, 100, 100);
    canvasContext.fillText(player2, canvas.width - 100, 100);
}

function drawCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function drawRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function drawNet() {
    for (var i = 0; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}
