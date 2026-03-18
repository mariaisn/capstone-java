const lines = document.querySelectorAll("#high span");
const memItems = document.querySelectorAll(".mem-item");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memX = document.getElementById("mem-x");
const num1 = document.getElementById("mem-num-1");
const numX = document.getElementById("mem-num-x");
const numX1 = document.getElementById("mem-num-x1");
const numC = document.getElementById("mem-num-c");
const vPrint = document.getElementById("val-print");
const vX = document.getElementById("val-x");
const v1 = document.getElementById("val-1");
const vC = document.getElementById("val-c");
const vSum = document.getElementById("val-sum");
const vBool = document.getElementById("val-bool");

const plusOp = document.getElementById("plus-op");
const lessOp = document.getElementById("less-op");
const eqOp = document.getElementById("equal-op");

const conIn = document.getElementById("console-input");
const conBox = document.getElementById("console");

const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
  "Declare x",
  "Assign 0 to x",
  "Enter Do",
  "Print Hello",
  "Add 1 to x",
  "Calulate sum",
  "Assign sum to x",
  "Check Condition",
  "Condition is",
  "Exit Loop",
];

let current = -1;
let prev = -1;
const steps = 10;


const outArr = [];
let history = [];

let x = 0;
let loopCount = 0;
let boolVal;

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

function getHLine(step) {
  if (step < 0) return -1;

  const freeze = [
    [4, 6, 4],
    [7, 8, 5],
  ];

  for (const [start, end, line] of freeze) {
    if (step >= start && step <= end) return line;
  }

  let temp = 0;
  if (step > 6) temp = temp - 2;
  if (step > 8) temp = temp - 1;

  return step + temp;
}

function addOutRow(text) {
  const row = document.createElement("div");
  row.className = "console-row";

  const span = document.createElement("span");
  span.innerText = text;

  row.appendChild(span);
  conBox.appendChild(row);

  return row;
}

//add output row, add the row into array, and to return row number
function pushOut(text){
  const row = addOutRow(text);
  outArr.push(row);

  return row;
}

//delete last row from output and from array
function popOut(){
  const row = outArr.pop();
  if (row) {
    row.remove();
  }
}

function updateUI() {
  lines.forEach((line) => line.classList.remove("highlight"));

  memItems.forEach((item) => (item.style.display = "none"));
  memoryExplanation.style.display = "none";
  plusOp.style.display = "none";
  lessOp.style.display = "none";
  eqOp.style.display = "none";
  boolVal = x < 3 ? "True" : "False";

  if (boolVal === "True") {
    stepMessages[8]="Condition is True";
  } else {
    stepMessages[8]="Condition is False";
  }

  //call to get proper line to highlight into hLine
  const hLine = getHLine(current);

  //highlights the line
  if (lines[hLine]) {
    lines[hLine].classList.add("highlight");
  }

  if (current < 1) memX.innerText = "";

  if (current === 6 && prev >=6){
    x--;
  }

  if (current >= 0) {
    memItems[0].style.display = "flex";
    memoryExplanation.style.display = "flex";
  }

  if (current === 1 && prev< 1) {
    animateToMemory(vX, memX, x);
  }

    // delete output when going back
  if (current ===2 && prev >2){
    popOut();
  }

  // printing output
  if (current === 3) {
    if(prev < 3){
    const y = pushOut("Hello");
    animateToMemory(vPrint, y, "Hello");
  }

  if (prev >=3){
    popOut
  }
  }

  if (current >= 4 && current <= 6) {
    numX.style.display = "flex";
    num1.style.display = "flex";
    plusOp.style.display = "flex";

    // if entering the window, animate them down
    if (current === 4 && prev <4) {
      animateToMemory(memX, numX, x);
      animateToMemory(v1, num1, 1);
      plusOp.style.display = "flex";
    } else {
      // keep them visible if already in window
      if (current === 5) {
        numX.innerText = x;
        num1.innerText = 1;
        plusOp.style.display = "flex";
        eqOp.style.display = "flex";

        if (prev >=5){
          memX.innerText= x;
        }
      } else if (current === 6) {
        numX.innerText = x;
        num1.innerText = 1;
        plusOp.style.display = "flex";
        eqOp.style.display = "flex";
      } 
    }
    
  }else {
        // clear when not in window
        numX.style.display = "none";
        num1.style.display = "none";
        numX.innerText = "";
        num1.innerText = "";
  }

  if (current >= 5 && current <= 6) {

    vSum.style.display = "flex";
    vSum.innerText = x + 1;

    if (current === 6 && prev < 6) {
      animateToMemory(vSum, memX, x + 1);
    }
  }
  

  if(current === 7 && prev < 7){
    x++;
  }

  if (current >= 7 && current <= 8) {
    numX1.style.display = "flex";
    numC.style.display = "flex";
    lessOp.style.display = "flex";

    // if entering the window, animate them down
    if (current === 7 && prev < 7) {
      animateToMemory(memX, numX1, x);
      animateToMemory(vC, numC, 3);
    } else {
      // keep them visible if already in window
      if (current === 8) {
        numX1.innerText = x;
        numC.innerText = 3;
      }
    }
  } else {
    // clear when not in window
    numX1.innerText = "";
    numC.innerText = "";
  }



  if (current === 8) {
    vBool.style.display = "flex";
    vBool.innerText = boolVal;
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1;

  prev = current;
}

nextBtn.addEventListener("click", () => {

if (current === 8) {

    if (x<3) {
      loopCount++;      
      history.push(current);
      current = 2;
      prev = current;     
    } else {
     
      history.push(current);
      current++;
    }

  } else if (current < steps - 1) {
    history.push(current);
    current++;
  }

  updateUI();
  updateMemoryExplanation();
});

backBtn.addEventListener("click", () => {
    if (history.length > 0) {
    const prevStep = history.pop();

  
    if (prevStep === 2 && current === 8) {
      loopCount--;
    }

    current = prevStep;
    updateUI();
    updateMemoryExplanation();
  }
});

function updateMemoryExplanation() {
  if (current < 0) {
    memoryExplanation.innerText = "Click Next to begin!";
  } else if (current < stepMessages.length) {
    memoryExplanation.innerText = stepMessages[current];
  } else {
    memoryExplanation.innerText = "Done!";
  }
}

updateUI();
updateMemoryExplanation();