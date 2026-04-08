// memory explanation box
const explanationBox = document.getElementById("memory-explanation");

// add method header spans
const highBlock = document.getElementById("high");
highBlock.innerHTML = highBlock.innerHTML
  .replace(
    "  public static void average(int x, int y, int z){",
    "  <span>public static void average(int x, int y, int z){</span>",
  )
  .replace(
    "  public static void sum(int x, int y, int z){",
    "  <span>public static void sum(int x, int y, int z){</span>",
  );

const explanations = [
  "Import Scanner",
  "The statement creates an object for performing console input and assigns the object to the reference variable named input",
  "Prompt first number",
  "Read first number",
  "Store in num1",
  "Prompt second number",
  "Read second number",
  "Store in num2",
  "Prompt third number",
  "Read third number",
  "Store in num3",
  "Call average()",
  "Go to average()",
  "Calculate avg",
  "Show avg result",
  "Store avg",
  "Print avg",
  "Call sum()",
  "Go to sum()",
  "Calculate total",
  "Show total result",
  "Store total",
  "Print total",
  "Done!",
];

// select all spans
const lines = document.querySelectorAll("#high span");

// button
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// input row in output
const consoleRow = document.getElementById("console-input-row");
const promptBox = document.getElementById("prompt");
const numberInput = document.getElementById("number-input");

// output
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");
const out5 = document.getElementById("ou5");

// memory squares
const memNum1 = document.getElementById("mem-num1");
const memNum2 = document.getElementById("mem-num2");
const memNum3 = document.getElementById("mem-num3");
const memAvg = document.getElementById("mem-avg");
const memTotal = document.getElementById("mem-total");

// memory items
const itemNum1 = document.getElementById("item-num1");
const itemNum2 = document.getElementById("item-num2");
const itemNum3 = document.getElementById("item-num3");
const itemAvg = document.getElementById("item-avg");
const itemTotal = document.getElementById("item-total");

// calc row
const calcLeft = document.getElementById("calc-left");
const calcMid = document.getElementById("calc-mid");
const calcRight = document.getElementById("calc-right");
const plusOp1 = document.getElementById("plus-op-1");
const plusOp2 = document.getElementById("plus-op-2");
const extraOp = document.getElementById("extra-op");
const extraNum = document.getElementById("extra-num");
const eqOp = document.getElementById("eq-op");
const calcResult = document.getElementById("calc-result");

// other
const memItems = document.querySelectorAll(".mem-item");

const LAST_STEP = 23;

let current = -1;
let prevStep = -1;

const prompts = [
  "Enter the first number:",
  "Enter the second number:",
  "Enter the third number:",
];

const storedText = ["", "", ""];

// allow only integer typing
function filterIntegerTyping() {
  let v = numberInput.value;

  v = v.replace(/[^\d-]/g, "");

  if (v.includes("-")) {
    v =
      (v[0] === "-" ? "-" : "") +
      v.slice(v[0] === "-" ? 1 : 0).replace(/-/g, "");
  }

  numberInput.value = v;
}

numberInput.addEventListener("input", filterIntegerTyping);
numberInput.addEventListener("paste", () => setTimeout(filterIntegerTyping, 0));
numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && canAcceptInput()) {
    captureCurrentInput();
    if (current < LAST_STEP) {
      current++;
      updateHighlight();
    }
  }
});

function isInputStep(step) {
  return step === 3 || step === 6 || step === 9;
}

function getCurrentInputIndex() {
  if (current === 3) return 0;
  if (current === 6) return 1;
  if (current === 9) return 2;
  return -1;
}

function canAcceptInput() {
  if (!isInputStep(current)) return true;

  filterIntegerTyping();
  const raw = numberInput.value.trim();

  if (raw === "" || raw === "-") return false;
  return /^-?\d+$/.test(raw);
}

function getStoredText(index) {
  return (storedText[index] || "").trim();
}

function getValue(index) {
  const parsed = parseInt(getStoredText(index), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAverage(value) {
  if (Number.isInteger(value)) return value.toFixed(1);
  return String(value);
}

function fitMemorySquare(square, text) {
  square.innerText = text;
  square.style.width = "60px";

  const len = String(text).length;
  if (len <= 4) {
    square.style.width = "60px";
  } else if (len <= 8) {
    square.style.width = "85px";
  } else if (len <= 12) {
    square.style.width = "120px";
  } else if (len <= 18) {
    square.style.width = "170px";
  } else {
    square.style.width = "230px";
  }
}

function animateToMemory(sourceElement, targetElement, finalValue) {
  if (!sourceElement || !targetElement) {
    if (targetElement) fitMemorySquare(targetElement, finalValue);
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
    fitMemorySquare(targetElement, finalValue);
    document.body.removeChild(flying);
  });
}

// figure out what line to highlight
function getHLine(step) {
  if (step < 0) return -1;

  if (step === 0) return 0;
  if (step === 1) return 1;

  if (step === 2) return 2;
  if (step === 3 || step === 4) return 3;

  if (step === 5) return 5;
  if (step === 6 || step === 7) return 6;

  if (step === 8) return 8;
  if (step === 9 || step === 10) return 9;

  if (step === 11) return 11;
  if (step === 12) return 13;
  if (step >= 13 && step <= 15) return 14;
  if (step === 16) return 16;

  if (step === 17) return 12;
  if (step === 18) return 17;
  if (step >= 19 && step <= 21) return 18;
  if (step === 22) return 19;

  return -1;
}

function addExtraHighlight(hLine) {
  if (hLine === 3 && lines[4]) lines[4].classList.add("highlight");
  if (hLine === 6 && lines[7]) lines[7].classList.add("highlight");
  if (hLine === 9 && lines[10]) lines[10].classList.add("highlight");
  if (hLine === 14 && lines[15]) lines[15].classList.add("highlight");
}

// move input row so it stays in order like output lines
function moveConsoleRowForCurrentStep() {
  if (current === 2 || current === 3) {
    out1.parentNode.insertBefore(consoleRow, out1);
    return;
  }

  if (current === 5 || current === 6) {
    out2.parentNode.insertBefore(consoleRow, out2);
    return;
  }

  if (current === 8 || current === 9) {
    out3.parentNode.insertBefore(consoleRow, out3);
    return;
  }

  out5.parentNode.appendChild(consoleRow);
}

function setPromptAndInput() {
  moveConsoleRowForCurrentStep();

  consoleRow.style.display = "none";
  numberInput.style.visibility = "hidden";
  numberInput.readOnly = true;
  numberInput.style.pointerEvents = "none";

  let promptIndex = -1;

  if (current === 2 || current === 3) promptIndex = 0;
  if (current === 5 || current === 6) promptIndex = 1;
  if (current === 8 || current === 9) promptIndex = 2;

  if (promptIndex === -1) return;

  consoleRow.style.display = "flex";
  promptBox.innerText = prompts[promptIndex];
  numberInput.value = storedText[promptIndex];
  numberInput.placeholder = "";

  if (current === 3 || current === 6 || current === 9) {
    numberInput.style.visibility = "visible";
    numberInput.readOnly = false;
    numberInput.style.pointerEvents = "auto";
    numberInput.focus();
  }
}

function captureCurrentInput() {
  filterIntegerTyping();

  const index = getCurrentInputIndex();
  if (index === -1) return;
  if (!canAcceptInput()) return;

  storedText[index] = numberInput.value.trim();
}

function updateExplanation() {
  if (current < 0) {
    explanationBox.style.display = "none";
    explanationBox.textContent = "";
    return;
  }

  explanationBox.style.display = "flex";
  explanationBox.textContent = explanations[current] || "Done!";
}

function renderInputOutputLines(n1, n2, n3) {
  out1.innerHTML =
    current >= 4
      ? `${prompts[0]} <span id="out-num1">${String(n1)}</span>`
      : "";

  out2.innerHTML =
    current >= 7
      ? `${prompts[1]} <span id="out-num2">${String(n2)}</span>`
      : "";

  out3.innerHTML =
    current >= 10
      ? `${prompts[2]} <span id="out-num3">${String(n3)}</span>`
      : "";

  if (current < 16) out4.innerHTML = "";
  if (current < 22) out5.innerHTML = "";
}

function getInputOutputSource(step) {
  if (step === 4) return document.getElementById("out-num1");
  if (step === 7) return document.getElementById("out-num2");
  if (step === 10) return document.getElementById("out-num3");
  return null;
}

function clearCalcRow() {
  calcLeft.innerText = "";
  calcMid.innerText = "";
  calcRight.innerText = "";
  extraNum.innerText = "";
  calcResult.innerText = "";

  calcLeft.style.display = "none";
  calcMid.style.display = "none";
  calcRight.style.display = "none";
  plusOp1.style.display = "none";
  plusOp2.style.display = "none";
  extraOp.style.display = "none";
  extraNum.style.display = "none";
  eqOp.style.display = "none";
  calcResult.style.display = "none";
}

function showTopVariables() {
  if (current >= 3) itemNum1.style.display = "flex";
  if (current >= 6) itemNum2.style.display = "flex";
  if (current >= 9) itemNum3.style.display = "flex";
}

function showMethodVariable() {
  if (current >= 12 && current <= 16) {
    itemAvg.style.display = "flex";
  }

  if (current >= 18 && current <= 22) {
    itemTotal.style.display = "flex";
  }
}

function renderMemoryValues(n1, n2, n3, avgValue, sumValue) {
  memNum1.style.width = "60px";
  memNum2.style.width = "60px";
  memNum3.style.width = "60px";
  memAvg.style.width = "60px";
  memTotal.style.width = "60px";

  memNum1.innerText = current >= 4 ? String(n1) : "";
  memNum2.innerText = current >= 7 ? String(n2) : "";
  memNum3.innerText = current >= 10 ? String(n3) : "";

  if (current >= 15) {
    fitMemorySquare(memAvg, avgValue);
  } else {
    memAvg.innerText = "";
  }

  if (current >= 21) {
    fitMemorySquare(memTotal, sumValue);
  } else {
    memTotal.innerText = "";
  }
}

function showAverageCalc(n1, n2, n3, avgValue, goingForward) {
  if (current < 13 || current > 15) return;

  calcLeft.style.display = "flex";
  calcMid.style.display = "flex";
  calcRight.style.display = "flex";
  plusOp1.style.display = "flex";
  plusOp2.style.display = "flex";
  extraOp.style.display = "flex";
  extraNum.style.display = "flex";

  if (current === 13 && goingForward) {
    animateToMemory(memNum1, calcLeft, String(n1));
    animateToMemory(memNum2, calcMid, String(n2));
    animateToMemory(memNum3, calcRight, String(n3));
    animateToMemory(
      document.getElementById("lit-three-double"),
      extraNum,
      "3.0",
    );
  } else {
    calcLeft.innerText = String(n1);
    calcMid.innerText = String(n2);
    calcRight.innerText = String(n3);
    extraNum.innerText = "3.0";
  }

  if (current >= 14) {
    eqOp.style.display = "flex";
    calcResult.style.display = "flex";
    calcResult.innerText = avgValue;
  }
}

function showSumCalc(n1, n2, n3, sumValue, goingForward) {
  if (current < 19 || current > 21) return;

  calcLeft.style.display = "flex";
  calcMid.style.display = "flex";
  calcRight.style.display = "flex";
  plusOp1.style.display = "flex";
  plusOp2.style.display = "flex";

  if (current === 19 && goingForward) {
    animateToMemory(memNum1, calcLeft, String(n1));
    animateToMemory(memNum2, calcMid, String(n2));
    animateToMemory(memNum3, calcRight, String(n3));
  } else {
    calcLeft.innerText = String(n1);
    calcMid.innerText = String(n2);
    calcRight.innerText = String(n3);
  }

  if (current >= 20) {
    eqOp.style.display = "flex";
    calcResult.style.display = "flex";
    calcResult.innerText = sumValue;
  }
}

function updateHighlight() {
  const goingForward = current > prevStep;

  const n1 = getValue(0);
  const n2 = getValue(1);
  const n3 = getValue(2);

  const avgValue = formatAverage((n1 + n2 + n3) / 3);
  const sumValue = String(n1 + n2 + n3);

  lines.forEach((line) => line.classList.remove("highlight"));

  const hLine = getHLine(current);

  if (lines[hLine]) {
    lines[hLine].classList.add("highlight");
  }

  addExtraHighlight(hLine);
  setPromptAndInput();
  updateExplanation();
  renderInputOutputLines(n1, n2, n3);

  memItems.forEach((item) => (item.style.display = "none"));
  clearCalcRow();

  showTopVariables();
  showMethodVariable();
  renderMemoryValues(n1, n2, n3, avgValue, sumValue);

  // move typed value from output line into memory
  if (current === 4 && goingForward) {
    memNum1.innerText = "";
    animateToMemory(getInputOutputSource(4), memNum1, String(n1));
  }

  if (current === 7 && goingForward) {
    memNum2.innerText = "";
    animateToMemory(getInputOutputSource(7), memNum2, String(n2));
  }

  if (current === 10 && goingForward) {
    memNum3.innerText = "";
    animateToMemory(getInputOutputSource(10), memNum3, String(n3));
  }

  showAverageCalc(n1, n2, n3, avgValue, goingForward);
  showSumCalc(n1, n2, n3, sumValue, goingForward);

  if (current === 15 && goingForward) {
    memAvg.innerText = "";
    animateToMemory(calcResult, memAvg, avgValue);
  }

  if (current === 21 && goingForward) {
    memTotal.innerText = "";
    animateToMemory(calcResult, memTotal, sumValue);
  }

  if (current === 16) {
    if (out4.innerHTML === "") {
      out4.innerHTML = 'The average is: <span id="out-avg"></span>';
    }

    const outAvg = document.getElementById("out-avg");

    if (goingForward) {
      outAvg.innerText = "";
      animateToMemory(memAvg, outAvg, avgValue);
    } else {
      outAvg.innerText = avgValue;
    }
  }

  if (current === 22) {
    if (out5.innerHTML === "") {
      out5.innerHTML = 'The sum is: <span id="out-sum"></span>';
    }

    const outSum = document.getElementById("out-sum");

    if (goingForward) {
      outSum.innerText = "";
      animateToMemory(memTotal, outSum, sumValue);
    } else {
      outSum.innerText = sumValue;
    }
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled =
    current >= LAST_STEP || (isInputStep(current) && !canAcceptInput());
  prevStep = current;
}

nextBtn.addEventListener("click", () => {
  if (isInputStep(current)) {
    if (!canAcceptInput()) {
      numberInput.focus();
      return;
    }

    captureCurrentInput();
  }

  if (current < LAST_STEP) {
    current++;
    updateHighlight();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    updateHighlight();
  }
});

updateHighlight();