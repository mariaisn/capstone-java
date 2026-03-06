// Select all code spans for highlighting
const lines = document.querySelectorAll("#high span");
const memItems = document.querySelectorAll(".mem-item");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memI = document.getElementById("mem-i");
const memCond = document.getElementById("mem-cond");

const numI = document.getElementById("mem-num-i");
const numLimit = document.getElementById("mem-num-limit");
const compOp = document.getElementById("comp-op");
const valResult = document.getElementById("val-result");

const outputs = document.querySelectorAll(".out-box > div");

const LIMIT = 3;
const steps = 22;
let current = -1;
let prevStep = -1;

// Animation function
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
  // Highlight logic for for loop steps
  const ranges = [
    [3, 5, 2],
    [8, 10, 2],
    [13, 15, 2],
    [18, 20, 2],
  ];
  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }
  if (step === 6 || step === 11 || step === 16) return 5;
  if (step === 7 || step === 12 || step === 17) return 8;
  if (step >= 21) return 9;
  return 0;
}

function iValueAt(step) {
  if (step < 1) return null;
  if (step >= 17) return 3;
  if (step >= 12) return 2;
  if (step >= 7) return 1;
  return 0;
}

function condValueAt(step) {
  if (step < 5) return null;
  if (step >= 20) return "false";
  return "true";
}

function clearCalcRow() {
  numI.innerText = "";
  numLimit.innerText = "";
  compOp.innerText = "";
  valResult.innerText = "";

  numI.style.display = "none";
  numLimit.style.display = "none";
  compOp.style.display = "none";
  valResult.style.display = "none";
}

function showComparison(iVal, showResult) {
  numI.style.display = "flex";
  numLimit.style.display = "flex";
  compOp.style.display = "flex";
  numI.innerText = String(iVal);
  numLimit.innerText = String(LIMIT);
  compOp.innerText = "<";
  if (showResult) {
    valResult.style.display = "flex";
    valResult.innerText = iVal < LIMIT ? "true" : "false";
  } else {
    valResult.style.display = "none";
    valResult.innerText = "";
  }
}

function updateHighlight() {
  const goingForward = current > prevStep;

  // Highlight code
  lines.forEach((line) => line.classList.remove("highlight"));
  const hLine = getHLine(current);
  if (lines[hLine]) lines[hLine].classList.add("highlight");

  // Show/hide memory visuals
  memItems.forEach((item) => (item.style.display = "none"));
  if (current >= 1) memItems[0].style.display = "flex"; // i box
  if (current >= 5) memItems[1].style.display = "flex"; // cond box

  // Output
  outputs.forEach((o) => (o.innerText = ""));
  if (current >= 6) outputs[0].innerText = "Hello";
  if (current >= 11) outputs[1].innerText = "Hello";
  if (current >= 16) outputs[2].innerText = "Hello";

  // Hide the = symbol until step 3
  var eqSymbol = document.querySelector(".memOut.cent:nth-child(4)");
  if (eqSymbol) {
    eqSymbol.style.display = current >= 3 ? "flex" : "none";
  }

  // Base values
  const iVal = iValueAt(current);
  const condVal = condValueAt(current);

  // Reset calc row
  clearCalcRow();

  // Render memory values
  memI.innerText = iVal === null ? "" : iVal;
  memCond.innerText = condVal === null ? "" : condVal;

  // Animate initial assignment
  if (current === 2) {
    if (goingForward) {
      memI.innerText = "";
      animateToMemory(document.getElementById("val-i"), memI, "0");
    } else {
      memI.innerText = "0";
    }
  }

  // Animate i++
  if ([7, 12, 17].includes(current)) {
    let iBefore = 0;
    if (current === 12) iBefore = 1;
    if (current === 17) iBefore = 2;
    const iAfter = iBefore + 1;
    if (goingForward) {
      memI.innerText = String(iBefore);
      animateToMemory(document.getElementById("val-i"), memI, String(iAfter));
    } else {
      memI.innerText = String(iAfter);
    }
  }

  // Comparison window
  if ([3, 8, 13, 18].includes(current) && iVal !== null) {
    showComparison(iVal, false);
    if (goingForward) {
      animateToMemory(memI, numI, String(iVal));
      animateToMemory(
        document.getElementById("lit-3"),
        numLimit,
        String(LIMIT),
      );
    }
  }
  // Result step
  if ([4, 9, 14, 19].includes(current) && iVal !== null) {
    showComparison(iVal, true);
  }
  // Store step: animate result into cond
  if ([5, 10, 15, 20].includes(current) && iVal !== null) {
    showComparison(iVal, true);
    if (goingForward) {
      const resultText = iVal < LIMIT ? "true" : "false";
      valResult.innerText = resultText;
      animateToMemory(valResult, memCond, resultText);
    } else {
      memCond.innerText = iVal < LIMIT ? "true" : "false";
    }
  }

  // Print steps: animate "Hello" into output
  if ([6, 11, 16].includes(current) && goingForward) {
    const src = document.getElementById("lit-hello");
    if (current === 6) {
      outputs[0].innerText = "";
      animateToMemory(src, outputs[0], "Hello");
    }
    if (current === 11) {
      outputs[1].innerText = "";
      animateToMemory(src, outputs[1], "Hello");
    }
    if (current === 16) {
      outputs[2].innerText = "";
      animateToMemory(src, outputs[2], "Hello");
    }
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1;
  prevStep = current;
}

nextBtn.addEventListener("click", () => {
  if (current < steps - 1) {
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