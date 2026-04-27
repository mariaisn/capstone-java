// Night mode toggle
const toggle = document.getElementById("toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("night-mode");
  });
}

const explanationBox = document.getElementById("memory-explanation");

// code spans
const lines = document.querySelectorAll("#high span");

// buttons
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory items
const itemArray = document.getElementById("item-array");
const itemTarget = document.getElementById("item-target");
const itemIndex = document.getElementById("item-index");
const memArray = document.getElementById("mem-array");
const memTarget = document.getElementById("mem-target");
const memIndex = document.getElementById("mem-index");

// array block/cells
const arrayBlock = document.getElementById("array-block");
const arrayCells = [
  document.getElementById("cell-0"),
  document.getElementById("cell-1"),
  document.getElementById("cell-2"),
  document.getElementById("cell-3"),
  document.getElementById("cell-4"),
  document.getElementById("cell-5"),
  document.getElementById("cell-6"),
  document.getElementById("cell-7"),
];

// calc row
const calcRow = document.getElementById("calc-row");
const calcExpression = document.getElementById("calc-expression");
const calcResult = document.getElementById("calc-result");
const calcOp = document.getElementById("calc-op");

// output
const out1 = document.getElementById("ou1");

const SEARCH_VALUES = [1, 2, 3, 4, 5, 6, 7, 8];
const SEARCH_TARGET = 5;
const ARRAY_LENGTH = SEARCH_VALUES.length;

// steps
const LAST_STEP = 24;
let current = -1;
let prevStep = -1;

const explanations = [
  "Declare values as an int array reference",
  "Create the array and assign its reference to values",
  "Declare target",
  "Assign 5 to target",
  "Declare index",
  "Start the loop and prepare index",
  "Assign 0 to index",
  "Check whether index is less than values.length",
  "Compare values[index] with target",
  "Increment index to 1",
  "Check whether index is less than values.length",
  "Compare values[index] with target",
  "Increment index to 2",
  "Check whether index is less than values.length",
  "Compare values[index] with target",
  "Increment index to 3",
  "Check whether index is less than values.length",
  "Compare values[index] with target",
  "Increment index to 4",
  "Check whether index is less than values.length",
  "Compare values[index] with target and find the key",
  "Break out of the loop because the target was found",
  "Check whether index equals values.length",
  "Since the condition is false, go to the else branch",
  'Print "Found at index: 4"',
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

function clearHighlights() {
  lines.forEach((line) => line.classList.remove("highlight"));
}

function applyHighlight(step) {
  clearHighlights();

  // 0 int[] values
  // 1 = {1,2,3,4,5,6,7,8};
  // 2 int target
  // 3 = 5;
  // 4 int index;
  // 5 for(index=0;
  // 6 index<values.length;
  // 7 index++)
  // 8 {
  // 9 if(
  // 10 values[index]
  // 11 ==
  // 12 target
  // 13 )
  // 14 {
  // 15 break;
  // 16 }
  // 17 }
  // 18 if(
  // 19 index
  // 20 ==
  // 21 values.length
  // 22 )
  // 23 {
  // 24 System.out.print(
  // 25 "Not found"
  // 26 );
  // 27 }
  // 28 else
  // 29 {
  // 30 System.out.println(
  // 31 "Found at index: " + index
  // 32 );
  // 33 }

  if (step === 0 && lines[0]) lines[0].classList.add("highlight");
  if (step === 1 && lines[1]) lines[1].classList.add("highlight");
  if (step === 2 && lines[2]) lines[2].classList.add("highlight");
  if (step === 3 && lines[3]) lines[3].classList.add("highlight");
  if (step === 4 && lines[4]) lines[4].classList.add("highlight");

  if (step === 5 || step === 6) {
    if (lines[5]) lines[5].classList.add("highlight");
  }

  if ([7, 10, 13, 16, 19].includes(step)) {
    if (lines[6]) lines[6].classList.add("highlight");
  }

  if ([8, 11, 14, 17, 20].includes(step)) {
    if (lines[9]) lines[9].classList.add("highlight");
    if (lines[10]) lines[10].classList.add("highlight");
    if (lines[11]) lines[11].classList.add("highlight");
    if (lines[12]) lines[12].classList.add("highlight");
    if (lines[13]) lines[13].classList.add("highlight");
  }

  if ([9, 12, 15, 18].includes(step)) {
    if (lines[7]) lines[7].classList.add("highlight");
  }

  if (step === 21 && lines[15]) {
    lines[15].classList.add("highlight");
  }

  if (step === 22) {
    if (lines[18]) lines[18].classList.add("highlight");
    if (lines[19]) lines[19].classList.add("highlight");
    if (lines[20]) lines[20].classList.add("highlight");
    if (lines[21]) lines[21].classList.add("highlight");
    if (lines[22]) lines[22].classList.add("highlight");
  }

  if (step === 23 && lines[28]) {
    lines[28].classList.add("highlight");
  }

  if (step === 24) {
    if (lines[30]) lines[30].classList.add("highlight");
    if (lines[31]) lines[31].classList.add("highlight");
    if (lines[32]) lines[32].classList.add("highlight");
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

function clearCellStates() {
  arrayCells.forEach((cell) => {
    cell.classList.remove("active-cell");
    cell.classList.remove("found-cell");
  });
}

function indexValueAtStep(step) {
  if (step < 6) return null;
  if (step < 9) return 0;
  if (step < 12) return 1;
  if (step < 15) return 2;
  if (step < 18) return 3;
  return 4;
}

function updateUI() {
  const goingForward = current > prevStep;

  applyHighlight(current);
  updateExplanation();
  clearCalcRow();
  clearCellStates();

  itemArray.style.display = "none";
  itemTarget.style.display = "none";
  itemIndex.style.display = "none";
  arrayBlock.style.display = "none";

  out1.innerText = current >= 24 ? "Found at index: 4" : "";

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
    itemTarget.style.display = "flex";
  }

  if (current >= 3) {
    if (current === 3 && goingForward) {
      memTarget.innerText = "";
      animateToMemory(document.getElementById("val-target"), memTarget, "5");
    } else {
      memTarget.innerText = "5";
    }
  } else {
    memTarget.innerText = "";
  }

  if (current >= 4) {
    itemIndex.style.display = "flex";
  }

  const idx = indexValueAtStep(current);
  if (idx === null) {
    memIndex.innerText = "";
  } else {
    memIndex.innerText = String(idx);
  }

  if (current === 6 && goingForward) {
    memIndex.innerText = "";
    animateToMemory(document.getElementById("loop-cond"), memIndex, "0");
  }

  // loop condition
  if ([7, 10, 13, 16, 19].includes(current)) {
    calcRow.style.display = "flex";
    calcExpression.innerText = `${idx} < ${ARRAY_LENGTH}`;
    calcOp.innerText = "=";
    calcResult.innerText = idx < ARRAY_LENGTH ? "true" : "false";
  }

  // comparisons
  if ([8, 11, 14, 17, 20].includes(current)) {
    calcRow.style.display = "flex";
    calcExpression.innerText = `values[${idx}] == ${SEARCH_TARGET}`;
    calcOp.innerText = "=";
    calcResult.innerText =
      SEARCH_VALUES[idx] === SEARCH_TARGET ? "true" : "false";

    arrayCells[idx].classList.add("active-cell");

    if (SEARCH_VALUES[idx] === SEARCH_TARGET) {
      arrayCells[idx].classList.add("found-cell");
    }
  }

  // increments
  if ([9, 12, 15, 18].includes(current)) {
    const before =
      current === 9 ? 0 : current === 12 ? 1 : current === 15 ? 2 : 3;

    const after = before + 1;

    calcRow.style.display = "flex";
    calcExpression.innerText = `${before} + 1`;
    calcOp.innerText = "=";
    calcResult.innerText = String(after);

    if (goingForward) {
      memIndex.innerText = String(before);
      animateToMemory(
        document.getElementById("loop-inc"),
        memIndex,
        String(after),
      );
    } else {
      memIndex.innerText = String(after);
    }
  }

  // break
  if (current === 21) {
    arrayCells[4].classList.add("active-cell");
    arrayCells[4].classList.add("found-cell");
  }

  // final if(index == values.length)
  if (current === 22) {
    arrayCells[4].classList.add("active-cell");
    arrayCells[4].classList.add("found-cell");

    calcRow.style.display = "flex";
    calcExpression.innerText = `${memIndex.innerText} == ${ARRAY_LENGTH}`;
    calcOp.innerText = "=";
    calcResult.innerText = "false";
  }

  // else branch
  if (current === 23) {
    arrayCells[4].classList.add("active-cell");
    arrayCells[4].classList.add("found-cell");
  }

  // final found output
  if (current === 24) {
    arrayCells[4].classList.add("active-cell");
    arrayCells[4].classList.add("found-cell");

    if (goingForward) {
      out1.innerText = "";
      animateToMemory(
        document.getElementById("found-text"),
        out1,
        "Found at index: 4",
      );
    }
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
