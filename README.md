
# Interactive IT Quiz App

A responsive, keyboard-accessible IT quiz built with pure HTML, CSS, and JavaScript.

## Features

- One question at a time
- 30-second timer per question
- Automatic advance when time expires
- Instant correct and incorrect answer feedback
- Progress indicator
- Keyboard shortcuts (1–4)
- Final score and grade message
- Answer review
- Restart functionality
- Responsive layout for mobile and desktop
- Editable questions in a separate JavaScript file

## Project Structure

- `index.html` — Page structure
- `styles.css` — Styling and responsive layout
- `quiz.js` — Quiz logic and state management
- `questions.js` — Editable quiz questions

## How to Run

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Open `index.html` in a web browser.

Alternatively, use the VS Code Live Server extension to run the project locally.

No frameworks, package installation, or build process are required.

## How to Add or Edit Questions

Open `questions.js` and edit the `quizQuestions` array.

Each question has three properties:

- `question`: The question text
- `options`: An array containing exactly four options
- `answer`: The zero-based index of the correct option (0–3)

Example:

```javascript
{
  question: "What does URL stand for?",
  options: [
    "Uniform Resource Locator",
    "Universal Record Link",
    "Unified Resource List",
    "User Reference Location"
  ],
  answer: 0
}
```

Add a comma between question objects when adding another question.

Keep the question structure valid. The quiz logic automatically uses the number of questions in the array.

## Testing Checklist

- [ ] Correct answers increase the score once
- [ ] Incorrect answers do not increase the score
- [ ] Timer expiry advances to the next question
- [ ] Timer expiry does not award a point
- [ ] Progress updates for every question
- [ ] Final score matches the recorded answers
- [ ] Review shows selected and correct answers
- [ ] Restart resets the timer, score, and review
- [ ] Keyboard shortcuts 1–4 work
- [ ] Layout works on mobile and desktop
- [ ] Browser console has no errors

## Technologies

HTML5, CSS3, Vanilla JavaScript.
