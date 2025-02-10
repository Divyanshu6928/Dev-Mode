let timer;
let isRunning = false;
let timeLeft = 25 * 60;
let totalDuration = timeLeft; // Initialize total duration for progress calculation
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
const alarm = new Audio('audio/Untitled ‑ Made with FlexClip.mp3');
const sessionCompletion = new Audio("audio/discord-calling-250633.mp3");
const notification = document.getElementById("notification");

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

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
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
                clearInterval(timer);
                isRunning = false;
                rotatingCircle.classList.remove("active");
                sessionCompletion.play();
                
                if (!isBreak) {
                    sessions++;
                    showNotification('Break time🍵');
                    sessionCount.textContent = sessions;
                    totalDuration = (sessions % 4 === 0) ? longBreakInput.value * 60 : breakInput.value * 60;
                    timeLeft = totalDuration;
                    isBreak = true;
                } else {
                    totalDuration = workInput.value * 60;
                    timeLeft = totalDuration;
                    isBreak = false;
                    showNotification('Break time ended💻');
                }
                updateDisplay();
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        rotatingCircle.classList.remove("active");
        pauseBtn.textContent = "Resume";
    } else {
        isRunning = true;
        pauseBtn.textContent = "Pause";
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                sessionCompletion.play();
                clearInterval(timer);
                isRunning = false;
                pauseBtn.textContent = "Pause";
                
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
                startTimer();
            }
        }, 1000);
    }
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

function skipBreak() {
    if (isBreak) {
        clearInterval(timer);
        isRunning = false;
        totalDuration = workInput.value * 60;
        timeLeft = totalDuration;
        isBreak = false;
        rotatingCircle.classList.remove("active"); 
        updateDisplay();
        showNotification("Break skipped. Back to work!💻");
    } else {
        showNotification("You are not on a break currently.");
    }
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
skipBreakBtn.addEventListener("click", skipBreak);

document.querySelector('.btn').addEventListener('click', setWorkTime);

function setWorkTime() {
    if (workInput.value >= 1) {
        clearInterval(timer);
        isRunning = false;
        totalDuration = workInput.value * 60;
        timeLeft = totalDuration;
        isBreak = false;
        updateDisplay();
    } else {
        showNotification('Work time must be at least 1 minute.');
    }
}

updateDisplay();
