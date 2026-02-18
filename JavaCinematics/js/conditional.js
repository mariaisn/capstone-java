// select all spans
const lines = document.querySelectorAll("#high span");

// buttons
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory squares
const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");

const memEql  = document.getElementById("mem-eql");
const memLEql = document.getElementById("mem-lEql");
const memMEql = document.getElementById("mem-mEql");
const memNEql = document.getElementById("mem-nEql");

// calculation row
const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const logicOp = document.getElementById("logic-op");
const equalOp = document.getElementById("equal-op");
const valResult = document.getElementById("val-result");

// output variables
const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");

// memory items (all boxes + calc text blocks use mem-item)
const memItems = document.querySelectorAll(".mem-item");

// steps
const steps = 24;
let current = -1;

const X_VAL = "5";
const Y_VAL = "6";



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



// freeze highlight during the “operation window”
function getHLine(step) {
    if (step < 0) return -1;

    // windows:
    // eql window: 5-7 highlight expression (span index 5)
    if (step >= 5 && step <= 7) return 5;

    // lEql window: 10-12 highlight expression (span index 8)
    if (step >= 10 && step <= 12) return 8;

    // mEql window: 15-17 highlight expression (span index 11)
    if (step >= 15 && step <= 17) return 11;

    // nEql window: 20-22 highlight expression (span index 14)
    if (step >= 20 && step <= 22) return 14;

    let temp = 0;
    if (step > 7)  temp -= 2;
    if (step > 12) temp -= 2;
    if (step > 17) temp -= 2;
    if (step > 22) temp -= 2;

    return step + temp;
}

function updateHighlight() {
    // highlight
    lines.forEach(line => line.classList.remove("highlight"));
    const hLine = getHLine(current);
    if (lines[hLine]) lines[hLine].classList.add("highlight");

    // hide all memory visuals by default
    memItems.forEach(item => item.style.display = "none");

    // show variable boxes progressively
    // Order in DOM:
    // 0:x, 1:y, 2:eql, 3:lEql, 4:mEql, 5:nEql, then calc row items
    if (current >= 0) memItems[0].style.display = "flex"; // x
    if (current >= 2) memItems[1].style.display = "flex"; // y
    if (current >= 4) memItems[2].style.display = "flex"; // eql
    if (current >= 9) memItems[3].style.display = "flex"; // lEql
    if (current >= 14) memItems[4].style.display = "flex"; // mEql
    if (current >= 19) memItems[5].style.display = "flex"; // nEql

    // calc row pieces are not in memItems (except numX/numY/valResult), so control directly
    numX.style.display = "none";
    numY.style.display = "none";
    logicOp.style.display = "none";
    equalOp.style.display = "none";
    valResult.style.display = "none";


    // clear values when going backwards
    if (current < 1) memX.innerText = "";
    if (current < 3) memY.innerText = "";

    if (current < 7)  memEql.innerText = "";
    if (current < 12) memLEql.innerText = "";
    if (current < 17) memMEql.innerText = "";
    if (current < 22) memNEql.innerText = "";

    if (current < 8)  out1.innerText = "";
    if (current < 13) out2.innerText = "";
    if (current < 18) out3.innerText = "";
    if (current < 23) out4.innerText = "";


    // animate x and y from code to memory
    if (current === 1 && memX.innerText === "") {
        animateToMemory(document.getElementById("val-x"), memX, X_VAL);
    }
    if (current === 3 && memY.innerText === "") {
        animateToMemory(document.getElementById("val-y"), memY, Y_VAL);
    }

    // bring x and y down during each operation window
    const inAnyOp =
        (current >= 5 && current <= 7) ||
        (current >= 10 && current <= 12) ||
        (current >= 15 && current <= 17) ||
        (current >= 20 && current <= 22);

    if (inAnyOp) {
        numX.style.display = "flex";
        numY.style.display = "flex";

        // if we're entering the window, animate them down
        if ((current === 5 || current === 10 || current === 15 || current === 20) &&
            numX.innerText === "" && numY.innerText === "") {
            animateToMemory(memX, numX, X_VAL);
            animateToMemory(memY, numY, Y_VAL);
        } else {
            // keep them visible if already in window
            numX.innerText = X_VAL;
            numY.innerText = Y_VAL;
        }
    } else {
        // clear when not in window
        numX.innerText = "";
        numY.innerText = "";
    }

    // show operator symbol in the window
    if (current >= 5 && current <= 7) {
        logicOp.style.display = "flex";
        logicOp.innerText = "==";
    }
    if (current >= 10 && current <= 12) {
        logicOp.style.display = "flex";
        logicOp.innerText = "<=";
    }
    if (current >= 15 && current <= 17) {
        logicOp.style.display = "flex";
        logicOp.innerText = ">=";
    }
    if (current >= 20 && current <= 22) {
        logicOp.style.display = "flex";
        logicOp.innerText = "!=";
    }

    // show "=" and result (middle step of each window)
    // (Hard-coded results based on x=5, y=6)
    if (current === 6) {
        equalOp.style.display = "flex";
        valResult.style.display = "flex";
        valResult.innerText = "false"; // 5==6
    }
    if (current === 11) {
        equalOp.style.display = "flex";
        valResult.style.display = "flex";
        valResult.innerText = "true"; // 5<=6
    }
    if (current === 16) {
        equalOp.style.display = "flex";
        valResult.style.display = "flex";
        valResult.innerText = "false"; // 5>=6
    }
    if (current === 21) {
        equalOp.style.display = "flex";
        valResult.style.display = "flex";
        valResult.innerText = "true"; // 5!=6
    }


    // store to boolean variable 
    if (current === 7 && memEql.innerText === "") {
        // ensure result is present as source
        valResult.innerText = "false";
        valResult.style.display = "flex";
        animateToMemory(valResult, memEql, "false");
    }
    if (current === 12 && memLEql.innerText === "") {
        valResult.innerText = "true";
        valResult.style.display = "flex";
        animateToMemory(valResult, memLEql, "true");
    }
    if (current === 17 && memMEql.innerText === "") {
        valResult.innerText = "false";
        valResult.style.display = "flex";
        animateToMemory(valResult, memMEql, "false");
    }
    if (current === 22 && memNEql.innerText === "") {
        valResult.innerText = "true";
        valResult.style.display = "flex";
        animateToMemory(valResult, memNEql, "true");
    }


    //fly from memory variable to output
    if (current === 8 && out1.innerText === "") {
        animateToMemory(memEql, out1, "false");
    }
    if (current === 13 && out2.innerText === "") {
        animateToMemory(memLEql, out2, "true");
    }
    if (current === 18 && out3.innerText === "") {
        animateToMemory(memMEql, out3, "false");
    }
    if (current === 23 && out4.innerText === "") {
        animateToMemory(memNEql, out4, "true");
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