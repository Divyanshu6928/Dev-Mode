let timer;
let isRunning = false;
let timeLeft = 25 * 60;
let totalDuration = timeLeft; 
let sessions = 0;
let isBreak = false;

const display = document.querySelector(".timer-display");
const rotatingCircle = document.querySelector(".rotating-circle");
const sessionCount = document.getElementById("session-count");
const workInput = document.getElementById("work-time");
const breakInput = document.getElementById("break-time");
const longBreakInput = document.getElementById("long-break-time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const skipBreakBtn = document.getElementById("skip-break");
const alarm = new Audio('/Dev-Mode/timer.mp3');


function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    const percentage = (timeLeft / totalDuration) * 100;
    rotatingCircle.style.background = `conic-gradient(
        #7b68ee ${percentage}%,
        #444 ${percentage}%
    )`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        rotatingCircle.classList.add("active");

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                alarm.play();
                clearInterval(timer);
                isRunning = false;
                rotatingCircle.classList.remove("active");
                handleSessionEnd();
            }
        }, 1000);
    }
}
function handleSessionEnd() {
    if (!isBreak) {
        sessions++;
        sessionCount.textContent = sessions;
        totalDuration = (sessions % 4 === 0) ? longBreakInput.value * 60 : breakInput.value * 60;
        timeLeft = totalDuration;
        isBreak = true;
    } else {
        totalDuration = workInput.value * 60;
        timeLeft = totalDuration;
        isBreak = false;
    }
    updateDisplay();
    startTimer();
}
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    rotatingCircle.classList.remove("active");
}
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    sessions = 0;
    sessionCount.textContent = 0;
    totalDuration = workInput.value * 60;
    timeLeft = totalDuration;
    isBreak = false;
    rotatingCircle.classList.remove("active"); 
    updateDisplay();
}

// Skip break 
function skipBreak() {
    if (isBreak) {
        clearInterval(timer);
        totalDuration = workInput.value * 60;
        timeLeft = totalDuration;
        isBreak = false;
        rotatingCircle.classList.add("active"); 
        updateDisplay();
        startTimer();
    } else {
        alert("You are not on a break currently.");
    }
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
skipBreakBtn.addEventListener("click", skipBreak);

updateDisplay();
