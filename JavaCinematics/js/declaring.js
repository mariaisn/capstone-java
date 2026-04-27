// Night mode toggle
const toggle = document.getElementById("toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("night-mode");
  });
}

//select all lines
const lines = document.querySelectorAll("#high span");

//BUTTON CODE
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memC = document.getElementById("mem-c");
const memD = document.getElementById("mem-d");
const memE = document.getElementById("mem-e");
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
const memDStoredValue = "Number 68";

const stepMessages = [
  "Declare int a",
  "Assign 68 to a",
  "Print a",
  "Declare double b",
  "Assign 68.0 to b",
  "Print b",
  "Declare char c",
  "Assign D to c",
  "Print c",
  "Declare String d",
  "Assign Number 68 to d",
  "Print d",
  "Declare boolean e",
  "Assign true to e",
  "Print e",
];

//MATH SYMBOLS
const plusOp = document.getElementById("plus-op");
const equalOp = document.getElementById("equal-op");

//start page with nopthing highlighted
const steps = 15;
let current = -1;

function createCharDisplay(container, str) {
  container.innerHTML = "";

  const indexRow = document.createElement("div");
  indexRow.className = "char-row";

  for (let i = 0; i < str.length; i++) {
    const indexBox = document.createElement("div");
    indexBox.className = "char-index";
    indexBox.innerText = i;
    indexRow.appendChild(indexBox);
  }

  container.appendChild(indexRow);

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

function setMemDValue(displayValue, storedValue) {
  memD.innerText = displayValue;
  memD.dataset.storedValue = storedValue;
  createCharDisplay(memDChars, storedValue);
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
    if (targetElement === memD) {
      setMemDValue("Ref", finalValue);
    } else {
      targetElement.innerText = finalValue;
    }
    document.body.removeChild(flying);
  });
}

//function to calculate what line to highlight
//keeps highlight still during math process
//corrects line skips
function getHLine(step) {
  if (step < 0) return -1;

  let temp = 0;
  if (step > 15) temp = temp - 2;

  return step + temp;
}

function updateMemoryExplanation() {
  if (!memoryExplanation) return;

  if (current < 0) {
    memoryExplanation.style.display = "none";
    memoryExplanation.innerText = "";
  } else if (current < stepMessages.length) {
    memoryExplanation.style.display = "block";
    memoryExplanation.innerText = stepMessages[current];
  } else {
    memoryExplanation.style.display = "block";
    memoryExplanation.innerText = "Done!";
  }
}

function updateHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));

  //call to get proper line to highlight into hLine
  const hLine = getHLine(current);

  //highlights the line
  if (lines[hLine]) {
    lines[hLine].classList.add("highlight");
  }

  memItems.forEach((item) => (item.style.visibility = "hidden"));

  // step 0 declares x
  if (current >= 0) {
    memItems[0].style.visibility = "visible";
  }

  // step 2 declares y
  if (current >= 3) {
    memItems[1].style.visibility = "visible";
  }

  // step 4 declares add
  if (current >= 6) {
    memItems[2].style.visibility = "visible";
  }
  if (current >= 9) {
    memItems[3].style.visibility = "visible";
  }
  if (current >= 12) {
    memItems[4].style.visibility = "visible";
  }

  //bring x and y down

  //step 7: add x and y

  // clears values when going backwards
  if (current < 1) memX.innerText = "";
  if (current < 2) out1.innerText = "";
  if (current < 4) memY.innerText = "";
  if (current < 5) out2.innerText = "";
  if (current < 7) memC.innerText = "";
  if (current < 8) out3.innerText = "";
  if (current < 10) {
    memD.innerText = "";
    delete memD.dataset.storedValue;
    memDChars.innerHTML = "";
  }
  if (current < 11) out4.innerText = "";
  if (current < 13) memE.innerText = "";
  if (current < 14) out5.innerText = "";

  // keep the numbered character boxes visible from the declaration step onward
  if (current < 10) memDChars.innerHTML = "";
  if (current >= 10 && memD.dataset.storedValue && memDChars.innerHTML === "") {
    createCharDisplay(memDChars, memD.dataset.storedValue);
  }

  // animate going forward
  // initiates x
  if (current === 1 && memX.innerText === "") {
    animateToMemory(document.getElementById("val-a"), memX, "68");
  }
  // initiates y
  if (current === 4 && memY.innerText === "") {
    animateToMemory(document.getElementById("val-b"), memY, "68.0");
  }

  if (current === 7 && memC.innerText === "") {
    animateToMemory(document.getElementById("val-c"), memC, "D");
  }
  if (current === 10 && memD.innerText === "") {
    animateToMemory(document.getElementById("val-d"), memD, memDStoredValue);
  }
  if (current === 13 && memE.innerText === "") {
    animateToMemory(document.getElementById("val-e"), memE, "True");
  }

  // if(current === 8 && outAns.innerText === ""){
  //outAns.style.visibility="visible";
  //outAns.innerText="18";
  //animateToMemory(memADD, outAns, "D");
  // }

  //fly from memory variable to output
  if (current === 2 && out1.innerText === "") {
    animateToMemory(memX, out1, "68");
  }
  if (current === 5 && out2.innerText === "") {
    animateToMemory(memY, out2, "68.0");
  }
  if (current === 8 && out3.innerText === "") {
    animateToMemory(memC, out3, "D");
  }
  if (current === 11 && out4.innerText === "") {
    animateToMemory(memD, out4, memDStoredValue);
  }
  if (current === 14 && out5.innerText === "") {
    animateToMemory(memE, out5, "true");
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
