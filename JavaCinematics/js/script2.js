//select all lines
const lines = document.querySelectorAll("#high span");

//BUTTON CODE
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");


const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memADD = document.getElementById("mem-add");

const memItems = document.querySelectorAll(".mem-item");

//MATH SYMBOLS
const plusOp = document.getElementById("plus-op");
const equalOp = document.getElementById("equal-op");

const outputSection = document.getElementById("output-section");


//start page with nopthing highlighted
const steps=38;
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


//function to calculate what line to highlight
//keeps highlight still during math process
//corrects line skips
function getHLine(step){
    if (step<0) return -1;

    if(step>=5 && step <=7) 
        return 5;
    
    else if(step >=10 && step<=12)
        return 8;
    
    else if(step >=15 && step<=17)
        return 11;

    else if(step>=20 && step<=22)
        return 14;

    else if(step>=25 && step<=27)
        return 17;

    else if(step>=34 && step<=36)
        return 24;

    let temp = 0;
    if (step > 7)
        temp = temp-2;
    if (step >12)
        temp = temp-2;
    if (step >17)
        temp=temp-2;
    if (step> 22)
        temp=temp-2;
    if(step > 27)
        temp=temp-2;
    if(step>36)
        temp=temp-2;

    return step + temp;
}


function updateHighlight() {

    lines.forEach(line => line.classList.remove("highlight"));

    //call to get proper line to highlight into hLine
    const hLine = getHLine(current);

    //highlights the line
    if(lines[hLine]){
        lines[hLine].classList.add("highlight");
    }

    memItems.forEach(item => item.style.visibility="hidden");

    // step 0 declares x
    if (current >= 0) {
        memItems[0].style.visibility = "visible";
    }

    // step 2 declares y
    if (current >= 2) {
        memItems[1].style.visibility = "visible";
    }

    // step 4 declares add
    if (current >= 4) {
        memItems[2].style.visibility = "visible";
    }

    //bring x and y down
    if ((current >=5 && current<=7)||
        (current >=10 && current <=12)||
        (current >=14 && current <=16)){
        memItems[3].style.visibility="visible";
        memItems[4].style.visibility="visible";
    }

    //step 7: add x and y
    if (current >=6 && current<=7){
        memItems[5].style.visibility="visible";
    }

    // clears values when going backwards
    if (current < 1) memX.innerText = "";
    if (current < 3) memY.innerText = "";
    if (current < 7) memADD.innerText = "";

    // animate going forward
    // initiates x
    if (current === 1 && memX.innerText === "") {
        animateToMemory(document.getElementById("val-x"), memX, "13");
    }
    // initiates y
    if (current === 3 && memY.innerText === "") {
        animateToMemory(document.getElementById("val-y"), memY, "5");
    }
    // initiates add
    if (current === 7 && memADD.innerText === "") {
        animateToMemory(document.getElementById("val-add"), memADD, "18");
    }

    // clear output when going backwards
    if (current < 6) {
        outputSection.innerText = "";
    }

    // show output when reached println line
    if (current === 6) {
        outputSection.innerText = "18";
    }

    // hide operators
    plusOp.style.visibility = "hidden";
    equalOp.style.visibility = "hidden";

    // show addition visuals when calculating add
    // START EDITING HERE
    if (current >=5 && current<=7) {
        plusOp.style.visibility="visible";
    }

    if (current >=6 && current<=7){
        equalOp.style.visibility="visible";
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