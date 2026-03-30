const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const inputX = document.getElementById("input-x");
const inputY = document.getElementById("input-y");

const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");

const echoX = document.getElementById("echo-x");
const echoY = document.getElementById("echo-y");

const memoryExplanation = document.getElementById("memory-explanation");

const memMap = {
  x1: document.getElementById("mem-x"),
  y1: document.getElementById("mem-y"),
  x2: document.getElementById("mem-x2"),
  y2: document.getElementById("mem-y2"),
  x3: document.getElementById("mem-x3"),
  y3: document.getElementById("mem-y3"),
  a: document.getElementById("mem-a"),
  b: document.getElementById("mem-b"),
  c: document.getElementById("mem-c"),
  A: document.getElementById("mem-A"),
  B: document.getElementById("mem-B"),
  C: document.getElementById("mem-C"),
};

const calcFormula = document.getElementById("calc-formula");

// One-after-the-other stepping: declaration line first, then input/expression line.
const lineByStep = [
  0, 2, 3,
  4, 5,
  6, 7,
  8, 9,
  10, 11,
  12, 13,
  14, 15,
  16, 17,
  18, 19,
  20, 21,
  22, 23,
  24, 25,
  26, 27,
  28,
];

const stepMessages = [
  "Import Scanner",
  "Create Scanner input",
  "Print: Enter three points",
  "Declare x1",
  "Read x1",
  "Declare y1",
  "Read y1",
  "Declare x2",
  "Read x2",
  "Declare y2",
  "Read y2",
  "Declare x3",
  "Read x3",
  "Declare y3",
  "Read y3",
  "Declare a",
  "Compute a",
  "Declare b",
  "Compute b",
  "Declare c",
  "Compute c",
  "Declare A",
  "Compute A",
  "Declare B",
  "Compute B",
  "Declare C",
  "Compute C",
  "Print the three angles",
];

const inputSteps = [
  { step: 4, key: "x1", label: "x1" },
  { step: 6, key: "y1", label: "y1" },
  { step: 8, key: "x2", label: "x2" },
  { step: 10, key: "y2", label: "y2" },
  { step: 12, key: "x3", label: "x3" },
  { step: 14, key: "y3", label: "y3" },
];

const computedSteps = [
  { step: 16, key: "a" },
  { step: 18, key: "b" },
  { step: 20, key: "c" },
  { step: 22, key: "A" },
  { step: 24, key: "B" },
  { step: 26, key: "C" },
];

let current = -1;
const values = {};

function round2(n) {
  return Math.round(n * 100) / 100;
}

function toDegrees(rad) {
  return (rad * 180) / Math.PI;
}

function clampAcosInput(v) {
  if (v > 1) return 1;
  if (v < -1) return -1;
  return v;
}

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

function getInputDef(step) {
  return inputSteps.find((s) => s.step === step) || null;
}

function isInputStep(step) {
  return getInputDef(step) !== null;
}

function formatNum(n) {
  if (!Number.isFinite(n)) return "";
  return Number.isInteger(n) ? String(n) : String(n);
}

function updateMemoryExplanation() {
  if (!memoryExplanation) return;

  if (current < 0) {
    memoryExplanation.style.display = "none";
    memoryExplanation.innerText = "";
    return;
  }

  memoryExplanation.style.display = "flex";
  memoryExplanation.innerText = stepMessages[current] || "Done";
}

function clearFutureValues() {
  inputSteps.forEach(({ step, key }) => {
    if (current < step) delete values[key];
  });

  computedSteps.forEach(({ step, key }) => {
    if (current < step) delete values[key];
  });
}

function computeSidesAndAngles() {
  const required = ["x1", "y1", "x2", "y2", "x3", "y3"];
  const hasAll = required.every((k) => Number.isFinite(values[k]));
  if (!hasAll) return;

  if (current >= 16) {
    values.a = Math.sqrt(
      (values.x2 - values.x3) * (values.x2 - values.x3) +
        (values.y2 - values.y3) * (values.y2 - values.y3)
    );
  }

  if (current >= 18) {
    values.b = Math.sqrt(
      (values.x1 - values.x3) * (values.x1 - values.x3) +
        (values.y1 - values.y3) * (values.y1 - values.y3)
    );
  }

  if (current >= 20) {
    values.c = Math.sqrt(
      (values.x1 - values.x2) * (values.x1 - values.x2) +
        (values.y1 - values.y2) * (values.y1 - values.y2)
    );
  }

  if (current >= 22 && Number.isFinite(values.b) && Number.isFinite(values.c)) {
    const cosA =
      (values.a * values.a - values.b * values.b - values.c * values.c) /
      (-2 * values.b * values.c);
    values.A = toDegrees(Math.acos(clampAcosInput(cosA)));
  }

  if (current >= 24 && Number.isFinite(values.a) && Number.isFinite(values.c)) {
    const cosB =
      (values.b * values.b - values.a * values.a - values.c * values.c) /
      (-2 * values.a * values.c);
    values.B = toDegrees(Math.acos(clampAcosInput(cosB)));
  }

  if (current >= 26 && Number.isFinite(values.a) && Number.isFinite(values.b)) {
    const cosC =
      (values.c * values.c - values.b * values.b - values.a * values.a) /
      (-2 * values.a * values.b);
    values.C = toDegrees(Math.acos(clampAcosInput(cosC)));
  }
}

// Track which compute step has already triggered its fly animation so it
// doesn't re-fire when the user navigates back then forward again.
let lastAnimatedStep = -1;

// Fly all source squares simultaneously to the formula area, then reveal text.
function flyMultiToFormula(srcKeys, finalText) {
  if (!calcFormula) return;

  const srcElements = srcKeys
    .map((k) => memMap[k])
    .filter((el) => el && el.innerText !== "");

  if (srcElements.length === 0) {
    calcFormula.innerText = finalText;
    return;
  }

  const rectEnd = calcFormula.getBoundingClientRect();
  let completed = 0;

  srcElements.forEach((srcEl) => {
    const rectStart = srcEl.getBoundingClientRect();

    const flying = document.createElement("div");
    flying.className = "fly-value";
    flying.innerText = srcEl.innerText;

    document.body.appendChild(flying);

    flying.style.left = rectStart.left + rectStart.width  / 2 + "px";
    flying.style.top  = rectStart.top  + rectStart.height / 2 + "px";

    requestAnimationFrame(() => {
      flying.style.left = rectEnd.left + rectEnd.width  / 2 + "px";
      flying.style.top  = rectEnd.top  + rectEnd.height / 2 + "px";
    });

    flying.addEventListener("transitionend", () => {
      document.body.removeChild(flying);
      completed++;
      if (completed === srcElements.length) {
        calcFormula.innerText = finalText;
      }
    });
  });
}

function updateMemorySquares() {
  Object.keys(memMap).forEach((key) => {
    if (!memMap[key]) return;
    memMap[key].innerText = Number.isFinite(values[key])
      ? formatNum(round2(values[key]))
      : "";
  });

  if (!calcFormula) return;

  // Determine formula text and which squares to fly from for this step
  let formulaText = "";
  let srcKeys     = [];

  if (current === 16 && Number.isFinite(values.a)) {
    formulaText = `a = Math.sqrt((x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3)) = Math.sqrt((${formatNum(values.x2)} - ${formatNum(values.x3)}) * (${formatNum(values.x2)} - ${formatNum(values.x3)}) + (${formatNum(values.y2)} - ${formatNum(values.y3)}) * (${formatNum(values.y2)} - ${formatNum(values.y3)})) = ${formatNum(round2(values.a))}`;
    srcKeys = ["x2", "x3", "y2", "y3"];
  } else if (current === 18 && Number.isFinite(values.b)) {
    formulaText = `b = Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3)) = Math.sqrt((${formatNum(values.x1)} - ${formatNum(values.x3)}) * (${formatNum(values.x1)} - ${formatNum(values.x3)}) + (${formatNum(values.y1)} - ${formatNum(values.y3)}) * (${formatNum(values.y1)} - ${formatNum(values.y3)})) = ${formatNum(round2(values.b))}`;
    srcKeys = ["x1", "x3", "y1", "y3"];
  } else if (current === 20 && Number.isFinite(values.c)) {
    formulaText = `c = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) = Math.sqrt((${formatNum(values.x1)} - ${formatNum(values.x2)}) * (${formatNum(values.x1)} - ${formatNum(values.x2)}) + (${formatNum(values.y1)} - ${formatNum(values.y2)}) * (${formatNum(values.y1)} - ${formatNum(values.y2)})) = ${formatNum(round2(values.c))}`;
    srcKeys = ["x1", "x2", "y1", "y2"];
  } else if (current === 22 && Number.isFinite(values.A)) {
    formulaText = `A = Math.toDegrees(Math.acos((a * a - b * b - c * c) / (-2 * b * c))) = ${formatNum(round2(values.A))}°`;
    srcKeys = ["a", "b", "c"];
  } else if (current === 24 && Number.isFinite(values.B)) {
    formulaText = `B = Math.toDegrees(Math.acos((b * b - a * a - c * c) / (-2 * a * c))) = ${formatNum(round2(values.B))}°`;
    srcKeys = ["a", "b", "c"];
  } else if (current === 26 && Number.isFinite(values.C)) {
    formulaText = `C = Math.toDegrees(Math.acos((c * c - b * b - a * a) / (-2 * a * b))) = ${formatNum(round2(values.C))}°`;
    srcKeys = ["a", "b", "c"];
  } else if (current === 27 && Number.isFinite(values.A) && Number.isFinite(values.B) && Number.isFinite(values.C)) {
    formulaText = `Math.round(A * 100) / 100.0 = ${formatNum(round2(values.A))}\nMath.round(B * 100) / 100.0 = ${formatNum(round2(values.B))}\nMath.round(C * 100) / 100.0 = ${formatNum(round2(values.C))}`;
    srcKeys = ["A", "B", "C"];
  }

  if (!formulaText) {
    calcFormula.innerText = "";
    return;
  }

  // Animate on first arrival at this step; show text directly on revisit
  if (current !== lastAnimatedStep) {
    lastAnimatedStep = current;
    calcFormula.innerText = "";
    flyMultiToFormula(srcKeys, formulaText);
  } else {
    calcFormula.innerText = formulaText;
  }
}

function updateOutput() {
  if (!out1 || !out2 || !out3 || !out4) return;

  out1.innerText = current >= 2 ? "Enter three points:" : "";

  const inputOrder = ["x1", "y1", "x2", "y2", "x3", "y3"];
  const entered = inputOrder
    .filter((k) => Number.isFinite(values[k]))
    .map((k) => formatNum(values[k]));

  out2.innerHTML = entered.join("<br>");

  if (current >= 27 && Number.isFinite(values.A)) {
    out3.innerText = `The three angles are ${round2(values.A)} ${round2(
      values.B
    )} ${round2(values.C)}`;
  } else {
    out3.innerText = "";
  }

  out4.innerText = "";
}

function updateInputUI() {
  if (!inputX || !inputY || !echoX || !echoY) return;

  const inputDef = getInputDef(current);

  inputY.style.visibility = "hidden";
  inputY.style.display = "none";
  echoY.innerText = "";

  if (!inputDef) {
    inputX.style.visibility = "hidden";
    echoX.innerText = "";
    return;
  }

  inputX.style.visibility = "visible";
  inputX.placeholder = "";
  inputX.value = Number.isFinite(values[inputDef.key])
    ? String(values[inputDef.key])
    : "";
  echoX.innerText = "";
}

function updateHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));

  if (current >= 0) {
    const hLine = lineByStep[current];
    if (lines[hLine]) lines[hLine].classList.add("highlight");
  }

  clearFutureValues();
  computeSidesAndAngles();
  updateMemorySquares();
  updateOutput();
  updateInputUI();
  updateMemoryExplanation();

  const atStart = current <= 0;
  const atEnd = current >= lineByStep.length - 1;
  const inputDef = getInputDef(current);
  const needsInput = inputDef && !Number.isFinite(values[inputDef.key]);

  backBtn.disabled = atStart;
  nextBtn.disabled = atEnd || needsInput;
}

inputX.addEventListener("keypress", (event) => {
  if (event.key !== "Enter") return;

  const inputDef = getInputDef(current);
  if (!inputDef) return;

  const raw = inputX.value.trim();
  const parsed = Number(raw);
  if (raw === "" || !Number.isFinite(parsed)) return;

  values[inputDef.key] = parsed;

  const memTarget = memMap[inputDef.key];
  animateToMemory(inputX, memTarget, formatNum(parsed));

  updateHighlight();
});

nextBtn.addEventListener("click", () => {
  if (current < lineByStep.length - 1) {
    current += 1;
    updateHighlight();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    lastAnimatedStep = -1;
    current -= 1;
    updateHighlight();
  }
});

updateHighlight();
