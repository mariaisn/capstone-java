// select all spans
const lines = document.querySelectorAll("#high span");

// button
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory squares
const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");

const memC1 = document.getElementById("mem-c1");
const memC2 = document.getElementById("mem-c2");

// calculation row
const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const valResult = document.getElementById("val-result");

// output variables
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");

// memory items
const memItems = document.querySelectorAll(".mem-item");

// operator symbols
const compOp = document.getElementById("comp-op");
const eqOp = document.getElementById("eq-op");

// steps
const steps = 6;
let current = -1;

const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
  "Click Next to begin",
  "Declare int x and set x = 7",
  "Move x's value (7) to  x",
  "Check condition: if x == 7",
  "Print 'True' because condition is true",
  "Done!",
];
function updateMemoryExplanation() {
  if (current < 0) {
    memoryExplanation.innerText = stepMessages[0];
  } else if (current < stepMessages.length) {
    memoryExplanation.innerText = stepMessages[current];
  } else {
    memoryExplanation.innerText = "Done!";
  }
}

const X_VAL = "7";
const Y_VAL = "3";
const CONST_7 = "True";

// animation
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

function getHLine(step) {
  if (step < 0) return -1;

  // operation highlight windows: [startStep, endStep, spanIndex]
  const ranges = [
    [2, 4, 2],
    [9, 11, 10],
  ];

  // if inside an operation window, freeze highlight
  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

  // keep the print line highlighted for the fly-to-output step
  if (step === 6) return 5;

  // otherwise shift step based on how many lines are skipped
  // (we don't step through braces/else lines as separate highlights)
  let shift = 0;
  if (step >= 7) shift = 1; // jump over first if-block braces
  if (step >= 12) shift = 3; // jump to the blank else-body highlight

  return step + shift;
}

function updateHighlight() {
  // highlight
  lines.forEach((line) => line.classList.remove("highlight"));

  // call to get proper line to highlight into HLine
  const hLine = getHLine(current);

  if (lines[hLine]) lines[hLine].classList.add("highlight");

  // make the if-statement highlight appear as one continuous block
  // (each if line is split across 3 spans in the HTML)
  if (hLine === 2) {
    if (lines[3]) lines[3].classList.add("highlight");
    if (lines[4]) lines[4].classList.add("highlight");
  }
  if (hLine === 10) {
    if (lines[11]) lines[11].classList.add("highlight");
    if (lines[12]) lines[12].classList.add("highlight");
  }

  // hide all memory visuals by default
  memItems.forEach((item) => (item.style.display = "none"));

  // show variable boxes progressively
  // Order in DOM:
  // 0:x, 1:y, 2:cond1, 3:cond2, then template boxes
  if (current >= 0) memItems[0].style.display = "flex"; // x
  if (current >= 7) memItems[1].style.display = "flex"; // y
  if (current >= 4) memItems[2].style.display = "flex"; // cond1
  if (current >= 11) memItems[3].style.display = "flex"; // cond2

  // calc row pieces are not in memItems (except numX/numY/valResult), so control directly
  numX.style.display = "none";
  numY.style.display = "none";
  compOp.style.display = "none";
  eqOp.style.display = "none";
  valResult.style.display = "none";

  // clear values when going backwards
  if (current < 1) memX.innerText = "";
  if (current < 8) memY.innerText = "";

  if (current < 4) memC1.innerText = "";
  if (current < 11) memC2.innerText = "";

  if (current < 6) out1.innerText = "";
  out2.innerText = "";
  out3.innerText = "";
  out4.innerText = "";

  // animate x and y from code to memory
  if (current === 1 && memX.innerText === "") {
    animateToMemory(document.getElementById("val-x"), memX, X_VAL);
  }
  if (current === 8 && memY.innerText === "") {
    animateToMemory(document.getElementById("val-y"), memY, Y_VAL);
  }

  // bring values down during each operation window
  const inAnyOp =
    (current >= 2 && current <= 4) || (current >= 9 && current <= 11);

  if (inAnyOp) {
    numX.style.display = "flex";
    numY.style.display = "flex";

    // if entering the window, animate them down
    if (current === 2 && numX.innerText === "" && numY.innerText === "") {
      animateToMemory(memX, numX, X_VAL);
      animateToMemory(document.getElementById("lit-7a"), numY, CONST_7);
    } else if (
      current === 9 &&
      numX.innerText === "" &&
      numY.innerText === ""
    ) {
      animateToMemory(memY, numX, Y_VAL);
      animateToMemory(document.getElementById("lit-7b"), numY, CONST_7);
    } else {
      // keep them visible if already in window
      if (current >= 2 && current <= 4) {
        numX.innerText = X_VAL;
        numY.innerText = CONST_7;
      }
      if (current >= 9 && current <= 11) {
        numX.innerText = Y_VAL;
        numY.innerText = CONST_7;
      }
    }
  } else {
    // clear when not in window
    numX.innerText = "";
    numY.innerText = "";
  }

  // animate operator symbol in the window / show result
  if (current >= 2 && current <= 4) {
    compOp.style.display = "flex";
    compOp.innerText = "==";
  }
  if (current >= 9 && current <= 11) {
    compOp.style.display = "flex";
    compOp.innerText = "==";
  }

  // show "=" and result (middle step of each window)
  if (current === 3) {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = "true";
  }
  if (current === 10) {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = "false";
  }

  // store to variable
  if (current === 4 && memC1.innerText === "") {
    // ensure result is present as source
    valResult.innerText = "true";
    valResult.style.display = "flex";
    animateToMemory(valResult, memC1, "true");
  }
  if (current === 11 && memC2.innerText === "") {
    valResult.innerText = "false";
    valResult.style.display = "flex";
    animateToMemory(valResult, memC2, "false");
  }

  //fly from memory variable to output
  if (current === 5 && out1.innerText === "") {
    animateToMemory(memX, out1, "True");
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
updateMemoryExplanation();
