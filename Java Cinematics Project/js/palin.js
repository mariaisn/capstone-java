const lines = document.querySelectorAll("#high span");


const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const conIn = document.getElementById("console-input");
const conBox = document.getElementById("console");

const memItems = document.querySelectorAll(".mem-item");

const mem = {
    s: document.getElementById("mem-s"),
    low: document.getElementById("mem-l"),
    high: document.getElementById("mem-h"),
    pal: document.getElementById("mem-p"),
    ref: document.getElementById("mem-r")
}

const num = {
    low: document.getElementById("num-low"),
    length: document.getElementById("num-length"),
    high: document.getElementById("num-high"),
    one: document.getElementById("num-one"),
    sum: document.getElementById("num-sum")
}

const opp = {
    min: document.getElementById("minus-op"),
    plus: document.getElementById("plus-op"),
    less: document.getElementById("less-op"),
    notE: document.getElementById("notE-op"),
    equal: document.getElementById("equal-op"),
};


const steps = 34;
let current = -1;
let prev = -1;


const outArr = [];
let history = [];

let x = 0;
let loopCount = 0;
let boolVal;
let sVal;

const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
  "Importing the Scanner Class",
  "Creating a Scanner Object called in",
  "Declare x",
  "Receive input from user",
  "Assign number to x",
  "Declare y",
  "Receive input from user",
  "Assign number to y",
  "Declare add",
  "Add x and y",
  "Calculate Sum",
  "Assign sum to add",
  "Print add",
  "Declare sub",
  "Subtract x and y",
  "Calculate Difference",
  "Assign difference to sub",
  "Print sub",
  "Declare mul",
  "Multiply x and y",
  "Calculate Multiplication",
  "Assign multiplication to mul",
  "Print Mul",
  "Declare div",
  "Divide x and y",
  "Calculate Division",
  "Assign division to div",
  "Print div",
  "Declare rem",
  "Get Remainder of x and y",
  "Calculate Remainder",
  "Assign remainder to rem",
  "Print rem",
  "Declare double x1",
  "Receive input from user",
  "Assign number to x1",
  "Declare double y1",
  "Receive input from user",
  "Assign number to y1",
  "Declare div2",
  "Divide x1 and y1",
  "Calculate Division",
  "Assign division to div2",
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

  flying.style.left = rectStart.left + rectStart.width / 2 + "px";
  flying.style.top = rectStart.top + rectStart.height / 2 + "px";

  requestAnimationFrame(() => {
    flying.style.left = rectEnd.left + rectEnd.width / 2 + "px";
    flying.style.top = rectEnd.top + rectEnd.height / 2 + "px";
  });

  flying.addEventListener("transitionend", () => {
    if (targetElement === mem.s) {
      setReferenceValue(mem.s, mem.r, finalValue);
    }  else {
      targetElement.innerText = finalValue;
    }

    document.body.removeChild(flying);
  });
}



function setReferenceValue(targetElement, charsElement, storedValue) {
  targetElement.innerText = "ref";
  targetElement.dataset.storedValue = storedValue;
  createCharDisplay(charsElement, storedValue);
}



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



function getHLine(step) {
  if (step < 0) return -1;

  // operation highlight windows: [startStep, endStep, spanIndex]
  const ranges = [
    [4, 5, 4],
    [9,11,8],
    [15,16,12],
    [17,18,13],
    [21,23,16],
    [24,26,17]
  ];

    // if inside an operation window, freeze highlight
  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

    //fix holds
  let temp = 0;
  if (step > 5) temp = temp - 1;
  if (step > 11) temp = temp - 2;
  if (step > 16) temp = temp - 1;
  if (step > 18) temp = temp - 1;
  if (step > 23) temp = temp - 2;
  if (step > 26) temp = temp - 2;

  return step + temp;
}



conIn.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {

  const value = conIn.value;

  const source = pushOut(value);
  source.style.color="goldenrod";

  if (current === 4) {
    sVal = String(value);
    animateToMemory(source,mem.s, sVal);
  }

    conIn.value = "";
    conIn.style.display = "none";
    current++;
    updateUI();
    updateMemoryExplanation();
  }
});




function addOutRow(text) {
  const row = document.createElement("div");
  row.className = "console-row";

  const span = document.createElement("span");
  span.innerText = text;

  row.appendChild(span);
  conBox.appendChild(row);

  return row;
}

function pushOut(text){
  const row = addOutRow(text);
  outArr.push(row);

  return row;
}

function popOut(){
  const row = outArr.pop();
  if (row) {
    row.remove();
  }
}



function updateUI() {
    lines.forEach((line) => line.classList.remove("highlight"));

  //call to get proper line to highlight into hLine
  const hLine = getHLine(current);

  //highlights the line
  if (lines[hLine]) {
    lines[hLine].classList.add("highlight");
  }

  memItems.forEach((item) => (item.style.display = "none"));
  memoryExplanation.style.display ="none";

  // hide math operators
  Object.values(opp).forEach(op => op.style.display="none");

  if(current >=0){
     memoryExplanation.style.display="flex";
  }


  const declVar = [
    [3, 0], //s
    [6,1], //low
    [8,2], //high
    [12,3], //isPalandrome
  ]

  declVar.forEach(([step, i]) => {
    if (current >= step) {
    memItems[i].style.display = "flex";
    memoryExplanation.style.display="flex";
    }
  })


  if (current === 4) {
    conIn.style.display = "block";
    
    if (document.activeElement !== conIn) {
        conIn.focus();
    }

    conIn.onblur = () => {
        if (inputSteps.includes(current)) {
            conIn.focus();
        }
    };
  } else {
      conIn.style.display = "none";
      conIn.onblur = null;
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = (current >= steps - 1 || current === 4);
}

nextBtn.addEventListener("click", () => {

/*if (current === 8) {

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
  } */
  current++;
  updateUI();
  updateMemoryExplanation();
});

backBtn.addEventListener("click", () => {
  /*  
  
  if (history.length > 0) {
    const prevStep = history.pop();

  
    if (prevStep === 2 && current === 8) {
      loopCount--;
    } */

    current = prevStep;
    updateUI();
    updateMemoryExplanation();
  /* } */
});

function updateMemoryExplanation() {
    if (current < stepMessages.length) {
        memoryExplanation.innerText = stepMessages[current];
    } else {
        memoryExplanation.innerText = "Done!";
    }
}

updateUI();
updateMemoryExplanation();