import { questions } from "./data/questions.js";

let idx = 0;
let score = 0;
let locked = false;

const elQuestion = document.getElementById("question");
const elAnswers = document.getElementById("answers");
const elNext = document.getElementById("next");
const elRestart = document.getElementById("restart");
const elProgress = document.getElementById("progress");
const elScore = document.getElementById("score");
const elHint = document.getElementById("hint");

function render() {
  const q = questions[idx];
  locked = false;
  elNext.disabled = true;
  elHint.textContent = "";

  elProgress.textContent = `Pitanje ${idx + 1}/${questions.length}`;
  elScore.textContent = `Poeni: ${score}`;
  elQuestion.textContent = q.question;

  elAnswers.innerHTML = "";
  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = choice;
    btn.addEventListener("click", () => onAnswer(i, btn));
    elAnswers.appendChild(btn);
  });
}

function onAnswer(selectedIndex, btn) {
  if (locked) return;
  locked = true;

  const q = questions[idx];
  const buttons = Array.from(elAnswers.querySelectorAll("button"));

  buttons.forEach(b => (b.disabled = true));

  const correctBtn = buttons[q.answerIndex];
  correctBtn.classList.add("correct");

  if (selectedIndex === q.answerIndex) {
    score += 1;
    btn.classList.add("correct");
    elHint.textContent = "Tačno!";
  } else {
    btn.classList.add("wrong");
    elHint.textContent = `Netačno. ${q.explanation}`;
  }

  elScore.textContent = `Poeni: ${score}`;
  elNext.disabled = false;

  if (idx === questions.length - 1) {
    elNext.textContent = "Završi";
  } else {
    elNext.textContent = "Sledeće";
  }
}

function next() {
  if (idx < questions.length - 1) {
    idx += 1;
    render();
  } else {
    finish();
  }
}

function finish() {
  elQuestion.textContent = `Kraj! Osvojio/la si ${score}/${questions.length} poena.`;
  elAnswers.innerHTML = "";
  elNext.hidden = true;
  elRestart.hidden = false;
  elHint.textContent = "";
}

function restart() {
  idx = 0;
  score = 0;
  elNext.hidden = false;
  elRestart.hidden = true;
  render();
}

elNext.addEventListener("click", next);
elRestart.addEventListener("click", restart);

render();
