// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const game = {
    running: false,
    playerScore: 0,
    computerScore: 0,
};

const paddle = {
    width: 15,
    height: 100,
    speed: 6,
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speedX: 5,
    speedY: 5,
    maxSpeed: 8,
};

const player = {
    x: 20,
    y: canvas.height / 2 - paddle.height / 2,
    width: paddle.width,
    height: paddle.height,
};

const computer = {
    x: canvas.width - 20 - paddle.width,
    y: canvas.height / 2 - paddle.height / 2,
    width: paddle.width,
    height: paddle.height,
};

// Input handling
const keys = {};
let mouseY = canvas.height / 2;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        e.preventDefault();
        toggleGame();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Game functions
function toggleGame() {
    game.running = !game.running;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.speedY = (Math.random() - 0.5) * 5;
}

function updatePlayerPaddle() {
    // Mouse control
    if (mouseY > 0 && mouseY < canvas.height) {
        player.y = mouseY - paddle.height / 2;
    }

    // Arrow key control
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= paddle.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - paddle.height) {
        player.y += paddle.speed;
    }

    // Boundary check
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - paddle.height) {
        player.y = canvas.height - paddle.height;
    }
}

function updateComputerPaddle() {
    const computerCenter = computer.y + paddle.height / 2;
    const difficulty = 0.045; // AI difficulty (higher = easier)

    // Simple AI: follow the ball with slight delay/imperfection
    if (computerCenter < ball.y - 35) {
        computer.y += paddle.speed * difficulty * 100;
    } else if (computerCenter > ball.y + 35) {
        computer.y -= paddle.speed * difficulty * 100;
    }

    // Boundary check
    if (computer.y < 0) computer.y = 0;
    if (computer.y > canvas.height - paddle.height) {
        computer.y = canvas.height - paddle.height;
    }
}

function updateBall() {
    if (!game.running) return;

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Paddle collision detection
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.speedX = -ball.speedX;
        ball.x = player.x + player.width + ball.radius;
        
        // Add spin based on where the ball hits the paddle
        const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        ball.speedY = hitPos * ball.maxSpeed;
    }

    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.speedX = -ball.speedX;
        ball.x = computer.x - ball.radius;
        
        // Add spin based on where the ball hits the paddle
        const hitPos = (ball.y - (computer.y + computer.height / 2)) / (computer.height / 2);
        ball.speedY = hitPos * ball.maxSpeed;
    }

    // Scoring
    if (ball.x < 0) {
        game.computerScore++;
        resetBall();
        document.getElementById('computerScore').textContent = game.computerScore;
    }
    if (ball.x > canvas.width) {
        game.playerScore++;
        resetBall();
        document.getElementById('playerScore').textContent = game.playerScore;
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = '#00ff88';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;
    
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);

    // Draw ball
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Draw game status
    if (!game.running) {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS SPACE TO START', canvas.width / 2, canvas.height / 2);
    }
}

function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
resetBall();
gameLoop();
