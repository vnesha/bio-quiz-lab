import { questions, topics } from "./data/questions-from-lessons.js";

let idx = 0;
let score = 0;
let locked = false;
let activeTopic = "Sve";
let activeGrade = "Sve";
let bank = [];

const elQuestion = document.getElementById("question");
const elAnswers = document.getElementById("answers");
const elNext = document.getElementById("next");
const elRestart = document.getElementById("restart");
const elProgress = document.getElementById("progress");
const elScore = document.getElementById("score");
const elHint = document.getElementById("hint");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickBank() {
  let base = questions;

  if (activeGrade !== "Sve") {
    const g = Number(activeGrade);
    base = base.filter(q => Number(q.grade) === g);
  }

  if (activeTopic !== "Sve") {
    base = base.filter(q => q.topic === activeTopic);
  }

  bank = shuffle(base);
  idx = 0;
  score = 0;
}

async function renderImage(q) {
  if (!q.image) return;
  if (q.image.kind === "svg" && q.image.path) {
    try {
      const res = await fetch(q.image.path);
      const svg = await res.text();
      const wrap = document.createElement("div");
      wrap.className = "image";
      wrap.innerHTML = svg;
      elAnswers.appendChild(wrap);
    } catch (e) {
      // ignore
    }
  }
}

async function render() {
  const q = bank[idx];
  locked = false;
  elNext.disabled = true;
  elHint.textContent = "";
  elNext.hidden = false;

  elProgress.textContent = `Pitanje ${idx + 1}/${bank.length}`;
  elScore.textContent = `Poeni: ${score}`;
  elQuestion.textContent = q.prompt;

  elAnswers.innerHTML = "";

  // Optional image (for image-mcq)
  if (q.type === "image-mcq") {
    await renderImage(q);
  }

  if (q.type === "mcq" || q.type === "image-mcq") {
    q.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "answer";
      btn.textContent = choice;
      btn.addEventListener("click", () => onMcqAnswer(i, btn));
      elAnswers.appendChild(btn);
    });
    return;
  }

  if (q.type === "order") {
    renderOrder(q);
    return;
  }

  if (q.type === "match") {
    renderMatch(q);
    return;
  }

  elHint.textContent = "Nepoznat tip pitanja.";
}

function onMcqAnswer(selectedIndex, btn) {
  if (locked) return;
  locked = true;

  const q = bank[idx];
  const buttons = Array.from(elAnswers.querySelectorAll("button.answer"));
  buttons.forEach(b => (b.disabled = true));

  const correctBtn = buttons[q.answerIndex];
  if (correctBtn) correctBtn.classList.add("correct");

  if (selectedIndex === q.answerIndex) {
    score += 1;
    btn.classList.add("correct");
    elHint.textContent = "Tačno!";
  } else {
    btn.classList.add("wrong");
    elHint.textContent = `Netačno. ${q.explanation ?? ""}`.trim();
  }

  elScore.textContent = `Poeni: ${score}`;
  elNext.disabled = false;
  elNext.textContent = idx === bank.length - 1 ? "Završi" : "Sledeće";
}

function renderOrder(q) {
  const state = shuffle(q.items);

  const list = document.createElement("div");
  list.className = "order-list";

  function draw() {
    list.innerHTML = "";
    state.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "order-row";

      const label = document.createElement("div");
      label.className = "order-item";
      label.textContent = `${i + 1}. ${item}`;

      const controls = document.createElement("div");
      controls.className = "order-controls";

      const up = document.createElement("button");
      up.className = "btn btn-secondary";
      up.textContent = "↑";
      up.disabled = i === 0 || locked;
      up.onclick = () => {
        [state[i - 1], state[i]] = [state[i], state[i - 1]];
        draw();
      };

      const down = document.createElement("button");
      down.className = "btn btn-secondary";
      down.textContent = "↓";
      down.disabled = i === state.length - 1 || locked;
      down.onclick = () => {
        [state[i + 1], state[i]] = [state[i], state[i + 1]];
        draw();
      };

      controls.appendChild(up);
      controls.appendChild(down);

      row.appendChild(label);
      row.appendChild(controls);
      list.appendChild(row);
    });
  }

  draw();

  const check = document.createElement("button");
  check.className = "btn";
  check.textContent = "Proveri";
  check.onclick = () => {
    if (locked) return;
    locked = true;

    const ok = state.every((v, i) => v === q.items[i]);
    if (ok) {
      score += 1;
      elHint.textContent = "Tačno!";
    } else {
      elHint.textContent = `Netačno. ${q.explanation ?? ""}`.trim();
    }

    elScore.textContent = `Poeni: ${score}`;
    elNext.disabled = false;
    elNext.textContent = idx === bank.length - 1 ? "Završi" : "Sledeće";

    // lock buttons
    Array.from(list.querySelectorAll("button")).forEach(b => (b.disabled = true));
    check.disabled = true;
  };

  elAnswers.appendChild(list);
  elAnswers.appendChild(check);
}

function renderMatch(q) {
  const wrap = document.createElement("div");
  wrap.className = "match";

  const rows = [];

  q.left.forEach(leftItem => {
    const row = document.createElement("div");
    row.className = "match-row";

    const left = document.createElement("div");
    left.className = "match-left";
    left.textContent = leftItem;

    const sel = document.createElement("select");
    sel.className = "match-select";
    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = "— izaberi —";
    sel.appendChild(opt0);
    q.right.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      sel.appendChild(opt);
    });

    row.appendChild(left);
    row.appendChild(sel);
    wrap.appendChild(row);

    rows.push({ leftItem, sel, row });
  });

  const check = document.createElement("button");
  check.className = "btn";
  check.textContent = "Proveri";
  check.onclick = () => {
    if (locked) return;
    locked = true;

    let ok = true;
    rows.forEach(({ leftItem, sel, row }) => {
      sel.disabled = true;
      const correct = q.pairs[leftItem];
      if (sel.value !== correct) {
        ok = false;
        row.classList.add("wrong");
      } else {
        row.classList.add("correct");
      }
    });

    if (ok) {
      score += 1;
      elHint.textContent = "Tačno!";
    } else {
      elHint.textContent = "Netačno. Pokušaj sledeće pitanje.";
    }

    elScore.textContent = `Poeni: ${score}`;
    elNext.disabled = false;
    elNext.textContent = idx === bank.length - 1 ? "Završi" : "Sledeće";
    check.disabled = true;
  };

  elAnswers.appendChild(wrap);
  elAnswers.appendChild(check);
}

function next() {
  if (idx < bank.length - 1) {
    idx += 1;
    render();
  } else {
    finish();
  }
}

function finish() {
  elQuestion.textContent = `Kraj! Osvojio/la si ${score}/${bank.length} poena.`;
  elAnswers.innerHTML = "";
  elNext.hidden = true;
  elRestart.hidden = false;
  elHint.textContent = "";
}

function restart() {
  pickBank();
  elNext.hidden = false;
  elRestart.hidden = true;
  render();
}

function initTopicUI() {
  const quizCard = document.getElementById("quiz");
  const top = quizCard.querySelector(".quiz-top");

  const wrap = document.createElement("div");
  wrap.className = "filters";

  const gradeSel = document.createElement("select");
  gradeSel.className = "topic-select";
  ;[
    ["Sve", "Svi razredi"],
    ["6", "6. razred"],
    ["7", "7. razred"],
    ["8", "8. razred"],
  ].forEach(([v, label]) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = label;
    gradeSel.appendChild(opt);
  });
  gradeSel.onchange = () => {
    activeGrade = gradeSel.value;
    restart();
  };

  const topicSel = document.createElement("select");
  topicSel.className = "topic-select";
  const all = document.createElement("option");
  all.value = "Sve";
  all.textContent = "Sve oblasti";
  topicSel.appendChild(all);
  topics
    .filter(t => t !== "Sve")
    .forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      topicSel.appendChild(opt);
    });
  topicSel.onchange = () => {
    activeTopic = topicSel.value;
    restart();
  };

  wrap.appendChild(gradeSel);
  wrap.appendChild(topicSel);
  top.prepend(wrap);
}

elNext.addEventListener("click", next);
elRestart.addEventListener("click", restart);

initTopicUI();
pickBank();
render();
