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

// memory reference
const memArray = document.getElementById("mem-array");
const itemArray = document.getElementById("item-array");

// array panel/block
const panelArray = document.getElementById("panel-array");
const arrayBlock = document.getElementById("array-block");

// array cells
const arrayCells = [
  document.getElementById("cell-0"),
  document.getElementById("cell-1"),
  document.getElementById("cell-2"),
  document.getElementById("cell-3"),
  document.getElementById("cell-4"),
];

const targetCell = document.getElementById("cell-3");

// calc row
const calcRow = document.getElementById("calc-row");
const calcLeft = document.getElementById("calc-left");
const calcRight = document.getElementById("calc-right");

// output
const out1 = document.getElementById("ou1");

// steps
const LAST_STEP = 3;
let current = -1;
let prevStep = -1;

const explanations = [
  "Declare values as an int array reference",
  "Create a new int array with 5 elements and assign its reference to values",
  "Assign 7 to index 3 of the array",
  "Print the value stored at values[3] to the output",
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

  // 0=int[] values
  // 1== new int[5];
  // 2=values[3]
  // 3== 7;
  // 4=System.out.println(
  // 5=values[3]
  // 6=);

  if (step === 0 && lines[0]) {
    lines[0].classList.add("highlight");
  }

  if (step === 1 && lines[1]) {
    lines[1].classList.add("highlight");
  }

  if (step === 2) {
    if (lines[2]) lines[2].classList.add("highlight");
    if (lines[3]) lines[3].classList.add("highlight");
  }

  if (step === 3) {
    if (lines[4]) lines[4].classList.add("highlight");
    if (lines[5]) lines[5].classList.add("highlight");
    if (lines[6]) lines[6].classList.add("highlight");
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

function setDefaultArrayValues() {
  for (let i = 0; i < arrayCells.length; i++) {
    arrayCells[i].innerText = "0";
  }
}

function clearCalcRow() {
  calcLeft.innerText = "";
  calcRight.innerText = "";
  calcRow.style.display = "none";
}

function updateUI() {
  const goingForward = current > prevStep;

  applyHighlight(current);
  updateExplanation();

  panelArray.style.display = "none";
  itemArray.style.display = "none";
  arrayBlock.style.display = "none";
  clearCalcRow();

  if (current < 3) {
    out1.innerText = "";
  }

  if (current < 1) {
    memArray.innerText = "";
  }

  setDefaultArrayValues();

  if (current >= 2) {
    targetCell.innerText = "7";
  }

  if (current >= 0) {
    panelArray.style.display = "flex";
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
  }

  // assign 7 to index 3
  if (current === 2) {
    calcRow.style.display = "flex";
    calcLeft.innerText = "values[3]";
    calcRight.innerText = "7";

    if (goingForward) {
      targetCell.innerText = "0";
      animateToMemory(document.getElementById("val-assign"), targetCell, "7");
    } else {
      targetCell.innerText = "7";
    }
  }

  // print line and show output all in one step
  if (current === 3) {
    if (out1.innerText === "" && goingForward) {
      animateToMemory(targetCell, out1, "7");
    } else {
      out1.innerText = "7";
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
