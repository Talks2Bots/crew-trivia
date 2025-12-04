// Game state
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// DOM elements
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const currentQuestionNum = document.getElementById('current-question-num');
const totalQuestions = document.getElementById('total-questions');
const finalScore = document.getElementById('final-score');
const maxScore = document.getElementById('max-score');
const scorePercentage = document.getElementById('score-percentage');
const categoryBadge = document.getElementById('category-badge');

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error('Failed to load questions');
        }
        questions = await response.json();
        return questions;
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions. Please make sure questions.json exists.');
        return [];
    }
}

// Initialize game
async function initGame() {
    questions = await loadQuestions();
    if (questions.length === 0) {
        return;
    }
    
    // Shuffle questions for variety
    shuffleArray(questions);
    
    currentQuestionIndex = 0;
    score = 0;
    updateScoreDisplay();
    totalQuestions.textContent = questions.length;
    showScreen('start');
}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Show specific screen
function showScreen(screenName) {
    startScreen.classList.add('hidden');
    questionScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');

    switch (screenName) {
        case 'start':
            startScreen.classList.remove('hidden');
            break;
        case 'question':
            questionScreen.classList.remove('hidden');
            break;
        case 'results':
            resultsScreen.classList.remove('hidden');
            break;
    }
}

// Display current question
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    currentQuestionNum.textContent = currentQuestionIndex + 1;
    categoryBadge.textContent = question.category || '';
    
    // Clear previous answers
    answersContainer.innerHTML = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    selectedAnswer = null;

    // Get the correct answer text based on the answer letter
    const answerLetter = question.answer.toUpperCase();
    const answerIndex = answerLetter.charCodeAt(0) - 65; // Convert A=0, B=1, C=2, D=3
    const correctAnswer = question.options[answerIndex];

    // Create answer buttons with labels (A, B, C, D)
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        button.textContent = `${letter}) ${option}`;
        button.dataset.letter = letter;
        button.dataset.answer = option;
        button.addEventListener('click', () => selectAnswer(letter, question.answer, correctAnswer, button));
        answersContainer.appendChild(button);
    });
}

// Handle answer selection
function selectAnswer(selectedLetter, correctLetter, correctAnswerText, buttonElement) {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    selectedAnswer = selectedLetter;
    const allButtons = document.querySelectorAll('.answer-btn');
    
    // Disable all buttons
    allButtons.forEach(btn => btn.disabled = true);

    // Mark correct and incorrect answers
    allButtons.forEach(btn => {
        if (btn.dataset.letter === correctLetter.toUpperCase()) {
            btn.classList.add('correct');
        } else if (btn.dataset.letter === selectedLetter && selectedLetter !== correctLetter.toUpperCase()) {
            btn.classList.add('incorrect');
        }
    });

    // Update score and show feedback
    if (selectedLetter.toUpperCase() === correctLetter.toUpperCase()) {
        score++;
        updateScoreDisplay();
        feedback.textContent = 'Correct! ✓';
        feedback.className = 'feedback correct';
    } else {
        feedback.textContent = `Incorrect! The correct answer is: ${correctLetter.toUpperCase()}) ${correctAnswerText}`;
        feedback.className = 'feedback incorrect';
    }

    // Move to next question after a delay
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 2000);
}

// Update score display
function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

// Show results screen
function showResults() {
    const percentage = Math.round((score / questions.length) * 100);
    finalScore.textContent = score;
    maxScore.textContent = questions.length;
    scorePercentage.textContent = `${percentage}%`;
    showScreen('results');
}

// Event listeners
startBtn.addEventListener('click', () => {
    if (questions.length > 0) {
        displayQuestion();
        showScreen('question');
    }
});

restartBtn.addEventListener('click', () => {
    initGame();
});

// Initialize game on page load
initGame();

