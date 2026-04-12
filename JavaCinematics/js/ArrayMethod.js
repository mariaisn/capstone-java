const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");
const memoryExplanation = document.getElementById("memory-explanation");
const memA = document.getElementById("mem-a");
const memB = document.getElementById("mem-b");
const memItemA = document.getElementById("mem-item-a");
const memItemB = document.getElementById("mem-item-b");
const out1 = document.getElementById("ou1");
const memAArray = document.getElementById("mem-a-array");
const memBPointer = document.getElementById("mem-b-pointer");
let current = -1;
const steps = lines.length;
const executionSteps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 9];
let previousStepPos = -1;

const stepMessages = [
  "Declare class Test",
  "Start main method",
  "Create int[] a with 5 slots",
  "Set a[0] = 7",
  "Set a[1] = 8",
  "Set a[2] = 5",
  "Set a[3] = 6",
  "Set a[4] = 4",
  "Call edit(a)",
  "Print a[2]",
  "",
  "Declare edit method with int[] b",
  "Set b[2] = 10 (changes array pointed by a)",
  "",
  "",
];

const initialArray = ["", "", "", "", ""];
const assignmentByLine = {
  3: { index: 0, value: "7" },
  4: { index: 1, value: "8" },
  5: { index: 2, value: "5" },
  6: { index: 3, value: "6" },
  7: { index: 4, value: "4" },
  12: { index: 2, value: "10" },
};

function animateToMemory(sourceElement, targetElement, finalValue) {
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

function createArrayDisplay(container, values) {
  if (!container) return;

  container.innerHTML = "";

  const indexRow = document.createElement("div");
  indexRow.className = "array-index-row";

  values.forEach((_, index) => {
    const indexLabel = document.createElement("span");
    indexLabel.className = "array-index-label";
    indexLabel.innerText = index;
    indexRow.appendChild(indexLabel);
  });

  const valueRow = document.createElement("div");
  valueRow.className = "char-row";

  values.forEach((value) => {
    const charBox = document.createElement("div");
    charBox.className = "char-box";

    const cellValue = document.createElement("span");
    cellValue.className = "cell-value";
    cellValue.innerText = value;

    charBox.appendChild(cellValue);
    valueRow.appendChild(charBox);
  });

  container.appendChild(indexRow);
  container.appendChild(valueRow);
}

function getArrayValueSource(container, index) {
  if (!container) return null;
  const valueElements = container.querySelectorAll(".cell-value");
  return valueElements[index] || null;
}

function getStepPosition(lineIndex) {
  return executionSteps.indexOf(lineIndex);
}

function buildState(stepPos) {
  const boundedStepPos = Math.max(-1, stepPos);
  const state = {
    showA: boundedStepPos >= 2,
    showB: boundedStepPos >= 9,
    showOutput: boundedStepPos >= 11,
    aRef: boundedStepPos >= 2 ? "ref" : "",
    bRef: boundedStepPos >= 9 ? "ref" : "",
    array: [...initialArray],
    output: "",
  };

  for (let pos = 0; pos <= boundedStepPos; pos += 1) {
    const lineIndex = executionSteps[pos];
    const assignment = assignmentByLine[lineIndex];
    if (assignment) {
      state.array[assignment.index] = assignment.value;
    }
  }

  if (state.showOutput) {
    state.output = state.array[2];
  }

  return state;
}

function renderState(state) {
  if (memItemA) memItemA.style.display = state.showA ? "flex" : "none";
  if (memItemB) memItemB.style.display = state.showB ? "flex" : "none";

  if (memA) memA.innerText = state.aRef;
  if (memB) memB.innerText = state.bRef;

  if (memBPointer) {
    memBPointer.style.visibility = state.showB ? "visible" : "hidden";
  }

  if (memAArray) {
    if (state.showA) {
      createArrayDisplay(memAArray, state.array);
    } else {
      memAArray.innerHTML = "";
    }
  }

  if (out1) {
    out1.innerText = state.showOutput ? state.output : "";
  }
}

function updateHighlight() {
  const stepPos = getStepPosition(current);
  const previousState = buildState(previousStepPos);
  const currentState = buildState(stepPos);
  const isForward = stepPos > previousStepPos;

  lines.forEach((line) => line.classList.remove("highlight"));

  if (current >= 0 && lines[current]) {
    lines[current].classList.add("highlight");
  }

  renderState(currentState);

  if (isForward && current === 2 && memA) {
    memA.innerText = "";
    animateToMemory(lines[2], memA, "ref");
  }

  if (isForward && current === 11 && memB) {
    memB.innerText = "";
    animateToMemory(lines[11], memB, "ref");
  }

  const assignment = assignmentByLine[current];
  if (isForward && assignment && memAArray) {
    const target = getArrayValueSource(memAArray, assignment.index);
    if (target) {
      target.innerText = previousState.array[assignment.index] || "";
      animateToMemory(lines[current], target, assignment.value);
    }
  }

  if (isForward && current === 9 && out1) {
    out1.innerText = "";
    const src = getArrayValueSource(memAArray, 2) || memA;
    animateToMemory(src, out1, currentState.output || "10");
  }

  backBtn.disabled = stepPos <= 0;
  nextBtn.disabled = stepPos >= executionSteps.length - 1;

  previousStepPos = stepPos;
}

function updateMemoryExplanation() {
  if (!memoryExplanation) return;

  if (current < 0) {
    memoryExplanation.innerText = "";
  } else if (current < stepMessages.length) {
    memoryExplanation.innerText = stepMessages[current] || "";
  } else {
    memoryExplanation.innerText = "Done!";
  }
}

nextBtn.addEventListener("click", () => {
  const stepPos = getStepPosition(current);
  const nextIndex = executionSteps[stepPos + 1];
  if (nextIndex !== undefined) {
    current = nextIndex;
    updateHighlight();
    updateMemoryExplanation();
  }
});

backBtn.addEventListener("click", () => {
  const stepPos = getStepPosition(current);
  const prevIndex = executionSteps[stepPos - 1];
  if (prevIndex !== undefined) {
    current = prevIndex;
    updateHighlight();
    updateMemoryExplanation();
  }
});

updateHighlight();
updateMemoryExplanation();
