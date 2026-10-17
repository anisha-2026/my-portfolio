
"use strict";

const QUESTION_TIME = 30;
const FEEDBACK_DELAY = 900;

const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress-text");
const timerText = document.getElementById("timer-text");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");
const scoreText = document.getElementById("score-text");
const gradeMessage = document.getElementById("grade-message");
const reviewButton = document.getElementById("review-button");
const restartButton = document.getElementById("restart-button");
const reviewContainer = document.getElementById("review-container");
const reviewItems = document.getElementById("review-items");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = QUESTION_TIME;
let timerId = null;
let feedbackTimeoutId = null;
let hasAnswered = false;
let quizResults = [];
let quizFinished = false;

function startQuiz() {
  clearTimers();

  currentQuestionIndex = 0;
  score = 0;
  timeLeft = QUESTION_TIME;
  hasAnswered = false;
  quizFinished = false;
  quizResults = [];

  reviewContainer.hidden = true;
  reviewItems.replaceChildren();
  quizScreen.hidden = false;
  resultScreen.hidden = true;

  renderQuestion();
}

function clearTimers() {
  clearInterval(timerId);
  clearTimeout(feedbackTimeoutId);
  timerId = null;
  feedbackTimeoutId = null;
}

function renderQuestion() {
  clearTimers();

  if (currentQuestionIndex >= quizQuestions.length) {
    showResults();
    return;
  }

  hasAnswered = false;
  timeLeft = QUESTION_TIME;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  progressText.textContent =
    `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

  progressBar.setAttribute("aria-valuemax", quizQuestions.length);
  progressBar.setAttribute("aria-valuenow", currentQuestionIndex);
  progressFill.style.width =
    `${(currentQuestionIndex / quizQuestions.length) * 100}%`;

  questionText.textContent = currentQuestion.question;
  optionsContainer.replaceChildren();

  feedback.textContent = "";
  feedback.className = "feedback";
  nextButton.hidden = true;
  timerText.classList.remove("low-time");

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.dataset.index = String(index);

    const number = document.createElement("span");
    number.className = "option-number";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1);

    const label = document.createElement("span");
    label.textContent = option;

    button.append(number, label);
    button.addEventListener("click", () => selectAnswer(index));
    optionsContainer.append(button);
  });

  questionText.focus();
  updateTimerDisplay();
  startTimer();
}

function startTimer() {
  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerText.textContent = `${timeLeft} seconds`;
  timerText.classList.toggle("low-time", timeLeft <= 10);
}

function selectAnswer(selectedIndex) {
  if (hasAnswered || quizFinished) return;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === currentQuestion.answer;

  hasAnswered = true;
  clearInterval(timerId);
  timerId = null;

  if (isCorrect) {
    score += 1;
  }

  quizResults.push({
    question: currentQuestion.question,
    options: [...currentQuestion.options],
    correctIndex: currentQuestion.answer,
    selectedIndex,
    timedOut: false
  });

  showAnswerFeedback(selectedIndex, currentQuestion.answer);

  feedback.textContent = isCorrect
    ? "Correct! Well done."
    : `Incorrect. Correct answer: ${currentQuestion.options[currentQuestion.answer]}`;

  feedback.className = isCorrect
    ? "feedback correct-text"
    : "feedback wrong-text";

  scheduleNextQuestion();
}

function showAnswerFeedback(selectedIndex, correctIndex) {
  const optionButtons = optionsContainer.querySelectorAll(".option-button");

  optionButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === correctIndex) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && selectedIndex !== correctIndex) {
      button.classList.add("wrong");
    }
  });
}

function handleTimeout() {
  if (hasAnswered || quizFinished) return;

  hasAnswered = true;
  clearInterval(timerId);
  timerId = null;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  quizResults.push({
    question: currentQuestion.question,
    options: [...currentQuestion.options],
    correctIndex: currentQuestion.answer,
    selectedIndex: null,
    timedOut: true
  });

  showAnswerFeedback(-1, currentQuestion.answer);
  feedback.textContent =
    `Time is up! Correct answer: ${currentQuestion.options[currentQuestion.answer]}`;
  feedback.className = "feedback wrong-text";

  // A timeout advances automatically after a short feedback pause.
  scheduleNextQuestion();
}

function scheduleNextQuestion() {
  nextButton.hidden = false;
  nextButton.focus();

  feedbackTimeoutId = setTimeout(() => {
    currentQuestionIndex += 1;
    renderQuestion();
  }, FEEDBACK_DELAY);
}

nextButton.addEventListener("click", () => {
  if (!hasAnswered || quizFinished) return;

  clearTimeout(feedbackTimeoutId);
  feedbackTimeoutId = null;
  currentQuestionIndex += 1;
  renderQuestion();
});

function showResults() {
  clearTimers();
  quizFinished = true;
  quizScreen.hidden = true;
  resultScreen.hidden = false;

  progressFill.style.width = "100%";
  progressBar.setAttribute("aria-valuenow", quizQuestions.length);

  scoreText.textContent =
    `You scored ${score} out of ${quizQuestions.length}`;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage >= 80) {
    gradeMessage.textContent = "Excellent! You have strong IT knowledge.";
  } else if (percentage >= 50) {
    gradeMessage.textContent = "Good job! Keep practising to improve.";
  } else {
    gradeMessage.textContent = "Keep learning! Practice makes progress.";
  }

  reviewContainer.hidden = true;
  reviewItems.replaceChildren();
  reviewButton.textContent = "Review Answers";
  restartButton.focus();
}

function showReview() {
  reviewItems.replaceChildren();

  quizResults.forEach((result, index) => {
    const item = document.createElement("article");
    item.className = "review-item";

    const heading = document.createElement("h4");
    heading.textContent = `Question ${index + 1}: ${result.question}`;

    const userAnswer = document.createElement("p");
    const correctAnswer = document.createElement("p");

    if (result.timedOut) {
      userAnswer.textContent = "Your answer: No answer (time expired)";
      userAnswer.className = "review-wrong";
    } else {
      userAnswer.textContent =
        `Your answer: ${result.options[result.selectedIndex]}`;
      userAnswer.className =
        result.selectedIndex === result.correctIndex
          ? "review-correct"
          : "review-wrong";
    }

    correctAnswer.textContent =
      `Correct answer: ${result.options[result.correctIndex]}`;
    correctAnswer.className = "review-correct";

    item.append(heading, userAnswer, correctAnswer);
    reviewItems.append(item);
  });

  reviewContainer.hidden = false;
  reviewButton.textContent = "Hide Review";
}

reviewButton.addEventListener("click", () => {
  if (reviewContainer.hidden) {
    showReview();
  } else {
    reviewContainer.hidden = true;
    reviewButton.textContent = "Review Answers";
  }
});

restartButton.addEventListener("click", startQuiz);

document.addEventListener("keydown", (event) => {
  if (
    resultScreen.hidden &&
    !quizScreen.hidden &&
    !hasAnswered &&
    /^[1-4]$/.test(event.key) &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.metaKey
  ) {
    selectAnswer(Number(event.key) - 1);
  }
});

if (Array.isArray(quizQuestions) && quizQuestions.length > 0) {
  const validQuestions = quizQuestions.every((question) =>
    typeof question.question === "string" &&
    question.question.trim().length > 0 &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every((option) => typeof option === "string") &&
    Number.isInteger(question.answer) &&
    question.answer >= 0 &&
    question.answer < 4
  );

  if (validQuestions) {
    startQuiz();
  } else {
    quizScreen.hidden = true;
    questionText.textContent =
      "Unable to load the quiz. Please check questions.js.";
  }
} else {
  quizScreen.hidden = true;
  questionText.textContent = "No quiz questions are available.";
}
