// Night mode toggle
const toggle = document.getElementById("toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("night-mode");
  });
}

const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memoryExplanation = document.getElementById("memory-explanation");
const memN = document.getElementById("mem-n");
const memSum = document.getElementById("mem-sum");
const memAverage = document.getElementById("mem-average");
const memCount = document.getElementById("mem-count");
const memI = document.getElementById("mem-i");
const itemN = document.getElementById("item-n");
const itemSum = document.getElementById("item-sum");
const itemAverage = document.getElementById("item-average");
const itemCount = document.getElementById("item-count");
const itemI = document.getElementById("item-i");
const numbersContainer = document.getElementById("numbers-container");

const arrayCells = [
  document.getElementById("arr-0"),
  document.getElementById("arr-1"),
  document.getElementById("arr-2"),
  document.getElementById("arr-3"),
  document.getElementById("arr-4"),
];

const calcLeft = document.getElementById("calc-left");
const calcOp = document.getElementById("calc-op");
const calcRight = document.getElementById("calc-right");
const calcEq = document.getElementById("calc-eq");
const calcResult = document.getElementById("calc-result");

const outLine1 = document.getElementById("ou1");
const outLine2 = document.getElementById("ou2");
const outLine3 = document.getElementById("ou3");
const outLine4 = document.getElementById("ou4");

const consoleRow = document.getElementById("console-input-row");
const promptEl = document.getElementById("prompt");
const consoleInput = document.getElementById("console-input");

// --- Line index lookups ---
const lineScanner = Array.from(lines).findIndex((l) =>
  l.textContent.includes("java.util.Scanner input"),
);
const linePrintN = Array.from(lines).findIndex((l) =>
  l.textContent.includes("number of items"),
);
const lineReadN = Array.from(lines).findIndex((l) =>
  l.textContent.includes("int n = input.nextInt"),
);
const lineCreateArray = Array.from(lines).findIndex((l) =>
  l.textContent.includes("double[] numbers = new double[n]"),
);
const lineSumInit = Array.from(lines).findIndex((l) =>
  l.textContent.includes("double sum = 0"),
);
const linePrintNumbers = Array.from(lines).findIndex((l) =>
  l.textContent.includes("Enter the numbers"),
);
const lineForLoop1 = Array.from(lines).findIndex(
  (l) => l.textContent.trim() === "for (int i = 0; i < n; i++) {",
);
const lineReadNum = Array.from(lines).findIndex((l) =>
  l.textContent.includes("numbers[i] = input.nextDouble"),
);
const lineSumAdd = Array.from(lines).findIndex((l) =>
  l.textContent.includes("sum += numbers[i]"),
);
const lineAverage = Array.from(lines).findIndex((l) =>
  l.textContent.includes("double average = sum / n"),
);
const lineCountInit = Array.from(lines).findIndex((l) =>
  l.textContent.includes("int count = 0"),
);
const lineForLoop2 = Array.from(lines).findIndex(
  (l) => l.textContent.trim() === "for (int i = 0; i < n; i++)",
);
const lineIfAbove = Array.from(lines).findIndex((l) =>
  l.textContent.includes("if (numbers[i] > average)"),
);
const lineCountInc = Array.from(lines).findIndex((l) =>
  l.textContent.includes("count++"),
);
const linePrintAverage = Array.from(lines).findIndex((l) =>
  l.textContent.includes("Average is"),
);
const linePrintCount = Array.from(lines).findIndex((l) =>
  l.textContent.includes("Number of elements above the average is"),
);

// --- State ---
let current = -1;
let steps = [];
let nLocked = false;
let numsLocked = false;
let nRaw = "5";
let numsRaw = "1 2 3 4 5";
let navDirection = "none";
let prevSnapshot = null;

function readN() {
  const v = parseInt(nRaw, 10);
  return Number.isFinite(v) && v >= 1 && v <= 5 ? v : 5;
}

function readNumbers(n) {
  const raw = (numsRaw || "").trim();
  const tokens = raw === "" ? [] : raw.split(/[\s,]+/);
  const values = [];

  for (let i = 0; i < n; i++) {
    const parsed = parseFloat(tokens[i]);
    values.push(Number.isFinite(parsed) ? parsed : (i + 1) * 1.0);
  }

  return values;
}

function filterConsoleInput() {
  if (current === 2) {
    consoleInput.value = consoleInput.value.replace(/\D/g, "");
    return;
  }

  if (current === 6) {
    consoleInput.value = consoleInput.value.replace(/[^0-9.\-\s,]/g, "");
  }
}

function fmt(x) {
  if (!Number.isFinite(x)) return String(x);
  return Number.isInteger(x) ? x.toFixed(1) : String(parseFloat(x.toFixed(10)));
}

function buildSteps() {
  const n = readN();
  const numbers = readNumbers(n);
  const sum = numbers.reduce((a, b) => a + b, 0);
  const average = sum / n;
  const sumFmt = fmt(sum);
  const avgFmt = fmt(average);
  const zeroArr = Array(n).fill("0.0");
  const fullArr = numbers.map(fmt);

  steps = [];

  // 0 - create scanner
  steps.push({
    msg: "Create scanner object to read user input.",
    hl: [lineScanner],
    n: "",
    sum: "",
    avg: "",
    cnt: "",
    i: "",
    arr: Array(n).fill(""),
    out1: "",
    out2: "",
    calc: null,
  });

  // 1 - print prompt for n
  steps.push({
    msg: 'Print "Enter the number of items: " to the screen.',
    hl: [linePrintN],
    n: "",
    sum: "",
    avg: "",
    cnt: "",
    i: "",
    arr: Array(n).fill(""),
    out1: "",
    out2: "",
    calc: null,
  });

  // 2 - read n (input enabled at this step)
  steps.push({
    msg: "Read integer from user. Type a value for n (1-5), then click Next.",
    hl: [lineReadN],
    n: "",
    sum: "",
    avg: "",
    cnt: "",
    i: "",
    arr: Array(n).fill(""),
    out1: "",
    out2: "",
    calc: null,
  });

  // 3 - create array
  steps.push({
    msg:
      "Create numbers array of size n=" +
      n +
      ". All elements initialized to 0.0.",
    hl: [lineCreateArray],
    n: String(n),
    sum: "",
    avg: "",
    cnt: "",
    i: "",
    arr: zeroArr,
    out1: "",
    out2: "",
    calc: null,
  });

  // 4 - sum = 0
  steps.push({
    msg: "Initialize sum = 0.",
    hl: [lineSumInit],
    n: String(n),
    sum: "0.0",
    avg: "",
    cnt: "",
    i: "",
    arr: zeroArr,
    out1: "",
    out2: "",
    calc: null,
  });

  // 5 - print "Enter the numbers:"
  steps.push({
    msg: 'Print "Enter the numbers: " to the screen.',
    hl: [linePrintNumbers],
    n: String(n),
    sum: "0.0",
    avg: "",
    cnt: "",
    i: "",
    arr: zeroArr,
    out1: "",
    out2: "",
    calc: null,
  });

  // 6 - enter numbers (inputs enabled at this step)
  steps.push({
    msg: "Enter " + n + " number(s) below, then click Next.",
    hl: [lineForLoop1, lineReadNum],
    n: String(n),
    sum: "0.0",
    avg: "",
    cnt: "",
    i: "",
    arr: zeroArr,
    out1: "",
    out2: "",
    calc: null,
  });

  // 7..6+n - first for loop
  let runSum = 0;
  for (let i = 0; i < n; i++) {
    const prev = runSum;
    runSum += numbers[i];
    const partArr = [
      ...numbers.slice(0, i + 1).map(fmt),
      ...Array(n - i - 1).fill("0.0"),
    ];
    steps.push({
      msg:
        "i=" +
        i +
        ": numbers[" +
        i +
        "] = " +
        fmt(numbers[i]) +
        ". sum = " +
        fmt(prev) +
        " + " +
        fmt(numbers[i]) +
        " = " +
        fmt(runSum) +
        ".",
      hl: [lineForLoop1, lineReadNum, lineSumAdd],
      n: String(n),
      sum: fmt(runSum),
      avg: "",
      cnt: "",
      i: String(i),
      arr: partArr,
      out1: "",
      out2: "",
      calc: {
        left: fmt(prev),
        op: "+",
        right: fmt(numbers[i]),
        result: fmt(runSum),
      },
    });
  }

  // first loop ends
  steps.push({
    msg:
      "i=" +
      n +
      ", condition i < n (" +
      n +
      " < " +
      n +
      ") is false. First loop ends.",
    hl: [lineForLoop1],
    n: String(n),
    sum: sumFmt,
    avg: "",
    cnt: "",
    i: String(n),
    arr: fullArr,
    out1: "",
    out2: "",
    calc: null,
  });

  // average
  steps.push({
    msg: "average = sum / n = " + sumFmt + " / " + n + " = " + avgFmt + ".",
    hl: [lineAverage],
    n: String(n),
    sum: sumFmt,
    avg: avgFmt,
    cnt: "",
    i: String(n),
    arr: fullArr,
    out1: "",
    out2: "",
    calc: { left: sumFmt, op: "/", right: String(n), result: avgFmt },
  });

  // count = 0
  steps.push({
    msg: "Initialize count = 0.",
    hl: [lineCountInit],
    n: String(n),
    sum: sumFmt,
    avg: avgFmt,
    cnt: "0",
    i: "",
    arr: fullArr,
    out1: "",
    out2: "",
    calc: null,
  });

  // second for loop
  let runCount = 0;
  for (let j = 0; j < n; j++) {
    const above = numbers[j] > average;
    const beforeCnt = runCount;
    if (above) runCount++;
    const hlArr = [lineForLoop2, lineIfAbove];
    if (above) hlArr.push(lineCountInc);
    const msg2 = above
      ? "i=" +
        j +
        ": numbers[" +
        j +
        "]=" +
        fmt(numbers[j]) +
        " > average=" +
        avgFmt +
        "? Yes. count++ and count = " +
        runCount +
        "."
      : "i=" +
        j +
        ": numbers[" +
        j +
        "]=" +
        fmt(numbers[j]) +
        " > average=" +
        avgFmt +
        "? No. count stays " +
        beforeCnt +
        ".";
    steps.push({
      msg: msg2,
      hl: hlArr,
      n: String(n),
      sum: sumFmt,
      avg: avgFmt,
      cnt: String(runCount),
      i: String(j),
      arr: fullArr,
      out1: "",
      out2: "",
      calc: {
        left: fmt(numbers[j]),
        op: ">",
        right: avgFmt,
        result: above ? "true" : "false",
      },
    });
  }

  // second loop ends
  steps.push({
    msg:
      "i=" +
      n +
      ", condition i < n (" +
      n +
      " < " +
      n +
      ") is false. Second loop ends.",
    hl: [lineForLoop2],
    n: String(n),
    sum: sumFmt,
    avg: avgFmt,
    cnt: String(runCount),
    i: String(n),
    arr: fullArr,
    out1: "",
    out2: "",
    calc: null,
  });

  // print average
  steps.push({
    msg: 'Print "Average is ' + avgFmt + '".',
    hl: [linePrintAverage],
    n: String(n),
    sum: sumFmt,
    avg: avgFmt,
    cnt: String(runCount),
    i: String(n),
    arr: fullArr,
    out3: "Average is " + avgFmt,
    out4: "",
    calc: null,
  });

  // print count
  steps.push({
    msg: 'Print "Number of elements above the average is ' + runCount + '".',
    hl: [linePrintCount],
    n: String(n),
    sum: sumFmt,
    avg: avgFmt,
    cnt: String(runCount),
    i: String(n),
    arr: fullArr,
    out3: "Average is " + avgFmt,
    out4: "Number of elements above the average is " + runCount,
    calc: null,
  });

  // Post-process: persist prompt outputs as static lines
  const nLabel = "Enter the number of items: " + n;
  const numsLabel = "Enter the numbers: " + numbers.map(fmt).join(" ");
  steps.forEach((step, idx) => {
    if (idx >= 3) step.out1 = nLabel;
    if (idx >= 7) step.out2 = numsLabel;
  });
}

buildSteps();
consoleInput.addEventListener("input", filterConsoleInput);

function animateToMemory(
  sourceElement,
  targetElement,
  finalValue,
  duration = 700,
) {
  if (!targetElement) return;

  if (!sourceElement) {
    targetElement.innerText = String(finalValue);
    return;
  }

  const rectStart = sourceElement.getBoundingClientRect();
  const rectEnd = targetElement.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = String(finalValue);
  flying.style.transition = `all ${duration}ms ease-in-out`;

  document.body.appendChild(flying);
  flying.style.left = `${rectStart.left + rectStart.width / 2}px`;
  flying.style.top = `${rectStart.top + rectStart.height / 2}px`;

  requestAnimationFrame(() => {
    flying.style.left = `${rectEnd.left + rectEnd.width / 2}px`;
    flying.style.top = `${rectEnd.top + rectEnd.height / 2}px`;
  });

  flying.addEventListener("transitionend", () => {
    targetElement.innerText = String(finalValue);
    if (document.body.contains(flying)) document.body.removeChild(flying);
  });
}

function snapshotFromStep(step) {
  return {
    n: step.n || "",
    sum: step.sum || "",
    avg: step.avg || "",
    cnt: step.cnt || "",
    i: step.i || "",
    arr: Array.isArray(step.arr) ? [...step.arr] : [],
    out1: step.out1 || "",
    out2: step.out2 || "",
    out3: step.out3 || "",
    out4: step.out4 || "",
  };
}

function lineEl(index) {
  return index >= 0 ? lines[index] : null;
}

function animateChanges(step) {
  if (navDirection !== "forward" || !prevSnapshot) return;

  const next = snapshotFromStep(step);

  if (prevSnapshot.n !== next.n && next.n !== "") {
    memN.innerText = "";
    animateToMemory(lineEl(lineReadN) || lineEl(lineCreateArray), memN, next.n);
  }

  if (prevSnapshot.sum !== next.sum && next.sum !== "") {
    memSum.innerText = "";
    const src = step.hl.includes(lineSumAdd)
      ? lineEl(lineSumAdd)
      : lineEl(lineSumInit) || lineEl(lineSumAdd);
    animateToMemory(src, memSum, next.sum);
  }

  if (prevSnapshot.avg !== next.avg && next.avg !== "") {
    memAverage.innerText = "";
    animateToMemory(lineEl(lineAverage), memAverage, next.avg);
  }

  if (prevSnapshot.cnt !== next.cnt && next.cnt !== "") {
    memCount.innerText = "";
    const src = step.hl.includes(lineCountInc)
      ? lineEl(lineCountInc)
      : lineEl(lineCountInit);
    animateToMemory(src, memCount, next.cnt);
  }

  if (prevSnapshot.i !== next.i && next.i !== "") {
    memI.innerText = "";
    const src = step.hl.includes(lineForLoop2)
      ? lineEl(lineForLoop2)
      : lineEl(lineForLoop1);
    animateToMemory(src, memI, next.i);
  }

  arrayCells.forEach((cell, idx) => {
    if (!cell) return;
    const prevVal = idx < prevSnapshot.arr.length ? prevSnapshot.arr[idx] : "";
    const nextVal = idx < next.arr.length ? next.arr[idx] : "";
    if (prevVal === nextVal || nextVal === "") return;

    cell.innerText = "";
    const src = step.hl.includes(lineReadNum)
      ? lineEl(lineReadNum)
      : lineEl(lineCreateArray);
    animateToMemory(src, cell, nextVal);
  });

  if (prevSnapshot.out1 !== next.out1 && next.out1 !== "") {
    outLine1.innerText = "";
    animateToMemory(lineEl(linePrintN), outLine1, next.out1);
  }
  if (prevSnapshot.out2 !== next.out2 && next.out2 !== "") {
    outLine2.innerText = "";
    animateToMemory(lineEl(linePrintNumbers), outLine2, next.out2);
  }
  if (prevSnapshot.out3 !== next.out3 && next.out3 !== "") {
    outLine3.innerText = "";
    animateToMemory(lineEl(linePrintAverage), outLine3, next.out3);
  }
  if (prevSnapshot.out4 !== next.out4 && next.out4 !== "") {
    outLine4.innerText = "";
    animateToMemory(lineEl(linePrintCount), outLine4, next.out4);
  }
}

function clearHighlights() {
  lines.forEach((l) => l.classList.remove("highlight"));
}

function setCalc(calc) {
  if (!calc) {
    calcLeft.innerText =
      calcOp.innerText =
      calcRight.innerText =
      calcEq.innerText =
      calcResult.innerText =
        "";
    [calcLeft, calcOp, calcRight, calcEq, calcResult].forEach((el) => {
      el.style.display = "none";
    });
    return;
  }
  calcLeft.innerText = calc.left;
  calcOp.innerText = calc.op;
  calcRight.innerText = calc.right;
  calcEq.innerText = "=";
  calcResult.innerText = calc.result;
  [calcLeft, calcRight, calcResult].forEach((el) => {
    el.style.display = "flex";
  });
  [calcOp, calcEq].forEach((el) => {
    el.style.display = "block";
  });
}

function renderInputVisibility() {
  // Show prompt row only at steps 1-2 (enter n) and 5-6 (enter numbers)
  if (current >= 1 && current <= 2) {
    consoleRow.style.display = "flex";
    promptEl.innerText = "Enter the number of items:";
    consoleInput.inputMode = "numeric";
    consoleInput.placeholder = "5";
    if (current !== 2 || nLocked) {
      consoleInput.value = nRaw;
    }
    consoleInput.disabled = !(current === 2 && !nLocked);
    return;
  }
  if (current >= 5 && current <= 6) {
    consoleRow.style.display = "flex";
    promptEl.innerText = "Enter the numbers:";
    consoleInput.inputMode = "decimal";
    consoleInput.placeholder = "1 2 3 4 5";
    if (current !== 6 || numsLocked) {
      consoleInput.value = numsRaw;
    }
    consoleInput.disabled = !(current === 6 && !numsLocked);
    return;
  }
  consoleRow.style.display = "none";
}

function renderStep() {
  clearHighlights();

  if (current < 0) {
    memoryExplanation.style.display = "none";
    itemN.style.display = "none";
    itemSum.style.display = "none";
    itemAverage.style.display = "none";
    itemCount.style.display = "none";
    itemI.style.display = "none";
    numbersContainer.style.display = "none";
    memN.innerText =
      memSum.innerText =
      memAverage.innerText =
      memCount.innerText =
      memI.innerText =
        "";
    arrayCells.forEach((c) => {
      if (c) c.innerText = "";
    });
    setCalc(null);
    outLine1.innerText = "";
    outLine2.innerText = "";
    outLine3.innerText = "";
    outLine4.innerText = "";
    consoleRow.style.display = "none";
    nLocked = false;
    numsLocked = false;
    prevSnapshot = null;
    consoleInput.disabled = false;
    consoleInput.value = "";
    backBtn.disabled = true;
    nextBtn.disabled = false;
    return;
  }

  const step = steps[current];

  memoryExplanation.style.display = "block";
  memoryExplanation.innerText = step.msg;

  // Declaration/initialization visibility (match other examples)
  itemN.style.display = current >= 3 ? "flex" : "none";
  itemSum.style.display = current >= 4 ? "flex" : "none";
  itemAverage.style.display = step.avg !== "" ? "flex" : "none";
  itemCount.style.display = step.cnt !== "" ? "flex" : "none";
  itemI.style.display = step.i !== "" ? "flex" : "none";
  numbersContainer.style.display = current >= 3 ? "flex" : "none";

  step.hl.forEach((idx) => {
    if (idx >= 0 && lines[idx]) lines[idx].classList.add("highlight");
  });

  memN.innerText = step.n;
  memSum.innerText = step.sum;
  memAverage.innerText = step.avg;
  memCount.innerText = step.cnt;
  memI.innerText = step.i;

  arrayCells.forEach((cell, i) => {
    if (cell) cell.innerText = i < step.arr.length ? step.arr[i] : "";
  });

  setCalc(step.calc);

  outLine1.innerText = step.out1 || "";
  outLine2.innerText = step.out2 || "";
  outLine3.innerText = step.out3 || "";
  outLine4.innerText = step.out4 || "";

  animateChanges(step);
  prevSnapshot = snapshotFromStep(step);

  renderInputVisibility();

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps.length - 1;
}

nextBtn.addEventListener("click", () => {
  if (current >= steps.length - 1) return;

  // Leaving step 2: capture n, lock, rebuild trace
  if (current === 2 && !nLocked) {
    const clean = consoleInput.value.replace(/\D/g, "").trim();
    nRaw = clean === "" ? "5" : clean;
    nLocked = true;
    buildSteps();
  }

  // Leaving step 6: capture numbers, lock, rebuild trace
  if (current === 6 && !numsLocked) {
    numsRaw = consoleInput.value.replace(/[^0-9.\-\s,]/g, "").trim();
    if (numsRaw === "") numsRaw = "1 2 3 4 5";
    numsLocked = true;
    buildSteps();
  }

  current++;
  navDirection = "forward";
  renderStep();
  navDirection = "none";
});

backBtn.addEventListener("click", () => {
  if (current <= -1) return;

  // Going back to step 2: unlock n
  if (current === 3) {
    nLocked = false;
  }

  // Going back to step 6: unlock numbers and rebuild
  if (current === 7) {
    numsLocked = false;
    buildSteps();
  }

  current--;
  navDirection = "backward";
  renderStep();
  navDirection = "none";
});

renderStep();
