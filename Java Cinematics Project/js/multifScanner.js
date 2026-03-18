const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const inputItems = document.querySelectorAll(".input-item");

const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");

const itemX = document.getElementById("item-x");
const itemY = document.getElementById("item-y");

const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const compOp = document.getElementById("comp-op");
const eqOp = document.getElementById("eq-op");
const valResult = document.getElementById("val-result");
const RESULT_POP_DELAY_MS = 850;

const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");
const echoX = document.getElementById("echo-x");
const echoY = document.getElementById("echo-y");

let current = -1;
let xValue = null;
let yValue = null;
const history = [];

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

function hasX() {
    return Number.isFinite(xValue);
}

function hasY() {
    return Number.isFinite(yValue);
}

function isGreater() {
    return xValue > yValue;
}

function isLess() {
    return xValue < yValue;
}

function clearCalcRow() {
    numX.style.display = "none";
    numY.style.display = "none";
    compOp.style.display = "none";
    eqOp.style.display = "none";
    valResult.style.display = "none";
    numX.innerText = "";
    numY.innerText = "";
    valResult.innerText = "";
}

function showCompare(opText, resultText) {
    numX.style.display = "flex";
    numY.style.display = "flex";
    compOp.style.display = "flex";
    eqOp.style.display = "flex";
    valResult.style.display = "flex";

    numX.innerText = String(xValue);
    numY.innerText = String(yValue);
    compOp.innerText = opText;
    eqOp.innerText = "=";
    valResult.innerText = resultText;
}

function revealResultAfterAnimation(step, value) {
    valResult.innerText = "";

    setTimeout(() => {
        if (current === step) {
            valResult.innerText = value;
        }
    }, RESULT_POP_DELAY_MS);
}

function getHLine(step) {
    if (step < 0) return -1;
    if (step === 0) return 0;

    let line = 0;
    if (step === 1) line = 1;
    else if (step === 2) line = 2;
    else if (step === 3) line = 3;
    else if (step === 4) line = 4;
    else if (step === 5) line = 5;
    else if (step === 6) line = 6;
    else if (step === 7) line = isGreater() ? 7 : -1;
    else if (step === 8 || step === 9) line = 8;
    else if (step === 10) line = isLess() ? 9 : 11;
    else if (step === 11) line = 10;
    else line = 11;

    return line === -1 ? -1 : line + 1;
}

function getNextStep(step) {
    if (step < 0) return 0;
    if (step === 0) return 1;
    if (step === 1) return 2;
    if (step === 2) return 3;
    if (step === 3) return 4;
    if (step === 4) return 5;
    if (step === 5) return 6;
    if (step === 6) return 7;
    if (step === 7) return isGreater() ? 8 : 10;
    if (step === 8) return 9;
    if (step === 9) return 9;
    if (step === 10) return isLess() ? 11 : 12;
    if (step === 11) return 11;
    if (step === 12) return 13;
    return 13;
}

function isTerminalStep(step) {
    return step === 9 || step === 11 || step === 13;
}

function updateHighlight() {
    lines.forEach((line) => line.classList.remove("highlight"));

    const hLine = getHLine(current);
    if (lines[hLine]) lines[hLine].classList.add("highlight");
    if (hLine === 12 && lines[13]) lines[13].classList.add("highlight");

    inputItems.forEach((item) => {
        item.style.visibility = "hidden";
    });

    if (current === 3) {
        inputItems[0].style.visibility = "visible";
        inputItems[0].value = hasX() ? String(xValue) : "";
    }

    if (current === 6 && !hasY()) {
        inputItems[1].style.visibility = "visible";
        inputItems[1].value = hasY() ? String(yValue) : "";
    }

    if (current >= 1) {
        out1.innerText = "Enter x: ";
    } else {
        out1.innerText = "";
    }

    if (current >= 4) {
        out2.innerText = "Enter y: ";
    } else {
        out2.innerText = "";
    }

    echoX.innerText = current >= 1 && current !== 3 && hasX() ? String(xValue) : "";
    echoY.innerText = current >= 4 && hasY() ? String(yValue) : "";

    itemX.style.display = current >= 2 ? "flex" : "none";
    itemY.style.display = current >= 5 ? "flex" : "none";

    out3.innerText = "";

    if (current < 3) {
        memX.innerText = "";
        xValue = null;
        inputItems[0].value = "";
    }

    if (current < 6) {
        memY.innerText = "";
        yValue = null;
        inputItems[1].value = "";
    }

    clearCalcRow();

    if (current === 2 && hasX() && memX.innerText === "") {
        animateToMemory(inputItems[0], memX, String(xValue));
    }

    if (current === 6 && hasY() && memY.innerText === "") {
        animateToMemory(inputItems[1], memY, String(yValue));
    }

    if (current === 8 && isGreater()) {
        numX.style.display = "flex";
        numY.style.display = "flex";
        compOp.style.display = "flex";
        eqOp.style.display = "flex";
        valResult.style.display = "flex";
        compOp.innerText = ">";
        eqOp.innerText = "=";
        revealResultAfterAnimation(8, String(xValue));
        animateToMemory(memX, numX, String(xValue));
        animateToMemory(memY, numY, String(yValue));
    }
    if (current === 9 && isGreater()) {
        showCompare(">", String(xValue));
    }

    if (current === 10 && isLess()) {
        const compareResult2 = String(yValue);
        numX.style.display = "flex";
        numY.style.display = "flex";
        compOp.style.display = "flex";
        eqOp.style.display = "flex";
        valResult.style.display = "flex";
        compOp.innerText = "<";
        eqOp.innerText = "=";
        revealResultAfterAnimation(10, compareResult2);
        animateToMemory(memX, numX, String(xValue));
        animateToMemory(memY, numY, String(yValue));
    }
    if (current === 11 && isLess()) {
        const compareResult2 = String(yValue);
        showCompare("<", compareResult2);
    }

    // equal-case calculation row (matches multiif style)
    if (current === 12 && hasX() && hasY() && !isLess() && !isGreater()) {
        numX.style.display = "flex";
        numY.style.display = "flex";
        compOp.style.display = "flex";
        eqOp.style.display = "flex";
        valResult.style.display = "flex";

        compOp.innerText = "==";
        eqOp.innerText = "=";
        revealResultAfterAnimation(12, String(xValue));
        animateToMemory(memX, numX, String(xValue));
        animateToMemory(memY, numY, String(yValue));
    }
    if (current === 13 && hasX() && hasY() && !isLess() && !isGreater()) {
        showCompare("==", String(xValue));
    }

    if (current === 9 && out3.innerText === "") {
        animateToMemory(memX, out3, String(xValue));
    }

    if (current === 11 && out3.innerText === "") {
        animateToMemory(memY, out3, String(yValue));
    }

    if (current === 13 && out3.innerText === "") {
        animateToMemory(memX, out3, String(xValue));
    }

    backBtn.disabled = current <= 0;
    nextBtn.disabled = isTerminalStep(current);
}

inputItems[0].addEventListener("keypress", (event) => {
    if (event.key === "Enter" && current === 3) {
        const raw = inputItems[0].value.trim();
        const parsed = Number(raw);
        if (raw === "" || !Number.isFinite(parsed)) {
            return;
        }

        xValue = parsed;
        memX.innerText = "";
        out4.innerText = "";
        echoX.innerText = String(xValue);
        animateToMemory(inputItems[0], memX, String(xValue));
        inputItems[0].style.visibility = "hidden";
    }
});

inputItems[1].addEventListener("keypress", (event) => {
    if (event.key === "Enter" && current === 6) {
        const raw = inputItems[1].value.trim();
        const parsed = Number(raw);
        if (raw === "" || !Number.isFinite(parsed)) {
            return;
        }

        yValue = parsed;
        memY.innerText = "";
        out4.innerText = "";
        echoY.innerText = String(yValue);
        animateToMemory(inputItems[1], memY, String(yValue));
        inputItems[1].style.visibility = "hidden";
    }
});

nextBtn.addEventListener("click", () => {
    if (current === 3 && !hasX()) {
        return;
    }

    if (current === 6 && !hasY()) {
        return;
    }

    out4.innerText = "";

    if (isTerminalStep(current)) return;

    history.push(current);
    current = getNextStep(current);
    updateHighlight();
});

backBtn.addEventListener("click", () => {
    if (history.length === 0) return;
    current = history.pop();

    if (current === 3) {
        xValue = null;
        memX.innerText = "";
        inputItems[0].value = "";
    }

    if (current === 6) {
        yValue = null;
        memY.innerText = "";
        inputItems[1].value = "";
    }

    updateHighlight();
});

updateHighlight();