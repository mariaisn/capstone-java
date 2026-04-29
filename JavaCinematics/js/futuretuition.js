// Night mode toggle
const toggle = document.getElementById("toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("night-mode");
  });
}

// code lines
const lines = document.querySelectorAll("#high span");

// buttons
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory items
const memItems = document.querySelectorAll(".mem-item");

// memory squares
const memTuition = document.getElementById("mem-tuition");
const memYear = document.getElementById("mem-year");

// condition row
const numTuitionCond = document.getElementById("mem-num-tuition-cond");
const numLimit = document.getElementById("mem-num-limit");
const condOp = document.getElementById("cond-op");
const condEqOp = document.getElementById("cond-eq-op");
const valCondResult = document.getElementById("val-cond-result");

// math row
const numTuitionMul = document.getElementById("mem-num-tuition-mul");
const numRate = document.getElementById("mem-num-rate");
const mulOp = document.getElementById("mul-op");
const mulEqOp = document.getElementById("mul-eq-op");
const valMulResult = document.getElementById("val-mul-result");

// output and explanation
const out1 = document.getElementById("ou1");
const memoryExplanation = document.getElementById("memory-explanation");

// fixed values for the example
const START_TUITION = 10000.0;
const RATE = 1.07;
const LIMIT = 20000.0;
const FINAL_YEAR = 11;

// step control
let current = -1;
let prevStep = -1;
const steps = 39;

// animate a value from code or memory into another location
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

// format as money with 2 decimal places
function formatMoney(value) {
  return value.toFixed(2);
}

// tuition value by step
function tuitionAt(step) {
  if (step < 1) return null;
  if (step >= 36) return 21048.52;
  if (step >= 33) return 19671.51;
  if (step >= 30) return 18384.59;
  if (step >= 27) return 17181.86;
  if (step >= 24) return 16057.81;
  if (step >= 21) return 15007.3;
  if (step >= 18) return 14025.51;
  if (step >= 15) return 13107.95;
  if (step >= 12) return 12250.42;
  if (step >= 9) return 11448.99;
  if (step >= 6) return 10700.0;
  return 10000.0;
}

// year value by step
function yearAt(step) {
  if (step < 3) return null;
  if (step >= 37) return 11;
  if (step >= 34) return 10;
  if (step >= 31) return 9;
  if (step >= 28) return 8;
  if (step >= 25) return 7;
  if (step >= 22) return 6;
  if (step >= 19) return 5;
  if (step >= 16) return 4;
  if (step >= 13) return 3;
  if (step >= 10) return 2;
  if (step >= 7) return 1;
  return 0;
}

// condition data for each loop check
function getConditionStepData(step) {
  const map = {
    4: { tuition: 10000.0, result: true },
    7: { tuition: 10700.0, result: true },
    10: { tuition: 11448.99, result: true },
    13: { tuition: 12250.42, result: true },
    16: { tuition: 13107.95, result: true },
    19: { tuition: 14025.51, result: true },
    22: { tuition: 15007.3, result: true },
    25: { tuition: 16057.81, result: true },
    28: { tuition: 17181.86, result: true },
    31: { tuition: 18384.59, result: true },
    34: { tuition: 19671.51, result: true },
    37: { tuition: 21048.52, result: false },
  };
  return map[step] || null;
}

// multiplication data for each loop run
function getMultiplyStepData(step) {
  const map = {
    5: { tuition: 10000.0, result: 10700.0 },
    8: { tuition: 10700.0, result: 11448.99 },
    11: { tuition: 11448.99, result: 12250.42 },
    14: { tuition: 12250.42, result: 13107.95 },
    17: { tuition: 13107.95, result: 14025.51 },
    20: { tuition: 14025.51, result: 15007.3 },
    23: { tuition: 15007.3, result: 16057.81 },
    26: { tuition: 16057.81, result: 17181.86 },
    29: { tuition: 17181.86, result: 18384.59 },
    32: { tuition: 18384.59, result: 19671.51 },
    35: { tuition: 19671.51, result: 21048.52 },
  };
  return map[step] || null;
}

// decide which code line should be highlighted
function getHLine(step) {
  if (step < 0) return -1;

  if (step === 0) return 0; // declare tuition
  if (step === 1) return 1; // assign 10000.0
  if (step === 2) return 2; // declare year
  if (step === 3) return 3; // assign 0

  const condSteps = [4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37];
  if (condSteps.includes(step)) return 4;

  const mulSteps = [5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
  if (mulSteps.includes(step)) return 7;

  const incSteps = [6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
  if (incSteps.includes(step)) return 10;

  if (step === 38) return 12;

  return -1;
}

// update memory explanation text
function updateMemoryExplanation() {
  const messages = {
    0: "Declare tuition",
    1: "Assign 10000.0 to tuition",
    2: "Declare year",
    3: "Assign 0 to year",
    4: "Check if tuition is less than 20000.0",
    5: "Multiply tuition by 1.07",
    6: "Increment year to 1",
    7: "Check if tuition is less than 20000.0",
    8: "Multiply tuition by 1.07",
    9: "Increment year to 2",
    10: "Check if tuition is less than 20000.0",
    11: "Multiply tuition by 1.07",
    12: "Increment year to 3",
    13: "Check if tuition is less than 20000.0",
    14: "Multiply tuition by 1.07",
    15: "Increment year to 4",
    16: "Check if tuition is less than 20000.0",
    17: "Multiply tuition by 1.07",
    18: "Increment year to 5",
    19: "Check if tuition is less than 20000.0",
    20: "Multiply tuition by 1.07",
    21: "Increment year to 6",
    22: "Check if tuition is less than 20000.0",
    23: "Multiply tuition by 1.07",
    24: "Increment year to 7",
    25: "Check if tuition is less than 20000.0",
    26: "Multiply tuition by 1.07",
    27: "Increment year to 8",
    28: "Check if tuition is less than 20000.0",
    29: "Multiply tuition by 1.07",
    30: "Increment year to 9",
    31: "Check if tuition is less than 20000.0",
    32: "Multiply tuition by 1.07",
    33: "Increment year to 10",
    34: "Check if tuition is less than 20000.0",
    35: "Multiply tuition by 1.07",
    36: "Increment year to 11",
    37: "tuition < 20000.0 is false",
    38: "Print the final answer",
  };

  if (current >= 0 && messages[current]) {
    memoryExplanation.innerText = messages[current];
    memoryExplanation.style.display = "block";
  } else {
    memoryExplanation.style.display = "none";
  }
}

// clear condition visuals
function clearConditionRow() {
  numTuitionCond.innerText = "";
  numLimit.innerText = "";
  condOp.innerText = "";
  valCondResult.innerText = "";

  numTuitionCond.style.display = "none";
  numLimit.style.display = "none";
  condOp.style.display = "none";
  condEqOp.style.display = "none";
  valCondResult.style.display = "none";
}

// clear multiplication visuals
function clearMultiplyRow() {
  numTuitionMul.innerText = "";
  numRate.innerText = "";
  valMulResult.innerText = "";

  numTuitionMul.style.display = "none";
  numRate.style.display = "none";
  mulOp.style.display = "none";
  mulEqOp.style.display = "none";
  valMulResult.style.display = "none";
}

// main display update
function updateHighlight() {
  const goingForward = current > prevStep;

  // remove old highlight
  lines.forEach((line) => line.classList.remove("highlight"));

  // highlight current code line
  const hLine = getHLine(current);

  if (hLine === 0) {
    if (lines[0]) lines[0].classList.add("highlight");
  } else if (hLine === 1) {
    if (lines[1]) lines[1].classList.add("highlight");
  } else if (hLine === 2) {
    if (lines[2]) lines[2].classList.add("highlight");
  } else if (hLine === 3) {
    if (lines[3]) lines[3].classList.add("highlight");
  } else if (hLine === 4) {
    if (lines[4]) lines[4].classList.add("highlight");
    if (lines[5]) lines[5].classList.add("highlight");
    if (lines[6]) lines[6].classList.add("highlight");
  } else if (hLine === 7) {
    if (lines[7]) lines[7].classList.add("highlight");
    if (lines[8]) lines[8].classList.add("highlight");
    if (lines[9]) lines[9].classList.add("highlight");
  } else if (hLine === 10) {
    if (lines[10]) lines[10].classList.add("highlight");
  } else if (hLine === 12) {
    if (lines[12]) lines[12].classList.add("highlight");
    if (lines[13]) lines[13].classList.add("highlight");
    if (lines[14]) lines[14].classList.add("highlight");
    if (lines[15]) lines[15].classList.add("highlight");
    if (lines[16]) lines[16].classList.add("highlight");
  }

  // reset memory visibility
  memItems.forEach((item) => (item.style.display = "none"));
  if (current >= 0) memItems[0].style.display = "flex";
  if (current >= 2) memItems[1].style.display = "flex";

  // set memory values
  const tuitionValue = tuitionAt(current);
  const yearValue = yearAt(current);

  memTuition.innerText = tuitionValue === null ? "" : formatMoney(tuitionValue);
  memYear.innerText = yearValue === null ? "" : String(yearValue);

  // clear rows first
  clearConditionRow();
  clearMultiplyRow();

  // clear output unless final step
  out1.innerText =
    current >= 38 ? `Tuition will be doubled in ${FINAL_YEAR} years` : "";

  // animate tuition assignment
  if (current === 1) {
    if (goingForward) {
      memTuition.innerText = "";
      animateToMemory(
        document.getElementById("val-tuition"),
        memTuition,
        formatMoney(START_TUITION),
      );
    } else {
      memTuition.innerText = formatMoney(START_TUITION);
    }
  }

  // animate year assignment
  if (current === 3) {
    if (goingForward) {
      memYear.innerText = "";
      animateToMemory(document.getElementById("val-year"), memYear, "0");
    } else {
      memYear.innerText = "0";
    }
  }

  // show condition check
  const condData = getConditionStepData(current);
  if (condData) {
    numTuitionCond.style.display = "flex";
    numLimit.style.display = "flex";
    condOp.style.display = "flex";
    condEqOp.style.display = "flex";
    valCondResult.style.display = "flex";

    numTuitionCond.innerText = formatMoney(condData.tuition);
    numLimit.innerText = formatMoney(LIMIT);
    condOp.innerText = "<";
    valCondResult.innerText = condData.result ? "true" : "false";

    if (goingForward) {
      animateToMemory(
        memTuition,
        numTuitionCond,
        formatMoney(condData.tuition),
      );
      animateToMemory(
        document.getElementById("lit-limit"),
        numLimit,
        formatMoney(LIMIT),
      );
    }
  }

  // show multiplication step
  const mulData = getMultiplyStepData(current);
  if (mulData) {
    numTuitionMul.style.display = "flex";
    numRate.style.display = "flex";
    mulOp.style.display = "flex";
    mulEqOp.style.display = "flex";
    valMulResult.style.display = "flex";

    numTuitionMul.innerText = formatMoney(mulData.tuition);
    numRate.innerText = RATE.toFixed(2);
    valMulResult.innerText = formatMoney(mulData.result);

    if (goingForward) {
      animateToMemory(memTuition, numTuitionMul, formatMoney(mulData.tuition));
      animateToMemory(
        document.getElementById("lit-rate"),
        numRate,
        RATE.toFixed(2),
      );
    }
  }

  // year increment steps
  const incSteps = {
    6: 1,
    9: 2,
    12: 3,
    15: 4,
    18: 5,
    21: 6,
    24: 7,
    27: 8,
    30: 9,
    33: 10,
    36: 11,
  };

  // animate year++
  if (Object.prototype.hasOwnProperty.call(incSteps, current)) {
    const newYear = incSteps[current];
    const oldYear = newYear - 1;

    if (goingForward) {
      memYear.innerText = String(oldYear);
      animateToMemory(
        document.getElementById("inc-year"),
        memYear,
        String(newYear),
      );
    } else {
      memYear.innerText = String(newYear);
    }
  }

  // move multiplication result into tuition
  if (Object.prototype.hasOwnProperty.call(incSteps, current - 1)) {
    const newTuition = tuitionAt(current);
    if (current >= 6 && current <= 36 && (current - 6) % 3 === 0) {
      if (goingForward) {
        memTuition.innerText = formatMoney(tuitionAt(current - 1));
        animateToMemory(valMulResult, memTuition, formatMoney(newTuition));
      } else {
        memTuition.innerText = formatMoney(newTuition);
      }
    }
  }

  // final output
  if (current === 38 && goingForward) {
    out1.innerText = "";
    animateToMemory(
      document.getElementById("lit-out1"),
      out1,
      `Tuition will be doubled in ${FINAL_YEAR} years`,
    );
  }

  // button states
  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1;

  updateMemoryExplanation();
  prevStep = current;
}

// next step
nextBtn.addEventListener("click", () => {
  if (current < steps - 1) {
    current++;
    updateHighlight();
  }
});

// previous step
backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    updateHighlight();
  }
});

// initial load
updateHighlight();
