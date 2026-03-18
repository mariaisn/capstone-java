// select all spans
const lines = document.querySelectorAll("#high span");

// buttons
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory square
const memJ = document.getElementById("mem-j");

// calc row
const numJ = document.getElementById("mem-num-j");
const numLimit = document.getElementById("mem-num-limit");
const compOp = document.getElementById("comp-op");
const eqOp = document.getElementById("eq-op");
const valResult = document.getElementById("val-result");

// output
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");

// memory items
const memItems = document.querySelectorAll(".mem-item");

// constants for this example
const J_START = 0;
const LIMIT = 3;

// steps
// 0..15
let current = -1;
let prevStep = -1;
const steps = 16;

// animation
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
  if (step === 0) return 0;

  if (
    step === 1 ||
    step === 2 ||
    step === 5 ||
    step === 6 ||
    step === 9 ||
    step === 10 ||
    step === 13 ||
    step === 14
  ) {
    return 2;
  }

  if (step === 3 || step === 7 || step === 11) return 5;
  if (step === 4 || step === 8 || step === 12) return 8;
  if (step === 15) return 9;

  return -1;
}

function isCompareOnlyStep(step) {
  return step === 1 || step === 5 || step === 9 || step === 13;
}

function isResultStep(step) {
  return step === 2 || step === 6 || step === 10 || step === 14;
}

function isPrintStep(step) {
  return step === 3 || step === 7 || step === 11;
}

function isIncStep(step) {
  return step === 4 || step === 8 || step === 12;
}

function jValueAt(step) {
  if (step < 0) return null;
  if (step >= 12) return 3;
  if (step >= 8) return 2;
  if (step >= 4) return 1;
  return 0;
}

function clearCalcRow() {
  numJ.innerText = "";
  numLimit.innerText = "";
  compOp.innerText = "";
  valResult.innerText = "";

  numJ.style.display = "none";
  numLimit.style.display = "none";
  compOp.style.display = "none";
  eqOp.style.display = "none";
  valResult.style.display = "none";
}

function showComparison(jVal, showEqAndResult) {
  numJ.style.display = "flex";
  numLimit.style.display = "flex";
  compOp.style.display = "flex";

  numJ.innerText = String(jVal);
  numLimit.innerText = String(LIMIT);
  compOp.innerText = "<";

  if (showEqAndResult) {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = jVal < LIMIT ? "true" : "false";
  } else {
    eqOp.style.display = "none";
    valResult.style.display = "none";
  }
}

function updateHighlight() {
  const goingForward = current > prevStep;

  // highlight
  lines.forEach((line) => line.classList.remove("highlight"));
  const hLine = getHLine(current);
  if (lines[hLine]) lines[hLine].classList.add("highlight");

  // int j line uses spans 0 and 1
  if (hLine === 0 && lines[1]) {
    lines[1].classList.add("highlight");
  }

  // while line uses spans 2, 3, 4
  if (hLine === 2) {
    if (lines[3]) lines[3].classList.add("highlight");
    if (lines[4]) lines[4].classList.add("highlight");
  }

  // print line uses spans 5, 6, 7
  if (hLine === 5) {
    if (lines[6]) lines[6].classList.add("highlight");
    if (lines[7]) lines[7].classList.add("highlight");
  }

  // show/hide memory visuals
  memItems.forEach((item) => (item.style.display = "none"));
  if (current >= 0) memItems[0].style.display = "flex";

  // output deterministic
  out1.innerText = current >= 3 ? "World" : "";
  out2.innerText = current >= 7 ? "World" : "";
  out3.innerText = current >= 11 ? "World" : "";
  out4.innerText = "";

  const jVal = jValueAt(current);

  clearCalcRow();

  if (jVal === null) {
    memJ.innerText = "";
  } else {
    memJ.innerText = String(jVal);
  }

  // first step: create square + highlight + move 0 into memory together
  if (current === 0) {
    if (goingForward) {
      memJ.innerText = "";
      animateToMemory(document.getElementById("val-j"), memJ, String(J_START));
    } else {
      memJ.innerText = String(J_START);
    }
  }

  if (isCompareOnlyStep(current) && jVal !== null) {
    showComparison(jVal, false);

    if (goingForward) {
      animateToMemory(memJ, numJ, String(jVal));
      animateToMemory(document.getElementById("lit-3"), numLimit, String(LIMIT));
    }
  }

  if (isResultStep(current) && jVal !== null) {
    showComparison(jVal, true);
  }

  if (isPrintStep(current) && goingForward) {
    const src = document.getElementById("lit-world");

    if (current === 3) {
      out1.innerText = "";
      animateToMemory(src, out1, "World");
    }
    if (current === 7) {
      out2.innerText = "";
      animateToMemory(src, out2, "World");
    }
    if (current === 11) {
      out3.innerText = "";
      animateToMemory(src, out3, "World");
    }
  }

  if (isIncStep(current)) {
    let jBefore = 0;
    if (current === 8) jBefore = 1;
    if (current === 12) jBefore = 2;

    const jAfter = jBefore + 1;

    if (goingForward) {
      memJ.innerText = String(jBefore);
      animateToMemory(document.getElementById("inc"), memJ, String(jAfter));
    } else {
      memJ.innerText = String(jAfter);
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