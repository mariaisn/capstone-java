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



const steps = 44;

//start page with nopthing highlighted
//current is the step we are on
let current = -1;

//prev will let our system know when it's going backwards
let prev = -1;

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
    [3, 4, 3],
    [6,7,5],
    [9,11,7],
    [14,16,10],
    [19,21,13],
    [24,26,16],
    [29,31,19],
    [34,35,22],
    [37,38,24],
    [40,42,26]
  ];

    // if inside an operation window, freeze highlight
  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

    //fix holds
  let temp = 0;
  if (step > 4) temp = temp - 1;
  if (step > 7) temp = temp - 1;
  if (step > 11) temp = temp - 2;
  if (step > 16) temp = temp - 2;
  if (step > 21) temp = temp - 2;
  if (step > 26) temp = temp - 2;
  if (step > 31) temp = temp - 2;
  if (step > 35) temp = temp - 1;
  if (step > 38) temp = temp - 1;
  if (step > 42) temp = temp - 2;

  return step + temp;
}

conIn.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {

  const value = conIn.value;

  const source = pushOut(value);
  source.style.color="goldenrod";

  if (current === 3) {
    X_VAL = Number(value);
    animateToMemory(source,mem.x,X_VAL);
  }

  if (current === 6) {
    Y_VAL = Number(value);
    animateToMemory(source,mem.y,Y_VAL);
  }

  if (current === 34) {
    X1_VAL = Number(value);
    animateToMemory(source,mem.x1,X1_VAL);
  }   

  if (current === 37) {
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

   if(current >=0){
     memoryExplanation.style.display="flex";
  }



  const inputSteps = [3, 6, 34, 37];

  if (inputSteps.includes(current)) {
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



  //delete numbers from variables
  const clVar = [
    {step: 4, value: mem.x},
    {step: 7, value: mem.y},
    {step: 11, value: mem.add},
    {step: 16, value: mem.sub},
    {step: 21, value: mem.mul},
    {step: 26, value: mem.div},
    {step: 31, value: mem.rem},
    {step: 35, value: mem.x1},
    {step: 38, value: mem.y1},
    {step: 42, value: mem.div2}
  ];

  clVar.forEach(({step, value}) => {
    if(current < step) value.innerText="";
  })


  //declare variables
  const declVar = [
    [2, 0], //x
    [5,1], //y
    [8,2], //add
    [13,3], //sub
    [18,4], //mul
    [23,5], //div
    [28,6], //rem
    [33,10], //x1
    [36,11], //y1
    [39,12] //div2
  ]

  declVar.forEach(([step, i]) => {
    if (current >= step) {
    memItems[i].style.display = "flex";
    memoryExplanation.style.display="flex";
    }
  })




  //range by steps where math is happening for x and y
  const mtRanges = [
    {start: 9, end: 11},
    {start: 14,end: 16},
    {start: 19,end: 21},
    {start: 24,end: 26},
    {start: 29,end: 31}
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

  if (current >=40 && current <=42) {
    num.x1.style.display = "flex";
    num.y1.style.display = "flex";

    // if entering the window, animate them down
    if (current===40) {
      animateToMemory(mem.x1, num.x1, X1_VAL);
      animateToMemory(mem.y1, num.y1, Y1_VAL);
    }
    else {
      // keep them visible if already in window
      if (current >= 41 && current <= 42) {
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
    {start: 10, end: 11, cal: tAdd},
    {start: 15, end: 16, cal: tSub},
    {start: 20, end: 21, cal: tMul},
    {start: 25, end: 26, cal: tDiv},
    {start: 30, end: 31, cal: tRem}
  ];

  sRanges.forEach(({start, end, cal}) =>{
    if(current >=start && current<=end){
      num.sum.style.display = "flex";
      num.sum.innerText = cal;
    }
  })

  if (current >=41 && current <=42){
    num.sum2.style.display = "flex";
    num.sum2.innerText = tDiv2;
  }




  //assign sum to variables
  const asVar = [
    {step: 11, to: "add", value: tAdd},
    {step: 16, to: "sub", value: tSub},
    {step: 21, to: "mul", value: tMul},
    {step: 26, to: "div", value: tDiv},
    {step: 31, to: "rem", value: tRem}
  ];

  asVar.forEach(({step, to, value}) => {
    if(current === step && mem[to].innerText === ""){
      
      animateToMemory(num.sum, mem[to], value);
    }
  })

  if (current === 42 && mem.div2.innerText === "") {
    animateToMemory(num.sum2, mem.div2, tDiv2);
  };



  



  // show math operators
  const mOpp = [
    {start: 9, end: 11, sign:"plus"},
    {start: 14, end: 16, sign:"min"},
    {start: 19, end: 21, sign:"mul"},
    {start: 24, end: 26, sign:"divi"},
    {start: 29, end: 31, sign:"rem"},
    {start: 40, end: 42, sign:"divi2"}
  ];

  mOpp.forEach(({start, end, sign}) => {
    if (current >= start && current <= end) {
      opp[sign].style.display = "block";
    }
  });

  if (
    (current >= 10 && current <= 11) ||
    (current >= 15 && current <= 16) ||
    (current >= 20 && current <= 21) ||
    (current >= 25 && current <= 26) ||
    (current >= 30 && current <= 31)
  ) {
    opp.equal.style.display = "flex";
  }

  if(current >= 41 && current <= 42){
    opp.equal2.style.display="flex";
  }




  //output

  // step 3 x pushed to output
  // step 6 y pushed to output

  const outPrint = [
    {step: 12, value: tAdd, from: "add"},
    {step: 17, value: tSub, from: "sub"},
    {step: 22, value: tMul, from: "mul"},
    {step: 27, value: tDiv, from: "div"},
    {step: 32, value: tRem, from: "rem"}
  ];

  outPrint.forEach(({step, value, from}) => {
    if(current === step && prev<step){
      num.sum.display = "none";
      const x = pushOut(value);
      animateToMemory(mem[from], x, value);
    }
  })

  //step 34 x1 pushed to output
  //step 37 y1 pushed to output

  if (current === 43 && prev<43) {
    num.sum2.style.display = "none";
    const x = pushOut(tDiv2)
    animateToMemory(mem.div2, x, tDiv2);
  }

  //delete output
  const delOut = [4, 7, 12, 17, 22, 27, 32, 35, 38, 43];

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