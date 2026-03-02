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
const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const numADD = document.getElementById("val-add");
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");
const out5 = document.getElementById("ou5");

const memItems = document.querySelectorAll(".mem-item");

//MATH SYMBOLS
const plusOp = document.getElementById("plus-op");
const equalOp = document.getElementById("equal-op");


//start page with nopthing highlighted
const steps=16;
let current = -1;



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

    // operation highlight windows: [startStep, endStep, spanIndex]
    const ranges = [
        [2,3,2],
        [4,4,3],
        [5,6,4],
        [7,7,5],
        [8,9,6],
        [10,10,7],
        [11,12,8],
        [13,13,9],
        [14,15,10]

    ];

    // if inside an operation window, freeze highlight
    for (const [start, end, line] of ranges) {
        if (step >= start && step <= end) return line;
    }

    // keep the print line highlighted for the fly-to-output step
    if (step === 3) return 5;

    // otherwise shift step based on how many lines are skipped
    // (we don't step through braces/else lines as separate highlights)
    let shift = 0;
    if (step === 3) shift = 1;   // jump over first if-block braces
    if (step >= 12) shift = 3;  // jump to the blank else-body highlight

    return step - shift;
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

    memItems.forEach(item => item.style.visibility="hidden");

    // step 0 declares x
    if (current >= 1) {
        memItems[0].style.visibility = "visible";
    }

    // step 2 declares y
    if (current >= 4) {
        memItems[1].style.visibility = "visible";
    }

    // step 4 declares add
    if (current >= 7) {
        memItems[2].style.visibility = "visible";
    }
  if (current >= 10) {
        memItems[3].style.visibility = "visible";
    }
   if (current >= 13) {
        memItems[4].style.visibility = "visible";
    }

    //bring x and y down
 

    //step 7: add x and y

    // clears values when going backwards
    if (current < 2) memX.innerText = "";
    if (current < 1)  out1.innerText ="";
    if (current < 5) memY.innerText = "";
    if (current < 4)  out2.innerText ="";
    if (current < 8) memC.innerText = "";
    if (current < 7)  out3.innerText ="";
    if (current < 11) memD.innerText = "";
    if (current < 10)  out4.innerText ="";
    if (current < 14) memE.innerText = "";
    if (current < 13)  out5.innerText ="";


    // animate going forward
    // initiates x
  
     if (current === 2 && out1.innerText=== ""){
    out1.innerText = "8";
   }
    if (current === 5 && out2.innerText=== ""){
    out2.innerText = "8.0";
   }
    if (current === 8 && out3.innerText=== ""){
    out3.innerText = 'Hello World';
   }
     if (current === 11 && out4.innerText=== ""){
    out4.innerText = 'Hello World';
   }
        if (current === 14 && out5.innerText=== ""){
    out5.innerText = 'H';
   }





   // if(current === 8 && outAns.innerText === ""){
        //outAns.style.visibility="visible";
        //outAns.innerText="18";
        //animateToMemory(memADD, outAns, "D");
   // }


    //fly from memory variable to output
    if (current === 3 && memX.innerText === "") {
        animateToMemory(out1, memX, "8");
    }
    if (current === 6 && memY.innerText === "") {
        animateToMemory(out2, memY, "8.0");
    }
    if (current === 9 && memC.innerText === "") {
        animateToMemory(out3, memC, "Hello");
    }
    if (current === 12 && memD.innerText === "") {
        animateToMemory(out4, memD, "Hello World");
    }
        if (current === 15 && memE.innerText === "") {
        animateToMemory(out5, memE, "H");
    }


    // hide operators
    plusOp.style.visibility = "hidden";
    equalOp.style.visibility = "hidden";

    // show addition visuals when calculating add
    // START EDITING HERE
   // if (current >=5 && current<=7) {
        plusOp.style.visibility="visible";
   // }

    //if (current >=6 && current<=7){
        equalOp.style.visibility="visible";
   // }


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