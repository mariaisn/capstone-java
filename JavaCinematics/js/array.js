const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");
const memoryExplanation = document.getElementById("memory-explanation");
const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memX1 = document.getElementById("mem-x1");
const memY1 = document.getElementById("mem-y1");
const memItemX = document.getElementById("mem-item-x");
const memItemY = document.getElementById("mem-item-y");
const memItemX1 = document.getElementById("mem-item-x1");
const memItemY1 = document.getElementById("mem-item-y1");
const out1 = document.getElementById("ou1");
const memX1Array = document.getElementById("mem-x1-array");
const memY1Pointer = document.getElementById("mem-y1-pointer");
const out2 = document.getElementById("ou2");
let current = -1;
const steps = lines.length;

const stepMessages = [
  "Declare class Main",
  "Start main method",
  "Declare x and store 7",
  "Declare y and copy x",
  "Update y = y + 1",
  "Create array x1 = {1, 2, 3}",
  "Create reference y1 = x1",
  "Set y1[1] = 7 (also changes x1[1])",
  "Print x1[1]",
  "Print y1[1]",
  "Close main method",
  "Close class Main",
];

const initialArray = ["1", "2", "3"];
const updatedArray = ["1", "7", "3"];

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
  indexRow.className = "char-row";

  for (let i = 0; i < values.length; i++) {
    const indexBox = document.createElement("div");
    indexBox.className = "char-index";
    indexBox.innerText = i;
    indexRow.appendChild(indexBox);
  }

  const valueRow = document.createElement("div");
  valueRow.className = "char-row";

  values.forEach((value) => {
    const charBox = document.createElement("div");
    charBox.className = "char-box";
    charBox.innerText = value;
    valueRow.appendChild(charBox);
  });

  container.appendChild(indexRow);
  container.appendChild(valueRow);
}

function getArrayValueSource(container, index) {
  if (!container) return null;
  const rows = container.querySelectorAll(".char-row");
  if (rows.length < 2) return null;
  const boxes = rows[1].querySelectorAll(".char-box");
  return boxes[index] || null;
}

function updateHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));

  if (current >= 0 && lines[current]) {
    lines[current].classList.add("highlight");
  }

  if (memItemX) memItemX.style.display = current >= 2 ? "flex" : "none";
  if (memItemY) memItemY.style.display = current >= 3 ? "flex" : "none";
  if (memItemX1) memItemX1.style.display = current >= 5 ? "flex" : "none";
  if (memItemY1) memItemY1.style.display = current >= 6 ? "flex" : "none";

  if (current < 2 && memX) memX.innerText = "";
  if (current < 3 && memY) memY.innerText = "";
  if (current < 5 && memX1) memX1.innerText = "";
  if (current < 6 && memY1) memY1.innerText = "";
  if (current < 5 && memX1Array) memX1Array.innerHTML = "";
  if (memY1Pointer) memY1Pointer.style.visibility = current >= 6 ? "visible" : "hidden";

  if (current < 8 && out1) out1.innerText = "";
  if (current < 9 && out2) out2.innerText = "";

  if (current === 2 && memX && memX.innerText === "") {
    animateToMemory(lines[2], memX, "7");
  }

  if (current === 3 && memY && memY.innerText === "") {
    animateToMemory(lines[3], memY, "7");
  }

  if (current === 4 && memY && memY.innerText !== "8") {
    animateToMemory(lines[4], memY, "8");
  }

  if (current === 5 && memX1 && memX1.innerText === "") {
    animateToMemory(lines[5], memX1, "ref");
    createArrayDisplay(memX1Array, initialArray);
  }

  if (current === 6 && memY1 && memY1.innerText === "") {
    animateToMemory(lines[6], memY1, "ref");
  }

  if (current === 7) {
    if (memX1Array) {
      createArrayDisplay(memX1Array, updatedArray);
    }
  }

  if (current === 8 && out1 && out1.innerText === "") {
    const src = getArrayValueSource(memX1Array, 1) || memX1;
    animateToMemory(src, out1, "7");
  }

  if (current === 9 && out2 && out2.innerText === "") {
    const src = getArrayValueSource(memX1Array, 1) || memY1;
    animateToMemory(src, out2, "7");
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1;
}

function updateMemoryExplanation() {
  if (!memoryExplanation) return;

  if (current < 0) {
    memoryExplanation.innerText = "Click Next to begin";
  } else if (current < stepMessages.length) {
    memoryExplanation.innerText = stepMessages[current];
  } else {
    memoryExplanation.innerText = "Done!";
  }
}

nextBtn.addEventListener("click", () => {
  if (current < steps - 1) {
    current += 1;
    updateHighlight();
    updateMemoryExplanation();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current -= 1;
    updateHighlight();
    updateMemoryExplanation();
  }
});

updateHighlight();
updateMemoryExplanation();
