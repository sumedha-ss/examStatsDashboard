// convert responses from numbers to letters
function numberToLetter(num) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  return letters[num];
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

// initialize page
renderData();
