const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const inputItems = document.querySelectorAll(".input-item");
const valX = document.getElementById("val-x");
const valY = document.getElementById("val-y");

const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memC1 = document.getElementById("mem-c1");
const memC2 = document.getElementById("mem-c2");

const itemX = document.getElementById("item-x");
const itemY = document.getElementById("item-y");
const itemC1 = document.getElementById("item-eql");
const itemC2 = document.getElementById("item-lEql");

const numX = document.getElementById("mem-num-x");
const numY = document.getElementById("mem-num-y");
const compOp = document.getElementById("comp-op");
const eqOp = document.getElementById("eq-op");
const valResult = document.getElementById("val-result");

const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");

let current = 0;
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

function getHLine(step) {
    if (step === 0) return 0;
    if (step === 1) return 2;
    if (step === 2) return isGreater() ? 4 : -1;
    if (step === 3) return 5;
    if (step === 4) return isLess() ? 6 : 8;
    if (step === 5) return 7;
    return 9;
}

function getNextStep(step) {
    if (step === 0) return 1;
    if (step === 1) return 2;
    if (step === 2) return isGreater() ? 3 : 4;
    if (step === 3) return 3;
    if (step === 4) return isLess() ? 5 : 6;
    if (step === 5) return 5;
    return 6;
}

function isTerminalStep(step) {
    return step === 3 || step === 5 || step === 6;
}

function updateHighlight() {
    lines.forEach((line) => line.classList.remove("highlight"));

    const hLine = getHLine(current);
    if (lines[hLine]) lines[hLine].classList.add("highlight");
    if (hLine === 9 && lines[8]) lines[8].classList.add("highlight");

    inputItems.forEach((item) => {
        item.style.visibility = "hidden";
    });

    if (current === 0) {
        inputItems[0].style.visibility = "visible";
        inputItems[0].value = hasX() ? String(xValue) : "";
        out1.innerText = "Enter x:";
    } else if (current === 1) {
        inputItems[1].style.visibility = "visible";
        inputItems[1].value = hasY() ? String(yValue) : "";
        out1.innerText = "Enter y:";
    }

    itemX.style.display = current >= 0 ? "flex" : "none";
    itemY.style.display = current >= 1 ? "flex" : "none";
    itemC1.style.display = current >= 2 && isGreater() ? "flex" : "none";
    itemC2.style.display = current >= 4 && isLess() ? "flex" : "none";

    out2.innerText = "";
    out3.innerText = "";
    out4.innerText = "";

    if (current < 1) {
        memY.innerText = "";
        yValue = null;
        inputItems[1].value = "";
        valY.innerText = "= 0";
    }

    if (current < 2) memC1.innerText = "";
    if (current < 4) memC2.innerText = "";

    clearCalcRow();

    if (current === 2) {
        if (isGreater()) {
            const compareResult = "true";
            showCompare(">", compareResult);
            if (memC1.innerText === "") {
                animateToMemory(valResult, memC1, compareResult);
            }
        }
    }

    if (current > 2 && isGreater() && memC1.innerText === "") {
        memC1.innerText = "true";
    }

    if (current === 4) {
        if (isLess()) {
            const compareResult2 = "true";
            showCompare("<", compareResult2);
            if (memC2.innerText === "") {
                animateToMemory(valResult, memC2, compareResult2);
            }
        }
    }

    if (current > 4 && isLess() && memC2.innerText === "") {
        memC2.innerText = "true";
    }

    if (current === 3 && out1.innerText !== "Enter x:" && out1.innerText !== "Enter y:" && out1.innerText === "") {
        animateToMemory(memX, out1, String(xValue));
    }

    if (current === 5 && out1.innerText === "") {
        animateToMemory(memY, out1, String(yValue));
    }

    if (current === 6 && out1.innerText === "") {
        animateToMemory(lines[9], out1, "equal");
    }

    backBtn.disabled = current <= 0;
    nextBtn.disabled = isTerminalStep(current);
}

inputItems[0].addEventListener("keypress", (event) => {
    if (event.key === "Enter" && current === 0) {
        const raw = inputItems[0].value.trim();
        const parsed = Number(raw);
        if (raw === "" || !Number.isFinite(parsed)) {
            out1.innerText = "Enter a valid number for x.";
            return;
        }

        xValue = parsed;
        valX.innerText = `= ${xValue}`;
        memX.innerText = "";
        memC1.innerText = "";
        memC2.innerText = "";
        out1.innerText = "";
        animateToMemory(inputItems[0], memX, String(xValue));
        inputItems[0].style.visibility = "hidden";
    }
});

inputItems[1].addEventListener("keypress", (event) => {
    if (event.key === "Enter" && current === 1) {
        const raw = inputItems[1].value.trim();
        const parsed = Number(raw);
        if (raw === "" || !Number.isFinite(parsed)) {
            out1.innerText = "Enter a valid number for y.";
            return;
        }

        yValue = parsed;
        valY.innerText = `= ${yValue}`;
        memY.innerText = "";
        memC1.innerText = "";
        memC2.innerText = "";
        out1.innerText = "";
        animateToMemory(inputItems[1], memY, String(yValue));
        inputItems[1].style.visibility = "hidden";
    }
});

nextBtn.addEventListener("click", () => {
    if (current === 0 && !hasX()) {
        out1.innerText = "Enter x first.";
        return;
    }

    if (current === 1 && !hasY()) {
        out1.innerText = "Enter y first.";
        return;
    }

    if (isTerminalStep(current)) return;

    history.push(current);
    current = getNextStep(current);
    updateHighlight();
});

backBtn.addEventListener("click", () => {
    if (history.length === 0) return;
    current = history.pop();
    updateHighlight();
});

updateHighlight();
