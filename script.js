let timer;
let isRunning = false;
let timeLeft = 25 * 60;
let sessions = 0;
let isBreak = false;
const display = document.querySelector(".timer-display");
const progressBar = document.querySelector(".progress");
const sessionCount = document.getElementById("session-count");
const workInput = document.getElementById("work-time");
const breakInput = document.getElementById("break-time");
const longBreakInput = document.getElementById("long-break-time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const alarm = new Audio('/Dev-Mode/timer.mp3');

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    progressBar.style.width = `${100 - (timeLeft / (isBreak ? breakInput.value * 60 : workInput.value * 60) * 100)}%`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            //alert 
            // alert("Time is up!");
            alarm.play();
            clearInterval(timer);
            isRunning = false;
            if (!isBreak) {
                sessions++;
                sessionCount.textContent = sessions;
                timeLeft = (sessions % 4 === 0) ? longBreakInput.value * 60 : breakInput.value * 60;
                isBreak = true;
            } else {
                timeLeft = workInput.value * 60;
                isBreak = false;
            }
            startTimer();
        }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    sessions = 0;
    sessionCount.textContent = 0;
    timeLeft = workInput.value * 60;
    isBreak = false;
    updateDisplay();
}

const skipBreakBtn = document.getElementById("skip-break");
skipBreakBtn.addEventListener("click", skipBreak);

function skipBreak() {
    if (isBreak) {
        clearInterval(timer); 
        timeLeft = workInput.value * 60;
        isBreak = false; 
        updateDisplay(); 
        startTimer(); 
    }
    
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();