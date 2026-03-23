const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memX = document.getElementById("mem-x");
const memGuess = document.getElementById("mem-guess");

const itemX = document.getElementById("item-x");
const itemGuess = document.getElementById("item-guess");

const numX = document.getElementById("mem-num-x");
const compOp = document.getElementById("comp-op");
const eqOp = document.getElementById("eq-op");
const valResult = document.getElementById("val-result");
const RESULT_POP_DELAY_MS = 850;

const out1 = document.getElementById("ou1");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");
const out5 = document.getElementById("ou5");
const outBox = document.getElementById("out-box");
const guessInput = document.getElementById("guess-input");
const memoryExplanation = document.getElementById("memory-explanation");

let current = -1;
let numberValue = Math.floor(Math.random() * 101);
let guessValue = null;
let wasSuccessOutputVisible = false;
const history = [];
const guessLog = [];
const guessHistory = document.getElementById("guess-history");

function animateGuessSquareToOutput() {
  if (!memGuess || !out4 || !Number.isFinite(guessValue)) return;

  const rectStart = memGuess.getBoundingClientRect();
  const rectEnd = out4.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = String(guessValue);

  document.body.appendChild(flying);

  flying.style.left = rectStart.left + rectStart.width / 2 + "px";
  flying.style.top = rectStart.top + rectStart.height / 2 + "px";

  requestAnimationFrame(() => {
    flying.style.left = rectEnd.left + rectEnd.width / 2 + "px";
    flying.style.top = rectEnd.top + rectEnd.height / 2 + "px";
  });

  flying.addEventListener("transitionend", () => {
    document.body.removeChild(flying);
  });
}

function updateMemoryExplanation() {
  if (!memoryExplanation) return;

  memoryExplanation.style.display = "flex";

  if (current < 0) {
    memoryExplanation.innerText = "Click Next to begin";
    return;
  }

  let message = "";

  if (current === 0) message = "Import Scanner";
  else if (current === 1) message = "Declare number";
  else if (current === 2) message = "Generate random number";
  else if (current === 3) message = "Create Scanner input";
  else if (current === 4) message = "Print prompt";
  else if (current === 5) message = "Start loop";
  else if (current === 6) message = "Print guess prompt";
  else if (current === 7) message = "Declare guess";
  else if (current === 8) message = "Read guess";
  else if (current === 9) message = "Check if guess equals number";
  else if (current === 10) message = "Print correct guess";
  else if (current === 11) message = "Break loop";
  else if (current === 12) message = "End if block";
  else if (current === 13) message = "Check if guess too high";
  else if (current === 14) message = "Print too high";
  else if (current === 15) message = "Else";
  else if (current === 16) message = "Print too low";
  else if (current === 17) message = "End loop";
  else if (current === 18) message = "End method";
  else message = "Done!";

  memoryExplanation.innerText = message;
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
  numX.style.display = "none";
  compOp.style.display = "none";
  eqOp.style.display = "none";
  valResult.style.display = "none";
  numX.innerText = "";
  eqOp.innerText = "";
  valResult.innerText = "";
}

function showCalculation(opText) {
  numX.style.display = "flex";
  compOp.style.display = "flex";
  eqOp.style.display = "flex";

  numX.innerText = String(numberValue);
  compOp.innerText = opText;
  eqOp.innerText = String(guessValue);
}

function isEqualGuess() {
  return Number.isFinite(guessValue) && guessValue === numberValue;
}

function isGreaterGuess() {
  return Number.isFinite(guessValue) && guessValue > numberValue;
}

function getHLine(step) {
  if (step < 0) return -1;
  // At the condition step, highlight only the branch that applies.
  if (step === 9) {
    if (isEqualGuess()) return 9;
    if (isGreaterGuess()) return 13;
    return 15;
  }
  return step;
}

function getNextStep(step) {
  if (step < 8) return step + 1;
  if (step === 8) return 9;

  // if (guess == number) — jump directly to the executed statement
  if (step === 9) return isEqualGuess() ? 10 : (isGreaterGuess() ? 14 : 16);

  // True branch: print success, break, then end method.
  if (step === 10) return 11;
  if (step === 11) return 18;

  // Too high / too low — loop back to input.nextInt() immediately.
  if (step === 14) return 8;
  if (step === 16) return 8;

  // End of loop goes back to next iteration prompt.
  if (step === 17) return 6;

  // End method stays terminal.
  if (step >= 18) return 18;
}

function updateHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));

  const hLine = getHLine(current);
  if (lines[hLine]) lines[hLine].classList.add("highlight");

  itemX.style.display = current >= 1 ? "flex" : "none";
  itemGuess.style.display = current >= 7 ? "flex" : "none";

  out3.innerText = "";

  if (current >= 4) {
    out1.innerText = "Guess a magic number between 0 and 100";
  } else {
    out1.innerText = "";
  }

  if (current >= 6) {
    out3.innerText = "Enter your guess: ";
  } else {
    out3.innerText = "";
  }

  if (guessInput) {
    guessInput.style.visibility =
      current === 8 && !Number.isFinite(guessValue) ? "visible" : "hidden";
  }

  if (current >= 6 && Number.isFinite(guessValue)) {
    out4.innerText = String(guessValue);
  } else {
    out4.innerText = "";
  }

  // Show result message in output
  if ((current >= 10 && current <= 11) || (current === 18 && isEqualGuess())) {
    out5.innerText = "Yes, the number is " + numberValue;
  } else if (current === 14) {
    out5.innerText = "Your guess is too high";
  } else if (current === 16) {
    out5.innerText = "Your guess is too low";
  } else {
    out5.innerText = "";
  }

  const successVisible = current >= 10 && current <= 11 && isEqualGuess();
  if (successVisible && !wasSuccessOutputVisible) {
    animateGuessSquareToOutput();
  }
  wasSuccessOutputVisible = successVisible;

  // Render accumulated past iterations
  if (guessHistory) {
    guessHistory.innerHTML = guessLog
      .map((e) => `<div>${e.guess}</div><div>${e.result}</div>`)
      .join("");
  }

  if (outBox) outBox.scrollTop = outBox.scrollHeight;

  if (current < 2) {
    memX.innerText = "";
  }

  if (current < 7) {
    memGuess.innerText = "";
    guessValue = null;
    if (guessInput) {
      guessInput.value = "";
    }
  }

  clearCalcRow();

  if (Number.isFinite(guessValue)) {
    if (current === 9) {
      if (isEqualGuess()) showCalculation("==");
      else if (isGreaterGuess()) showCalculation(">");
      else showCalculation("<");
    } else if (current === 10 || current === 11) {
      showCalculation("==");
    } else if (current === 14) {
      showCalculation(">");
    } else if (current === 16) {
      showCalculation("<");
    }
  }

  if (current === 2 && memX.innerText === "") {
    animateToMemory(lines[2], memX, String(numberValue));
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = (current === 8 && !Number.isFinite(guessValue)) || current === 18;

  updateMemoryExplanation();
}

function commitGuessFromInput() {
  if (!guessInput || current !== 8) return;

  const raw = guessInput.value.trim();
  const parsed = Number(raw);
  if (raw === "" || !Number.isFinite(parsed)) {
    guessValue = null;
    memGuess.innerText = "";
    updateHighlight();
    return;
  }

  const changed = !Number.isFinite(guessValue) || guessValue !== parsed;
  guessValue = parsed;

  if (changed) {
    memGuess.innerText = "";
    animateToMemory(guessInput, memGuess, String(guessValue));
  }

  updateHighlight();
}

if (guessInput) {
  guessInput.addEventListener("input", () => {
    guessValue = null;
    memGuess.innerText = "";
    out4.innerText = "";
    updateHighlight();
  });

  guessInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      commitGuessFromInput();
    }
  });
}

nextBtn.addEventListener("click", () => {
  // Commit the current iteration to the log before looping back.
  if ((current === 14 || current === 16) && Number.isFinite(guessValue)) {
    const result = current === 14 ? "Your guess is too high" : "Your guess is too low";
    guessLog.push({ guess: guessValue, result });
    // Reset guess state for the next iteration.
    guessValue = null;
    memGuess.innerText = "";
    if (guessInput) guessInput.value = "";
  }
  history.push(current);
  current = getNextStep(current);
  updateHighlight();
});

backBtn.addEventListener("click", () => {
  if (history.length === 0) return;
  // Undo a committed loop iteration when stepping back over the boundary.
  const prev = history[history.length - 1];
  if (current === 8 && (prev === 14 || prev === 16) && guessLog.length > 0) {
    const entry = guessLog.pop();
    guessValue = entry.guess;
    memGuess.innerText = String(guessValue);
  }
  current = history.pop();

  updateHighlight();
});

updateHighlight();
