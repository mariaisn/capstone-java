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
  "Condition is false",
  "Exit Loop",
];

let current = -1;
const steps = 10;

let x=0;
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
        [4,6,4],
        [7,8,5],
    ];

    for (const [start, end, line] of freeze) {
        if (step >= start && step <= end) return line;
    }

    let temp = 0;
    if (step > 6) temp = temp - 2;
    if (step > 8) temp = temp - 1;

    return step + temp;
}



function addConsoleRow(text) {
  const row = document.createElement("div");
  row.className = "console-row";

  const span = document.createElement("span");
  span.innerText = text;

  row.appendChild(span);
  conBox.appendChild(row);

  return span;
}



function updateUI() {
    lines.forEach((line) => line.classList.remove("highlight"));

    memItems.forEach((item) => (item.style.display = "none"));
    memoryExplanation.style.display ="none";
    plusOp.style.display ="none";
    lessOp.style.display ="none";
    eqOp.style.display ="none";

    //call to get proper line to highlight into hLine
    const hLine = getHLine(current);

    //highlights the line
    if (lines[hLine]) {
        lines[hLine].classList.add("highlight");
    }


    if(current < 1) memX.innerText = "";




    if (current >= 0){
        memItems[0].style.display = "flex";
        memoryExplanation.style.display="flex";
    }

    if (current === 1 && memX.innerText===""){
        animateToMemory(vX, memX, x);
    }

    if(current === 3){
        const y=addConsoleRow("Hello");
        animateToMemory(vPrint, y, "Hello");
    }



    
if (current >=4 && current <=6) {
    numX.style.display = "flex";
    num1.style.display = "flex";

    // if entering the window, animate them down
    if (current === 4) {
            animateToMemory(memX, numX, x);
            animateToMemory(v1, num1, 1);
            plusOp.style.display = "flex";
        }
    else {
        // keep them visible if already in window
    if (current === 5) {
                numX.innerText = x;
                num1.innerText = 1;
                plusOp.style.display = "flex";
                eqOp.style.display = "flex";
            }
    else if (current === 6) {
                numX.innerText = x;
                num1.innerText = 1;
                plusOp.style.display = "flex";
                eqOp.style.display = "flex";
            }
        
    else {
        // clear when not in window
        numX.style.display = "none";
        num1.style.display = "none";
        numX.innerText = "";
        num1.innerText = "";
    }
}
}

    

    if(current>=5 && current <=6){

        if(current ===5){
            vSum.style.display = "flex";
            vSum.innerText = x++;
        }
        else if(current ===6){
        vSum.style.display = "flex";
        vSum.innerText = x;
        animateToMemory(vSum, memX, x);
        }
    }



 if (current >=7 && current <=8) {
    numX1.style.display = "flex";
    numC.style.display = "flex";

    // if entering the window, animate them down
    if (current === 7) {
            animateToMemory(memX, numX1, x);
            animateToMemory(vC, numC, 3);
        }
    else {
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

    if (current >=7 && current <=8){
        lessOp.style.display = "flex";
    }

    if (current === 8){
        vBool.style.display = "flex";
        boolVal = x < 3 ? "True" : "False";
        vBool.innerText = boolVal;

        if(boolVal === "True"){
            current = 1;
            loopCount++;
            if(loopCount>0){
            stepMessages[1]="Condition is True";
            }
            else {
                stepMessages[1]="Assign 0 to x";
            }
        }
    }



  backBtn.disabled = current <= 0;
  nextBtn.disabled = (current >= steps - 1);
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