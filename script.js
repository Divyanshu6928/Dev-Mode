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
const alarm = new Audio('');

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


// function pauseTimer() {
//     clearInterval(timer);
//     isRunning = false;
// }


function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        pauseBtn.textContent = "Resume";  // Change button text to "Resume"
    } else {
        isRunning = true;
        pauseBtn.textContent = "Pause";  // Change button text back to "Pause"
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                alarm.play();
                clearInterval(timer);
                isRunning = false;
                pauseBtn.textContent = "Pause";  // Reset to "Pause" when the timer finishes
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




function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    sessions = 0;
    sessionCount.textContent = 0;
    timeLeft = workInput.value * 60;
    isBreak = false;
    updateDisplay();
}





startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();



document.querySelector('.btn').addEventListener('click', setWorkTime);

function setWorkTime() {
    if (workInput.value >= 1) {  // Ensure work time is at least 1 minute
        clearInterval(timer);  // Stop the current timer if it's running
        isRunning = false;
        timeLeft = workInput.value * 60;  // Update timeLeft based on the new input
        isBreak = false;
        updateDisplay();  // Update the display with the new time
    } else {
        alert('Work time must be at least 1 minute.');
    }
}

