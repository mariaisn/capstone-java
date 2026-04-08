const explanationBox = document.getElementById("memory-explanation");

// code spans
const lines = document.querySelectorAll("#high span");

// buttons
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory items
const itemArray = document.getElementById("item-array");
const itemIndex = document.getElementById("item-index");
const memArray = document.getElementById("mem-array");
const memIndex = document.getElementById("mem-index");

// array block/cells
const arrayBlock = document.getElementById("array-block");
const arrayCells = [
  document.getElementById("cell-0"),
  document.getElementById("cell-1"),
  document.getElementById("cell-2"),
  document.getElementById("cell-3"),
  document.getElementById("cell-4"),
];

// calc row
const calcRow = document.getElementById("calc-row");
const calcExpression = document.getElementById("calc-expression");
const calcResult = document.getElementById("calc-result");
const calcOp = document.getElementById("calc-op");

// output
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");

const ARRAY_VALUES = [1, 2, 3, 4, 5];
const LIMIT = 5;

// steps
const LAST_STEP = 21;
let current = -1;
let prevStep = -1;

const explanations = [
  "Declare numbers as an int array reference",
  "Create the array with values 1, 2, 3, 4, and 5, then assign its reference to numbers",
  "Declare loop variable index",
  "Assign 0 to index",
  "Check whether index is less than 5",
  'Print numbers[index] followed by a space',
  "Increment index to 1",
  "Check whether index is less than 5",
  'Print numbers[index] followed by a space',
  "Increment index to 2",
  "Check whether index is less than 5",
  'Print numbers[index] followed by a space',
  "Increment index to 3",
  "Check whether index is less than 5",
  'Print numbers[index] followed by a space',
  "Increment index to 4",
  "Check whether index is less than 5",
  'Print numbers[index] followed by a space',
  "Increment index to 5",
  "Check whether index is less than 5 and exit the loop when the condition is false",
  "Print a blank line using println()",
  "Print numbers.length, which is 5",
  "Done!",
];

function animateToMemory(sourceElement, targetElement, finalValue) {
  if (!sourceElement || !targetElement) {
    targetElement.innerText = finalValue;
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

function animateToOutput(sourceElement, targetElement, finalValue) {
  if (!sourceElement || !targetElement) {
    targetElement.textContent = finalValue;
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
    targetElement.textContent = finalValue;
    document.body.removeChild(flying);
  });
}

function clearHighlights() {
  lines.forEach((line) => line.classList.remove("highlight"));
}

function applyHighlight(step) {
  clearHighlights();

  // 0 int[] numbers
  // 1 = {1,2,3,4,5};
  // 2 for(int index=0;
  // 3 index<5;
  // 4 index++)
  // 5 {
  // 6 System.out.print(
  // 7 numbers[index] + " "
  // 8 );
  // 9 }
  // 10 System.out.println();
  // 11 System.out.println(
  // 12 numbers.length
  // 13 );

  if (step === 0 && lines[0]) lines[0].classList.add("highlight");
  if (step === 1 && lines[1]) lines[1].classList.add("highlight");

  if (step === 2 || step === 3) {
    if (lines[2]) lines[2].classList.add("highlight");
  }

  if ([4, 7, 10, 13, 16, 19].includes(step)) {
    if (lines[3]) lines[3].classList.add("highlight");
  }

  if ([5, 8, 11, 14, 17].includes(step)) {
    if (lines[6]) lines[6].classList.add("highlight");
    if (lines[7]) lines[7].classList.add("highlight");
    if (lines[8]) lines[8].classList.add("highlight");
  }

  if ([6, 9, 12, 15, 18].includes(step)) {
    if (lines[4]) lines[4].classList.add("highlight");
  }

  if (step === 20 && lines[10]) {
    lines[10].classList.add("highlight");
  }

  if (step === 21) {
    if (lines[11]) lines[11].classList.add("highlight");
    if (lines[12]) lines[12].classList.add("highlight");
    if (lines[13]) lines[13].classList.add("highlight");
  }
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

function clearCalcRow() {
  calcRow.style.display = "none";
  calcExpression.innerText = "";
  calcResult.innerText = "";
  calcOp.innerText = "";
}

function clearActiveCells() {
  arrayCells.forEach((cell) => cell.classList.remove("active-cell"));
}

function indexValueAtStep(step) {
  if (step < 3) return null;
  if (step < 6) return 0;
  if (step < 9) return 1;
  if (step < 12) return 2;
  if (step < 15) return 3;
  if (step < 18) return 4;
  return 5;
}

function printedCountAtStep(step) {
  let count = 0;
  if (step >= 5) count++;
  if (step >= 8) count++;
  if (step >= 11) count++;
  if (step >= 14) count++;
  if (step >= 17) count++;
  return count;
}

function renderPrintedOutput(step) {
  const count = printedCountAtStep(step);
  out1.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.id = `out-item-${i}`;
    span.textContent = `${ARRAY_VALUES[i]} `;
    out1.appendChild(span);
  }
}

function updateUI() {
  const goingForward = current > prevStep;

  applyHighlight(current);
  updateExplanation();
  clearCalcRow();
  clearActiveCells();

  itemArray.style.display = "none";
  itemIndex.style.display = "none";
  arrayBlock.style.display = "none";

  renderPrintedOutput(current);
  out2.innerText = current >= 20 ? " " : "";
  out3.innerText = current >= 21 ? "5" : "";

  if (current >= 0) {
    itemArray.style.display = "flex";
  }

  if (current >= 1) {
    arrayBlock.style.display = "flex";

    if (current === 1 && goingForward) {
      memArray.innerText = "";
      animateToMemory(document.getElementById("val-array"), memArray, "ref");
    } else {
      memArray.innerText = "ref";
    }
  } else {
    memArray.innerText = "";
  }

  if (current >= 2) {
    itemIndex.style.display = "flex";
  }

  const idx = indexValueAtStep(current);

  if (idx === null) {
    memIndex.innerText = "";
  } else {
    memIndex.innerText = String(idx);
  }

  if (current === 3 && goingForward) {
    memIndex.innerText = "";
    animateToMemory(document.getElementById("cond-five"), memIndex, "0");
  }

  // condition checks
  if ([4, 7, 10, 13, 16, 19].includes(current)) {
    calcRow.style.display = "flex";
    calcExpression.innerText = `${idx} < ${LIMIT}`;
    calcOp.innerText = "=";
    calcResult.innerText = idx < LIMIT ? "true" : "false";
  }

  // print current element
  if ([5, 8, 11, 14, 17].includes(current)) {
    const printIndex = idx;

    arrayCells[printIndex].classList.add("active-cell");

    if (goingForward) {
      renderPrintedOutput(current - 1);

      const newSpan = document.createElement("span");
      newSpan.id = `out-item-${printIndex}`;
      newSpan.textContent = "";
      out1.appendChild(newSpan);

      animateToOutput(arrayCells[printIndex], newSpan, `${ARRAY_VALUES[printIndex]} `);
    }
  }

  // increments
  if ([6, 9, 12, 15, 18].includes(current)) {
    const before =
      current === 6 ? 0 :
      current === 9 ? 1 :
      current === 12 ? 2 :
      current === 15 ? 3 : 4;

    const after = before + 1;

    calcRow.style.display = "flex";
    calcExpression.innerText = `${before} + 1`;
    calcOp.innerText = "=";
    calcResult.innerText = String(after);

    if (goingForward) {
      memIndex.innerText = String(before);
      animateToMemory(document.getElementById("inc-code"), memIndex, String(after));
    } else {
      memIndex.innerText = String(after);
    }
  }

  if (current === 20 && goingForward) {
    out2.innerText = " ";
  }

  if (current === 21 && goingForward) {
    out3.innerText = "";
    animateToMemory(document.getElementById("print-length"), out3, "5");
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= LAST_STEP;

  prevStep = current;
}

nextBtn.addEventListener("click", () => {
  if (current < LAST_STEP) {
    current++;
    updateUI();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    updateUI();
  }
});

updateUI();