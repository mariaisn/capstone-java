const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memX = document.getElementById("mem-x");
const memC = document.getElementById("mem-c");
const vSum = document.getElementById("val-sum");
const numX = document.getElementById("mem-num-x");
const numC = document.getElementById("mem-num-c");

const dobE = document.getElementById("dobEq-op");
const eqOp = document.getElementById("equal-op");

const out1 = document.getElementById("out1");

const memItems = document.querySelectorAll(".mem-item");

const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
  "Click Next to begin",
  "Declare int x and set x = 7",
  "Move x's value (7) to  x",
  "Check condition: if x == 7",
  "Store result (True) in  'condition'",
  "Print x because condition is True",
];

let current = -1;
const steps = stepMessages.length;

function animateToMemory(sourceElement, targetElement, finalValue) {
  const rectStart = sourceElement.getBoundingClientRect();
  const rectEnd = targetElement.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = finalValue;

  document.body.appendChild(flying);

  // start at code
  flying.style.left = rectStart.left + rectStart.width / 2 + "px";
  flying.style.top = rectStart.top + rectStart.height / 2 + "px";

  requestAnimationFrame(() => {
    // move to center of memory square
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

  if (step >= 2 && step <= 4) return 2;

  let temp = 0;
  if (step > 4) temp = temp - 2;

  return step + temp;
}

function updateHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));

  memItems.forEach((item) => (item.style.display = "none"));

  //call to get proper line to highlight into hLine
  const hLine = getHLine(current);

  //highlights the line
  if (lines[hLine]) {
    lines[hLine].classList.add("highlight");
  }

  if (current < 1) memX.innerText = "";

  if (current >= 2 && current <= 4) {
    numC.style.display = "flex";
    numX.style.display = "flex";
  }

  if (current >= 3 && current <= 4) {
    numC.innerText = "7";
    numX.innerText = "7";
  }

  if (current < 4) memC.innerText = "";

  if (current < 5) {
    out1.style.display = "none";
    out1.innerText = "";
  }

  if (!(current >= 2 && current <= 4)) {
    numX.innerText = "";
    numC.innerText = "";
  }

  // Show memory items progressively
  if (current >= 0)
    memItems[0].style.display = "flex"; // x
  else memItems[0].style.display = "none";
  if (current >= 2)
    memItems[1].style.display = "flex"; // c
  else memItems[1].style.display = "none";
  if (current >= 2)
    memItems[1].style.display = "flex"; // c
  else memItems[1].style.display = "none";
  if (current === 2 && numC.innerText === "") {
    animateToMemory(document.getElementById("val-c"), numC, "True");
  }

  if (current >= 3 && current <= 4) {
    vSum.style.display = "flex";
    vSum.innerText = "True";
  }

  if (current === 4 && memC.innerText === "") {
    animateToMemory(vSum, memC, "True");
  }

  if (current === 5 && out1.innerText === "") {
    out1.style.display = "flex";
    out1.innerText = "7";
    animateToMemory(memX, out1, "7");
  }

  dobE.style.display = "none";
  eqOp.style.display = "none";

  if (current >= 2 && current <= 4) {
    dobE.style.display = "block";
  }

  if (current >= 3 && current <= 4) {
    eqOp.style.display = "block";
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1;
}

function updateMemoryExplanation() {
  if (current < 0) {
    memoryExplanation.innerText = stepMessages[0];
  } else if (current < stepMessages.length) {
    memoryExplanation.innerText = stepMessages[current];
  } else {
    memoryExplanation.innerText = "Done!";
  }
}

nextBtn.addEventListener("click", () => {
  if (current < steps - 1) {
    current++;
    updateMemoryExplanation();
    updateHighlight();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    updateMemoryExplanation();
    updateHighlight();
  }
});

updateMemoryExplanation();
updateHighlight();
