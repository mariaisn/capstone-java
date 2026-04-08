const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memoryExplanation = document.getElementById("memory-explanation");
const memDegrees = document.getElementById("mem-degrees");
const memRadians = document.getElementById("mem-radians");
const out1 = document.getElementById("ou1");
const mainLine = document.getElementById("main-line");

const headerLine1 = document.getElementById("header-line-1");
const headerLine2 = document.getElementById("header-line-2");
const deg30DeclLine = document.getElementById("deg30-decl-line");
const deg30AssignLine = document.getElementById("deg30-assign-line");
const rad30DeclLine = document.getElementById("rad30-decl-line");
const rad30AssignLine = document.getElementById("rad30-assign-line");
const row30Line1 = document.getElementById("row30-line-1");
const row30Line2 = document.getElementById("row30-line-2");
const row30Line3 = document.getElementById("row30-line-3");
const deg60TargetLine = document.getElementById("deg60-target-line");
const deg60AssignLine = document.getElementById("deg60-assign-line");
const rad60TargetLine = document.getElementById("rad60-target-line");
const rad60AssignLine = document.getElementById("rad60-assign-line");
const row60Line1 = document.getElementById("row60-line-1");
const row60Line2 = document.getElementById("row60-line-2");
const row60Line3 = document.getElementById("row60-line-3");

const steps = [
  "Enter main",
  "Print table header",
  "Declare degrees",
  "Assign 30 to degrees",
  "Declare radians",
  "Assign Math.toRadians(degrees) to radians",
  "Print row for 30",
  "Target degrees for reassignment",
  "Assign 60 to degrees",
  "Target radians for reassignment",
  "Assign Math.toRadians(degrees) to radians",
  "Print row for 60",
  "End program",
];

let current = -1;
let previousStep = -1;

function animateToMemory(sourceElement, targetElement, finalValue) {
  if (!sourceElement || !targetElement) {
    if (targetElement) targetElement.textContent = finalValue;
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
    if (document.body.contains(flying)) {
      document.body.removeChild(flying);
    }
  });
}

function formatCell(text) {
  return String(text).padEnd(10, " ");
}

function formatRow(deg, rad, sinv, cosv, tanv) {
  return (
    formatCell(deg) +
    formatCell(rad.toFixed(4)) +
    formatCell(sinv.toFixed(4)) +
    formatCell(cosv.toFixed(4)) +
    formatCell(tanv.toFixed(4))
  );
}

function updateOutput() {
  const header =
    formatCell("Degrees") +
    formatCell("Radians") +
    formatCell("Sine") +
    formatCell("Cosine") +
    formatCell("Tangent");

  const r30 = formatRow(
    30,
    Math.PI / 6,
    0.5,
    Math.sqrt(3) / 2,
    1 / Math.sqrt(3),
  );
  const r60 = formatRow(60, Math.PI / 3, Math.sqrt(3) / 2, 0.5, Math.sqrt(3));

  if (current < 1) {
    out1.textContent = "";
    return;
  }

  if (current < 6) {
    out1.textContent = header;
    return;
  }

  if (current < 11) {
    out1.textContent = `${header}\n${r30}`;
    return;
  }

  out1.textContent = `${header}\n${r30}\n${r60}`;
}

function updateMemory(movingForward) {
  document.getElementById("item-degrees").style.display =
    current >= 2 ? "flex" : "none";
  document.getElementById("item-radians").style.display =
    current >= 4 ? "flex" : "none";

  if (movingForward && current === 3) {
    memDegrees.textContent = "";
    animateToMemory(deg30AssignLine, memDegrees, "30");
    memRadians.textContent = "";
    return;
  }

  if (movingForward && current === 5) {
    memRadians.textContent = "";
    animateToMemory(rad30AssignLine, memRadians, "0.5236");
    return;
  }

  if (movingForward && current === 8) {
    animateToMemory(deg60AssignLine, memDegrees, "60");
    memRadians.textContent = "0.5236";
    return;
  }

  if (movingForward && current === 10) {
    animateToMemory(rad60AssignLine, memRadians, "1.0472");
    return;
  }

  if (current < 2) {
    memDegrees.textContent = "";
    memRadians.textContent = "";
  } else if (current < 8) {
    memDegrees.textContent = current >= 3 ? "30" : "";
    memRadians.textContent = current >= 5 ? "0.5236" : "";
  } else {
    memDegrees.textContent = "60";
    memRadians.textContent = current >= 10 ? "1.0472" : "0.5236";
  }
}

function updateHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));

  if (current === 0) {
    mainLine.classList.add("highlight");
  } else if (current === 1) {
    headerLine1.classList.add("highlight");
    headerLine2.classList.add("highlight");
  } else if (current === 2) {
    deg30DeclLine.classList.add("highlight");
  } else if (current === 3) {
    deg30AssignLine.classList.add("highlight");
  } else if (current === 4) {
    rad30DeclLine.classList.add("highlight");
  } else if (current === 5) {
    rad30AssignLine.classList.add("highlight");
  } else if (current === 6) {
    row30Line1.classList.add("highlight");
    row30Line2.classList.add("highlight");
    row30Line3.classList.add("highlight");
  } else if (current === 7) {
    deg60TargetLine.classList.add("highlight");
  } else if (current === 8) {
    deg60AssignLine.classList.add("highlight");
  } else if (current === 9) {
    rad60TargetLine.classList.add("highlight");
  } else if (current === 10) {
    rad60AssignLine.classList.add("highlight");
  } else if (current === 11) {
    row60Line1.classList.add("highlight");
    row60Line2.classList.add("highlight");
    row60Line3.classList.add("highlight");
  }
}

function updateUI() {
  const movingForward = current > previousStep;

  if (current >= 0) {
    memoryExplanation.style.display = "flex";
    memoryExplanation.textContent = steps[current];
  } else {
    memoryExplanation.style.display = "none";
    memoryExplanation.textContent = "";
  }

  updateHighlight();
  updateMemory(movingForward);
  updateOutput();

  backBtn.disabled = current <= -1;
  nextBtn.disabled = current >= steps.length - 1;

  previousStep = current;
}

nextBtn.addEventListener("click", () => {
  if (current < steps.length - 1) {
    current++;
    updateUI();
  }
});

backBtn.addEventListener("click", () => {
  if (current > -1) {
    current--;
    updateUI();
  }
});

updateUI();