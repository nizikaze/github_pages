const bpmDisplay = document.getElementById('bpm-display');
const tapButton = document.getElementById('tap-button');
const resetButton = document.getElementById('reset-button');

let lastTapTime = 0;
let tapTimes = [];
let timeoutId;

const calculateBPM = () => {
    if (tapTimes.length < 2) {
        return;
    }

    const intervals = [];
    for (let i = 1; i < tapTimes.length; i++) {
        intervals.push(tapTimes[i] - tapTimes[i - 1]);
    }

    const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    const bpm = 60000 / averageInterval;
    bpmDisplay.textContent = Math.round(bpm);
};

const reset = () => {
    lastTapTime = 0;
    tapTimes = [];
    bpmDisplay.textContent = '0';
    clearTimeout(timeoutId);
};

tapButton.addEventListener('click', () => {
    const now = new Date().getTime();

    if (lastTapTime !== 0 && now - lastTapTime > 2000) {
        reset();
    }

    lastTapTime = now;
    tapTimes.push(now);
    calculateBPM();

    clearTimeout(timeoutId);
    timeoutId = setTimeout(reset, 2000);
});

resetButton.addEventListener('click', reset);