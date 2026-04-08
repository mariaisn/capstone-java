const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memoryExplanation = document.getElementById("memory-explanation");
const memI = document.getElementById("mem-i");
const calcLeft = document.getElementById("calc-left");
const calcOp = document.getElementById("calc-op");
const calcRight = document.getElementById("calc-right");
const calcEq = document.getElementById("calc-eq");
const calcResult = document.getElementById("calc-result");
const output = document.getElementById("ou1");

const arrayCells = [
  document.getElementById("arr-0"),
  document.getElementById("arr-1"),
  document.getElementById("arr-2"),
  document.getElementById("arr-3"),
  document.getElementById("arr-4"),
];

const lineCreateArray = Array.from(lines).findIndex((line) =>
  line.textContent.includes("int[] values = new int[5];"),
);
const lineForLoop = Array.from(lines).findIndex((line) =>
  line.textContent.includes("for (int i = 1; i < 5; i++)"),
);
const lineLoopAssign = Array.from(lines).findIndex((line) =>
  line.textContent.includes("values[i] = i + values[i - 1];"),
);
const lineFinalAssign = Array.from(lines).findIndex((line) =>
  line.textContent.includes("values[0] = values[1] + values[4];"),
);

const steps = [
  {
    message: "Create values array with 5 cells. Java initializes all int cells to 0.",
    highlight: [lineCreateArray],
    values: [0, 0, 0, 0, 0],
    iValue: "",
    animateIFromCode: false,
    calc: null,
    output: "",
  },
  {
    message: "Loop step: i = 1, so values[1] = 1 + values[0] = 1 + 0 = 1.",
    highlight: [lineForLoop, lineLoopAssign],
    values: [0, 1, 0, 0, 0],
    iValue: "1",
    animateIFromCode: true,
    calc: {
      left: "1",
      op: "+",
      right: "0",
      result: "1",
      leftSource: "i",
      rightSourceIndex: 0,
    },
    output: "",
  },
  {
    message: "Loop step: i = 2, so values[2] = 2 + values[1] = 2 + 1 = 3.",
    highlight: [lineForLoop, lineLoopAssign],
    values: [0, 1, 3, 0, 0],
    iValue: "2",
    animateIFromCode: true,
    calc: {
      left: "2",
      op: "+",
      right: "1",
      result: "3",
      leftSource: "i",
      rightSourceIndex: 1,
    },
    output: "",
  },
  {
    message: "Loop step: i = 3, so values[3] = 3 + values[2] = 3 + 3 = 6.",
    highlight: [lineForLoop, lineLoopAssign],
    values: [0, 1, 3, 6, 0],
    iValue: "3",
    animateIFromCode: true,
    calc: {
      left: "3",
      op: "+",
      right: "3",
      result: "6",
      leftSource: "i",
      rightSourceIndex: 2,
    },
    output: "",
  },
  {
    message: "Loop step: i = 4, so values[4] = 4 + values[3] = 4 + 6 = 10.",
    highlight: [lineForLoop, lineLoopAssign],
    values: [0, 1, 3, 6, 10],
    iValue: "4",
    animateIFromCode: true,
    calc: {
      left: "4",
      op: "+",
      right: "6",
      result: "10",
      leftSource: "i",
      rightSourceIndex: 3,
    },
    output: "",
  },
  {
    message: "Loop ends after i reaches 5 because i < 5 is no longer true.",
    highlight: [lineForLoop],
    values: [0, 1, 3, 6, 10],
    iValue: "5",
    animateIFromCode: true,
    calc: null,
    output: "",
  },
  {
    message: "values[0] = values[1] + values[4] = 1 + 10 = 11.",
    highlight: [lineFinalAssign],
    values: [11, 1, 3, 6, 10],
    iValue: "5",
    animateIFromCode: false,
    calc: {
      left: "1",
      op: "+",
      right: "10",
      result: "11",
      leftSourceIndex: 1,
      rightSourceIndex: 4,
    },
    output: "",
  },
];

let current = -1;
let previousStep = -1;

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

function setDisplay(element, show, displayType = "flex") {
  if (!element) return;
  element.style.display = show ? displayType : "none";
}

function clearHighlights() {
  lines.forEach((line) => line.classList.remove("highlight"));
}

function renderCalc(calc, isForward) {
  if (!calc) {
    calcLeft.innerText = "";
    calcOp.innerText = "";
    calcRight.innerText = "";
    calcEq.innerText = "";
    calcResult.innerText = "";
    setDisplay(calcLeft, false);
    setDisplay(calcOp, false, "block");
    setDisplay(calcRight, false);
    setDisplay(calcEq, false, "block");
    setDisplay(calcResult, false);
    return;
  }

  calcLeft.innerText = "";
  calcOp.innerText = calc.op;
  calcRight.innerText = "";
  calcEq.innerText = "=";
  calcResult.innerText = "";
  setDisplay(calcLeft, true);
  setDisplay(calcOp, true, "block");
  setDisplay(calcRight, true);
  setDisplay(calcEq, true, "block");
  setDisplay(calcResult, true);

  if (isForward) {
    const leftSource =
      calc.leftSource === "i"
        ? memI
        : Number.isInteger(calc.leftSourceIndex)
          ? arrayCells[calc.leftSourceIndex]
          : null;
    const rightSource = Number.isInteger(calc.rightSourceIndex)
      ? arrayCells[calc.rightSourceIndex]
      : null;

    animateValue(leftSource, calcLeft, calc.left, 650);
    animateValue(rightSource, calcRight, calc.right, 650);

    setTimeout(() => {
      calcResult.innerText = calc.result;
    }, 700);
  } else {
    calcLeft.innerText = calc.left;
    calcRight.innerText = calc.right;
    calcResult.innerText = calc.result;
  }
}

function renderStep() {
  const isForward = current > previousStep;
  clearHighlights();

  if (current < 0) {
    setDisplay(memoryExplanation, false, "block");
    memoryExplanation.innerText = "";
    arrayCells.forEach((cell) => {
      if (cell) cell.innerText = "";
    });
    memI.innerText = "";
    renderCalc(null, isForward);
    output.innerText = "";
    backBtn.disabled = true;
    nextBtn.disabled = false;
    previousStep = current;
    return;
  }

  const step = steps[current];
  setDisplay(memoryExplanation, true, "block");

  step.highlight.forEach((index) => {
    if (index >= 0 && lines[index]) {
      lines[index].classList.add("highlight");
    }
  });

  memoryExplanation.innerText = step.message;

  step.values.forEach((value, index) => {
    if (arrayCells[index]) {
      arrayCells[index].innerText = String(value);
    }
  });

  if (!step.iValue) {
    memI.innerText = "";
  } else if (isForward && step.animateIFromCode) {
    memI.innerText = "";
    animateValue(lines[lineForLoop], memI, step.iValue, 650);
  } else {
    memI.innerText = step.iValue;
  }

  renderCalc(step.calc, isForward);
  output.innerText = step.output;

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