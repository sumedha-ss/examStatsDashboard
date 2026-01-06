// convert responses from numbers to letters
function numberToLetter(num) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  return letters[num];
}

// calculate question statistics
function calculateStatistics() {
  const questions = Object.values(LocalSubmissions);
  const totalQuestions = questions.length;

  let correctCount = 0;
  let incorrectCount = 0;
  let totalAttempts = 0;

  questions.forEach((questionData) => {
    const hasCorrect = questionData.attempts.some((attempt) => attempt.correct);
    if (hasCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }
    totalAttempts += questionData.attempts.length;
  });

  const accuracyRate =
    totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const avgAttempts = totalQuestions > 0 ? totalAttempts / totalQuestions : 0;

  return {
    totalQuestions,
    correctCount,
    incorrectCount,
    accuracyRate,
    avgAttempts,
  };
}

function renderStatistics() {
  const stats = calculateStatistics();
  const statsDiv = document.getElementById("statistics");
  statsDiv.innerHTML = `
    <div class="statistics-container">
      <div class="stat-card">
        <div class="stat-label">Total Questions</div>
        <div class="stat-value">${stats.totalQuestions}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Number Correct</div>
        <div class="stat-value">${stats.correctCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Number Incorrect</div>
        <div class="stat-value">${stats.incorrectCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Accuracy Rate</div>
        <div class="stat-value">${stats.accuracyRate.toFixed(1)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Average Attempts</div>
        <div class="stat-value">${stats.avgAttempts.toFixed(1)}</div>
      </div>
    </div>
  `;
}

function renderData() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  Object.entries(LocalSubmissions).forEach(([questionId, questionData]) => {
    const questionContainer = document.createElement("div");
    questionContainer.className = "question-container";

    const questionHeader = document.createElement("div");
    questionHeader.className = "question-id";
    questionHeader.innerHTML = `
        Question ID: ${questionId}
        <span class="attempt-count">${questionData.attempts.length} attempt${
      questionData.attempts.length !== 1 ? "s" : ""
    }</span>
      `;
    questionContainer.appendChild(questionHeader);

    questionData.attempts.forEach((attempt, index) => {
      const attemptDiv = document.createElement("div");
      attemptDiv.className = `attempt ${
        attempt.correct ? "correct" : "incorrect"
      }`;

      const attemptHeader = document.createElement("div");
      attemptHeader.className = "attempt-header";
      attemptHeader.innerHTML = `
          <span><strong>Attempt ${index + 1}</strong></span>
          <span class="correct-badge ${attempt.correct}">
            ${attempt.correct ? "Correct" : "Incorrect"}
          </span>
        `;
      attemptDiv.appendChild(attemptHeader);

      const solutionDiv = document.createElement("div");
      solutionDiv.className = "solution";
      const solutionLetters = attempt.userSolution
        .map(numberToLetter)
        .join(", ");
      solutionDiv.innerHTML = `
          <span class="solution-label">Answer: </span>
          <span class="solution-value">${solutionLetters}</span>
        `;
      attemptDiv.appendChild(solutionDiv);

      questionContainer.appendChild(attemptDiv);
    });

    contentDiv.appendChild(questionContainer);
  });
}

// initialize content
renderStatistics();
renderData();
