const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memoryExplanation = document.getElementById("memory-explanation");
const consoleBox = document.getElementById("console");

const itemI1 = document.getElementById("item-i1");
const itemI2 = document.getElementById("item-i2");
const itemResult = document.getElementById("item-result");

const memI1 = document.getElementById("mem-i1");
const memI2 = document.getElementById("mem-i2");
const memResult = document.getElementById("mem-result");

const lineMain = document.getElementById("l8");
const linePrint1 = document.getElementById("l9");
const linePrint2 = document.getElementById("l10");
const linePrint3 = document.getElementById("l11");
const lineSumSig = document.getElementById("l2");
const lineResultDecl = document.getElementById("l3");
const lineFor = document.getElementById("l4");
const lineAcc = document.getElementById("l5");
const lineReturn = document.getElementById("l6");
const lineEnd = document.getElementById("l13");

const steps = [
  "Enter main method",
  "Call sum(1, 10)",
  "Parameters: i1=1, i2=10",
  "Set result = 0",
  "Loop adds from 1 to 10",
  "Return 55",
  "Print first line",
  "Call sum(20, 37)",
  "Loop adds from 20 to 37",
  "Return 513 and print second line",
  "Call sum(35, 49)",
  "Loop adds from 35 to 49",
  "Return 630 and print third line",
  "End program",
];

let current = -1;

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

function highlightOnly(target) {
  lines.forEach((line) => line.classList.remove("highlight"));
  if (target) target.classList.add("highlight");
}

function renderOutput() {
  const out = [];
  if (current >= 6) out.push("Sum from 1 to 10 is 55");
  if (current >= 9) out.push("Sum from 20 to 37 is 513");
  if (current >= 12) out.push("Sum from 35 to 49 is 630");

  consoleBox.innerHTML = out
    .map((t) => `<div class=\"console-row\">${t}</div>`)
    .join("");
}

function updateUI() {
  if (current < 0) {
    memoryExplanation.style.display = "none";
    memoryExplanation.innerText = "";
  } else {
    memoryExplanation.style.display = "flex";
    memoryExplanation.innerText = steps[current] || "";
  }

  itemI1.style.display = current >= 2 ? "flex" : "none";
  itemI2.style.display = current >= 2 ? "flex" : "none";
  itemResult.style.display = current >= 3 ? "flex" : "none";

  if (current < 2) {
    memI1.innerText = "";
    memI2.innerText = "";
  }
  if (current < 3) {
    memResult.innerText = "";
  }

  switch (current) {
    case 0:
      highlightOnly(lineMain);
      break;
    case 1:
      highlightOnly(linePrint1);
      break;
    case 2:
      highlightOnly(lineSumSig);
      memI1.innerText = "1";
      memI2.innerText = "10";
      break;
    case 3:
      highlightOnly(lineResultDecl);
      memI1.innerText = "1";
      memI2.innerText = "10";
      memResult.innerText = "0";
      break;
    case 4:
      highlightOnly(lineAcc);
      memI1.innerText = "1";
      memI2.innerText = "10";
      memResult.innerText = "55";
      break;
    case 5:
      highlightOnly(lineReturn);
      memI1.innerText = "1";
      memI2.innerText = "10";
      memResult.innerText = "55";
      break;
    case 6:
      highlightOnly(linePrint1);
      memI1.innerText = "1";
      memI2.innerText = "10";
      memResult.innerText = "55";
      break;
    case 7:
      highlightOnly(linePrint2);
      memI1.innerText = "20";
      memI2.innerText = "37";
      memResult.innerText = "0";
      break;
    case 8:
      highlightOnly(lineFor);
      memI1.innerText = "20";
      memI2.innerText = "37";
      memResult.innerText = "513";
      break;
    case 9:
      highlightOnly(linePrint2);
      memI1.innerText = "20";
      memI2.innerText = "37";
      memResult.innerText = "513";
      break;
    case 10:
      highlightOnly(linePrint3);
      memI1.innerText = "35";
      memI2.innerText = "49";
      memResult.innerText = "0";
      break;
    case 11:
      highlightOnly(lineFor);
      memI1.innerText = "35";
      memI2.innerText = "49";
      memResult.innerText = "630";
      break;
    case 12:
      highlightOnly(linePrint3);
      memI1.innerText = "35";
      memI2.innerText = "49";
      memResult.innerText = "630";
      break;
    case 13:
      highlightOnly(lineEnd);
      break;
    default:
      highlightOnly(null);
  }

  if (current === 2) {
    memI1.innerText = "";
    memI2.innerText = "";
    animateToMemory(linePrint1, memI1, "1");
    animateToMemory(linePrint1, memI2, "10");
  }

  if (current === 3) {
    memResult.innerText = "";
    animateToMemory(lineResultDecl, memResult, "0");
  }

  renderOutput();

  backBtn.disabled = current <= -1;
  nextBtn.disabled = current >= steps.length - 1;
}

nextBtn.addEventListener("click", () => {
  if (current < steps.length - 1) {
    current += 1;
    updateUI();
  }
});

backBtn.addEventListener("click", () => {
  if (current > -1) {
    current -= 1;
    updateUI();
  }
});

updateUI();