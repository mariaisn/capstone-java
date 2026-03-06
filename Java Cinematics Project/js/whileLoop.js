// select all spans
const lines = document.querySelectorAll("#high span");

// buttons
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory squares
const memJ = document.getElementById("mem-j");
const memCond = document.getElementById("mem-cond");

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
// 0..21
const steps = 22;
let current = -1;
let prevStep = -1; // track direction

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

  const ranges = [
    [3, 5, 2],
    [8, 10, 2],
    [13, 15, 2],
    [18, 20, 2],
  ];

  // if inside an operation window, freeze highlight
  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

  // keep the print line highlighted for the fly-to-output step
  if (step === 6 || step === 11 || step === 16) return 5;

  // keep the increment line highlighted during the j++ step
  if (step === 7 || step === 12 || step === 17) return 8;

  // highlight the closing brace at the end
  if (step >= 21) return 9;

  // otherwise
  return 0;
}

// helper
function isWhileWindowStep(step) {
  return (
    (step >= 3 && step <= 5) ||
    (step >= 8 && step <= 10) ||
    (step >= 13 && step <= 15) ||
    (step >= 18 && step <= 20)
  );
}

function isCompareOnlyStep(step) {
  return step === 3 || step === 8 || step === 13 || step === 18;
}

function isResultStep(step) {
  return step === 4 || step === 9 || step === 14 || step === 19;
}

function isStoreStep(step) {
  return step === 5 || step === 10 || step === 15 || step === 20;
}

function isIncStep(step) {
  return step === 7 || step === 12 || step === 17;
}

function isPrintStep(step) {
  return step === 6 || step === 11 || step === 16;
}

// compute j value at any step (deterministic)
function jValueAt(step) {
  // j exists after step 2
  if (step < 2) return null;

  // after executing increments:
  // inc at 7 => j becomes 1
  // inc at 12 => j becomes 2
  // inc at 17 => j becomes 3
  if (step >= 17) return 3;
  if (step >= 12) return 2;
  if (step >= 7) return 1;
  return 0;
}

// compute cond value at any step (deterministic)
function condValueAt(step) {
  // cond appears after first store (step 5)
  if (step < 5) return null;

  // final store (20) sets false
  if (step >= 20) return "false";
  return "true";
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
    valResult.innerText = "";
  }
}

function updateHighlight() {
  const goingForward = current > prevStep;

  // highlight
  lines.forEach((line) => line.classList.remove("highlight"));
  const hLine = getHLine(current);
  if (lines[hLine]) lines[hLine].classList.add("highlight");

  // add extra spans for multi-span “lines”
  // int j line uses spans 0 and 1
  if (hLine === 0) {
    if (lines[1]) lines[1].classList.add("highlight");
  }

  // while line uses spans 2,3,4
  if (hLine === 2) {
    if (lines[3]) lines[3].classList.add("highlight");
    if (lines[4]) lines[4].classList.add("highlight");
  }

  // print line uses spans 5,6,7
  if (hLine === 5) {
    if (lines[6]) lines[6].classList.add("highlight");
    if (lines[7]) lines[7].classList.add("highlight");
  }

  // show/hide memory visuals
  memItems.forEach((item) => (item.style.display = "none"));
  if (current >= 1) memItems[0].style.display = "flex"; // j box shown after start
  if (current >= 5) memItems[1].style.display = "flex"; // cond box after first store

  // output deterministic
  if (current >= 6) out1.innerText = "World";
  else out1.innerText = "";

  if (current >= 11) out2.innerText = "World";
  else out2.innerText = "";

  if (current >= 16) out3.innerText = "World";
  else out3.innerText = "";

  out4.innerText = "";

  // base values
  const jVal = jValueAt(current);
  const condVal = condValueAt(current);

  // reset calc row every time, then rebuild for this step
  clearCalcRow();

  // render memory values deterministically
  if (jVal === null) {
    memJ.innerText = "";
  } else {
    // default set
    memJ.innerText = String(jVal);
  }

  if (condVal === null) {
    memCond.innerText = "";
  } else {
    memCond.innerText = condVal;
  }

  // step 2: animate initial assignment
  if (current === 2) {
    if (goingForward) {
      memJ.innerText = "";
      animateToMemory(document.getElementById("val-j"), memJ, String(J_START));
    } else {
      memJ.innerText = String(J_START);
    }
  }

  // increment steps: animate j++ into memory (only forward)
  if (isIncStep(current)) {
    // jBefore is the value *before* this increment executes
    let jBefore = 0;
    if (current === 12) jBefore = 1;
    if (current === 17) jBefore = 2;

    const jAfter = jBefore + 1;

    if (goingForward) {
      // show previous first, then animate new value from code "j++;"
      memJ.innerText = String(jBefore);
      animateToMemory(document.getElementById("inc"), memJ, String(jAfter));
    } else {
      // going backward into this step: show what this step represents (after increment)
      memJ.innerText = String(jAfter);
    }
  }

  // while windows: deterministic visuals per step
  if (isWhileWindowStep(current) && jVal !== null) {
    // compare-only step: show j < 3
    if (isCompareOnlyStep(current)) {
      showComparison(jVal, false);

      if (goingForward) {
        // ensure they show immediately, then animate to same place (harmless)
        // (no need to clear; avoids flicker)
        animateToMemory(memJ, numJ, String(jVal));
        animateToMemory(
          document.getElementById("lit-3"),
          numLimit,
          String(LIMIT),
        );
      }
    }

    // sesult step: show j < 3 = true/false
    if (isResultStep(current)) {
      showComparison(jVal, true);
    }

    // store step: keep showing j < 3 = result
    // and animate result into cond when moving forward.
    if (isStoreStep(current)) {
      showComparison(jVal, true);

      if (goingForward) {
        const resultText = jVal < LIMIT ? "true" : "false";
        // force correct text before animating
        valResult.innerText = resultText;

        // animate to cond
        animateToMemory(valResult, memCond, resultText);
      } else {
        // going backward into store step
        memCond.innerText = jVal < LIMIT ? "true" : "false";
      }
    }
  }

  // print steps: animate "World" into output
  if (isPrintStep(current) && goingForward) {
    const src = document.getElementById("lit-world");
    if (current === 6) {
      out1.innerText = "";
      animateToMemory(src, out1, "World");
    }
    if (current === 11) {
      out2.innerText = "";
      animateToMemory(src, out2, "World");
    }
    if (current === 16) {
      out3.innerText = "";
      animateToMemory(src, out3, "World");
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