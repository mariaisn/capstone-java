const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memoryExplanation = document.getElementById("memory-explanation");
const consoleBox = document.getElementById("console");

const itemI = document.getElementById("item-i");
const itemJ = document.getElementById("item-j");
const itemK = document.getElementById("item-k");

const memI = document.getElementById("mem-i");
const memJ = document.getElementById("mem-j");
const memK = document.getElementById("mem-k");

const calcRow = document.getElementById("calc-row");
const calcNum1 = document.getElementById("calc-num1");
const calcNum2 = document.getElementById("calc-num2");
const calcBool = document.getElementById("calc-bool");

const callLine = document.getElementById("call-line");
const returnLine = document.getElementById("return-line");
const printLine = document.getElementById("print-line");
const mainLine = document.getElementById("main-line");
const maxSignatureLine = document.getElementById("max-signature-line");
const resultDeclLine = document.getElementById("result-decl-line");
const endClassLine = document.getElementById("end-class-line");
const ifLine = document.getElementById("if-line");
const resultNum1Line = document.getElementById("result-num1-line");
const declILine = document.getElementById("decl-i");
const assignILine = document.getElementById("assign-i");
const declJLine = document.getElementById("decl-j");
const assignJLine = document.getElementById("assign-j");

const steps = [
  "Enter main",
  "Declare i",
  "Assign 5 to i",
  "Declare j",
  "Assign 2 to j",
  "Call max(i, j).",
  "Pass num1 and num2",
  "Declare result",
  "(num1 > num2) is true since num1 is 5 and num2 is 2",
  "result is now 5",
  "Return result",
  "Store in k",
  "Print output",
  "End program",
];

const outputText = "The maximum between 5 and 2 is 5";

let current = -1;
let lastAction = "init";

function animateToMemory(sourceElement, targetElement, finalValue) {
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

function renderOutput() {
  consoleBox.innerHTML = "";

  if (current >= 12) {
    const row = document.createElement("div");
    row.className = "console-row";
    row.textContent = outputText;
    consoleBox.appendChild(row);

    if (current === 12 && lastAction === "forward") {
      row.textContent = "";
      animateToMemory(printLine, row, outputText);
    }
  }
}

function updateUI() {
  lines.forEach((line) => line.classList.remove("highlight"));

  const highlightTargets = [
    mainLine,
    declILine,
    assignILine,
    declJLine,
    assignJLine,
    callLine,
    maxSignatureLine,
    resultDeclLine,
    ifLine,
    resultNum1Line,
    returnLine,
    callLine,
    printLine,
    endClassLine,
  ];

  if (current >= 0) {
    const target = highlightTargets[current];
    if (target) {
      target.classList.add("highlight");
    }
    memoryExplanation.style.display = "flex";
    memoryExplanation.innerText = steps[current];
  } else {
    memoryExplanation.style.display = "none";
    memoryExplanation.innerText = "";
  }

  itemI.style.display = current >= 1 ? "flex" : "none";
  itemJ.style.display = current >= 3 ? "flex" : "none";
  itemK.style.display = current >= 11 ? "flex" : "none";

  memI.innerText = current >= 2 ? "5" : "";
  memJ.innerText = current >= 4 ? "2" : "";
  memK.innerText = current >= 11 ? "5" : "";

  if (current === 2 && lastAction === "forward") {
    memI.innerText = "";
    animateToMemory(assignILine, memI, "5");
  }

  if (current === 4 && lastAction === "forward") {
    memJ.innerText = "";
    animateToMemory(assignJLine, memJ, "2");
  }

  calcRow.style.display = current >= 6 ? "flex" : "none";
  calcNum1.innerText = current >= 6 ? "5" : "";
  calcNum2.innerText = current >= 6 ? "2" : "";
  calcBool.innerText = current >= 8 ? "True" : "";

  if (current === 6 && lastAction === "forward") {
    calcNum1.innerText = "";
    calcNum2.innerText = "";
    animateToMemory(callLine, calcNum1, "5");
    animateToMemory(callLine, calcNum2, "2");
  }

  if (current === 11 && lastAction === "forward") {
    memK.innerText = "";
    animateToMemory(returnLine, memK, "5");
  }

  renderOutput();

  backBtn.disabled = current <= -1;
  nextBtn.disabled = current >= steps.length - 1;
}

nextBtn.addEventListener("click", () => {
  if (current < steps.length - 1) {
    current++;
    lastAction = "forward";
    updateUI();
  }
});

backBtn.addEventListener("click", () => {
  if (current > -1) {
    current--;
    lastAction = "back";
    updateUI();
  }
});

updateUI();