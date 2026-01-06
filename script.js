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

function calculateAttemptsHistogram() {
  const questions = Object.values(LocalSubmissions);
  let oneAttempt = 0;
  let twoAttempts = 0;
  let threePlusAttempts = 0;

  questions.forEach((questionData) => {
    const attemptCount = questionData.attempts.length;
    if (attemptCount === 1) {
      oneAttempt++;
    } else if (attemptCount === 2) {
      twoAttempts++;
    } else if (attemptCount >= 3) {
      threePlusAttempts++;
    }
  });

  return {
    oneAttempt,
    twoAttempts,
    threePlusAttempts,
  };
}

// State for chart view type
let chartViewType = "histogram"; // "histogram" or "pie"

function renderChart() {
  const histogram = calculateAttemptsHistogram();
  const histogramDiv = document.getElementById("histogram");

  // Calculate max value for scaling (histogram only)
  const maxValue = Math.max(
    histogram.oneAttempt,
    histogram.twoAttempts,
    histogram.threePlusAttempts,
    1
  );

  const oneWidth = (histogram.oneAttempt / maxValue) * 100;
  const twoWidth = (histogram.twoAttempts / maxValue) * 100;
  const threeWidth = (histogram.threePlusAttempts / maxValue) * 100;

  // Calculate totals for pie chart
  const total =
    histogram.oneAttempt + histogram.twoAttempts + histogram.threePlusAttempts;
  const onePercent = total > 0 ? (histogram.oneAttempt / total) * 100 : 0;
  const twoPercent = total > 0 ? (histogram.twoAttempts / total) * 100 : 0;
  const threePercent =
    total > 0 ? (histogram.threePlusAttempts / total) * 100 : 0;

  // Calculate pie chart angles
  const oneAngle = (onePercent / 100) * 360;
  const twoAngle = (twoPercent / 100) * 360;
  const threeAngle = (threePercent / 100) * 360;

  let chartContent = "";
  if (chartViewType === "histogram") {
    chartContent = `
      <div class="histogram-chart">
        <div class="histogram-bar-wrapper">
          <span class="histogram-bar-label">1 attempt</span>
          <div class="histogram-bar-container">
            <div class="histogram-bar" style="width: ${oneWidth}%"></div>
          </div>
          <span class="histogram-bar-value">${histogram.oneAttempt}</span>
        </div>
        <div class="histogram-bar-wrapper">
          <span class="histogram-bar-label">2 attempts</span>
          <div class="histogram-bar-container">
            <div class="histogram-bar" style="width: ${twoWidth}%"></div>
          </div>
          <span class="histogram-bar-value">${histogram.twoAttempts}</span>
        </div>
        <div class="histogram-bar-wrapper">
          <span class="histogram-bar-label">3+ attempts</span>
          <div class="histogram-bar-container">
            <div class="histogram-bar" style="width: ${threeWidth}%"></div>
          </div>
          <span class="histogram-bar-value">${histogram.threePlusAttempts}</span>
        </div>
      </div>
    `;
  } else {
    // Pie chart using SVG paths
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    // Helper function to create arc path
    function createArc(startAngle, endAngle) {
      const start = polarToCartesian(centerX, centerY, radius, endAngle);
      const end = polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return [
        "M",
        centerX,
        centerY,
        "L",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
        "Z",
      ].join(" ");
    }

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    }

    // Calculate angles (start from -90 degrees for top)
    let currentAngle = -90;
    const oneAngle = (onePercent / 100) * 360;
    const twoAngle = (twoPercent / 100) * 360;
    const threeAngle = (threePercent / 100) * 360;

    const oneStart = currentAngle;
    const oneEnd = currentAngle + oneAngle;
    currentAngle += oneAngle;

    const twoStart = currentAngle;
    const twoEnd = currentAngle + twoAngle;
    currentAngle += twoAngle;

    const threeStart = currentAngle;
    const threeEnd = currentAngle + threeAngle;

    chartContent = `
      <div class="pie-chart">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path d="${createArc(oneStart, oneEnd)}" fill="#b3a078" />
          <path d="${createArc(twoStart, twoEnd)}" fill="#928156" />
          <path d="${createArc(threeStart, threeEnd)}" fill="#7a6b4a" />
        </svg>
        <div class="pie-legend">
          <div class="pie-legend-item">
            <span class="pie-color" style="background-color: #b3a078"></span>
            <span class="pie-label">1 attempt</span>
            <span class="pie-value">${histogram.oneAttempt}</span>
          </div>
          <div class="pie-legend-item">
            <span class="pie-color" style="background-color: #928156"></span>
            <span class="pie-label">2 attempts</span>
            <span class="pie-value">${histogram.twoAttempts}</span>
          </div>
          <div class="pie-legend-item">
            <span class="pie-color" style="background-color: #7a6b4a"></span>
            <span class="pie-label">3+ attempts</span>
            <span class="pie-value">${histogram.threePlusAttempts}</span>
          </div>
        </div>
      </div>
    `;
  }

  histogramDiv.innerHTML = `
    <div class="histogram-container">
      <div class="histogram-header">
        <div class="histogram-title-section">
          <h2 class="histogram-title">Question Attempts</h2>
          <p class="histogram-subtitle">How many questions were solved in…</p>
        </div>
        <button class="chart-toggle-btn" onclick="toggleChartView()">
          ${chartViewType === "histogram" ? "Pie Chart View" : "Histogram View"}
        </button>
      </div>
      ${chartContent}
    </div>
  `;
}

function toggleChartView() {
  chartViewType = chartViewType === "histogram" ? "pie" : "histogram";
  renderChart();
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
renderChart();
renderData();
