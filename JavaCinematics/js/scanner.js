//select all lines
const lines = document.querySelectorAll("#high span");

//BUTTON CODE
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// Night Mode Implementation
const toggle = document.getElementById("toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("night-mode", toggle.checked);
  });
}

const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memC = document.getElementById("mem-c");
const memD = document.getElementById("mem-d");
const memE = document.getElementById("mem-e");
const memCChars = document.getElementById("mem-c-chars");
const memDChars = document.getElementById("mem-d-chars");
const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const numADD = document.getElementById("val-add");
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");
const out5 = document.getElementById("ou5");

const memItems = document.querySelectorAll(".mem-item");
const memoryExplanation = document.getElementById("memory-explanation");

const stepMessages = [
  "Import the Scanner class",
  "The statement creates an object for performing console input and assigns the object to the reference variable named input",
  "Declare int a",
  "Scanner reads an integer from input",
  "Assign value to a",
  "Declare double b",
  "Scanner reads a double from input",
  "Assign value to b",
  "Declare String c",
  "Scanner reads a word from input",
  "Assign value to c",
  "Declare String d",
  "Scanner reads a full line from input",
  "Assign value to d",
  "Declare char e",
  "Scanner reads first character from input",
  "Assign value to e",
];

function updateMemoryExplanation() {
  if (!memoryExplanation) return;
  if (current < 0) {
    memoryExplanation.style.display = "none";
    memoryExplanation.innerText = "";
  } else if (current < stepMessages.length) {
    memoryExplanation.style.display = "flex";
    memoryExplanation.innerText = stepMessages[current];
  } else {
    memoryExplanation.style.display = "flex";
    memoryExplanation.innerText = "Done!";
  }
}

//MATH SYMBOLS
const plusOp = document.getElementById("plus-op");
const equalOp = document.getElementById("equal-op");

//start page with nopthing highlighted
const steps = 17;
let current = -1;

function setReferenceValue(targetElement, charsElement, storedValue) {
  targetElement.innerText = "Ref";
  targetElement.dataset.storedValue = storedValue;
  createCharDisplay(charsElement, storedValue);
}

function createCharDisplay(container, str) {
  container.innerHTML = "";

  // Create index row (numbers)
  const indexRow = document.createElement("div");
  indexRow.className = "char-row";

  for (let i = 0; i < str.length; i++) {
    const indexBox = document.createElement("div");
    indexBox.className = "char-index";
    indexBox.innerText = i;
    indexRow.appendChild(indexBox);
  }

  container.appendChild(indexRow);

  // Create character row
  const charRow = document.createElement("div");
  charRow.className = "char-row";

  for (let i = 0; i < str.length; i++) {
    const charBox = document.createElement("div");
    charBox.className = "char-box";
    charBox.innerText = str[i];
    charRow.appendChild(charBox);
  }

  container.appendChild(charRow);
}

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
    if (targetElement === memC) {
      setReferenceValue(memC, memCChars, finalValue);
    } else if (targetElement === memD) {
      setReferenceValue(memD, memDChars, finalValue);
    } else {
      targetElement.innerText = finalValue;
    }
    document.body.removeChild(flying);
  });
}

function getHLine(step) {
  if (step < 0) return -1;

  // operation highlight windows: [startStep, endStep, spanIndex]
  // all ranges shifted +1 to account for the new Import span at index 0
  const ranges = [
    [3, 4, 3],
    [5, 5, 4],
    [6, 7, 5],
    [8, 8, 6],
    [9, 10, 7],
    [11, 11, 8],
    [12, 13, 9],
    [14, 14, 10],
    [15, 16, 11],
  ];

  // if inside an operation window, freeze highlight
  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

  // steps 0, 1, 2 fall through here
  return step;
}

function updateHighlight() {
  // highlight
  lines.forEach((line) => line.classList.remove("highlight"));

  // call to get proper line to highlight into HLine
  const hLine = getHLine(current);

  if (lines[hLine]) lines[hLine].classList.add("highlight");

  // make the if-statement highlight appear as one continuous block
  // (each if line is split across 3 spans in the HTML)
  if (hLine === 3) {
    if (lines[3]) lines[3].classList.add("highlight");
  }
  if (hLine === 10) {
    if (lines[11]) lines[11].classList.add("highlight");
    if (lines[12]) lines[12].classList.add("highlight");
  }

  memItems.forEach((item) => (item.style.visibility = "hidden"));

  // step 1 declares x (shifted +1 for import line)
  if (current >= 2) {
    memItems[0].style.visibility = "visible";
  }

  // step 3 declares y
  if (current >= 5) {
    memItems[1].style.visibility = "visible";
  }

  // step 5 declares add
  if (current >= 8) {
    memItems[2].style.visibility = "visible";
  }
  if (current >= 11) {
    memItems[3].style.visibility = "visible";
  }
  if (current >= 14) {
    memItems[4].style.visibility = "visible";
  }

  //bring x and y down

  //step 7: add x and y

  // clears values when going backwards
  if (current < 3) memX.innerText = "";
  if (current < 2) out1.innerText = "";
  if (current < 6) memY.innerText = "";
  if (current < 5) out2.innerText = "";
  if (current < 9) {
    memC.innerText = "";
    delete memC.dataset.storedValue;
    memCChars.innerHTML = "";
  }
  if (current < 8) out3.innerText = "";
  if (current < 12) {
    memD.innerText = "";
    delete memD.dataset.storedValue;
    memDChars.innerHTML = "";
  }
  if (current < 11) out4.innerText = "";
  if (current < 15) memE.innerText = "";
  if (current < 14) out5.innerText = "";

  // keep counting squares visible from declaration step onward
  if (current < 10) memCChars.innerHTML = "";
  if (current < 13) memDChars.innerHTML = "";

  // recreate character displays when stepping back if memory has content
  if (current >= 10 && memC.dataset.storedValue && memCChars.innerHTML === "") {
    createCharDisplay(memCChars, memC.dataset.storedValue);
  }
  if (current >= 13 && memD.dataset.storedValue && memDChars.innerHTML === "") {
    createCharDisplay(memDChars, memD.dataset.storedValue);
  }

  // animate going forward
  // initiates x

  if (current === 3 && out1.innerText === "") {
    out1.innerText = "8";
  }
  if (current === 6 && out2.innerText === "") {
    out2.innerText = "8.0";
  }
  if (current === 9 && out3.innerText === "") {
    out3.innerText = "Hello World";
  }
  if (current === 12 && out4.innerText === "") {
    out4.innerText = "Hello World";
  }
  if (current === 15 && out5.innerText === "") {
    out5.innerText = "H";
  }

  // if(current === 8 && outAns.innerText === ""){
  //outAns.style.visibility="visible";
  //outAns.innerText="18";
  //animateToMemory(memADD, outAns, "D");
  // }

  //fly from memory variable to output
  if (current === 4 && memX.innerText === "") {
    animateToMemory(out1, memX, "8");
  }
  if (current === 7 && memY.innerText === "") {
    animateToMemory(out2, memY, "8.0");
  }
  if (current === 10 && memC.innerText === "") {
    animateToMemory(out3, memC, "Hello");
  }
  if (current === 13 && memD.innerText === "") {
    animateToMemory(out4, memD, "Hello World");
  }
  if (current === 16 && memE.innerText === "") {
    animateToMemory(out5, memE, "H");
  }

  // hide operators
  plusOp.style.visibility = "hidden";
  equalOp.style.visibility = "hidden";

  // show addition visuals when calculating add
  // START EDITING HERE
  // if (current >=5 && current<=7) {
  plusOp.style.visibility = "visible";
  // }

  //if (current >=6 && current<=7){
  equalOp.style.visibility = "visible";
  // }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1;

  updateMemoryExplanation();
}

nextBtn.addEventListener("click", () => {
  if (current < steps - 1) {
    current++;
    updateHighlight();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    updateHighlight();
  }
});

updateHighlight();
