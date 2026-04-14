// Game state variables
let secretNumber;
let attemptsLeft;
let maxRange;
let maxAttempts;
let score = 0;
let hintsUsed = 0;
let isGameOver = false;

const elements = {
    guessInput: document.getElementById('guessInput'),
    submitBtn: document.getElementById('submitBtn'),
    hintBtn: document.getElementById('hintBtn'),
    restartBtn: document.getElementById('restartBtn'),
    difficulty: document.getElementById('difficulty'),
    instruction: document.getElementById('instruction'),
    feedback: document.getElementById('feedback'),
    attempts: document.getElementById('attemptsDisplay'),
    score: document.getElementById('scoreDisplay'),
    leaderboard: document.getElementById('leaderboardList')
};

const settings = {
    easy: { range: 50, attempts: 10, multiplier: 1 },
    medium: { range: 100, attempts: 7, multiplier: 2 },
    hard: { range: 200, attempts: 5, multiplier: 3 }
};

//CORE GAME LOGIC

function initGame() {
    const diffKey = elements.difficulty.value;
    const config = settings[diffKey];

    // 1. Setup the rules based on difficulty
    maxRange = config.range;
    maxAttempts = config.attempts;
    secretNumber = Math.floor(Math.random() * maxRange) + 1;

    // 2. Reset the state
    attemptsLeft = maxAttempts;
    hintsUsed = 0;
    score = 0;
    isGameOver = false;

    // 3. Update the UI
    elements.instruction.textContent = `I'm thinking of a number between 1 and ${maxRange}.`;
    elements.attempts.textContent = attemptsLeft;
    elements.score.textContent = "0";
    elements.feedback.textContent = "";
    elements.feedback.className = "feedback";
    elements.guessInput.value = "";
    elements.guessInput.disabled = false;
    elements.submitBtn.disabled = false;
    elements.hintBtn.disabled = false;
    elements.restartBtn.classList.add('hidden');

    console.log(`Game Started: ${diffKey} mode. Number: ${secretNumber}`);
    loadLeaderboard();
}

function handleGuess() {
    if (isGameOver) return;

    const userGuess = parseInt(elements.guessInput.value);

    // Validate Input
    if (isNaN(userGuess) || userGuess < 1 || userGuess > maxRange) {
        setFeedback(`Error: Enter a number between 1 and ${maxRange}!`, "danger");
        return;
    }

    attemptsLeft--;
    elements.attempts.textContent = attemptsLeft;

    if (userGuess === secretNumber) {
        handleWin();
    } else if (attemptsLeft === 0) {
        handleLoss();
    } else {
        const clue = userGuess > secretNumber ? "Too high!" : "Too low!";
        setFeedback(clue, "warning");
    }

    elements.guessInput.value = "";
    elements.guessInput.focus();
}

function provideHint() {
    if (isGameOver || hintsUsed >= 1) return;

    hintsUsed++;
    // Generate a helpful narrow range around the secret number
    const rangeSize = 10;
    let minHint = Math.max(1, secretNumber - Math.floor(Math.random() * rangeSize));
    let maxHint = Math.min(maxRange, secretNumber + Math.floor(Math.random() * rangeSize));

    setFeedback(`Hint: It's between ${minHint} and ${maxHint}!`, "primary");
    elements.hintBtn.disabled = true; // One hint per game
}

// WIN/LOSS LOGIC

function handleWin() {
    isGameOver = true;
    const diffKey = elements.difficulty.value;

    // Calculation: (Remaining Attempts + 1) * Difficulty Multiplier
    score = (attemptsLeft + 1) * settings[diffKey].multiplier * 20;
    if (hintsUsed > 0) score = Math.floor(score * 0.7); // 30% penalty for using hints

    elements.score.textContent = score;
    setFeedback(`🎉 Correct! You won ${score} points!`, "success");

    endGame();
    saveScore();
}

function handleLoss() {
    isGameOver = true;
    setFeedback(`Out of tries! The number was ${secretNumber}.`, "danger");
    endGame();
}

function endGame() {
    elements.guessInput.disabled = true;
    elements.submitBtn.disabled = true;
    elements.hintBtn.disabled = true;
    elements.restartBtn.classList.remove('hidden');
}

function setFeedback(msg, type) {
    elements.feedback.textContent = msg;
    elements.feedback.className = `feedback ${type}`;
}

//DB INTERACTION

async function saveScore() {
    const initials = (prompt("High Score! Enter 3 initials:") || "AAA").toUpperCase().substring(0, 3);
    const entry = { name: initials, score: score, difficulty: elements.difficulty.value };

    try {
        await fetch('http://127.0.0.1:5000/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });
    } catch (e) {
        // Fallback to local storage if Python server is off
        let local = JSON.parse(localStorage.getItem('scores')) || [];
        local.push(entry);
        local.sort((a,b) => b.score - a.score);
        localStorage.setItem('scores', JSON.stringify(local.slice(0, 5)));
    }
    loadLeaderboard();
}

async function loadLeaderboard() {
    let data = [];
    try {
        const res = await fetch('http://127.0.0.1:5000/api/leaderboard');
        data = await res.json();
    } catch (e) {
        data = JSON.parse(localStorage.getItem('scores')) || [];
    }

    elements.leaderboard.innerHTML = data.map((item, i) =>
        `<li><span>#${i+1} ${item.name} (${item.difficulty})</span><span>${item.score} pts</span></li>`
    ).join('') || '<li>No scores yet</li>';
}

// LISTENERS

elements.submitBtn.addEventListener('click', handleGuess);
elements.hintBtn.addEventListener('click', provideHint);
elements.restartBtn.addEventListener('click', initGame);
elements.difficulty.addEventListener('change', initGame); // Starts new game on dropdown change

// Init on load
initGame();