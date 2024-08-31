// script.js
const dino = document.getElementById("dino");
const scoreDisplay = document.getElementById("score");
let isJumping = false;
let gravity = 0.9;
let score = 0;
let isGameOver = false;

// Retrieve high score from local storage or set to 0 if it doesn't exist
let highScore = localStorage.getItem("highScore") || 0;
const highScoreDisplay = document.createElement("div");
highScoreDisplay.className = "high-score";
highScoreDisplay.innerText = `High Score: ${highScore}`;
document.querySelector(".game-container").appendChild(highScoreDisplay);

// Function to make the dino jump
function jump() {
    if (!isJumping) {
        isJumping = true;
        let position = 0;
        let upInterval = setInterval(() => {
            if (position >= 150) {
                clearInterval(upInterval);
                let downInterval = setInterval(() => {
                    if (position <= 0) {
                        clearInterval(downInterval);
                        isJumping = false;
                    }
                    position -= 5;
                    position *= gravity;
                    dino.style.bottom = position + "px";
                }, 20);
            }
            position += 30;
            position *= gravity;
            dino.style.bottom = position + "px";
        }, 20);
    }
}

// Function to generate a random obstacle
function createObstacle() {
    if (isGameOver) return;

    let obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.right = '-20px';
    document.querySelector('.game-container').appendChild(obstacle);

    let randomTime = Math.random() * 4000 + 3000; // Random time for next obstacle (3 to 7 seconds)

    let obstacleHeight = Math.floor(Math.random() * 20) + 20; // Random height between 20px and 40px
    obstacle.style.height = obstacleHeight + "px";

    let obstacleWidth = Math.floor(Math.random() * 10) + 10; // Random width between 10px and 20px
    obstacle.style.width = obstacleWidth + "px";

    let moveObstacleInterval = setInterval(() => {
        let obstaclePosition = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
        if (obstaclePosition > 800) {
            clearInterval(moveObstacleInterval);
            document.querySelector('.game-container').removeChild(obstacle);
        } else {
            obstacle.style.right = obstaclePosition + 5 + "px";
        }
    }, 20);

    setTimeout(createObstacle, randomTime);
}

// Function to update score
function updateScore() {
    if (isGameOver) return;
    score++;
    scoreDisplay.innerText = `Score: ${score}`;
    setTimeout(updateScore, 100);
}

// Function to check collision
function checkCollision() {
    const dinoRect = dino.getBoundingClientRect();
    document.querySelectorAll('.obstacle').forEach((obstacle) => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            dinoRect.right > obstacleRect.left &&
            dinoRect.left < obstacleRect.right &&
            dinoRect.bottom > obstacleRect.top &&
            dinoRect.top < obstacleRect.bottom
        ) {
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore); // Save new high score
                highScoreDisplay.innerText = `High Score: ${highScore}`; // Update displayed high score
            }
            alert("Game Over! Your score: " + score);
            isGameOver = true;
            location.reload(); // Restart the game
        }
    });
}

document.addEventListener("keydown", (event) => {
    if ((event.key === " " || event.key === "ArrowUp") && !isGameOver) {
        jump();
    }
});

createObstacle();
updateScore();
setInterval(checkCollision, 10);
