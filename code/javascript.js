const mainContainer = document.querySelector(".main-container");
const squares = document.querySelectorAll(".square");
const timeLeft = document.getElementById("time-left");
const livesLeft = document.getElementById("lives-left");
const score = document.getElementById("score");
const startButton = document.querySelector(".start-button");
const gameStartMusic = new Audio("../assets/music/CreepyMusicBox.mp3");
const zombieGrunt = new Audio("../assets/music/ZombieGrunt.mp3");
const humanGrunt = new Audio("../assets/music/humanGrunt.mp3");
const jumpscareZombie = document.getElementById("jumpscareZombie");
const jumpscareZombie2 = document.getElementById("jumpscareZombie2");
const jumpscareZombie3 = document.getElementById("jumpscareZombie3");
const jumpscareSound = new Audio("../assets/music/JumpScareScream.mp3");
const jumpscareSound2 = new Audio("../assets/music/JumpScareScream2.mp3");
const jumpscareSound3 = new Audio("../assets/music/JumpScareScream3.wav");
const restartButton = document.querySelector(".restart-button");
const gameOverOverlay = document.querySelector(".game-over-overlay");
const gameOverImage = document.querySelector(".game-over-image");
const gameOverMessage = document.getElementById("game-over-message");
const finalScore = document.getElementById("final-score");



let result = 0;
let clickPositionHit;
let clickPositionMiss;
let currentTime = 60;
let lives = 3;
let buttonClick = null;
let countDownTimerId = null; 
let timerId = null; 
let soundBoard;
let randomImageJumpScare;
let jumpScareTimer;
let jumpScareOff = null;
let lastJumpScareType = -1;
let flickerIntervalId = null;
let flickerActive = false;


function cleanTiles(){
    squares.forEach(square => {
        square.classList.remove("active-zombie", "active-human");
    });
}

function randomCharacters(){
    cleanTiles();

    let randomZombieIndex = Math.floor(Math.random() * 20);
    let randomHumanIndex;

    do {
        randomHumanIndex = Math.floor(Math.random() * 20);
    } while (randomZombieIndex === randomHumanIndex); 

    let randomZombie = squares[randomZombieIndex];
    let randomHuman = squares[randomHumanIndex];

    randomZombie.classList.add("active-zombie");
    clickPositionHit = randomZombie.id;

    randomHuman.classList.add("active-human");
    clickPositionMiss = randomHuman.id;
}

squares.forEach(square => {
    square.addEventListener("mousedown", () => {
        let soundBoard = Math.floor(Math.random() * 2);
        if(square.id == clickPositionHit) {
            result += 10;
            updateResult();
            clickPositionHit = null;
            if(soundBoard === 0){
                zombieGrunt.play();
            }
            
        } else if (square.id == clickPositionMiss) {
            lives--;
            humanGrunt.play();
            updateLives();
            clickPositionMiss = null;
            if(lives > 0){
                humanHit();     
            }
            else if (lives === 0) {
                gameOver();
            }
        }
    });
});


function clearFlickerEffects() {
    squares.forEach(square => {
        square.classList.remove("flicker");
    });
}
function randomFlickerEffect() {
    clearFlickerEffects();
    let randomIndex = Math.floor(Math.random() * squares.length);
    let randomSquare = squares[randomIndex];
    randomSquare.classList.add("flicker");
}
function startFlickerEffect() {
    if (!flickerActive) {
        flickerActive = true;
        flickerIntervalId = setInterval(randomFlickerEffect, 1000);
    }
}
function stopFlickerEffect() {
    if (flickerActive) {
        clearInterval(flickerIntervalId);
        flickerActive = false;
        clearFlickerEffects();
    }
}
function toggleFlickerEffect() {
    if (flickerActive) {
        stopFlickerEffect();
        ToggleFlicker.classList.remove("flicker-mode-on");
    } else {
        startFlickerEffect();
        ToggleFlicker.classList.add("flicker-mode-on");
    }
}
const ToggleFlicker = document.querySelector(".flicker-mode");
ToggleFlicker.addEventListener("click", toggleFlickerEffect);

function humanHit() {
    const flashAnimation = document.createElement("div");
    flashAnimation.classList.add("red-flash");
    
    mainContainer.classList.add("shake-effect");

    document.body.appendChild(flashAnimation);
    
    setTimeout(() => {
        flashAnimation.remove();
        mainContainer.classList.remove("shake-effect");
    }, 500);
}

function updateLives() {
    livesLeft.textContent = lives;
}

function updateResult() {
    score.textContent = result;
}

function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime + "s";
    
    if (currentTime === 0) {
        gameOver();
    }
}

const rulesPage = document.querySelector(".rulesLink");
rulesPage.addEventListener("click", (e)=>{
    if(buttonClick){
        e.preventDefault();
        alert("Can't change Pages in middle of Game...");
    }
})

function newGame() {
    result = 0;
    lastJumpScareType = -1;
    jumpScareOff = null;
    randomJumpscare();
    goFullscreen();
    if (!buttonClick) {
        startButton.innerText = "Game Started";
        gameStartMusic.play();
        countDownTimerId = setInterval(countDown, 1000);
        timerId = setInterval(randomCharacters, 700);
        buttonClick = true;
    } else {
        alert("Game has already started...");
    }
}

function resetGame() {
    result = 0;
    lives = 3;
    currentTime = 60;
    score.textContent = result;
    updateLives();
    timeLeft.textContent = currentTime + "s";
    startButton.innerText = "Restart Game";
}

startButton.addEventListener("click", newGame);

function gameOver() {
    gameStartMusic.pause();
    gameStartMusic.currentTime = 0;
    clearTimeout(randomImageJumpScare);
    clearTimeout(jumpScareTimer);
    clearInterval(countDownTimerId);
    clearInterval(timerId);
    cleanTiles();
    jumpScareOff = true;
    buttonClick = null;
    displayGameOverScreen();
}


function displayGameOverScreen() {
    if (result >= 500) {
        gameOverMessage.textContent = "You Win!";
        gameOverMessage.style.color = "#00ff00";
        gameOverMessage.style.textShadow = "#4CBB17 0px 5px 15px";
    } else {
        gameOverMessage.textContent = "You Lose...";
        gameOverMessage.style.color = "#ff4040";
        gameOverMessage.style.textShadow = "#ff4040 0px 5px 15px";
    }
    finalScore.textContent = `Final Score: ${result}`;
    gameOverOverlay.classList.add("visible");

    restartButton.addEventListener("click", () => {
        gameOverOverlay.classList.remove("visible");
        resetGame();
    });
}


function triggerJumpscare() {
    if(!jumpScareOff){
        // console.log(lastJumpScareType);
        let jumpScareType;
        do {
            jumpScareType = Math.floor(Math.random()*3);
        } while (jumpScareType === lastJumpScareType);

        lastJumpScareType = jumpScareType;

        // console.log(jumpScareType);
        if(jumpScareType === 0){
            jumpscareSound.play();
            jumpscareZombie.classList.add("zombie-visible");
        } else if(jumpScareType === 1){
            jumpscareSound2.play();
            jumpscareZombie2.classList.add("zombie-visible-2");
        } else if(jumpScareType === 2){
            jumpscareSound3.play();
            jumpscareZombie3.classList.add("zombie-visible-3");
        }
        
        
        jumpScareTimer = setTimeout(() => {
            jumpscareZombie.classList.remove("zombie-visible");
            jumpscareZombie2.classList.remove("zombie-visible-2");
            jumpscareZombie3.classList.remove("zombie-visible-3");
        }, 700);
        console.log(lastJumpScareType);
    }
}

function randomJumpscare() {
    if(!jumpScareOff){
        let randomJumpScare = Math.floor(Math.random() * 20);
        // console.log(randomJumpScare);
        if(randomJumpScare <= 10){
            // console.log("Smaller than 10");
            randomJumpScare += 10;
        }
        randomJumpScare *= 1000;
        // console.log(randomJumpScare);
        if(randomJumpScare < (currentTime*1000)){
            // console.log(randomJumpScare);
            randomImageJumpScare = setTimeout(() => {
                triggerJumpscare();
                randomJumpscare();
            }, randomJumpScare);
        }
    }
}

const visibleArea = document.createElement("div");
const toggleDarkMode = document.querySelector(".dark-mode");
const fogOverlay = document.createElement("div");
toggleDarkMode.addEventListener("click", toggleFog);

const toggleGunElement = document.querySelector(".gun-toggle");
const gunElement = document.createElement("div");
document.body.appendChild(gunElement);
gunElement.classList.add("gun-element");

toggleGunElement.addEventListener("click", toggleGunAdd);

function toggleGunAdd(){
    toggleGunElement.classList.toggle("gun-toggle-off");
    gunElement.classList.toggle("gun-element");
}

function toggleFog(){
    toggleDarkMode.classList.toggle("dark-mode-on");

    fogOverlay.classList.toggle("fog-overlay");
    document.body.appendChild(fogOverlay);

    visibleArea.classList.toggle("visible-area");
    fogOverlay.appendChild(visibleArea);
}


document.body.addEventListener("mousemove", (e) => {
    const mouseX = e.pageX;
    const mouseY = e.pageY;

    const halfVisibleAreaWidth = visibleArea.offsetWidth / 2;
    const halfVisibleAreaHeight = visibleArea.offsetHeight / 2;
    const halfGunElementWidth = gunElement.offsetWidth / 2;
    const halfGunElementHeight = gunElement.offsetHeight / 2;

    const viewportWidth = window.innerWidth - 10;
    const viewportHeight = window.innerHeight - 10;

    let visibleAreaX = Math.max(0, Math.min(mouseX - halfVisibleAreaWidth, viewportWidth - visibleArea.offsetWidth));
    let visibleAreaY = Math.max(0, Math.min(mouseY - halfVisibleAreaHeight, viewportHeight - visibleArea.offsetHeight));

    let gunElementX = Math.max(0, Math.min(mouseX - halfGunElementWidth, viewportWidth - gunElement.offsetWidth));
    let gunElementY = Math.max(0, Math.min(mouseY - halfGunElementHeight, viewportHeight - gunElement.offsetHeight));

    visibleArea.style.left = `${visibleAreaX}px`;
    visibleArea.style.top = `${visibleAreaY}px`;

    gunElement.style.left = `${gunElementX}px`;
    gunElement.style.top = `${gunElementY}px`;
});


const mist = document.querySelector(".texture");
function fadeInMist() {
    mist.style.transition = "opacity 2s ease-in-out";
    mist.style.opacity = "0.7";
}

function fadeOutMist() {
    mist.style.transition = "opacity 2s ease-in-out";
    mist.style.opacity = "0.3";
}

squares.forEach(square => {
    square.addEventListener("click", () => {
        let fogChecker = Math.floor(Math.random() * 2);
        if(fogChecker === 0 && buttonClick){
        fadeInMist();
        }
        setTimeout(fadeOutMist, 6000);
    });
});

function goFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
});