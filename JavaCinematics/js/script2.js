// MAY HAVE TO REMOVE LINES
const lines = document.querySelectorAll("#high span");
const steps = 37;

//BUTTON CODE
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");


//not needed
const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memADD = document.getElementById("mem-add");

const memItems = document.querySelectorAll(".mem-item");
//MATH SYMBOLS
const plusOp = document.getElementById("plus-op");
const equalOp = document.getElementById("equal-op");

const outputSection = document.getElementById("output-section");


//start page with nopthing highlighted
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


function updateHighlight() {

    lines.forEach(line => line.classList.remove("highlight"));

    // highlight code
    if (current >= 0) {
        lines[current].classList.add("highlight");
    }

    // hides all memory values first
    memItems.forEach(item => item.style.display = "none");

    

    // step 0 declares x
    if (current >= 0) {
        memItems[0].style.display = "flex";
    }

    // step 2 declares y
    if (current >= 2) {
        memItems[1].style.display = "flex";
    }

    // step 4 declares add
    if (current >= 4) {
        memItems[2].style.display = "flex";
    }

    // clears values when going backwards
    if (current < 1) memX.innerText = "";
    if (current < 3) memY.innerText = "";
    if (current < 5) memADD.innerText = "";

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
    if (current === 5 && memADD.innerText === "") {
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
    plusOp.style.display = "none";
    equalOp.style.display = "none";

    // show addition visuals when calculating add
    // START EDITING HERE
    if (current >= 5) {
        plusOp.style.display = "block";
        equalOp.style.display = "block";
    }


    backBtn.disabled = current <= 0;
    nextBtn.disabled = current >= lines.length - 1;
}





nextBtn.addEventListener("click", () => {
    if (current < lines.length - 1) {
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