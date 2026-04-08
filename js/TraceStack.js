// Step-by-step highlight, memory, and animation walkthrough for the max(i, j) call stack trace.

// --- DOM References ---
// All <span> elements inside the code block used for highlighting.
const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// Explanation text shown below the memory squares.
const memoryExplanation = document.getElementById("memory-explanation");

// Wrapper elements for each memory variable (controls show/hide).
const itemI = document.getElementById("item-i");
const itemJ = document.getElementById("item-j");
const itemK = document.getElementById("item-k");
const itemNum1 = document.getElementById("item-num1");
const itemNum2 = document.getElementById("item-num2");
const itemResult = document.getElementById("item-result");

// Inner value squares for each memory variable.
const memI = document.getElementById("mem-i");
const memJ = document.getElementById("mem-j");
const memK = document.getElementById("mem-k");
const memNum1 = document.getElementById("mem-num1");
const memNum2 = document.getElementById("mem-num2");
const memResult = document.getElementById("mem-result");

// Calculation row elements (shown only when evaluating num1 > num2).
const calcLeft = document.getElementById("calc-left");
const calcOp = document.getElementById("calc-op");
const calcRight = document.getElementById("calc-right");
const calcEq = document.getElementById("calc-eq");
const calcResult = document.getElementById("calc-result");

// Output panel cells.
const outputs = [
  document.getElementById("ou1"),
  document.getElementById("ou2"),
  document.getElementById("ou3"),
  document.getElementById("ou4"),
  document.getElementById("ou5"),
  document.getElementById("ou6"),
];

// --- Step Messages ---
// One message per step; displayed in the memory-explanation panel.
const stepMessages = [
  "Declare i",               // step 0
  "Assign 5 to i",           // step 1
  "Declare j",               // step 2
  "Assign 2 to j",           // step 3
  "Declare k",               // step 4
  "Call max(i, j)",          // step 5
  "Enter max method",        // step 6
  "Declare result",          // step 7
  "Check condition num1 > num2", // step 8
  "Return result",           // step 9
  "Store result in k",       // step 10
  "Print to output", // step 11
];

// --- Span Index Lookup ---
// Each variable holds the index of the matching <span> in the code block.
// Text-based lookup keeps the mapping resilient to whitespace changes.
const iDeclarationIndex = Array.from(lines).findIndex((line) =>
  line.textContent.includes("int i")
);

const iValueIndex = Array.from(lines).findIndex((line) =>
  line.textContent.trim() === "5"
);

const jDeclarationIndex = Array.from(lines).findIndex((line) =>
  line.textContent.includes("int j")
);

const jValueIndex = Array.from(lines).findIndex((line) =>
  line.textContent.trim() === "2"
);

const kDeclarationIndex = Array.from(lines).findIndex((line) =>
  line.textContent.includes("int k")
);

const callMaxIndex = Array.from(lines).findIndex((line) =>
  line.textContent.includes("max(i, j)")
);

const methodSignatureIndex = Array.from(lines).findIndex((line) =>
  line.textContent.includes("public static int max")
);

const resultDeclarationIndex = Array.from(lines).findIndex((line) =>
  line.textContent.includes("int result")
);

const conditionIndex = Array.from(lines).findIndex((line) =>
  line.textContent.includes("if (num1 > num2)")
);

const resultAssignNum1Index = Array.from(lines).findIndex((line) =>
  line.textContent.includes("result = num1")
);

const returnIndex = Array.from(lines).findIndex((line) =>
  line.textContent.includes("return result")
);

const printIndex = Array.from(lines).findIndex((line) =>
  line.textContent.includes("System.out.println")
);

// Maps each step number to the span index that should be highlighted.
// Fallback values are used if a span is not found in the DOM.
const lineByStep = [
  iDeclarationIndex >= 0 ? iDeclarationIndex : 1,       // step 0 → int i
  iValueIndex >= 0 ? iValueIndex : 2,                   // step 1 → 5
  jDeclarationIndex >= 0 ? jDeclarationIndex : 3,       // step 2 → int j
  jValueIndex >= 0 ? jValueIndex : 4,                   // step 3 → 2
  kDeclarationIndex >= 0 ? kDeclarationIndex : 5,       // step 4 → int k
  callMaxIndex >= 0 ? callMaxIndex : 6,                 // step 5 → max(i, j)
  methodSignatureIndex >= 0 ? methodSignatureIndex : 6, // step 6 → public static int max
  resultDeclarationIndex >= 0 ? resultDeclarationIndex : 7, // step 7 → int result
  conditionIndex >= 0 ? conditionIndex : 8,             // step 8 → if (num1 > num2)
  resultAssignNum1Index >= 0 ? resultAssignNum1Index : 9, // step 9  → result = num1
  kDeclarationIndex >= 0 ? kDeclarationIndex : 5,       // step 10 → int k = max(i, j)
  printIndex >= 0 ? printIndex : 5,                     // step 11 → System.out.println
];

// Total number of forward steps (0-based index of the last step).
const maxStep = stepMessages.length - 1;

// current: active step index; -1 means the page has not started yet.
// previousStep: used to detect navigation direction (forward vs. back).
// calcResultTimeout: handle for the delayed "true" reveal in the calc row.
let current = -1;
let previousStep = -1;
let calcResultTimeout = null;

// --- Animation Helpers ---

// Flies a value label from sourceElement to targetElement, then sets the text.
function animateToMemory(sourceElement, targetElement, finalValue) {
  // If either element is missing, fall back to a direct text assignment.
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

// Flies a value label from a memory square toward the output panel (visual only).
// The actual output text is set separately with a setTimeout after the animation.
function animateNumberToOutput(sourceElement, valueText) {
  if (!sourceElement) return;

  const outputTarget = outputs[0];
  if (!outputTarget) return;

  const rectStart = sourceElement.getBoundingClientRect();
  const rectEnd = outputTarget.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = valueText;
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

// Toggles visibility of an element using inline display style.
function setDisplay(element, show, displayType = "flex") {
  if (!element) return;
  element.style.display = show ? displayType : "none";
}

// --- State Reset ---
// Clears all highlights, memory values, calc row, and output back to the initial state.
function resetInitialState() {
  lines.forEach((line) => line.classList.remove("highlight"));

  setDisplay(itemI, false);
  setDisplay(itemJ, false);
  setDisplay(itemK, false);
  setDisplay(itemNum1, false);
  setDisplay(itemNum2, false);
  setDisplay(itemResult, false);
  setDisplay(memoryExplanation, false);

  setDisplay(calcLeft, false);
  setDisplay(calcOp, false);
  setDisplay(calcRight, false);
  setDisplay(calcEq, false);
  setDisplay(calcResult, false);

  if (memI) memI.innerText = "";
  if (memJ) memJ.innerText = "";
  if (memK) memK.innerText = "";
  if (memNum1) memNum1.innerText = "";
  if (memNum2) memNum2.innerText = "";
  if (memResult) memResult.innerText = "";
  if (calcLeft) calcLeft.innerText = "";
  if (calcOp) calcOp.innerText = "";
  if (calcRight) calcRight.innerText = "";
  if (calcEq) calcEq.innerText = "";
  if (calcResult) calcResult.innerText = "";

  outputs.forEach((out) => {
    if (!out) return;
    out.innerText = "";
    setDisplay(out, false, "block");
  });
}

// --- Main UI Update ---
// Called after every Next/Back click. Reads `current` and redraws the entire UI.
function updateUI() {
  // Determine navigation direction so animations only play when stepping forward.
  const isForward = current > previousStep;

  // Always cancel any pending "true" reveal when the step changes.
  if (calcResultTimeout) {
    clearTimeout(calcResultTimeout);
    calcResultTimeout = null;
  }

  // Remove all highlights before applying the current step's highlight.
  lines.forEach((line) => line.classList.remove("highlight"));

  // Before step 0: reset everything and disable Back.
  if (current < 0) {
    resetInitialState();
    backBtn.disabled = true;
    nextBtn.disabled = false;
    return;
  }

  let highlightIndex = lineByStep[current] ?? -1;

  // Span 0 is "public static void main" — skip it to avoid highlighting that line.
  if (highlightIndex === 0) {
    highlightIndex = 1;
  }

  if (lines[highlightIndex]) {
    lines[highlightIndex].classList.add("highlight");
  }

  // Step 10: also highlight max(i, j) and return result alongside int k.
  if (current === 10) {
    if (callMaxIndex >= 0 && lines[callMaxIndex]) lines[callMaxIndex].classList.add("highlight");
    if (returnIndex >= 0 && lines[returnIndex]) lines[returnIndex].classList.add("highlight");
  }

  setDisplay(memoryExplanation, true);
  memoryExplanation.innerText = stepMessages[current] || "Done!";

  // Show each memory square once its variable is declared.
  setDisplay(itemI,      current >= 0);  // i declared at step 0
  setDisplay(itemJ,      current >= 2);  // j declared at step 2
  setDisplay(itemK,      current >= 4);  // k declared at step 4
  setDisplay(itemNum1,   current >= 6);  // num1 passed in at step 6
  setDisplay(itemNum2,   current >= 6);  // num2 passed in at step 6
  setDisplay(itemResult, current >= 7);  // result declared at step 7

  // --- Memory Value Updates ---
  // Each block: clear the square before its step, animate only on the exact forward step,
  // and set the value directly when navigating backward or revisiting a later step.

  // i gets value 5 at step 1, animated from the "5" span in the code.
  if (memI) {
    if (current < 1) memI.innerText = "";
    else if (current === 1 && isForward && memI.innerText === "")
      animateToMemory(lines[iValueIndex], memI, "5");
    else memI.innerText = "5";
  }

  // j gets value 2 at step 3, animated from the "2" span in the code.
  if (memJ) {
    if (current < 3) memJ.innerText = "";
    else if (current === 3 && isForward && memJ.innerText === "")
      animateToMemory(lines[jValueIndex], memJ, "2");
    else memJ.innerText = "2";
  }

  // num1 receives i's value (5) at step 6 when max() is entered.
  if (memNum1) {
    if (current < 6) memNum1.innerText = "";
    else if (current === 6 && isForward && memNum1.innerText === "")
      animateToMemory(memI, memNum1, "5");
    else memNum1.innerText = "5";
  }

  // num2 receives j's value (2) at step 6 when max() is entered.
  if (memNum2) {
    if (current < 6) memNum2.innerText = "";
    else if (current === 6 && isForward && memNum2.innerText === "")
      animateToMemory(memJ, memNum2, "2");
    else memNum2.innerText = "2";
  }

  // result is assigned num1's value (5) at step 9 (result = num1 branch taken).
  if (memResult) {
    if (current < 9) memResult.innerText = "";
    else if (current === 9 && isForward && memResult.innerText === "")
      animateToMemory(memNum1, memResult, "5");
    else memResult.innerText = "5";
  }

  // k receives result's value (5) at step 10 when max() returns.
  if (memK) {
    if (current < 10) memK.innerText = "";
    else if (current === 10 && isForward && memK.innerText === "")
      animateToMemory(memResult, memK, "5");
    else memK.innerText = "5";
  }

  // --- Calculation Row (step 8 only) ---
  // Show the "5 > 2 = true" row only when the if-condition is being evaluated.
  if (current === 8) {
    if (calcLeft) setDisplay(calcLeft, true);
    if (calcOp) {
      calcOp.innerText = ">";
      setDisplay(calcOp, true, "block");
    }
    if (calcRight) setDisplay(calcRight, true);
    if (calcEq) {
      calcEq.innerText = "=";
      setDisplay(calcEq, true, "block");
    }
    if (calcResult) setDisplay(calcResult, true);

    if (isForward) {
      // Animate 5 and 2 flying from the memory squares into the calc row.
      if (calcLeft) calcLeft.innerText = "";
      if (calcRight) calcRight.innerText = "";
      if (calcResult) calcResult.innerText = "";
      animateToMemory(memNum1, calcLeft, "5");
      animateToMemory(memNum2, calcRight, "2");

      // Delay showing "true" until after the flying animations finish (~820ms).
      calcResultTimeout = setTimeout(() => {
        if (current === 8 && calcResult) {
          calcResult.innerText = "true";
        }
      }, 820);
    } else {
      // Navigating backward: populate the row immediately without animation.
      if (calcLeft) calcLeft.innerText = "5";
      if (calcRight) calcRight.innerText = "2";
      if (calcResult) calcResult.innerText = "true";
    }
  } else {
    // Any step other than 8: hide and clear the entire calculation row.
    if (calcLeft) {
      calcLeft.innerText = "";
      setDisplay(calcLeft, false);
    }
    if (calcOp) {
      calcOp.innerText = "";
      setDisplay(calcOp, false, "block");
    }
    if (calcRight) {
      calcRight.innerText = "";
      setDisplay(calcRight, false);
    }
    if (calcEq) {
      calcEq.innerText = "";
      setDisplay(calcEq, false, "block");
    }
    if (calcResult) {
      calcResult.innerText = "";
      setDisplay(calcResult, false);
    }
  }

  // --- Output Panel (step 11) ---
  // Only the first output cell is used; remaining cells stay hidden.
  outputs.forEach((out, index) => {
    if (!out) return;
    if (index === 0 && current >= 11) {
      setDisplay(out, true, "block");

      if (current === 11 && isForward) {
        // Fly values from the i, j, and k squares toward the output area,
        // then reveal the full output string after the animations land.
        out.innerText = "";
        animateNumberToOutput(memI, "5");
        animateNumberToOutput(memJ, "2");
        animateNumberToOutput(memK, "5");

        setTimeout(() => {
          out.innerText = "The maximum between 5 and 2 is 5";
        }, 850);
      } else {
        // Navigating backward to step 11: show text immediately.
        out.innerText = "The maximum between 5 and 2 is 5";
      }
    } else {
      out.innerText = "";
      setDisplay(out, false, "block");
    }
  });

  // Update button states and record the step we just rendered.
  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= maxStep;
  previousStep = current;
}

// --- Button Event Listeners ---
nextBtn.addEventListener("click", () => {
  if (current < maxStep) {
    current++;
    updateUI();
  }
});

backBtn.addEventListener("click", () => {
  if (current > -1) {
    current--;
    updateUI();
  }
});

// Render the initial state (no highlights, no memory values) on page load.
updateUI();