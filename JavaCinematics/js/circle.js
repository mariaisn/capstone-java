// select all lines
const lines = document.querySelectorAll("#high span");

// button
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory squares
const memRadius = document.getElementById("mem-radius");
const memArea = document.getElementById("mem-area");

// calc row (these are also .mem-item)
const numR1 = document.getElementById("mem-num-r1");
const numR2 = document.getElementById("mem-num-r2");
const numPi = document.getElementById("mem-num-pi");
const valResult = document.getElementById("val-result");

// operators
const mul1 = document.getElementById("mul-1");
const mul2 = document.getElementById("mul-2");
const eqOp = document.getElementById("eq-op");

// output
const out1 = document.getElementById("ou1");

// explanation box
const explanationBox = document.getElementById("memory-explanation");

const explanations = [
  "click next to begin",
  "declare radius",
  "declare area",
  "radius = 20.0",
  "start compute",
  "show result in calc row",
  "store area into memory",
  "print line highlighted",
  "print output",
];

// all memory items
const memItems = document.querySelectorAll(".mem-item");

const RADIUS_VAL = 20.0;
const RADIUS_TEXT = "20.0";
const PI_VAL = 3.14159;
const PI_TEXT = "3.14159";
const AREA_VAL = (RADIUS_VAL * RADIUS_VAL * PI_VAL).toFixed(3); // 1256.636

const steps = 7;
let current = -1;

function animateToMemory(sourceElement, targetElement, finalValue) {
  const rectStart = sourceElement.getBoundingClientRect();
  const rectEnd = targetElement.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = finalValue;

  document.body.appendChild(flying);

  // start at source
  flying.style.left = rectStart.left + rectStart.width / 2 + "px";
  flying.style.top = rectStart.top + rectStart.height / 2 + "px";

  requestAnimationFrame(() => {
    // move to target
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

  if (step === 0) return 0; // double radius;
  if (step === 1) return 1; // double area;
  if (step === 2) return 2; // radius

  // 3-5: expression only
  if (step >= 3 && step <= 5) return 5; // radius * radius *

  // 6-7: println
  if (step >= 6) return 7;

  return 7;
}

function updateHighlight() {
  explanationBox.textContent = explanations[current + 1] || "";

  // clear all highlights first
  lines.forEach((line) => line.classList.remove("highlight"));

  const hLine = getHLine(current);

  if (lines[hLine]) lines[hLine].classList.add("highlight");

  // keep assignment chunk highlighted for radius = 20.0
  if (hLine === 2) {
    if (lines[3]) lines[3].classList.add("highlight");
  }

  // keep the full expression highlighted, but not "area ="
  if (hLine === 5) {
    if (lines[6]) lines[6].classList.add("highlight");
  }

  // hide all memory items by default
  memItems.forEach((item) => (item.style.display = "none"));

  // hide operators by default
  mul1.style.display = "none";
  mul2.style.display = "none";
  eqOp.style.display = "none";
  valResult.style.display = "none";

  // clear output when going backwards
  if (current < 7) out1.innerHTML = "";

  // show squares when declared
  if (current >= 0) memItems[0].style.display = "flex"; // radius
  if (current >= 1) memItems[1].style.display = "flex"; // area

  // clear values when going backwards
  if (current < 2) memRadius.innerText = "";
  if (current < 5) memArea.innerText = "";

  // clear calc row when going backwards before compute
  if (current < 3) {
    numR1.innerText = "";
    numR2.innerText = "";
    numPi.innerText = "";
    valResult.innerText = "";
  }

  // step 2: animate 20.0 into radius
  if (current === 2 && memRadius.innerText === "") {
    animateToMemory(
      document.getElementById("val-radius"),
      memRadius,
      RADIUS_TEXT,
    );
  }

  // step 3-5: compute window
  const inCompute = current >= 3 && current <= 5;
  if (inCompute) {
    numR1.style.display = "flex";
    numR2.style.display = "flex";
    numPi.style.display = "flex";

    mul1.style.display = "flex";
    mul2.style.display = "flex";

    if (
      current === 3 &&
      numR1.innerText === "" &&
      numR2.innerText === "" &&
      numPi.innerText === ""
    ) {
      if (memRadius.innerText === "") memRadius.innerText = RADIUS_TEXT;

      animateToMemory(memRadius, numR1, RADIUS_TEXT);
      animateToMemory(memRadius, numR2, RADIUS_TEXT);
      animateToMemory(document.getElementById("lit-pi"), numPi, PI_TEXT);
    } else {
      numR1.innerText = RADIUS_TEXT;
      numR2.innerText = RADIUS_TEXT;
      numPi.innerText = PI_TEXT;
    }
  }

  // step 4: show result
  if (current === 4) {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = AREA_VAL;
  }

  // step 5: store area into memory
  if (current === 5 && memArea.innerText === "") {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = AREA_VAL;
    animateToMemory(valResult, memArea, AREA_VAL);
  }

  // step 7: print output
  if (current === 7 && out1.innerHTML === "") {
    out1.innerHTML =
      'The area for the circle of radius <span id="out-radius"></span> is <span id="out-area"></span>';

    const outRadius = document.getElementById("out-radius");
    const outArea = document.getElementById("out-area");

    if (memRadius.innerText === "") memRadius.innerText = RADIUS_TEXT;
    if (memArea.innerText === "") memArea.innerText = AREA_VAL;

    animateToMemory(memRadius, outRadius, RADIUS_TEXT);
    animateToMemory(memArea, outArea, AREA_VAL);
  }

  backBtn.disabled = current <= -1;
  nextBtn.disabled = current >= steps;
}

nextBtn.addEventListener("click", () => {
  if (current < steps) {
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