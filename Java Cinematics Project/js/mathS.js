//select all lines
const lines = document.querySelectorAll("#high span");

//BUTTON CODE
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memX1 = document.getElementById("mem-x1");
const memY1 = document.getElementById("mem-y1");

const memADD = document.getElementById("mem-add");
const memSub = document.getElementById("mem-sub");
const memMul = document.getElementById("mem-mul");
const memDiv = document.getElementById("mem-div");
const memRem = document.getElementById("mem-rem");
const memDiv2 = document.getElementById("mem-div2");

const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const numSum = document.getElementById("val-sum");
const numX1 = document.getElementById("mem-num-x1");
const numY1 = document.getElementById("mem-num-y1");
const numSum2 = document.getElementById("val-sum2");

const memItems = document.querySelectorAll(".mem-item");

//MATH SYMBOLS
const plusOp = document.getElementById("plus-op");
const minuOp = document.getElementById("minus-op");
const multOp = document.getElementById("multi-op");
const diviOp = document.getElementById("divi-op");
const remOp = document.getElementById("rem-op");
const diviOp2 = document.getElementById("divi-op2");

const equalOp = document.getElementById("equal-op");
const equalOp2 = document.getElementById("equal-op2");

//console
const conIn = document.getElementById("console-input");
const conBox = document.getElementById("console");

let X_VAL;
let Y_VAL;
let X1_VAL;
let Y1_VAL;

//start page with nopthing highlighted
const steps = 42;
let current = -1;

const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
  "Declare x",
  "Assign 13 to x",
  "Declare y",
  "Assign 5 to y",
  "Declare add",
  "Add x and y",
  "Calculate Sum",
  "Assign 18 to add",
  "Print add",
  "Declare sub",
  "Subtract x and y",
  "Calculate Difference",
  "Assign 8 to sub",
  "Print sub",
  "Declare mul",
  "Multiply x and y",
  "Calculate Multiplication",
  "Assign 65 to mul",
  "Print Mul",
  "Declare div",
  "Divide x and y",
  "Calculate Division",
  "Assign 2 to div",
  "Print div",
  "Declare rem",
  "Get Remainder of x and y",
  "Calculate Remainder",
  "Assign 3 to rem",
  "Print rem",
  "Declare double x1",
  "Assign 13.0 to x1",
  "Declare double y1",
  "Assign 5.0 to y1",
  "Declare div2",
  "Divide x1 and y1",
  "Calculate Division",
  "Assign 2.6 to div2",
  "Print div2",
  "Done!",
];

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

//function to calculate what line to highlight
//keeps highlight still during math process
//corrects line skips
function getHLine(step) {
  if (step < 0) return -1;

  // operation highlight windows: [startStep, endStep, spanIndex]
  const ranges = [
    [1, 2, 1],
    [4, 5, 3],
    [7, 9, 5],
    [12, 14, 8],
    [17, 19, 11],
    [22, 24, 14],
    [27, 29, 17],
    [32, 33, 20],
    [35, 36, 22],
    [38, 40, 24],
  ];

  // if inside an operation window, freeze highlight
  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }
  let temp = 0;
  if (step > 2) temp = temp - 1;
  if (step > 5) temp = temp - 1;
  if (step > 9) temp = temp - 2;
  if (step > 14) temp = temp - 2;
  if (step > 19) temp = temp - 2;
  if (step > 24) temp = temp - 2;
  if (step > 29) temp = temp - 2;
  if (step > 33) temp = temp - 1;
  if (step > 36) temp = temp - 1;
  if (step > 40) temp = temp - 2;

  return step + temp;
}

conIn.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const value = conIn.value;

    const source = addConsoleRow(value); // 👈 creates a new row

    if (current === 1) {
      X_VAL = Number(value);
      animateToMemory(source, memX, X_VAL);
    }

    if (current === 4) {
      Y_VAL = Number(value);
      animateToMemory(source, memY, Y_VAL);
    }

    if (current === 32) {
      X1_VAL = Number(value);
      animateToMemory(source, memX1, X1_VAL);
    }

    if (current === 35) {
      Y1_VAL = Number(value);
      animateToMemory(source, memY1, Y1_VAL);
    }

    conIn.value = "";
    conIn.style.display = "none";
    current++;
    updateHighlight();
    updateMemoryExplanation();
  }
});

function addConsoleRow(text) {
  const row = document.createElement("div");
  row.className = "console-row";

  const span = document.createElement("span");
  span.innerText = text;

  row.appendChild(span);
  conBox.appendChild(row);

  return span;
}

function updateHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));

  //call to get proper line to highlight into hLine
  const hLine = getHLine(current);

  //highlights the line
  if (lines[hLine]) {
    lines[hLine].classList.add("highlight");
  }

  memItems.forEach((item) => (item.style.display = "none"));
  memoryExplanation.style.display = "none";

  let tAdd = X_VAL + Y_VAL;
  let tSub = X_VAL - Y_VAL;
  let tMul = X_VAL * Y_VAL;
  let tDiv = X_VAL / Y_VAL;
  let tRem = X_VAL % Y_VAL;
  let tDiv2 = X1_VAL / Y1_VAL;

  const inputSteps = [1, 4, 32, 35];

  if (inputSteps.includes(current)) {
    conIn.style.display = "block";
    conIn.focus();
  } else {
    conIn.style.display = "none";
  }

  // step 0 declares x
  if (current >= 0) {
    memItems[0].style.display = "flex";
    memoryExplanation.style.display = "flex";
  }

  // step 3 declares y
  if (current >= 3) {
    memItems[1].style.display = "flex";
  }

  // step 4 declares add
  if (current >= 6) {
    memItems[2].style.display = "flex";
  }

  //step 7

  //step 9 declare sub
  if (current >= 11) {
    memItems[3].style.display = "flex";
  }
  //step 14 declare mul
  if (current >= 16) {
    memItems[4].style.display = "flex";
  }
  //step 19 declare div
  if (current >= 21) {
    memItems[5].style.display = "flex";
  }
  //step 26 declare rem
  if (current >= 26) {
    memItems[6].style.display = "flex";
  }

  if (current >= 31) {
    memItems[10].style.display = "flex";
  }

  if (current >= 34) {
    memItems[11].style.display = "flex";
  }

  if (current >= 37) {
    memItems[12].style.display = "flex";
  }

  //bring x and y down
  const inAnyOp =
    (current >= 7 && current <= 9) ||
    (current >= 12 && current <= 14) ||
    (current >= 17 && current <= 19) ||
    (current >= 22 && current <= 24) ||
    (current >= 27 && current <= 29);

  if (inAnyOp) {
    numX.style.display = "flex";
    numY.style.display = "flex";

    // if entering the window, animate them down
    if (
      current === 7 ||
      current === 12 ||
      current === 17 ||
      current === 22 ||
      current === 27
    ) {
      animateToMemory(memX, numX, X_VAL);
      animateToMemory(memY, numY, Y_VAL);
    } else {
      // keep them visible if already in window
      if (
        (current >= 8 && current <= 9) ||
        (current >= 13 && current <= 14) ||
        (current >= 18 && current <= 19) ||
        (current >= 23 && current <= 24) ||
        (current >= 28 && current <= 29)
      ) {
        numX.innerText = X_VAL;
        numY.innerText = Y_VAL;
      }
    }
  } else {
    // clear when not in window
    numX.innerText = "";
    numY.innerText = "";
  }

  //bring x1 and y1 down

  if (current >= 38 && current <= 40) {
    numX1.style.display = "flex";
    numY1.style.display = "flex";

    // if entering the window, animate them down
    if (current === 38) {
      animateToMemory(memX, numX, X1_VAL);
      animateToMemory(memY, numY, Y1_VAL);
    } else {
      // keep them visible if already in window
      if (current >= 39 && current <= 40) {
        numX1.innerText = X1_VAL;
        numY1.innerText = Y1_VAL;
      }
    }
  } else {
    // clear when not in window
    numX1.innerText = "";
    numY1.innerText = "";
  }

  if (current < 9) memADD.innerText = "";
  if (current < 14) memSub.innerText = "";
  if (current < 19) memMul.innerText = "";
  if (current < 24) memDiv.innerText = "";
  if (current < 29) memRem.innerText = "";
  if (current < 40) memDiv2.innerText = "";

  //show sum
  if (current >= 8 && current <= 9) {
    numSum.style.display = "flex";
    numSum.innerText = tAdd;
  }

  if (current >= 13 && current <= 14) {
    numSum.style.display = "flex";
    numSum.innerText = tSub;
  }

  if (current >= 18 && current <= 19) {
    numSum.style.display = "flex";
    numSum.innerText = tMul;
  }

  if (current >= 23 && current <= 24) {
    numSum.style.display = "flex";
    numSum.innerText = tDiv;
  }

  if (current >= 28 && current <= 29) {
    numSum.style.display = "flex";
    numSum.innerText = tRem;
  }

  if (current >= 39 && current <= 40) {
    numSum2.style.display = "flex";
    numSum2.innerText = tDiv2;
  }

  // initiates add
  if (current === 9 && memADD.innerText === "") {
    animateToMemory(numSum, memADD, tAdd);
  }
  if (current === 14 && memSub.innerText === "") {
    animateToMemory(numSum, memSub, tSub);
  }
  if (current === 19 && memMul.innerText === "") {
    animateToMemory(numSum, memMul, tMul);
  }
  if (current === 24 && memDiv.innerText === "") {
    animateToMemory(numSum, memDiv, tDiv);
  }
  if (current === 29 && memRem.innerText === "") {
    animateToMemory(numSum, memRem, tRem);
  }
  if (current == 40 && memDiv2.innerText === "") {
    animateToMemory(numSum2, memDiv2, tDiv2);
  }

  // hide operators
  plusOp.style.display = "none";
  minuOp.style.display = "none";
  multOp.style.display = "none";
  diviOp.style.display = "none";
  remOp.style.display = "none";
  diviOp2.style.display = "none";

  equalOp2.style.display = "none";
  equalOp.style.display = "none";

  // show math operators
  if (current >= 7 && current <= 9) {
    plusOp.style.display = "block";
  }

  if (current >= 12 && current <= 14) {
    minuOp.style.display = "block";
  }

  if (current >= 17 && current <= 19) {
    multOp.style.display = "block";
  }

  if (current >= 22 && current <= 24) {
    diviOp.style.display = "block";
  }

  if (current >= 27 && current <= 29) {
    remOp.style.display = "block";
  }
  if (current >= 38 && current <= 40) {
    diviOp2.style.display = "block";
  }

  if (
    (current >= 8 && current <= 9) ||
    (current >= 13 && current <= 14) ||
    (current >= 18 && current <= 19) ||
    (current >= 23 && current <= 24) ||
    (current >= 28 && current <= 29)
  ) {
    equalOp.style.display = "flex";
  }

  if (current >= 39 && current <= 40) {
    equalOp2.style.display = "flex";
  }

  if (current === 10) {
    numSum.style.display = "none";
    const x = addConsoleRow(tAdd);
    animateToMemory(memADD, x, tAdd);
  }
  if (current === 15) {
    numSum.style.display = "none";
    const x = addConsoleRow(tSub);
    animateToMemory(memSub, x, tSub);
  }
  if (current === 20) {
    numSum.style.display = "none";
    const x = addConsoleRow(tMul);
    animateToMemory(memMul, x, tMul);
  }
  if (current === 25) {
    numSum.style.display = "none";
    const x = addConsoleRow(tDiv);
    animateToMemory(memDiv, x, tDiv);
  }
  if (current === 30) {
    numSum.style.display = "none";
    const x = addConsoleRow(tRem);
    animateToMemory(memRem, x, tRem);
  }
  if (current === 41) {
    numSum2.style.display = "none";
    const x = addConsoleRow(tDiv2);
    animateToMemory(memDiv2, x, tDiv2);
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1;
}

nextBtn.addEventListener("click", () => {
  if (current < steps - 1) {
    current++;
    updateHighlight();
    updateMemoryExplanation();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    updateHighlight();
    updateMemoryExplanation();
  }
});

updateHighlight();

function updateMemoryExplanation() {
  if (current < 0) {
    memoryExplanation.innerText = "Click Next to begin!";
  } else if (current < stepMessages.length) {
    memoryExplanation.innerText = stepMessages[current];
  } else {
    memoryExplanation.innerText = "Done!";
  }
}

updateMemoryExplanation();