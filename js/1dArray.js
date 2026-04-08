const explanationBox = document.getElementById("memory-explanation");

// select all spans
const lines = document.querySelectorAll("#high span");

// buttons
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory reference squares
const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memZ = document.getElementById("mem-z");

// memory reference items
const itemX = document.getElementById("item-x");
const itemY = document.getElementById("item-y");
const itemZ = document.getElementById("item-z");

// panels
const panelX = document.getElementById("panel-x");
const panelY = document.getElementById("panel-y");
const panelZ = document.getElementById("panel-z");

// array blocks
const arrayXBlock = document.getElementById("array-x-block");
const arrayYBlock = document.getElementById("array-y-block");
const arrayZBlock = document.getElementById("array-z-block");

// array cells
const xCells = [
  document.getElementById("x-cell-0"),
  document.getElementById("x-cell-1"),
  document.getElementById("x-cell-2"),
  document.getElementById("x-cell-3"),
  document.getElementById("x-cell-4"),
];

const yCells = [
  document.getElementById("y-cell-0"),
  document.getElementById("y-cell-1"),
  document.getElementById("y-cell-2"),
  document.getElementById("y-cell-3"),
  document.getElementById("y-cell-4"),
];

const zCells = [
  document.getElementById("z-cell-0"),
  document.getElementById("z-cell-1"),
];

// steps
const LAST_STEP = 8;
let current = -1;
let prevStep = -1;

const explanations = [
  "Declare x as an int array reference",
  "Create a new int array with 5 elements and assign its reference to x",
  "Declare y as a double array reference",
  "Create a new double array with 5 elements and assign its reference to y",
  "Declare z as a String array reference",
  'Create the String array and store "Hello" at index 0',
  'Store "Apple" at index 1',
  "Assign the String array reference to z",
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

  // span indexes in the HTML:
  // 0 = int[] x
  // 1 = = new int[5];
  // 2 = double[] y;
  // 3 = y
  // 4 = = new double[5];
  // 5 = String[] z
  // 6 = = {"Hello", "Apple"};

  if (step === 0 && lines[0]) {
    lines[0].classList.add("highlight");
  }

  if (step === 1 && lines[1]) {
    lines[1].classList.add("highlight");
  }

  if (step === 2 && lines[2]) {
    lines[2].classList.add("highlight");
  }

  if (step === 3) {
    if (lines[3]) lines[3].classList.add("highlight");
    if (lines[4]) lines[4].classList.add("highlight");
  }

  if (step === 4 && lines[5]) {
    lines[5].classList.add("highlight");
  }

  if (step === 5 && lines[6]) {
    lines[6].classList.add("highlight");
  }

  if (step === 6 && lines[6]) {
    lines[6].classList.add("highlight");
  }

  if (step === 7) {
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

function clearArrayDefaults() {
  xCells.forEach((cell) => {
    cell.innerText = "0";
  });

  yCells.forEach((cell) => {
    cell.innerText = "0.0";
  });

  zCells.forEach((cell) => {
    cell.innerText = "";
  });
}

function updateHighlight() {
  const goingForward = current > prevStep;

  applyHighlight(current);
  updateExplanation();

  // reset display
  panelX.style.display = "none";
  panelY.style.display = "none";
  panelZ.style.display = "none";

  itemX.style.display = "none";
  itemY.style.display = "none";
  itemZ.style.display = "none";

  arrayXBlock.style.display = "none";
  arrayYBlock.style.display = "none";
  arrayZBlock.style.display = "none";

  // reset values for back navigation
  if (current < 1) {
    memX.innerText = "";
  }

  if (current < 3) {
    memY.innerText = "";
  }

  if (current < 7) {
    memZ.innerText = "";
  }

  clearArrayDefaults();

  // X panel
  if (current >= 0) {
    panelX.style.display = "flex";
    itemX.style.display = "flex";
  }

  if (current >= 1) {
    arrayXBlock.style.display = "flex";

    if (current === 1 && goingForward) {
      memX.innerText = "";
      animateToMemory(document.getElementById("val-x"), memX, "ref");
    } else {
      memX.innerText = "ref";
    }
  }

  // Y panel
  if (current >= 2) {
    panelY.style.display = "flex";
    itemY.style.display = "flex";
  }

  if (current >= 3) {
    arrayYBlock.style.display = "flex";

    if (current === 3 && goingForward) {
      memY.innerText = "";
      animateToMemory(document.getElementById("val-y"), memY, "ref");
    } else {
      memY.innerText = "ref";
    }
  }

  // Z panel
  if (current >= 4) {
    panelZ.style.display = "flex";
    itemZ.style.display = "flex";
  }

  if (current >= 5) {
    arrayZBlock.style.display = "flex";
  }

  if (current >= 5) {
    if (current === 5 && goingForward) {
      zCells[0].innerText = "";
      animateToMemory(document.getElementById("val-z"), zCells[0], '"Hello"');
    } else {
      zCells[0].innerText = '"Hello"';
    }
  }

  if (current >= 6) {
    if (current === 6 && goingForward) {
      zCells[1].innerText = "";
      animateToMemory(document.getElementById("val-z"), zCells[1], '"Apple"');
    } else {
      zCells[1].innerText = '"Apple"';
    }
  }

  if (current >= 7) {
    if (current === 7 && goingForward) {
      memZ.innerText = "";
      animateToMemory(document.getElementById("val-z"), memZ, "ref");
    } else {
      memZ.innerText = "ref";
    }
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= LAST_STEP;

  prevStep = current;
}

nextBtn.addEventListener("click", () => {
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