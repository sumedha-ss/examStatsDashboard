# Exam Statistics Dashboard

A detailed dashboard for visualizing exam statistics, including overall performance and individual question analysis. The application includes interactive charts, a dark mode toggle, and collapsible question sections.

## Features

- **Overall Statistics**: Total questions, correct/incorrect counts, accuracy rate, and average attempts per question
- **Interactive Charts (with hover effects)**:
  - Pie charts for question accuracy and attempt distribution
  - Bar chart for attempt distribution
- **Question Details**: Breakdowns for each question with all attempts and answers
- **Dark Mode**: Toggle between light/dark mode
- **Collapsible Questions**: Expand and collapse individual question statistics
- **Scroll to Top**: Convenient button to go back to the top of the page

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd examStatsDashboard
```

2. No additional dependencies required! This is a static web application using only HTML, CSS, and JavaScript.

## Running the Code

### Option 1: Open directly in browser

Simply open the `index.html` file in your web browser.

### Option 2: Using a local server (recommended)

**Using Python:**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then navigate to `http://localhost:8000` in your browser.

**Using Node.js (http-server):**

```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server -p 8000
```

Then navigate to `http://localhost:8000` in your browser.

## Project Structure

```
examStatsDashboard/
├── index.html          # Main HTML file
├── styles.css          # All styling and themes
├── script.js           # Application logic and interactions
├── data.js             # Exam data
├── media/
│   └── logo.png        # Application logo
└── README.md           # This file
```

## Deployment

This project is deployed on Vercel. The live application can be accessed <a href="https://exam-stats.vercel.app/" target="_blank" rel="noopener noreferrer">here</a>!

## Technologies Used

- HTML5
- CSS3
- JavaScript

## AI Use

Cursor was used to implement the scroll-to-top button and hover features on all charts, as well as the state saving functionality for the dark/light mode toggle. Cursor was also used to implement the mobile responsive styling, and to write a few sections of this README.
