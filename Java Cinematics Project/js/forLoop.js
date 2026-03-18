// Select all code spans for highlighting
const lines = document.querySelectorAll("#high span");
const memItems = document.querySelectorAll(".mem-item");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memI = document.getElementById("mem-i");

const numI = document.getElementById("mem-num-i");
const numLimit = document.getElementById("mem-num-limit");
const compOp = document.getElementById("comp-op");
const equalOp = document.getElementById("equal-op");
const valResult = document.getElementById("val-result");

const valI = document.getElementById("val-i");
const cmpI3 = document.getElementById("cmp-i3");
const incI = document.getElementById("inc-i");
const litHello = document.getElementById("lit-hello");

const consoleBox = document.getElementById("console");
const memoryExplanation = document.getElementById("memory-explanation");

const stepMessages = [
  "Enter For",
  "Declare i",
  "Assign 0 to i",
  "Check Condition",
  "Condition is True",
  "Print Hello",
  "Increment i",
  "Exit loop",
];

const LIMIT = 3;
const steps = 8;

let current = -1;
let i = 0;
let loopCount = 0;
let boolVal = "";
let printedCount = 0;

const history = [];
let lastAction = "init";

function snapshot() {
  return {
    current,
    i,
    loopCount,
    boolVal,
    printedCount,
  };
}

function restore(state) {
  current = state.current;
  i = state.i;
  loopCount = state.loopCount;
  boolVal = state.boolVal;
  printedCount = state.printedCount;
}

function animateToMemory(sourceElement, targetElement, finalValue) {
  const rectStart = sourceElement.getBoundingClientRect();
  const rectEnd = targetElement.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = finalValue;

  document.body.appendChild(flying);

  flying.style.left = rectStart.left + rectStart.width / 2 + "px";
  flying.style.top = rectStart.top + rectStart.height / 2 + "px";

  requestAnimationFrame(() => {
    flying.style.left = rectEnd.left + rectEnd.width / 2 + "px";
    flying.style.top = rectEnd.top + rectEnd.height / 2 + "px";
  });

  flying.addEventListener("transitionend", () => {
    targetElement.innerText = finalValue;
    document.body.removeChild(flying);
  });
}

function getHLine(step) {
  if (step < 0) return -1;
  const map = [0, 1, 2, 3, 3, 5, 4, 6];
  return map[step] ?? -1;
}

function clearCalcRow() {
  numI.innerText = "";
  numLimit.innerText = "";
  compOp.innerText = "";
  valResult.innerText = "";

  numI.style.display = "none";
  numLimit.style.display = "none";
  compOp.style.display = "none";
  equalOp.style.display = "none";
  valResult.style.display = "none";
}

function addConsoleRow(text) {
  const row = document.createElement("div");
  row.className = "console-row";

  const span = document.createElement("span");
  span.innerText = text;
  row.appendChild(span);

  consoleBox.appendChild(row);
  return span;
}

function renderConsole() {
  consoleBox.innerHTML = "";

  for (let k = 0; k < printedCount; k++) {
    addConsoleRow("Hello");
  }

  if (current === 5 && lastAction === "forward") {
    consoleBox.innerHTML = "";
    for (let k = 0; k < printedCount - 1; k++) {
      addConsoleRow("Hello");
    }
    const target = addConsoleRow("");
    animateToMemory(litHello, target, "Hello");
  }
}

function updateMemoryExplanation() {
  if (!memoryExplanation) return;
  if (current < 0) {
    memoryExplanation.style.display = "none";
    memoryExplanation.innerText = "";
  } else {
    memoryExplanation.style.display = "flex";
    if (current === 2) {
      memoryExplanation.innerText = `Assign ${i} to i`;
    } else if (current === 4) {
      memoryExplanation.innerText =
        i < LIMIT ? "Condition is True" : "Condition is False";
    } else {
      memoryExplanation.innerText = stepMessages[current] || "";
    }
  }
}

function updateUI() {
  lines.forEach((line) => line.classList.remove("highlight"));
  const hLine = getHLine(current);
  if (hLine >= 0 && lines[hLine]) lines[hLine].classList.add("highlight");

  memItems.forEach((item) => (item.style.display = "none"));
  if (current >= 1) memItems[0].style.display = "flex";

  clearCalcRow();
  renderConsole();

  if (current < 2) {
    memI.innerText = "";
  } else {
    memI.innerText = String(i);
  }

  if (current === 2 && lastAction === "forward") {
    memI.innerText = "";
    animateToMemory(valI, memI, String(i));
  }

  if (current === 3 || current === 4) {
    numI.style.display = "flex";
    numLimit.style.display = "flex";
    compOp.style.display = "flex";
    numI.innerText = String(i);
    numLimit.innerText = String(LIMIT);
    compOp.innerText = "<";

    if (current === 3 && lastAction === "forward") {
      animateToMemory(memI, numI, String(i));
      animateToMemory(cmpI3, numLimit, String(LIMIT));
    }

    if (current === 4) {
      boolVal = i < LIMIT ? "True" : "False";
      equalOp.style.display = "flex";
      valResult.style.display = "flex";
      valResult.innerText = boolVal;
    }
  }

  if (current === 6 && lastAction === "forward") {
    animateToMemory(incI, memI, String(i));
  }

  updateMemoryExplanation();

  backBtn.disabled = history.length === 0;
}

nextBtn.addEventListener("click", () => {
  history.push(snapshot());
  lastAction = "forward";

  if (current < 0) {
    current = 0;
    updateUI();
    return;
  }

  if (current === 4) {
    boolVal = i < LIMIT ? "True" : "False";
    if (boolVal === "True") {
      printedCount++;
      current = 5;
    } else {
      current = 7;
    }
    updateUI();
    return;
  }

  if (current === 5) {
    i = i + 1;
    loopCount++;
    current = 6;
    updateUI();
    return;
  }

  if (current === 6) {
    current = 2;
    updateUI();
    return;
  }

  if (current < steps - 1) {
    current++;
    updateUI();
  }
});

backBtn.addEventListener("click", () => {
  if (history.length === 0) return;
  lastAction = "back";
  restore(history.pop());
  updateUI();
});

updateUI();