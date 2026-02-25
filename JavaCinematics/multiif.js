// select all spans
const lines = document.querySelectorAll("#high span");

// button
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory squares
const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");

const memC1  = document.getElementById("mem-c1");
const memC2  = document.getElementById("mem-c2");


// calculation row
const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const valResult = document.getElementById("val-result");


// output variables
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");

document.getElementById("ou1").style.textIndent = "15px";
// memory items
const memItems = document.querySelectorAll(".mem-item");


// operator symbols
const compOp = document.getElementById("comp-op");
const eqOp   = document.getElementById("eq-op");



// steps
const steps = 17;
let current = -1;

let X_VAL = "7";
const Y_VAL = "8";
const CONST_7 = "";

document.getElementById("val-x").innerText = "= " + X_VAL;

// animation 
function animateToMemory(sourceElement, targetElement, finalValue) {
    const rectStart = sourceElement.getBoundingClientRect();
    const rectEnd = targetElement.getBoundingClientRect();

    const flying = document.createElement("div");
    flying.className = "fly-value";
    flying.innerText = finalValue;

    document.body.appendChild(flying);

    flying.style.left = rectStart.left + rectStart.width / 2 + "px";
    flying.style.top  = rectStart.top  + rectStart.height / 2 + "px";

    requestAnimationFrame(() => {
        flying.style.left = rectEnd.left + rectEnd.width / 2 + "px";
        flying.style.top  = rectEnd.top  + rectEnd.height / 2 + "px";
    });

    flying.addEventListener("transitionend", () => {
        targetElement.innerText = finalValue;
        document.body.removeChild(flying);
    });
}



function getHLine(step) {
    if (step < 0) return -1;

    // operation highlight windows: [startStep, endStep, spanIndex]
    const ranges = [
      [4,5,6],
      [6,6,7],
      [7,7,1],
      [8,8,3],
      [9,10,8],
      [11,11,9],
      [12,12,1],
      [13,13,3],
      [14,15,4],
      [16,16,5]
    ];

    // if inside an operation window, freeze highlight
    for (const [start, end, line] of ranges) {
        if (step >= start && step <= end) return line;
    }

    // keep the print line highlighted for the fly-to-output step
    if (step === 100) return 5;

    // otherwise shift step based on how many lines are skipped
    // (we don't step through braces/else lines as separate highlights)
    let shift = 0;
    if (step >= 7) shift = 1;   // jump over first if-block braces
    if (step >= 12) shift = 3;  // jump to the blank else-body highlight

    return step + shift;
}




function updateHighlight() {
    // highlight
    lines.forEach(line => line.classList.remove("highlight"));

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


    // hide all memory visuals by default
    memItems.forEach(item => item.style.display = "none");

    // show variable boxes progressively
    // Order in DOM:
    // 0:x, 1:y, 2:cond1, 3:cond2, then template boxes
    if (current >= 0)  memItems[0].style.display = "flex"; // x
    if (current >= 2)  memItems[1].style.display = "flex"; // y
    if (current >= 5)  memItems[2].style.display = "flex"; // cond1



    // calc row pieces are not in memItems (except numX/numY/valResult), so control directly
    numX.style.display = "none";
    numY.style.display = "none";
    compOp.style.display = "none";
    eqOp.style.display = "none";
    valResult.style.display = "none";



    // clear values when going backwards
    if (current < 1) memX.innerText = "";
    if (current < 3) memY.innerText = "";
    if (current === 7 || current === 12) {
    memX.innerText = "";
    memY.innerText = "";
    memC1.innerText = "";
    out1.innerText = "";

    numX.innerText = "";
    numY.innerText = "";
    valResult.innerText = "";
}

    if (current < 7)  memC1.innerText = "";
    if (current < 11) memC2.innerText = "";
    if (current < 7) {
    X_VAL = "7";
    document.getElementById("val-x").innerText = "= " + X_VAL;
}
if (current >2 && current < 7){
    memX.innerText = "7";
}
if (current >7 && current < 12){
    memX.innerText = "8";
}
if (current >4 && current < 7){
    memY.innerText = "8";
}
if (current >8 && current < 12){
    memY.innerText = "8";
}
if (current === 6){
    memC1.innerText = "8";
}
    if (current < 7) out1.innerText = "";
    out2.innerText = "";
    out3.innerText = "";
    out4.innerText = "";
if (current >= 7) {
    X_VAL = "8";
    document.getElementById("val-x").innerText = "= " + X_VAL;
}
if (current >= 12) {
    X_VAL = "9";
    document.getElementById("val-x").innerText = "= " + X_VAL;
}
    // animate x and y from code to memory
    if (current === 1 && memX.innerText === "") {
        animateToMemory(document.getElementById("val-x"), memX, X_VAL);
    }
    if (current === 7 && memX.innerText === "") {
        animateToMemory(document.getElementById("val-x"), memX, X_VAL);
    }
    if (current === 12 && memX.innerText === "") {
        animateToMemory(document.getElementById("val-x"), memX, X_VAL);
    }
    if (current === 3 && memY.innerText === "") {
        animateToMemory(document.getElementById("val-y"), memY, Y_VAL);
    }
     if (current === 8 && memY.innerText === "") {
        animateToMemory(document.getElementById("val-y"), memY, Y_VAL);
    }
      if (current === 13 && memY.innerText === "") {
        animateToMemory(document.getElementById("val-y"), memY, Y_VAL);
    }



    // bring values down during each operation window
    const inAnyOp =
        (current >= 4 && current <= 6) ||
        (current >= 9 && current <= 11)||
        (current >= 14 && current <= 16)

    if (inAnyOp) {
        numX.style.display = "flex";
        numY.style.display = "flex";

        // if entering the window, animate them down
        if (current === 4 && numX.innerText === "" && numY.innerText === "") {
            animateToMemory(memX, numX, X_VAL);
            animateToMemory(memY, numY, Y_VAL);
        } if (current === 9 && numX.innerText === "" && numY.innerText === "") {
            animateToMemory(memX, numX, X_VAL);
            animateToMemory(memY, numY, Y_VAL);
           
            
        } if (current === 14){
             animateToMemory(memX, numX, X_VAL);
             animateToMemory(memY, numY, Y_VAL);

        }
        else {
            // keep them visible if already in window
            if (current >= 2 && current <= 6) {
                numX.innerText = X_VAL;
                
            }
               if (current >= 2 && current <= 4) {
                numX.innerText = X_VAL;
                
            }
            if (current >= 4 && current <= 6) {
                numY.innerText = Y_VAL;
                
            }
        }
    } else {
        // clear when not in window
        numX.innerText = "";
        numY.innerText = "";
    }


    // animate operator symbol in the window / show result
    if (current >= 4 && current <= 6) {
        compOp.style.display = "flex";
        compOp.innerText = "<";
    }
    if (current >= 9 && current <= 11) {
        compOp.style.display = "flex";
        compOp.innerText = "==";
    }
    if (current >= 14 && current <= 16) {
        compOp.style.display = "flex";
        compOp.innerText = ">";
    }

    // show "=" and result (middle step of each window)
    if (current === 3) {
        eqOp.style.display = "flex";
        valResult.style.display = "flex";
        valResult.innerText = "";
    }
    if (current === 10) {
        eqOp.style.display = "flex";
        valResult.style.display = "flex";
        valResult.innerText = "";
    }




    // store to variable 
    if (current === 5 && memC1.innerText === "") {
        // ensure result is present as source
        valResult.innerText = "";
        valResult.style.display = "flex";
        animateToMemory(valResult, memC1, "8");
    }
    if (current === 10 && memC1.innerText === "") {
        valResult.innerText = "";
        valResult.style.display = "flex";
        animateToMemory(valResult, memC1, "equal");
    }
    if (current === 15 && memC1.innerText === "") {
        valResult.innerText = "";
        valResult.style.display = "flex";
        animateToMemory(valResult, memC1, "9");
    }
    


    //fly from memory variable to output
    if (current === 6 && out1.innerText === "") {
        animateToMemory(memC1, out1, "8");
    }
     if (current === 11) {
        animateToMemory(memC1, out1, "equal");
    }
    if (current === 16) {
        animateToMemory(memC1, out1, "9");
    }

    backBtn.disabled = current <= 0;
    nextBtn.disabled = current >= steps - 1;
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



