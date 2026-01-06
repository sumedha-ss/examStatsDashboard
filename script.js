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
    <h2 class="section-title">Overall Statistics</h2>
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

// state for chart view type
let chartViewType = "histogram"; // "histogram" or "pie"

function renderChart() {
  const histogram = calculateAttemptsHistogram();
  const histogramDiv = document.getElementById("histogram");
  const stats = calculateStatistics();

  // calculate max value for histogram scaling
  const maxValue = Math.max(
    histogram.oneAttempt,
    histogram.twoAttempts,
    histogram.threePlusAttempts,
    1
  );

  const oneWidth = (histogram.oneAttempt / maxValue) * 100;
  const twoWidth = (histogram.twoAttempts / maxValue) * 100;
  const threeWidth = (histogram.threePlusAttempts / maxValue) * 100;

  // calculate totals for pie chart
  const total =
    histogram.oneAttempt + histogram.twoAttempts + histogram.threePlusAttempts;
  const onePercent = total > 0 ? (histogram.oneAttempt / total) * 100 : 0;
  const twoPercent = total > 0 ? (histogram.twoAttempts / total) * 100 : 0;
  const threePercent =
    total > 0 ? (histogram.threePlusAttempts / total) * 100 : 0;

  // calculate pie chart angles
  const oneAngle = (onePercent / 100) * 360;
  const twoAngle = (twoPercent / 100) * 360;
  const threeAngle = (threePercent / 100) * 360;

  // helper functions for pie charts
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

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

  // Accuracy pie chart data (left stats box)
  const totalQuestions = stats.totalQuestions || 0;
  const correctCount = stats.correctCount;
  const incorrectCount = stats.incorrectCount;
  const accuracyTotal = Math.max(totalQuestions, 1); // avoid divide-by-zero

  const correctPercent =
    accuracyTotal > 0 ? (correctCount / accuracyTotal) * 100 : 0;
  const incorrectPercent =
    accuracyTotal > 0 ? (incorrectCount / accuracyTotal) * 100 : 0;

  let accuracyCurrentAngle = -90;
  const correctAngle = (correctPercent / 100) * 360;
  const incorrectAngle = (incorrectPercent / 100) * 360;

  const correctStart = accuracyCurrentAngle;
  const correctEnd = accuracyCurrentAngle + correctAngle;
  accuracyCurrentAngle += correctAngle;

  const incorrectStart = accuracyCurrentAngle;
  const incorrectEnd = accuracyCurrentAngle + incorrectAngle;

  const accuracyChartContent = `
    <div class="histogram-container">
      <div class="histogram-header">
        <div class="histogram-title-section">
          <h2 class="histogram-title">Question Accuracy</h2>
        </div>
      </div>
      <div class="pie-chart accuracy-pie-chart">
        <div class="pie-chart-svg-container">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <path
              class="pie-segment accuracy-segment-1"
              d="${createArc(correctStart, correctEnd)}"
              fill="rgb(145, 130, 95)"
              data-value="${correctCount}"
              data-start-angle="${correctStart}"
              data-end-angle="${correctEnd}"
            />
            <path
              class="pie-segment accuracy-segment-2"
              d="${createArc(incorrectStart, incorrectEnd)}"
              fill="rgb(200, 180, 150)"
              data-value="${incorrectCount}"
              data-start-angle="${incorrectStart}"
              data-end-angle="${incorrectEnd}"
            />
          </svg>
          <div class="pie-overlay"></div>
        </div>
        <div class="pie-legend">
          <div class="pie-legend-item" data-segment="1">
            <span class="pie-color" style="background-color:rgb(145, 130, 95)"></span>
            <span class="pie-label">Correct</span>
            <span class="pie-value">${correctCount}</span>
          </div>
          <div class="pie-legend-item" data-segment="2">
            <span class="pie-color" style="background-color:rgb(200, 180, 150)"></span>
            <span class="pie-label">Incorrect</span>
            <span class="pie-value">${incorrectCount}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attempts Chart Content (right stats box, histogram/pie chart)
  let attemptsChartContent = "";
  if (chartViewType === "histogram") {
    attemptsChartContent = `
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
      </div>`;
  } else {
    // calculate angles (start from -90 degrees for top)
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

    attemptsChartContent = `
      <div class="pie-chart attempts-pie-chart">
        <div class="pie-chart-svg-container">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <path class="pie-segment pie-segment-1" d="${createArc(
              oneStart,
              oneEnd
            )}" fill="rgb(200, 180, 150)" data-value="${
      histogram.oneAttempt
    }" data-start-angle="${oneStart}" data-end-angle="${oneEnd}" />
            <path class="pie-segment pie-segment-2" d="${createArc(
              twoStart,
              twoEnd
            )}" fill="rgb(175, 155, 115)" data-value="${
      histogram.twoAttempts
    }" data-start-angle="${twoStart}" data-end-angle="${twoEnd}" />
            <path class="pie-segment pie-segment-3" d="${createArc(
              threeStart,
              threeEnd
            )}" fill="rgb(145, 130, 95)" data-value="${
      histogram.threePlusAttempts
    }" data-start-angle="${threeStart}" data-end-angle="${threeEnd}" />
          </svg>
          <div class="pie-overlay"></div>
        </div>
        <div class="pie-legend">
          <div class="pie-legend-item" data-segment="1">
            <span class="pie-color" style="background-color:rgb(200, 180, 150)"></span>
            <span class="pie-label">1 attempt</span>
            <span class="pie-value">${histogram.oneAttempt}</span>
          </div>
          <div class="pie-legend-item" data-segment="2">
            <span class="pie-color" style="background-color:rgb(175, 155, 115)"></span>
            <span class="pie-label">2 attempts</span>
            <span class="pie-value">${histogram.twoAttempts}</span>
          </div>
          <div class="pie-legend-item" data-segment="3">
            <span class="pie-color" style="background-color:rgb(145, 130, 95)"></span>
            <span class="pie-label">3+ attempts</span>
            <span class="pie-value">${histogram.threePlusAttempts}</span>
          </div>
        </div>
      </div>`;
  }

  histogramDiv.innerHTML = `
    <div class="histogram-layout">
      ${accuracyChartContent}
      <div class="histogram-container">
        <div class="histogram-header">
          <div class="histogram-title-section">
            <h2 class="histogram-title">Question Attempts</h2>
            <p class="histogram-subtitle">How many questions were solved in…</p>
          </div>
          <button class="chart-toggle-btn" onclick="toggleChartView()">
            ${
              chartViewType === "histogram"
                ? "Pie Chart View"
                : "Histogram View"
            }
          </button>
        </div>
        ${attemptsChartContent}
      </div>
    </div>
    <div class="section-divider"></div>
    <h2 class="section-title-two">Question Statistics</h2>
  `;

  // add hover effects for pie charts
  setupAccuracyPieChartHover();
  if (chartViewType === "pie") {
    setupPieChartHover();
  }
}

function setupAccuracyPieChartHover() {
  const pieContainer = document.querySelector(".accuracy-pie-chart");
  if (!pieContainer) return;

  const segments = pieContainer.querySelectorAll(".pie-segment");
  const legendItems = pieContainer.querySelectorAll(".pie-legend-item");
  const overlay = pieContainer.querySelector(".pie-overlay");
  const svg = pieContainer.querySelector("svg");

  segments.forEach((segment) => {
    let overlayPath = null; // store reference to overlay path for this segment

    segment.addEventListener("mouseenter", (e) => {
      const segmentNum = e.target.classList.contains("accuracy-segment-1")
        ? "1"
        : "2";
      const value = e.target.getAttribute("data-value");
      const rect = e.target.getBoundingClientRect();
      const svgRect = e.target.closest("svg").getBoundingClientRect();

      // highlight corresponding legend label
      legendItems.forEach((item) => {
        if (item.getAttribute("data-segment") === segmentNum) {
          item.classList.add("legend-hovered");
        }
      });

      // add white semi-transparent overlay
      if (svg) {
        const startAngle = parseFloat(
          e.target.getAttribute("data-start-angle")
        );
        const endAngle = parseFloat(e.target.getAttribute("data-end-angle"));
        const pathData = e.target.getAttribute("d");

        // create overlay path
        overlayPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        overlayPath.setAttribute("d", pathData);
        overlayPath.setAttribute("fill", "rgba(255, 255, 255, 0.01)");
        overlayPath.setAttribute("class", "pie-segment-overlay");
        overlayPath.style.pointerEvents = "none";
        svg.appendChild(overlayPath);
      }

      // show overlay with count - position at geometric center of segment
      if (overlay) {
        const svgContainer = e.target.closest(".pie-chart-svg-container");
        const svg = e.target.closest("svg");
        const svgRect = svg.getBoundingClientRect();

        // get angle information from data attributes
        const startAngle = parseFloat(
          e.target.getAttribute("data-start-angle")
        );
        const endAngle = parseFloat(e.target.getAttribute("data-end-angle"));

        // calculate middle angle of the segment
        let middleAngle = (startAngle + endAngle) / 2;

        // convert to radians (SVG uses -90 degrees as top, so adjust)
        const angleRadians = ((middleAngle - 90) * Math.PI) / 180.0;

        // calculate position at fixed distance from center (same for all segments)
        const radius = 80;
        const offsetRadius = 40; // Fixed distance from center (50% of radius) - same for all
        const svgSize = 200; // SVG viewBox size
        const svgCenter = svgSize / 2;

        // calculate position in SVG coordinates using polar coordinates
        // This ensures all numbers are at the exact same distance from center
        const x = svgCenter + offsetRadius * Math.cos(angleRadians);
        const y = svgCenter + offsetRadius * Math.sin(angleRadians);

        // convert to container coordinates (accounting for any scaling)
        const svgScale = svgRect.width / svgSize;
        const containerX = x * svgScale;
        const containerY = y * svgScale;

        overlay.style.display = "flex";
        overlay.style.left = `${containerX}px`;
        overlay.style.top = `${containerY}px`;
        overlay.textContent = value;
      }
    });

    segment.addEventListener("mouseleave", (e) => {
      const segmentNum = e.target.classList.contains("accuracy-segment-1")
        ? "1"
        : "2";

      // remove legend label highlight
      legendItems.forEach((item) => {
        if (item.getAttribute("data-segment") === segmentNum) {
          item.classList.remove("legend-hovered");
        }
      });

      // hide overlay
      if (overlay) {
        overlay.style.display = "none";
      }

      // remove overlay
      if (overlayPath && overlayPath.parentNode) {
        overlayPath.parentNode.removeChild(overlayPath);
        overlayPath = null;
      }
    });
  });
}

function setupPieChartHover() {
  const pieContainer = document.querySelector(".attempts-pie-chart");
  if (!pieContainer) return;

  const segments = pieContainer.querySelectorAll(".pie-segment");
  const legendItems = pieContainer.querySelectorAll(".pie-legend-item");
  const overlay = pieContainer.querySelector(".pie-overlay");
  const svg = pieContainer.querySelector("svg");

  segments.forEach((segment) => {
    let overlayPath = null; // store reference to overlay path for this segment

    segment.addEventListener("mouseenter", (e) => {
      const segmentNum = e.target.classList.contains("pie-segment-1")
        ? "1"
        : e.target.classList.contains("pie-segment-2")
        ? "2"
        : "3";
      const value = e.target.getAttribute("data-value");
      const rect = e.target.getBoundingClientRect();
      const svgRect = e.target.closest("svg").getBoundingClientRect();

      // highlight corresponding legend label
      legendItems.forEach((item) => {
        if (item.getAttribute("data-segment") === segmentNum) {
          item.classList.add("legend-hovered");
        }
      });

      // add white semi-transparent overlay
      if (svg) {
        const startAngle = parseFloat(
          e.target.getAttribute("data-start-angle")
        );
        const endAngle = parseFloat(e.target.getAttribute("data-end-angle"));
        const pathData = e.target.getAttribute("d");

        // create overlay path
        overlayPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        overlayPath.setAttribute("d", pathData);
        overlayPath.setAttribute("fill", "rgba(255, 255, 255, 0.01)");
        overlayPath.setAttribute("class", "pie-segment-overlay");
        overlayPath.style.pointerEvents = "none";
        svg.appendChild(overlayPath);
      }

      // show overlay with count - position at geometric center of segment
      if (overlay) {
        const svgContainer = e.target.closest(".pie-chart-svg-container");
        const svg = e.target.closest("svg");
        const svgRect = svg.getBoundingClientRect();

        // get angle information from data attributes
        const startAngle = parseFloat(
          e.target.getAttribute("data-start-angle")
        );
        const endAngle = parseFloat(e.target.getAttribute("data-end-angle"));

        // calculate middle angle of the segment
        let middleAngle = (startAngle + endAngle) / 2;

        // convert to radians (SVG uses -90 degrees as top, so adjust)
        const angleRadians = ((middleAngle - 90) * Math.PI) / 180.0;

        // calculate position at fixed distance from center (same for all segments)
        const radius = 80;
        const offsetRadius = 40; // Fixed distance from center (50% of radius) - same for all
        const svgSize = 200; // SVG viewBox size
        const svgCenter = svgSize / 2;

        // calculate position in SVG coordinates using polar coordinates
        // This ensures all numbers are at the exact same distance from center
        const x = svgCenter + offsetRadius * Math.cos(angleRadians);
        const y = svgCenter + offsetRadius * Math.sin(angleRadians);

        // convert to container coordinates (accounting for any scaling)
        const svgScale = svgRect.width / svgSize;
        const containerX = x * svgScale;
        const containerY = y * svgScale;

        overlay.style.display = "flex";
        overlay.style.left = `${containerX}px`;
        overlay.style.top = `${containerY}px`;
        overlay.textContent = value;
      }
    });

    segment.addEventListener("mouseleave", (e) => {
      const segmentNum = e.target.classList.contains("pie-segment-1")
        ? "1"
        : e.target.classList.contains("pie-segment-2")
        ? "2"
        : "3";

      // remove legend label highlight
      legendItems.forEach((item) => {
        if (item.getAttribute("data-segment") === segmentNum) {
          item.classList.remove("legend-hovered");
        }
      });

      // hide overlay
      if (overlay) {
        overlay.style.display = "none";
      }

      // remove overlay
      if (overlayPath && overlayPath.parentNode) {
        overlayPath.parentNode.removeChild(overlayPath);
        overlayPath = null;
      }
    });
  });
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
