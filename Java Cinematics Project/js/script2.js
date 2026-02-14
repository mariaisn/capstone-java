const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");


// added the following 7 - antonio
const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memZ = document.getElementById("mem-z");

const memItems = document.querySelectorAll(".mem-item");

const plusOp = document.getElementById("plus-op");
const equalOp = document.getElementById("equal-op");

const outputSection = document.getElementById("output-section");



let current = -1; // no line selected



// added this function - antonio
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


// updated this function - antonio
function updateHighlight() {

    lines.forEach(line => line.classList.remove("highlight"));

    // highlight code
    if (current >= 0) {
        lines[current].classList.add("highlight");
    }

    // hides all memory values first
    memItems.forEach(item => item.style.display = "none");

    // step 1 shows x
    if (current >= 1) {
        memItems[0].style.display = "flex";
    }

    // step 3 shows y
    if (current >= 3) {
        memItems[1].style.display = "flex";
    }

    // step 5 shows z
    if (current >= 5) {
        memItems[2].style.display = "flex";
    }

    // clears values when going backwards
    if (current < 1) memX.innerText = "";
    if (current < 3) memY.innerText = "";
    if (current < 5) memZ.innerText = "";

    // animate going forward
    if (current === 1 && memX.innerText === "") {
        animateToMemory(document.getElementById("val-x"), memX, "5");
    }

    if (current === 3 && memY.innerText === "") {
        animateToMemory(document.getElementById("val-y"), memY, "6");
    }

    if (current === 5 && memZ.innerText === "") {
        animateToMemory(document.getElementById("val-z"), memZ, "11");
    }

    // clear output when going backwards
    if (current < 6) {
        outputSection.innerText = "";
    }

    // show output when reached println line
    if (current === 6) {
        outputSection.innerText = "11";
    }

    // hide operators
    plusOp.style.display = "none";
    equalOp.style.display = "none";

    // show addition visuals when calculating z
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

// initial state
updateHighlight();