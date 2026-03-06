//select all lines
const lines = document.querySelectorAll("#high span");

//BUTTON CODE
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");


const memItems = document.querySelectorAll(".mem-item");


const mem = {
  x: document.getElementById("mem-x"),
  y: document.getElementById("mem-y"),
  x1: document.getElementById("mem-x1"),
  y1: document.getElementById("mem-y1"),
  add: document.getElementById("mem-add"),
  sub: document.getElementById("mem-sub"),
  mul: document.getElementById("mem-mul"),
  div: document.getElementById("mem-div"),
  rem: document.getElementById("mem-rem"),
  div2: document.getElementById("mem-div2")
};


const num = {
  x: document.getElementById("mem-num-x"),
  y: document.getElementById("mem-num-y"),
  sum:document.getElementById("val-sum"),
  x1: document.getElementById("mem-num-x1"),
  y1: document.getElementById("mem-num-y1"),
  sum2: document.getElementById("val-sum2")
};

//MATH SYMBOLS
const opp = {
  plus: document.getElementById("plus-op"),
  min: document.getElementById("minus-op"),
  mul: document.getElementById("multi-op"),
  divi: document.getElementById("divi-op"),
  rem: document.getElementById("rem-op"),
  divi2: document.getElementById("divi-op2"),
  equal: equalOp = document.getElementById("equal-op"),
  equal2: document.getElementById("equal-op2")
};

//console
const conIn = document.getElementById("console-input");
const conBox = document.getElementById("console");

let X_VAL;
let Y_VAL;
let X1_VAL;
let Y1_VAL;

const outArr = [];



const steps = 42;

//start page with nopthing highlighted
//current is the step we are on
let current = -1;

//prev will let our system know when it's going backwards
let prev = -1;

const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
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
    [4,5,3],
    [7,9,5],
    [12,14,8],
    [17,19,11],
    [22,24,14],
    [27,29,17],
    [32,33,20],
    [35,36,22],
    [38,40,24]
  ];

    // if inside an operation window, freeze highlight
  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

    //fix holds
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

conIn.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {

  const value = conIn.value;

  const source = pushOut(value);
  source.style.color="goldenrod";

  if (current === 1) {
    X_VAL = Number(value);
    animateToMemory(source,mem.x,X_VAL);
  }

  if (current === 4) {
    Y_VAL = Number(value);
    animateToMemory(source,mem.y,Y_VAL);
  }

  if (current === 32) {
    X1_VAL = Number(value);
    animateToMemory(source,mem.x1,X1_VAL);
  }   

  if (current === 35) {
    Y1_VAL = Number(value);
    animateToMemory(source,mem.y1,Y1_VAL);
  }

    conIn.value = "";
    conIn.style.display = "none";
    current++;
    updateUI();
    updateMemoryExplanation();
  }
});


//add output row
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

  let tAdd= X_VAL+Y_VAL;
  let tSub= X_VAL-Y_VAL;
  let tMul= X_VAL*Y_VAL;
  let tDiv= X_VAL/Y_VAL;
  let tRem= X_VAL%Y_VAL;
  let tDiv2= X1_VAL/Y1_VAL;


  const inputSteps = [1, 4, 32, 35];

  if (inputSteps.includes(current)) {
    conIn.style.display = "block";
    conIn.focus();
  } else {
    conIn.style.display = "none";
  }


  //delete numbers from variables
  const clVar = [
    {step: 2, value: mem.x},
    {step: 5, value: mem.y},
    {step: 9, value: mem.add},
    {step: 14, value: mem.sub},
    {step: 19, value: mem.mul},
    {step: 24, value: mem.div},
    {step: 29, value: mem.rem},
    {step: 33, value: mem.x1},
    {step: 36, value: mem.y1},
    {step: 40, value: mem.div2}
  ];

  clVar.forEach(({step, value}) => {
    if(current < step) value.innerText="";
  })




  //declare variables
  const declVar = [
    [0, 0], //x
    [3,1], //y
    [6,2], //add
    [11,3], //sub
    [16,4], //mul
    [21,5], //div
    [26,6], //rem
    [31,10], //x1
    [34,11], //y1
    [37,12] //div2
  ]

  declVar.forEach(([step, i]) => {
    if (current >= step) {
    memItems[i].style.display = "flex";
    memoryExplanation.style.display="flex";
    }
  })




  //range by steps where math is happening for x and y
  const mtRanges = [
    {start: 7, end: 9},
    {start: 12,end: 14},
    {start: 17,end: 19},
    {start: 22,end: 24},
    {start: 27,end: 29}
  ];

  //check which math range we are in
  const acRange = mtRanges.find(f => current >=f.start && current <= f.end);

  //check if we are currently inside math steps
  const mtSteps = !!acRange;

  //check if we are currently at the beginning of a math step
  const mtStart = acRange && current === acRange.start;
  if (mtSteps) {
    num.x.style.display = "flex";
    num.y.style.display = "flex";

    
  // if entering the window, animate them down
    if (mtStart) {
      animateToMemory(mem.x, num.x, X_VAL);
      animateToMemory(mem.y, num.y, Y_VAL);
    }
    else {
      num.x.innerText = X_VAL;
      num.y.innerText = Y_VAL;
    }
    
    } else {
        // clear when not in window
        num.x.innerText = "";
        num.y.innerText = "";
    }




  //bring x1 and y1 down

  if (current >=38 && current <=40) {
    num.x1.style.display = "flex";
    num.y1.style.display = "flex";

    // if entering the window, animate them down
    if (current===38) {
      animateToMemory(mem.x1, num.x1, X1_VAL);
      animateToMemory(mem.y1, num.y1, Y1_VAL);
    }
    else {
      // keep them visible if already in window
      if (current >= 39 && current <= 40) {
        num.x1.innerText = X1_VAL;
        num.y1.innerText = Y1_VAL;
      }
    }
  } else {
    // clear when not in window
    num.x1.innerText = "";
    num.y1.innerText = "";
  }






  //show sum
  const sRanges = [
    {start: 8, end: 9, cal: tAdd},
    {start: 13, end: 14, cal: tSub},
    {start: 18, end: 19, cal: tMul},
    {start: 23, end: 24, cal: tDiv},
    {start: 28, end: 29, cal: tRem}
  ];

  sRanges.forEach(({start, end, cal}) =>{
    if(current >=start && current<=end){
      num.sum.style.display = "flex";
      num.sum.innerText = cal;
    }
  })

  if (current >=39 && current <=40){
    num.sum2.style.display = "flex";
    num.sum2.innerText = tDiv2;
  }




  //assign sum to variables
  const asVar = [
    {step: 9, to: "add", value: tAdd},
    {step: 14, to: "sub", value: tSub},
    {step: 19, to: "mul", value: tMul},
    {step: 24, to: "div", value: tDiv},
    {step: 29, to: "rem", value: tRem}
  ];

  asVar.forEach(({step, to, value}) => {
    if(current === step && mem[to].innerText === ""){
      
      animateToMemory(num.sum, mem[to], value);
    }
  })

  if (current === 40 && mem.div2.innerText === "") {
    animateToMemory(num.sum2, mem.div2, tDiv2);
  };



  



  // show math operators
  const mOpp = [
    {start: 7, end: 9, sign:"plus"},
    {start: 12, end: 14, sign:"min"},
    {start: 17, end: 19, sign:"mul"},
    {start: 22, end: 24, sign:"divi"},
    {start: 27, end: 29, sign:"rem"},
    {start:38, end:40, sign:"divi2"}
  ];

  mOpp.forEach(({start, end, sign}) => {
    if (current >= start && current <= end) {
      opp[sign].style.display = "block";
    }
  });

  if (
    (current >= 8 && current <= 9) ||
    (current >= 13 && current <= 14) ||
    (current >= 18 && current <= 19) ||
    (current >= 23 && current <= 24) ||
    (current >= 28 && current <= 29)
  ) {
    opp.equal.style.display = "flex";
  }

  if(current >= 39 && current <= 40){
    opp.equal2.style.display="flex";
  }




  //output

  // step 1 x pushed to output
  // step 4 y pushed to output

  const outPrint = [
    {step: 10, value: tAdd, from: "add"},
    {step: 15, value: tSub, from: "sub"},
    {step: 20, value: tMul, from: "mul"},
    {step: 25, value: tDiv, from: "div"},
    {step: 30, value: tRem, from: "rem"}
  ];

  outPrint.forEach(({step, value, from}) => {
    if(current === step && prev<step){
      num.sum.display = "none";
      const x = pushOut(value);
      animateToMemory(mem[from], x, value);
    }
  })

  //step 32 x1 pushed to output
  //step 35 y1 pushed to output

  if (current === 41 && prev<41) {
    num.sum2.style.display = "none";
    const x = pushOut(tDiv2)
    animateToMemory(mem.div2, x, tDiv2);
  }

  //delete output
  const delOut = [2, 5, 10, 15, 20, 25, 30, 33, 36, 41];

  delOut.forEach(row => {
    if(current < row && prev >= row) popOut();
  })




  backBtn.disabled = current <= 0;
  nextBtn.disabled = (current >= steps - 1 || inputSteps.includes(current));

  //update previous to match current
  prev=current;
}


nextBtn.addEventListener("click", () => {
  if (current < steps - 1) {
    current++;
    updateUI();
    updateMemoryExplanation();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    updateUI();
    updateMemoryExplanation();
  }
});

updateUI();


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
