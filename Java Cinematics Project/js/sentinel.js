const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memData = document.getElementById("mem-data");
const memSum = document.getElementById("mem-sum");
const itemData = document.getElementById("item-data");
const itemSum = document.getElementById("item-sum");

const calcLeft = document.getElementById("calc-left");
const calcOp = document.getElementById("calc-op");
const calcRight = document.getElementById("calc-right");
const eqOp = document.getElementById("eq-op");
const calcResult = document.getElementById("calc-result");

const outputLines = document.getElementById("output-lines");
const dataInput = document.getElementById("data-input");
const outBox = document.getElementById("out-box");
const memoryExplanation = document.getElementById("memory-explanation");

let current = -1;
let dataValue = null;
let sumValue = 0;
let pendingInput = null;
let sumJustUpdated = false;
const outputLog = [];

const history = [];

const stepMessages = [
  "Import Scanner",
  "Main method",
  "Main method",
  "The statement creates an object for performing console input and assigns the object to the reference variable named input",
  "Print prompt for integer",
  "Declare data",
  "Read initial data",
  "Declare sum",
  "Assign 0 to sum",
  "Check while condition (data != 0)",
  "Condition result",
  "Add data to sum",
  "Print prompt for next integer",
  "Read next data",
  "End of loop body",
  "Exit while loop",
  "Print final sum",
];

function snapshot() {
  return {
    current,
    dataValue,
    sumValue,
    pendingInput,
    sumJustUpdated,
    outputLog: [...outputLog],
    inputValue: dataInput ? dataInput.value : "",
  };
}

function restore(state) {
  current = state.current;
  dataValue = state.dataValue;
  sumValue = state.sumValue;
  pendingInput = state.pendingInput;
  sumJustUpdated = state.sumJustUpdated;
  outputLog.length = 0;
  outputLog.push(...state.outputLog);
  if (dataInput) dataInput.value = state.inputValue;
}

function animateToMemory(sourceElement, targetElement, finalValue) {
  if (!sourceElement || !targetElement) {
    if (targetElement) targetElement.innerText = finalValue;
    return;
  }

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
  const map = [0, 2, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 13, 9, 14];
  return map[step] ?? -1;
}

function clearCalcRow() {
  calcLeft.style.display = "none";
  calcOp.style.display = "none";
  calcRight.style.display = "none";
  eqOp.style.display = "none";
  calcResult.style.display = "none";

  calcLeft.innerText = "";
  calcOp.innerText = "";
  calcRight.innerText = "";
  calcResult.innerText = "";
}

function renderOutput() {
  if (!outputLines) return;

  outputLines.innerHTML = outputLog
    .map((line) => `<div>${line}</div>`)
    .join("");

  if (outBox) outBox.scrollTop = outBox.scrollHeight;
}

function updateMemoryExplanation() {
  if (!memoryExplanation) return;

  if (current < 0) {
    memoryExplanation.style.display = "none";
    memoryExplanation.innerText = "";
    return;
  }

  memoryExplanation.style.display = "flex";

  if (current === 10) {
    memoryExplanation.innerText =
      dataValue !== 0 ? "Condition is True" : "Condition is False";
    return;
  }

  if (current === 11) {
    memoryExplanation.innerText = `Update sum: ${sumValue - dataValue} + ${dataValue} = ${sumValue}`;
    return;
  }

  memoryExplanation.innerText = stepMessages[current] || "";
}

function updateUI(lastAction = "none") {
  lines.forEach((line) => line.classList.remove("highlight"));
  const hLine = getHLine(current);
  if (hLine >= 0 && lines[hLine]) lines[hLine].classList.add("highlight");

  itemData.style.display = current >= 5 ? "flex" : "none";
  itemSum.style.display = current >= 7 ? "flex" : "none";

  memData.innerText =
    current >= 6 && dataValue !== null ? String(dataValue) : "";
  memSum.innerText = current >= 8 ? String(sumValue) : "";

  if (lastAction === "forward" && current === 8) {
    animateToMemory(lines[8], memSum, String(sumValue));
  }

  clearCalcRow();

  if (current === 10) {
    calcLeft.style.display = "flex";
    calcOp.style.display = "flex";
    calcRight.style.display = "flex";
    eqOp.style.display = "flex";
    calcResult.style.display = "flex";

    calcLeft.innerText = String(dataValue);
    calcOp.innerText = "!=";
    calcRight.innerText = "0";
    calcResult.innerText = dataValue !== 0 ? "True" : "False";
  }

  if (current === 11 && sumJustUpdated) {
    calcLeft.style.display = "flex";
    calcOp.style.display = "flex";
    calcRight.style.display = "flex";
    eqOp.style.display = "flex";
    calcResult.style.display = "flex";

    const oldSum = sumValue - dataValue;
    calcLeft.innerText = String(oldSum);
    calcOp.innerText = "+";
    calcRight.innerText = String(dataValue);
    calcResult.innerText = String(sumValue);

    animateToMemory(memData, memSum, String(sumValue));
  }

  if (dataInput) {
    const inputStep = current === 6 || current === 13;
    dataInput.style.visibility = inputStep ? "visible" : "hidden";
  }

  renderOutput();
  updateMemoryExplanation();

  backBtn.disabled = history.length === 0;
  nextBtn.disabled =
    ((current === 6 || current === 13) && !Number.isFinite(pendingInput)) ||
    current >= 16;
}

function commitInputValue() {
  if (!dataInput) return false;
  const raw = dataInput.value.trim();
  if (raw === "") return false;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return false;

  pendingInput = parsed;

  if (current === 6 || current === 13) {
    memData.innerText = "";
    animateToMemory(dataInput, memData, String(parsed));
  }

  return true;
}

if (dataInput) {
  dataInput.addEventListener("input", () => {
    pendingInput = null;
    updateUI();
  });

  dataInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      if (commitInputValue()) {
        updateUI();
      }
    }
  });
}

nextBtn.addEventListener("click", () => {
  if (current === 6 || current === 13) {
    if (!Number.isFinite(pendingInput) && !commitInputValue()) {
      updateUI();
      return;
    }
  }

  history.push(snapshot());
  sumJustUpdated = false;

  if (current < 0) {
    current = 0;
    updateUI("forward");
    return;
  }

  if (current === 1) {
    current = 3;
    updateUI("forward");
    return;
  }

  if (current === 3) {
    outputLog.push("Enter an integer (the input ends if it is 0): ");
    current = 4;
    updateUI("forward");
    return;
  }

  if (current === 6) {
    dataValue = pendingInput;
    outputLog.push(String(dataValue));
    pendingInput = null;
    if (dataInput) dataInput.value = "";
    current = 7;
    updateUI("forward");
    return;
  }

  if (current === 10) {
    current = dataValue !== 0 ? 11 : 15;

    if (current === 11) {
      sumValue += dataValue;
      sumJustUpdated = true;
    }

    updateUI("forward");
    return;
  }

  if (current === 11) {
    outputLog.push("Enter an integer (the input ends if it is 0): ");
    current = 12;
    updateUI("forward");
    return;
  }

  if (current === 13) {
    dataValue = pendingInput;
    outputLog.push(String(dataValue));
    pendingInput = null;
    if (dataInput) dataInput.value = "";
    current = 14;
    updateUI("forward");
    return;
  }

  if (current === 14) {
    current = 9;
    updateUI("forward");
    return;
  }

  if (current === 15) {
    outputLog.push("The sum is " + sumValue);
    current = 16;
    updateUI("forward");
    return;
  }

  current = Math.min(current + 1, 16);
  updateUI("forward");
});

backBtn.addEventListener("click", () => {
  if (history.length === 0) return;
  restore(history.pop());
  updateUI("back");
});

updateUI();