var bar1 = document.getElementById("bar1");
var bar2 = document.getElementById("bar2");
var ball = document.getElementById("ball");


const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

let score,
    maxScore,
    movement,
    rod,
    ballSpeedX = 2,
    ballSpeedY = 2;
let gameOn = false;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

(function () {
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(score);
    if (rod == null || maxScore == null) {
        alert("this is first time you are playing");
        maxScore = 0;
        rod = "Rod1";
    }
    else {
        alert(rod + "has max score of" + maxScore * 100);
    }
    resetBoard(rod);
})();

function resetBoard(rodName) {
    bar1.style.left = (window.innerWidth - bar1.offsetWidth) / 2 + "px";
    bar2.style.left = (window.innerWidth - bar2.offsetWidth) / 2 + "px";
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";

    if (rodName == rod2Name) {
        ball.style.top = (bar1.offsetTop + bar1.offsetHeight) + "px";
        ballSpeedY = 2;
    } else if (rodName == rod1Name) {
        ball.style.top = (bar2.offsetTop - bar2.offsetHeight) + "px";
        ballSpeedY = 2;
    }
    score = 0;
    gameOn = false;
}

function storeWin(rod, score) {
    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, maxScore);
    }
    clearInterval(movement);
    resetBoard(rod);

    alert(rod + " wins with a score of " + (score * 100) + ". Max score is: " + (maxScore * 100));
}


window.addEventListener("keypress", function (event) {
    let rodsSpeed = 20;

    let rodRect = bar1.getBoundingClientRect();

    if (event.code == "KeyD" && ((rodRect.x + rodRect.width) < window.innerWidth)) {
        bar1.style.left = (rodRect.x) + rodsSpeed + "px";
        bar2.style.left = bar1.style.left;
    } else if (event.code == "KeyA" && (rodRect.x > 0)) {
        bar1.style.left = (rodRect.x) - rodsSpeed + "px";
        bar2.style.left = bar1.style.left;
    }

    if (event.code === "Enter") {
        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = bar1.offsetHeight;
            let rod2Height = bar2.offsetHeight;
            let rod1Width = bar1.offsetWidth;
            let rod2Width = bar2.offsetWidth;

            movement = setInterval(function () {
                // Move ball 
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                rod1X = bar1.getBoundingClientRect().x;
                rod2X = bar2.getBoundingClientRect().x;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';


                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; // Reverses the direction
                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for Rod 1
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;

                    // Check if the game ends
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        storeWin(rod2Name, score);
                    }
                }

                // Check for Rod 2
                else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction
                    score++;

                    // Check if the game ends
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        storeWin(rod1Name, score);
                    }
                }

            }, 10);

        }
    }
});