// select all spans
const lines = document.querySelectorAll("#high span");

// buttons
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory items
const itemX = document.getElementById("item-x");
const itemY = document.getElementById("item-y");

// memory squares
const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");

// calculation row
const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const compOp = document.getElementById("comp-op");
const eqOp = document.getElementById("eq-op");
const valResult = document.getElementById("val-result");

// output
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");

// explanation
const memoryExplanation = document.getElementById("memory-explanation");

// values
const X_VAL = "7";
const Y_VAL = "3";
const CONST_7 = "7";

// steps
const steps = 9;
let current = -1;

const stepMessages = [
  "Click Next to begin",
  "Declare int x and set x = 7",
  "Evaluate condition: if x == 7",
  "Condition is true, so execution continues inside the if statement",
  "Print x because condition is true",
  "Declare int y and set y = 3",
  "Evaluate condition: if y == 7",
  "Condition is false, so execution goes to the else path",
  "Else block: nothing happens",
  "Done!",
];

function updateMemoryExplanation() {
  if (current < 0) {
    memoryExplanation.style.display = "none";
    memoryExplanation.innerText = "";
  } else if (current + 1 < stepMessages.length) {
    memoryExplanation.style.display = "flex";
    memoryExplanation.innerText = stepMessages[current + 1];
  } else {
    memoryExplanation.style.display = "flex";
    memoryExplanation.innerText = "Done!";
  }
}

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

  flying.addEventListener(
    "transitionend",
    () => {
      targetElement.innerText = finalValue;
      document.body.removeChild(flying);
    },
    { once: true },
  );
}

function clearHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));
}

function highlightRange(...indexes) {
  indexes.forEach((i) => {
    if (lines[i]) lines[i].classList.add("highlight");
  });
}

function updateHighlight() {
  clearHighlight();

  // reset variable box visibility
  itemX.style.display = "none";
  itemY.style.display = "none";

  // reset calc row
  numX.style.display = "none";
  numY.style.display = "none";
  compOp.style.display = "none";
  eqOp.style.display = "none";
  valResult.style.display = "none";

  // reset output lines not used
  out2.innerText = "";
  out3.innerText = "";
  out4.innerText = "";

  // clear values when going backward
  if (current < 0) memX.innerText = "";
  if (current < 4) memY.innerText = "";
  if (current < 3) out1.innerText = "";

  // show x after first step starts
  if (current >= 0) itemX.style.display = "flex";

  // show y after its declaration step starts
  if (current >= 4) itemY.style.display = "flex";

  // step 0: int x = 7
  if (current === 0) {
    highlightRange(0, 1);

    if (memX.innerText === "") {
      animateToMemory(document.getElementById("val-x"), memX, X_VAL);
    }
  }

  // step 1: show 7 == 7 only
  else if (current === 1) {
    highlightRange(2, 3, 4);

    numX.style.display = "flex";
    numY.style.display = "flex";
    compOp.style.display = "flex";

    compOp.innerText = "==";
    numX.innerText = X_VAL;
    numY.innerText = CONST_7;
    valResult.innerText = "";
  }

  // step 2: now show = true
  else if (current === 2) {
    highlightRange(2, 3, 4);

    numX.style.display = "flex";
    numY.style.display = "flex";
    compOp.style.display = "flex";
    eqOp.style.display = "flex";
    valResult.style.display = "flex";

    compOp.innerText = "==";
    numX.innerText = X_VAL;
    numY.innerText = CONST_7;
    valResult.innerText = "true";
  }

  // step 3: print x
  else if (current === 3) {
    highlightRange(5);

    if (out1.innerText === "") {
      animateToMemory(memX, out1, X_VAL);
    }
  }

  // step 4: int y = 3
  else if (current === 4) {
    highlightRange(8, 9);

    if (memY.innerText === "") {
      animateToMemory(document.getElementById("val-y"), memY, Y_VAL);
    }
  }

  // step 5: show 3 == 7 only
  else if (current === 5) {
    highlightRange(10, 11, 12);

    numX.style.display = "flex";
    numY.style.display = "flex";
    compOp.style.display = "flex";

    compOp.innerText = "==";
    numX.innerText = Y_VAL;
    numY.innerText = CONST_7;
    valResult.innerText = "";
  }

  // step 6: now show = false
  else if (current === 6) {
    highlightRange(10, 11, 12);

    numX.style.display = "flex";
    numY.style.display = "flex";
    compOp.style.display = "flex";
    eqOp.style.display = "flex";
    valResult.style.display = "flex";

    compOp.innerText = "==";
    numX.innerText = Y_VAL;
    numY.innerText = CONST_7;
    valResult.innerText = "false";
  }

  // step 7: else line
  else if (current === 7) {
    highlightRange(14);
  }

  // step 8: blank inside else
  else if (current === 8) {
    highlightRange(15);
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