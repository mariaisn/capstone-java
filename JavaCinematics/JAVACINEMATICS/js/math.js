//select all lines
const lines = document.querySelectorAll("#high span");

//BUTTON CODE
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");

const memADD = document.getElementById("mem-add");
const memSub = document.getElementById("mem-sub");
const memMul = document.getElementById("mem-mul");
const memDiv = document.getElementById("mem-div");
const memRem = document.getElementById("mem-rem");

const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const numSum = document.getElementById("val-sum");

//output variables
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");
const out5 = document.getElementById("ou5");
const out6 = document.getElementById("ou6");

const memItems = document.querySelectorAll(".mem-item");

//MATH SYMBOLS
const plusOp = document.getElementById("plus-op");
const minuOp = document.getElementById("minus-op");
const multOp = document.getElementById("multi-op");
const diviOp = document.getElementById("divi-op");
const remOp = document.getElementById("rem-op");

const equalOp = document.getElementById("equal-op");

//start page with nopthing highlighted
const steps = 38;
let current = -1;

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

  if (step >= 5 && step <= 7) return 5;
  else if (step >= 10 && step <= 12) return 8;
  else if (step >= 15 && step <= 17) return 11;
  else if (step >= 20 && step <= 22) return 14;
  else if (step >= 25 && step <= 27) return 17;
  else if (step >= 34 && step <= 36) return 24;

  let temp = 0;
  if (step > 7) temp = temp - 2;
  if (step > 12) temp = temp - 2;
  if (step > 17) temp = temp - 2;
  if (step > 22) temp = temp - 2;
  if (step > 27) temp = temp - 2;
  if (step > 36) temp = temp - 2;

  return step + temp;
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
  // step 0 declares x
  if (current >= 0) {
    memItems[0].style.display = "flex";
  }

  // step 2 declares y
  if (current >= 2) {
    memItems[1].style.display = "flex";
  }

  // step 4 declares add
  if (current >= 4) {
    memItems[2].style.display = "flex";
  }

  //step 7

  //step 9 declare sub
  if (current >= 9) {
    memItems[3].style.display = "flex";
  }
  //step 14 declare mul
  if (current >= 14) {
    memItems[4].style.display = "flex";
  }
  //step 19 declare div
  if (current >= 19) {
    memItems[5].style.display = "flex";
  }
  //step 24 declare rem
  if (current >= 24) {
    memItems[6].style.display = "flex";
  }

  //bring x and y down
  if (
    (current >= 5 && current <= 7) ||
    (current >= 10 && current <= 12) ||
    (current >= 15 && current <= 17) ||
    (current >= 20 && current <= 22) ||
    (current >= 25 && current <= 27)
  ) {
    numX.style.display = "flex";
    numY.style.display = "flex";
  }

  if (
    (current >= 6 && current <= 7) ||
    (current >= 11 && current <= 12) ||
    (current >= 16 && current <= 17) ||
    (current >= 21 && current <= 22) ||
    (current >= 26 && current <= 27)
  ) {
    numX.innerText = "13";
    numY.innerText = "5";
  }

  // clears values when going backwards
  if (current < 1) memX.innerText = "";
  if (current < 3) memY.innerText = "";
  if (current < 6) numSum.innerText = "";

  if (
    !(
      (current >= 5 && current <= 7) ||
      (current >= 10 && current <= 12) ||
      (current >= 15 && current <= 17) ||
      (current >= 20 && current <= 22) ||
      (current >= 25 && current <= 27)
    )
  ) {
    numX.innerText = "";
    numY.innerText = "";
  }

  if (current < 7) memADD.innerText = "";
  if (current < 12) memSub.innerText = "";
  if (current < 17) memMul.innerText = "";
  if (current < 22) memDiv.innerText = "";
  if (current < 27) memRem.innerText = "";

  if (current < 8) {
    out1.style.display = "none";
    out1.innerText = "";
  }

  // animate going forward
  // initiates x
  if (current === 1 && memX.innerText === "") {
    animateToMemory(document.getElementById("val-x"), memX, "13");
  }
  // initiates y
  if (current === 3 && memY.innerText === "") {
    animateToMemory(document.getElementById("val-y"), memY, "5");
  }
  //animate x and y down
  if (
    (current === 5 ||
      current === 10 ||
      current === 15 ||
      current === 20 ||
      current === 25) &&
    numX.innerText === "" &&
    numY.innerText === ""
  ) {
    animateToMemory(memX, numX, "13");
    animateToMemory(memY, numY, "5");
  }

  //show sum
  if (current >= 6 && current <= 7) {
    numSum.style.display = "flex";
    numSum.innerText = "18";
  }

  if (current >= 11 && current <= 12) {
    numSum.style.display = "flex";
    numSum.innerText = "8";
  }

  if (current >= 16 && current <= 17) {
    numSum.style.display = "flex";
    numSum.innerText = "65";
  }

  if (current >= 21 && current <= 22) {
    numSum.style.display = "flex";
    numSum.innerText = "2";
  }

  if (current >= 26 && current <= 27) {
    numSum.style.display = "flex";
    numSum.innerText = "3";
  }

  // initiates add
  if (current === 7 && memADD.innerText === "") {
    animateToMemory(numSum, memADD, "18");
  }
  if (current === 12 && memSub.innerText === "") {
    animateToMemory(numSum, memSub, "8");
  }
  if (current === 17 && memMul.innerText === "") {
    animateToMemory(numSum, memMul, "65");
  }
  if (current === 22 && memDiv.innerText === "") {
    animateToMemory(numSum, memDiv, "2");
  }
  if (current === 27 && memRem.innerText === "") {
    animateToMemory(numSum, memRem, "3");
  }

  //animate add to console
  if (current === 8 && out1.innerText === "") {
    numSum.style.display = "none";
    out1.style.display = "flex";
    out1.innerText = "18";
    animateToMemory(memADD, out1, "18");
  }
  if (current === 13 && out2.innerText === "") {
    numSum.style.display = "none";
    out2.style.display = "flex";
    out2.innerText = "18";
    animateToMemory(memADD, out2, "8");
  }
  if (current === 18 && out3.innerText === "") {
    numSum.style.display = "none";
    out3.style.display = "flex";
    out3.innerText = "18";
    animateToMemory(memADD, out3, "65");
  }
  if (current === 23 && out4.innerText === "") {
    numSum.style.display = "none";
    out4.style.display = "flex";
    out4.innerText = "18";
    animateToMemory(memADD, out4, "2");
  }
  if (current === 28 && out5.innerText === "") {
    numSum.style.display = "none";
    out5.style.display = "flex";
    out5.innerText = "18";
    animateToMemory(memADD, out5, "3");
  }

  // hide operators
  plusOp.style.display = "none";
  minuOp.style.display = "none";
  multOp.style.display = "none";
  diviOp.style.display = "none";
  remOp.style.display = "none";

  equalOp.style.display = "none";

  // show addition visuals when calculating add
  // START EDITING HERE
  if (current >= 5 && current <= 7) {
    plusOp.style.display = "block";
  }

  if (current >= 10 && current <= 12) {
    minuOp.style.display = "block";
  }

  if (current >= 15 && current <= 17) {
    multOp.style.display = "block";
  }

  if (current >= 20 && current <= 22) {
    diviOp.style.display = "block";
  }

  if (current >= 25 && current <= 27) {
    remOp.style.display = "block";
  }

  if (
    (current >= 6 && current <= 7) ||
    (current >= 11 && current <= 12) ||
    (current >= 16 && current <= 17) ||
    (current >= 21 && current <= 22) ||
    (current >= 26 && current <= 27)
  ) {
    equalOp.style.display = "flex";
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

const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
  "Start: Declare x",
  "Declare x = 13",
  "Declare y = 5",
  "y is set",
  "Add x + y",
  "Sum calculated",
  "Show sum",
  "Sum stored",
  "Print sum",
  "Subtract y from x",
  "Difference calculated",
  "Show difference",
  "Difference stored",
  "Print difference",
  "Multiply x * y",
  "Product calculated",
  "Show product",
  "Product stored",
  "Print product",
  "Divide x / y",
  "Quotient calculated",
  "Show quotient",
  "Quotient stored",
  "Print quotient",
  "Remainder x % y",
  "Remainder calculated",
  "Show remainder",
  "Remainder stored",
  "Print remainder",
  "Declare double x1",
  "x1 is set",
  "Declare double y1",
  "y1 is set",
  "Divide x1 / y1",
  "Double quotient calculated",
  "Show double quotient",
  "Double quotient stored",
  "Print double quotient",
  "Done!",
];

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
