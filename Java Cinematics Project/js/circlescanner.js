// memory explanation box
const explanationBox = document.getElementById("memory-explanation");

const explanations = [
  "click next to begin",
  "declare radius",
  "declare area",
  "import scanner",
  "create scanner",
  "prompt user for input",
  "read radius value from input",
  "start compute",
  "show result ",
  "store area ",
  "print output",
];

// select all lines
const lines = document.querySelectorAll("#high span");

// button
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// input row in output/console (for show/hide)
const consoleRow = document.getElementById("console-input-row");

// input in output/console
const radiusInput = document.getElementById("radius-input");

// memory squares
const memRadius = document.getElementById("mem-radius");
const memArea = document.getElementById("mem-area");

// calc row
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

// all memory items
const memItems = document.querySelectorAll(".mem-item");

const PI_VAL = 3.14159;

// steps
// -1 = before start
// 0  = declare radius
// 1  = declare area
// 2  = import Scanner
// 3  = create Scanner
// 4  = prompt
// 5  = radius = input.nextDouble()
// 6  = start compute
// 7  = show result
// 8  = store area
// 9  = print output
const steps = 9;
let current = -1;

// keeps step 5 from consuming input immediately
let inputCaptured = false;

/**
 * Allow users to type decimals, but only keep:
 * - digits 0-9
 * - at most one decimal '.'
 */
function filterDecimalTyping() {
  let v = radiusInput.value;

  // allow only digits and dots
  v = v.replace(/[^\d.]/g, "");

  // allow only one dot
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }

  radiusInput.value = v;
}

// enforce while typing/pasting
radiusInput.addEventListener("input", filterDecimalTyping);
radiusInput.addEventListener("paste", () => setTimeout(filterDecimalTyping, 0));

function getRadiusText() {
  filterDecimalTyping();

  const raw =
    radiusInput.value.trim() !== ""
      ? radiusInput.value.trim()
      : (radiusInput.placeholder || "20.0").trim();

  const f = parseFloat(raw);
  if (!Number.isFinite(f)) return "20.0";

  // if user typed a decimal, keep it as typed
  if (raw.includes(".")) return raw;

  // if it is a whole number used as a double, show .0
  return f.toFixed(1);
}

function getRadius() {
  const text = getRadiusText();
  const f = parseFloat(text);
  return Number.isFinite(f) ? f : 20.0;
}

function getArea(RADIUS_VAL) {
  return (RADIUS_VAL * RADIUS_VAL * PI_VAL).toFixed(3);
}

function setConsoleVisibility() {
  // show prompt row starting at the prompt line
  const shouldShowRow = current >= 4;
  consoleRow.style.display = shouldShowRow ? "flex" : "none";

  // show the input box only when reaching input.nextDouble()
  radiusInput.style.visibility = current >= 5 ? "visible" : "hidden";
}

function setInputLock() {
  // editable only when input.nextDouble() is highlighted and not yet captured
  const editable = current === 5 && !inputCaptured;

  radiusInput.readOnly = !editable;
  radiusInput.style.pointerEvents = editable ? "auto" : "none";

  if (editable) {
    radiusInput.focus();
  }
}

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

  if (step === 0) return 1; // double radius;
  if (step === 1) return 2; // double area;
  if (step === 2) return 0; // import java.util.Scanner;
  if (step === 3) return 3; // Scanner input...
  if (step === 4) return 4; // System.out.print(...)
  if (step === 5) return 5; // radius = input.nextDouble();

  // 6-8: compute and store area
  if (step >= 6 && step <= 8) return 7;

  // 9: println
  if (step >= 9) return 9;

  return 9;
}

function updateHighlight() {
  // Sync memory explanation box with current step
  explanationBox.textContent = explanations[current + 1] || "";

  // show/hide console row and lock/unlock input based on step
  setConsoleVisibility();
  setInputLock();

  const RADIUS_VAL = getRadius();
  const RADIUS_TEXT = getRadiusText();
  const AREA_VAL = getArea(RADIUS_VAL);

  // highlight
  lines.forEach((line) => line.classList.remove("highlight"));
  const hLine = getHLine(current);
  if (lines[hLine]) lines[hLine].classList.add("highlight");

  // keep "chunk" highlighted for assignment/expression
  if (hLine === 5) {
    if (lines[6]) lines[6].classList.add("highlight"); // "= input.nextDouble();"
  }
  if (hLine === 7) {
    if (lines[8]) lines[8].classList.add("highlight"); // "3.14159"
  }

  // hide all memory items by default
  memItems.forEach((item) => (item.style.display = "none"));

  // hide operators by default
  mul1.style.display = "none";
  mul2.style.display = "none";
  eqOp.style.display = "none";
  valResult.style.display = "none";

  // clear output when going backwards
  if (current < 9) out1.innerHTML = "";

  // show squares when declared
  if (current >= 0) memItems[0].style.display = "flex"; // radius
  if (current >= 1) memItems[1].style.display = "flex"; // area

  // clear values when going backwards
  if (current < 5) memRadius.innerText = "";
  if (current < 8) memArea.innerText = "";

  // reset capture state when going backwards before read step
  if (current < 5) {
    inputCaptured = false;
  }

  // clear calc row when going backwards before compute
  if (current < 6) {
    numR1.innerText = "";
    numR2.innerText = "";
    numPi.innerText = "";
    valResult.innerText = "";
  }

  // only after user confirms the input on step 5
  if (current === 5 && inputCaptured && memRadius.innerText === "") {
    radiusInput.value = RADIUS_TEXT;
    animateToMemory(radiusInput, memRadius, RADIUS_TEXT);
  }

  // step 6-8: compute window
  const inCompute = current >= 6 && current <= 8;
  if (inCompute) {
    // show calc row value boxes
    numR1.style.display = "flex";
    numR2.style.display = "flex";
    numPi.style.display = "flex";

    mul1.style.display = "flex";
    mul2.style.display = "flex";

    // entering compute: animate values down once
    if (
      current === 6 &&
      numR1.innerText === "" &&
      numR2.innerText === "" &&
      numPi.innerText === ""
    ) {
      if (memRadius.innerText === "") memRadius.innerText = RADIUS_TEXT;

      animateToMemory(memRadius, numR1, RADIUS_TEXT);
      animateToMemory(memRadius, numR2, RADIUS_TEXT);
      animateToMemory(document.getElementById("lit-pi"), numPi, String(PI_VAL));
    } else {
      numR1.innerText = RADIUS_TEXT;
      numR2.innerText = RADIUS_TEXT;
      numPi.innerText = String(PI_VAL);
    }
  }

  // step 7: show result
  if (current === 7) {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = AREA_VAL;
  }

  // step 8: store area into memory
  if (current === 8) {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = AREA_VAL;

    if (memArea.innerText === "") {
      animateToMemory(valResult, memArea, AREA_VAL);
    }
  }

  // step 9: highlight println line and print output immediately
  if (current === 9 && out1.innerHTML === "") {
    out1.innerHTML =
      'The area for the circle of radius <span id="out-radius"></span> is <span id="out-area"></span>';

    const outRadius = document.getElementById("out-radius");
    const outArea = document.getElementById("out-area");

    if (memRadius.innerText === "") memRadius.innerText = RADIUS_TEXT;
    if (memArea.innerText === "") memArea.innerText = AREA_VAL;

    animateToMemory(memRadius, outRadius, RADIUS_TEXT);
    animateToMemory(memArea, outArea, AREA_VAL);
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps;
}



nextBtn.addEventListener("click", () => {
  if (current === 5 && !inputCaptured) {
    inputCaptured = true;
    updateHighlight();
    return;
  }

  if (current < steps) {
    current++;
    updateHighlight();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;

    if (current < 5) {
      inputCaptured = false;
    }

    updateHighlight();
  }
});

updateHighlight();