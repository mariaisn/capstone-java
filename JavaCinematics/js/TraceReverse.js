const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memoryExplanation = document.getElementById("memory-explanation");
const memI = document.getElementById("mem-i");
const memJ = document.getElementById("mem-j");
const memListRef = document.getElementById("mem-list-ref");
const memReverseRef = document.getElementById("mem-reverse-ref");
const memList2Ref = document.getElementById("mem-list2-ref");
const itemListRef = document.getElementById("item-list-ref");
const itemReverseRef = document.getElementById("item-reverse-ref");
const itemList2Ref = document.getElementById("item-list2-ref");
const calcLeft = document.getElementById("calc-left");
const calcOp = document.getElementById("calc-op");
const calcRight = document.getElementById("calc-right");
const calcEq = document.getElementById("calc-eq");
const calcResult = document.getElementById("calc-result");
const output = document.getElementById("ou1");
const listContainers = Array.from(document.querySelectorAll(".char-container"));

const listCells = [
  document.getElementById("list-0"),
  document.getElementById("list-1"),
  document.getElementById("list-2"),
  document.getElementById("list-3"),
  document.getElementById("list-4"),
  document.getElementById("list-5"),
];

const resultCells = [
  document.getElementById("result-0"),
  document.getElementById("result-1"),
  document.getElementById("result-2"),
  document.getElementById("result-3"),
  document.getElementById("result-4"),
  document.getElementById("result-5"),
];

const list2Cells = [
  document.getElementById("list2-0"),
  document.getElementById("list2-1"),
  document.getElementById("list2-2"),
  document.getElementById("list2-3"),
  document.getElementById("list2-4"),
  document.getElementById("list2-5"),
];

const lineList1 = Array.from(lines).findIndex((line) =>
  line.textContent.includes("int[] list1 = {1, 2, 3, 4, 5, 6};"),
);
const lineList2 = Array.from(lines).findIndex((line) =>
  line.textContent.includes("int[] list2 = reverse(list1);"),
);
const lineMethod = Array.from(lines).findIndex((line) =>
  line.textContent.includes("public static int[] reverse(int[] list)"),
);
const lineResultDecl = Array.from(lines).findIndex((line) =>
  line.textContent.includes("int[] result = new int[list.length];"),
);
const lineLoop = Array.from(lines).findIndex((line) =>
  line.textContent.includes("for (int i = 0, j = result.length - 1"),
);
const lineAssign = Array.from(lines).findIndex((line) =>
  line.textContent.includes("result[j] = list[i];"),
);
const lineReturn = Array.from(lines).findIndex((line) =>
  line.textContent.includes("return result;"),
);

const steps = [
  {
    message: "Create list1 with values 1, 2, 3, 4, 5, 6.",
    highlight: [lineList1],
    list: [1, 2, 3, 4, 5, 6],
    result: ["", "", "", "", "", ""],
    list2: ["", "", "", "", "", ""],
    iValue: "",
    jValue: "",
    calc: null,
    move: null,
  },
  {
    message: "Call reverse(list1).",
    highlight: [lineList2, lineMethod],
    list: [1, 2, 3, 4, 5, 6],
    result: ["", "", "", "", "", ""],
    list2: ["", "", "", "", "", ""],
    iValue: "",
    jValue: "",
    calc: null,
    move: null,
  },
  {
    message: "Create result array with 6 cells, initialized to 0.",
    highlight: [lineResultDecl],
    list: [1, 2, 3, 4, 5, 6],
    result: [0, 0, 0, 0, 0, 0],
    list2: ["", "", "", "", "", ""],
    iValue: "",
    jValue: "",
    calc: null,
    move: null,
  },
  {
    message: "Loop starts: i = 0, j = 5.",
    highlight: [lineLoop],
    list: [1, 2, 3, 4, 5, 6],
    result: [0, 0, 0, 0, 0, 0],
    list2: ["", "", "", "", "", ""],
    iValue: "0",
    jValue: "5",
    calc: null,
    move: null,
  },
  {
    message: "result[5] = list[0] -> 1",
    highlight: [lineAssign],
    list: [1, 2, 3, 4, 5, 6],
    result: [0, 0, 0, 0, 0, 1],
    list2: ["", "", "", "", "", ""],
    iValue: "0",
    jValue: "5",
    calc: { left: "list[0]", op: "=>", right: "result[5]", result: "1" },
    move: { fromListIndex: 0, toResultIndex: 5, value: 1 },
  },
  {
    message: "i = 1, j = 4, then result[4] = list[1] -> 2",
    highlight: [lineLoop, lineAssign],
    list: [1, 2, 3, 4, 5, 6],
    result: [0, 0, 0, 0, 2, 1],
    list2: ["", "", "", "", "", ""],
    iValue: "1",
    jValue: "4",
    calc: { left: "list[1]", op: "=>", right: "result[4]", result: "2" },
    move: { fromListIndex: 1, toResultIndex: 4, value: 2 },
  },
  {
    message: "i = 2, j = 3, then result[3] = list[2] -> 3",
    highlight: [lineLoop, lineAssign],
    list: [1, 2, 3, 4, 5, 6],
    result: [0, 0, 0, 3, 2, 1],
    list2: ["", "", "", "", "", ""],
    iValue: "2",
    jValue: "3",
    calc: { left: "list[2]", op: "=>", right: "result[3]", result: "3" },
    move: { fromListIndex: 2, toResultIndex: 3, value: 3 },
  },
  {
    message: "i = 3, j = 2, then result[2] = list[3] -> 4",
    highlight: [lineLoop, lineAssign],
    list: [1, 2, 3, 4, 5, 6],
    result: [0, 0, 4, 3, 2, 1],
    list2: ["", "", "", "", "", ""],
    iValue: "3",
    jValue: "2",
    calc: { left: "list[3]", op: "=>", right: "result[2]", result: "4" },
    move: { fromListIndex: 3, toResultIndex: 2, value: 4 },
  },
  {
    message: "i = 4, j = 1, then result[1] = list[4] -> 5",
    highlight: [lineLoop, lineAssign],
    list: [1, 2, 3, 4, 5, 6],
    result: [0, 5, 4, 3, 2, 1],
    list2: ["", "", "", "", "", ""],
    iValue: "4",
    jValue: "1",
    calc: { left: "list[4]", op: "=>", right: "result[1]", result: "5" },
    move: { fromListIndex: 4, toResultIndex: 1, value: 5 },
  },
  {
    message: "i = 5, j = 0, then result[0] = list[5] -> 6",
    highlight: [lineLoop, lineAssign],
    list: [1, 2, 3, 4, 5, 6],
    result: [6, 5, 4, 3, 2, 1],
    list2: ["", "", "", "", "", ""],
    iValue: "5",
    jValue: "0",
    calc: { left: "list[5]", op: "=>", right: "result[0]", result: "6" },
    move: { fromListIndex: 5, toResultIndex: 0, value: 6 },
  },
  {
    message: "Return result.",
    highlight: [lineReturn],
    list: [1, 2, 3, 4, 5, 6],
    result: [6, 5, 4, 3, 2, 1],
    list2: [6, 5, 4, 3, 2, 1],
    iValue: "6",
    jValue: "-1",
    calc: null,
    move: null,
  },
  {
    message: "list2 now references the returned reversed array.",
    highlight: [lineList2],
    list: [1, 2, 3, 4, 5, 6],
    result: [6, 5, 4, 3, 2, 1],
    list2: [6, 5, 4, 3, 2, 1],
    iValue: "6",
    jValue: "-1",
    calc: null,
    move: null,
  },
];

let current = -1;
let previousStep = -1;

function setDisplay(element, show, displayType = "flex") {
  if (!element) return;
  element.style.display = show ? displayType : "none";
}

function animateValue(sourceElement, targetElement, value, duration = 700) {
  if (!sourceElement || !targetElement) {
    if (targetElement) targetElement.innerText = String(value);
    return;
  }

  const rectStart = sourceElement.getBoundingClientRect();
  const rectEnd = targetElement.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = String(value);
  flying.style.transition = `all ${duration}ms ease-in-out`;

  document.body.appendChild(flying);

  flying.style.left = `${rectStart.left + rectStart.width / 2}px`;
  flying.style.top = `${rectStart.top + rectStart.height / 2}px`;

  requestAnimationFrame(() => {
    flying.style.left = `${rectEnd.left + rectEnd.width / 2}px`;
    flying.style.top = `${rectEnd.top + rectEnd.height / 2}px`;
  });

  flying.addEventListener("transitionend", () => {
    targetElement.innerText = String(value);
    if (document.body.contains(flying)) {
      document.body.removeChild(flying);
    }
  });
}

function setRow(cells, values) {
  cells.forEach((cell, index) => {
    if (!cell) return;
    const value = values[index];
    cell.innerText = value === "" ? "" : String(value);
  });
}

function setRowVisibility(cells, show) {
  cells.forEach((cell) => {
    if (!cell) return;
    cell.style.visibility = show ? "visible" : "hidden";
  });
}

function clearHighlights() {
  lines.forEach((line) => line.classList.remove("highlight"));
}

function renderCalc(calc) {
  if (!calc) {
    setDisplay(calcLeft, false);
    setDisplay(calcOp, false, "block");
    setDisplay(calcRight, false);
    setDisplay(calcEq, false, "block");
    setDisplay(calcResult, false);
    calcLeft.innerText = "";
    calcOp.innerText = "";
    calcRight.innerText = "";
    calcEq.innerText = "";
    calcResult.innerText = "";
    return;
  }

  setDisplay(calcLeft, true);
  setDisplay(calcOp, true, "block");
  setDisplay(calcRight, true);
  setDisplay(calcEq, true, "block");
  setDisplay(calcResult, true);
  calcLeft.innerText = calc.left;
  calcOp.innerText = calc.op;
  calcRight.innerText = calc.right;
  calcEq.innerText = "=";
  calcResult.innerText = calc.result;
}

function renderStep() {
  const isForward = current > previousStep;
  clearHighlights();

  if (current < 0) {
    setDisplay(memoryExplanation, false, "block");
    memoryExplanation.innerText = "";
    listContainers.forEach((container) => setDisplay(container, false, "flex"));
    setRow(listCells, ["", "", "", "", "", ""]);
    setRow(resultCells, ["", "", "", "", "", ""]);
    setRow(list2Cells, ["", "", "", "", "", ""]);
    setRowVisibility(listCells, false);
    setRowVisibility(resultCells, false);
    setRowVisibility(list2Cells, false);
    memI.innerText = "";
    memJ.innerText = "";
    if (itemListRef) itemListRef.style.display = "none";
    if (itemReverseRef) itemReverseRef.style.display = "none";
    if (itemList2Ref) itemList2Ref.style.display = "none";
    if (memListRef) memListRef.innerText = "";
    if (memReverseRef) memReverseRef.innerText = "";
    if (memList2Ref) memList2Ref.innerText = "";
    renderCalc(null);
    output.innerText = "";
    backBtn.disabled = true;
    nextBtn.disabled = false;
    previousStep = current;
    return;
  }

  const step = steps[current];
  setDisplay(memoryExplanation, true, "block");
  memoryExplanation.innerText = step.message;

  const showList = current >= 0;
  const showResult = current >= 2;
  const showList2 = current >= 1;

  if (itemListRef) itemListRef.style.display = showList ? "flex" : "none";
  if (itemReverseRef) itemReverseRef.style.display = showResult ? "flex" : "none";
  if (itemList2Ref) itemList2Ref.style.display = showList2 ? "flex" : "none";

  if (memListRef) memListRef.innerText = showList ? "ref" : "";
  if (memReverseRef) memReverseRef.innerText = showResult ? "ref" : "";
  if (memList2Ref) memList2Ref.innerText = showList2 ? "ref" : "";

  if (listContainers[0]) setDisplay(listContainers[0], showList, "flex");
  if (listContainers[1]) setDisplay(listContainers[1], showResult, "flex");
  if (listContainers[2]) setDisplay(listContainers[2], showList2, "flex");
  setRowVisibility(listCells, showList);
  setRowVisibility(resultCells, showResult);
  setRowVisibility(list2Cells, showList2);

  step.highlight.forEach((index) => {
    if (index >= 0 && lines[index]) {
      lines[index].classList.add("highlight");
    }
  });

  setRow(listCells, step.list);

  if (step.move && isForward) {
    const toIndex = step.move.toResultIndex;
    const targetCell = resultCells[toIndex];
    if (targetCell) targetCell.innerText = "";

    step.result.forEach((value, index) => {
      if (index !== toIndex && resultCells[index]) {
        resultCells[index].innerText = value === "" ? "" : String(value);
      }
    });

    animateValue(listCells[step.move.fromListIndex], targetCell, step.move.value, 700);
  } else {
    setRow(resultCells, step.result);
  }

  setRow(list2Cells, step.list2);

  memI.innerText = step.iValue;
  memJ.innerText = step.jValue;

  renderCalc(step.calc);
  output.innerText = "";

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps.length - 1;
  previousStep = current;
}

nextBtn.addEventListener("click", () => {
  if (current < steps.length - 1) {
    current += 1;
    renderStep();
  }
});

backBtn.addEventListener("click", () => {
  if (current > -1) {
    current -= 1;
    renderStep();
  }
});

renderStep();
