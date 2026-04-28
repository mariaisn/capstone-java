// Night mode toggle
const toggle = document.getElementById("toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("night-mode");
  });
}

const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");
const conIn = document.getElementById("console-input");
const prompt = document.getElementById("prompt");

const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const memoryExplanation = document.getElementById("memory-explanation");

const itemHex = document.getElementById("item-hex");
const itemCh = document.getElementById("item-ch");
const itemValue = document.getElementById("item-value");

const memHex = document.getElementById("mem-hex");
const memCh = document.getElementById("mem-ch");
const memValue = document.getElementById("mem-value");

const calcLeft = document.getElementById("calc-left");
const calcOp = document.getElementById("calc-op");
const calcRight = document.getElementById("calc-right");
const calcEq = document.getElementById("calc-eq");
const calcResult = document.getElementById("calc-result");

const importLine = document.getElementById("import-line");
const mainLine = document.getElementById("main-line");
const scannerLine = document.getElementById("scanner-line");
const promptLine = document.getElementById("prompt-line");
const readLine = document.getElementById("read-line");
const lenIfLine = document.getElementById("len-if-line");
const lenPrintLine = document.getElementById("len-print-line");
const exitLine = document.getElementById("exit-line");
const chLine = document.getElementById("ch-line");
const afIfLine = document.getElementById("af-if-line");
const valueLine = document.getElementById("value-line");
const printValueLine = document.getElementById("print-value-line");
const printValueLine2 = document.getElementById("print-value-line-2");
const digitIfLine = document.getElementById("digit-if-line");
const printDigitLine = document.getElementById("print-digit-line");
const printDigitLine2 = document.getElementById("print-digit-line-2");
const invalidPrintLine = document.getElementById("invalid-print-line");

const steps = [
  "Import Scanner",
  "Enter main",
  "The statement creates an object for performing console input and assigns the object to the reference variable named input",
  "Print prompt",
  "Read hexString",
  "Check length != 1",
  "Convert to uppercase ch",
  "Check if A to F",
  "Compute decimal value",
  "Print decimal output",
  "End program",
];

let current = -1;
let userInput = "";
let hasInput = false;
let chValue = "";
let computedValue = "";
let isLengthValid = false;
let isAF = false;
let isDigit = false;

function computeState() {
  isLengthValid = userInput.length === 1;
  chValue = isLengthValid ? userInput.charAt(0).toUpperCase() : "";
  isAF = isLengthValid && chValue >= "A" && chValue <= "F";
  isDigit = isLengthValid && chValue >= "0" && chValue <= "9";
  computedValue = isAF
    ? String(chValue.charCodeAt(0) - "A".charCodeAt(0) + 10)
    : "";
}

function getBranch() {
  if (!hasInput) return "none";
  if (!isLengthValid) return "len";
  if (isAF) return "af";
  if (isDigit) return "digit";
  return "invalid";
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

function clearCalcRow() {
  [calcLeft, calcRight, calcResult].forEach((el) => {
    el.innerText = "";
    el.style.display = "none";
  });
  [calcOp, calcEq].forEach((el) => {
    el.style.display = "none";
  });
}

function updateOutput() {
  const branch = getBranch();

  prompt.innerText = "";
  out1.innerText = "";
  out2.innerText = "";

  if (current < 3) {
    return;
  }

  if (current === 3) {
    prompt.innerText = "Enter a hex digit: ";
    return;
  }

  if (current === 4) {
    prompt.innerText = "Enter a hex digit: ";
    return;
  }

  if (!hasInput) {
    prompt.innerText = "Enter a hex digit: ";
    return;
  }

  prompt.innerText = `Enter a hex digit: ${userInput}`;

  if (branch === "len") {
    if (current >= 6) out1.innerText = "You must enter exactly one character";
    return;
  }

  if (branch === "af") {
    if (current >= 9) {
      out1.innerText = `The decimal value for hex digit ${chValue} is ${computedValue}`;
    }
    return;
  }

  if (branch === "digit") {
    if (current >= 8) {
      out1.innerText = `The decimal value for hex digit ${chValue} is ${chValue}`;
    }
    return;
  }

  if (branch === "invalid") {
    if (current >= 9) out1.innerText = `${chValue} is an invalid input`;
    return;
  }
}

function updateUI() {
  lines.forEach((line) => line.classList.remove("highlight"));

  const branch = getBranch();
  const highlightTargets = [
    importLine,
    mainLine,
    scannerLine,
    promptLine,
    readLine,
    lenIfLine,
    branch === "len" ? lenPrintLine : chLine,
    branch === "len" ? exitLine : afIfLine,
    branch === "af"
      ? valueLine
      : branch === "digit"
        ? digitIfLine
        : branch === "invalid"
          ? invalidPrintLine
          : mainLine,
    branch === "af"
      ? printValueLine
      : branch === "digit"
        ? printDigitLine
        : branch === "invalid"
          ? invalidPrintLine
          : mainLine,
    null,
  ];

  if (current >= 0) {
    const target = highlightTargets[current];
    if (target) target.classList.add("highlight");
    if (current === 9 && branch === "af" && printValueLine2) {
      printValueLine2.classList.add("highlight");
    }
    if (current === 9 && branch === "digit" && printDigitLine2) {
      printDigitLine2.classList.add("highlight");
    }
    memoryExplanation.style.display = "flex";
    if (current === 5 && hasInput) {
      memoryExplanation.innerText = isLengthValid
        ? "length != 1 is False"
        : "length != 1 is True";
    } else if (current === 6 && branch === "len") {
      memoryExplanation.innerText = "Print length error";
    } else if (current === 7 && branch === "len") {
      memoryExplanation.innerText = "Exit program";
    } else if (current === 7 && hasInput) {
      memoryExplanation.innerText = isAF
        ? "A <= ch && ch <= F is True"
        : "A <= ch && ch <= F is False";
    } else if (current === 8 && hasInput && branch === "digit") {
      memoryExplanation.innerText = "Check digit branch";
    } else if (current === 8 && hasInput && branch === "invalid") {
      memoryExplanation.innerText = "Invalid input branch";
    } else if (current === 8 && hasInput && branch === "len") {
      memoryExplanation.innerText = "Program already exited";
    } else if (current === 9 && hasInput && branch === "digit") {
      memoryExplanation.innerText = "Print digit as char code expression";
    } else if (current === 9 && hasInput && branch === "invalid") {
      memoryExplanation.innerText = "Print invalid input message";
    } else if (current === 9 && hasInput && branch === "len") {
      memoryExplanation.innerText = "No further execution";
    } else {
      memoryExplanation.innerText = steps[current];
    }
  } else {
    memoryExplanation.style.display = "none";
    memoryExplanation.innerText = "";
  }

  conIn.style.display = "none";
  if (current === 4 && !hasInput) {
    conIn.style.display = "block";
    conIn.focus();
  }

  itemHex.style.display = current >= 4 ? "flex" : "none";
  itemCh.style.display = current >= 6 && branch !== "len" ? "flex" : "none";
  itemValue.style.display = current >= 8 && branch === "af" ? "flex" : "none";

  memHex.innerText = current >= 4 && hasInput ? userInput : "";
  memCh.innerText = current >= 6 && hasInput && isLengthValid ? chValue : "";
  memValue.innerText = current >= 8 && hasInput && isAF ? computedValue : "";

  clearCalcRow();

  if (current === 4 && hasInput) {
    memHex.innerText = "";
    animateToMemory(readLine, memHex, userInput);
  }

  if (current === 6 && hasInput && isLengthValid) {
    memCh.innerText = "";
    animateToMemory(chLine, memCh, chValue);
  }

  if (current === 7) {
    calcLeft.style.display = "flex";
    calcRight.style.display = "flex";
    calcOp.style.display = "flex";
    calcEq.style.display = "flex";
    calcResult.style.display = "flex";
    if (branch === "len") {
      calcLeft.innerText = "length";
      calcOp.innerText = "!=";
      calcRight.innerText = "1";
      calcResult.innerText = "True";
    } else {
      calcLeft.innerText = `'A' <= ${chValue}`;
      calcOp.innerText = "&&";
      calcRight.innerText = `${chValue} <= 'F'`;
      calcResult.innerText = hasInput ? (isAF ? "True" : "False") : "";
    }
  }

  if (current === 8) {
    calcLeft.style.display = "flex";
    calcRight.style.display = "flex";
    calcOp.style.display = "flex";
    calcEq.style.display = "flex";
    calcResult.style.display = "flex";
    calcLeft.innerText = hasInput && isAF ? `${chValue} - A + 10` : "N/A";
    calcOp.innerText = "";
    calcRight.innerText = "";
    calcResult.innerText = hasInput && isAF ? computedValue : "";

    if (hasInput && isAF) {
      memValue.innerText = "";
      animateToMemory(valueLine, memValue, computedValue);
    }
  }

  updateOutput();

  backBtn.disabled = current <= -1;
  nextBtn.disabled =
    current >= steps.length - 1 ||
    (current === 4 && !hasInput) ||
    (branch === "len" && current >= 7);
}

conIn.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    userInput = conIn.value.trim();
    if (userInput.length === 0) return;
    hasInput = true;
    computeState();
    conIn.value = "";
    if (current === 4) {
      current = 5;
    }
    updateUI();
  }
});

nextBtn.addEventListener("click", () => {
  if (current < steps.length - 1) {
    current++;
    updateUI();
  }
});

backBtn.addEventListener("click", () => {
  if (current > -1) {
    current--;

    if (current < 4) {
      hasInput = false;
      userInput = "";
      chValue = "";
      computedValue = "";
      isLengthValid = false;
      isAF = false;
      isDigit = false;
    }

    updateUI();
  }
});

updateUI();
