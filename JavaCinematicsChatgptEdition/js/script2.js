// select all lines
const lines = document.querySelectorAll("#high span");

// BUTTONS
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// MEMORY
const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memC = document.getElementById("mem-c");
const memD = document.getElementById("mem-d");
const memE = document.getElementById("mem-e");

const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");
const out5 = document.getElementById("ou5");

const memItems = document.querySelectorAll(".mem-item");

// OPERATORS
const plusOp = document.getElementById("plus-op");
const equalOp = document.getElementById("equal-op");

// =======================
// STEP CONTROL SYSTEM
// =======================

let current = -1;
let pressCount = 0;

// total number of logical steps in your animation
const totalSteps = 15;

// 👇 EDIT THIS TO CONTROL WHICH STEPS HOLD
// key = step number
// value = number of presses required
const holdSteps = {
    1: 3,
    2:2,
    3:3,
    4: 3,
    7: 2,
    14:3,
};

// returns how long a step should last
function getStepDuration(step) {
    return holdSteps[step] || 1;
}


// =======================
// ANIMATION
// =======================

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
        targetElement.innerText = finalValue;
        document.body.removeChild(flying);
    });
}


// =======================
// UPDATE UI
// =======================

function updateHighlight() {

    // remove highlights
    lines.forEach(line => line.classList.remove("highlight"));

    if (current >= 0 && lines[current]) {
        lines[current].classList.add("highlight");
    }

    // hide memory blocks
    memItems.forEach(item => item.style.visibility="hidden");

    if (current >= 0) memItems[0].style.visibility = "visible";
    if (current >= 3) memItems[1].style.visibility = "visible";
    if (current >= 6) memItems[2].style.visibility = "visible";
    if (current >= 9) memItems[3].style.visibility = "visible";
    if (current >= 12) memItems[4].style.visibility = "visible";

    // CLEAR values when going backward
    if (current < 1) memX.innerText = "";
    if (current < 2) out1.innerText ="";
    if (current < 4) memY.innerText = "";
    if (current < 5) out2.innerText ="";
    if (current < 7) memC.innerText = "";
    if (current < 8) out3.innerText ="";
    if (current < 10) memD.innerText = "";
    if (current < 11) out4.innerText ="";
    if (current < 13) memE.innerText = "";
    if (current < 14) out5.innerText ="";

    // FORWARD ANIMATIONS

    if (current === 1 && memX.innerText === "") {
        animateToMemory(document.getElementById("val-a"), memX, "68");
    }

    if (current === 4 && memY.innerText === "") {
        animateToMemory(document.getElementById("val-b"), memY, "68.0");    
    }

    if (current === 7 && memC.innerText === "") {
        animateToMemory(document.getElementById("val-c"), memC, "D");
    }

    if (current === 10 && memD.innerText === "") {
        animateToMemory(document.getElementById("val-d"), memD, "Number 68");
    }

    if (current === 13 && memE.innerText === "") {
        animateToMemory(document.getElementById("val-e"), memE, "true");
    }

    // OUTPUT ANIMATIONS

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
        animateToMemory(memD, out4, "Number 68");
    }

    if (current === 14 && out5.innerText === "") {
        animateToMemory(memE, out5, "true");
    }

    // operators visible
    plusOp.style.visibility = "visible";
    equalOp.style.visibility = "visible";

    // button states
    backBtn.disabled = current < 0;
    nextBtn.disabled = current >= totalSteps - 1;
}


// =======================
// BUTTON LOGIC
// =======================

nextBtn.addEventListener("click", () => {

    if (current >= totalSteps - 1) return;

    pressCount++;

    if (pressCount >= getStepDuration(current + 1)) {
        current++;
        pressCount = 0;
        updateHighlight();
    }
});


backBtn.addEventListener("click", () => {

    if (current < 0) return;

    pressCount--;

    if (pressCount < 0) {
        current--;
        if (current >= 0) {
            pressCount = getStepDuration(current) - 1;
        } else {
            pressCount = 0;
        }
        updateHighlight();
    }
});


updateHighlight();

