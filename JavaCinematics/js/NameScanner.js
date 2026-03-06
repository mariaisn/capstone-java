const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memXChars = document.getElementById("mem-x-chars");
const memYChars = document.getElementById("mem-y-chars");

const out1 = document.getElementById("ou1");
const out2 = document.getElementById("ou2");
const out3 = document.getElementById("ou3");
const out4 = document.getElementById("ou4");
const out5 = document.getElementById("ou5");
const out6 = document.getElementById("ou6");

const inputItems = document.querySelectorAll(".input-item");

let current = 0;
let firstName = "";
let lastName = "";

function createCharDisplay(container, str) {
    container.innerHTML = "";

    const indexRow = document.createElement("div");
    indexRow.className = "char-row";

    for (let i = 0; i < str.length; i++) {
        const indexBox = document.createElement("div");
        indexBox.className = "char-index";
        indexBox.innerText = i;
        indexRow.appendChild(indexBox);
    }

    container.appendChild(indexRow);

    const charRow = document.createElement("div");
    charRow.className = "char-row";

    for (let i = 0; i < str.length; i++) {
        const charBox = document.createElement("div");
        charBox.className = "char-box";
        charBox.innerText = str[i];
        charRow.appendChild(charBox);
    }

    container.appendChild(charRow);
}

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

        if (targetElement === memX) {
            createCharDisplay(memXChars, finalValue);
        }
        if (targetElement === memY) {
            createCharDisplay(memYChars, finalValue);
        }

        document.body.removeChild(flying);
    });
}

function getHLine(step) {
    if (step === 0) return 0;
    if (step === 1) return 1;
    if (step === 2) return 2;
    if (step === 3) return 3;
    if (step === 4) return 4;
    if (step === 5) return 5;
    if (step === 6) return 6;
    if (step === 7) return 7;
    return 8;
}

function updateHighlight() {
    lines.forEach((line) => line.classList.remove("highlight"));

    const hLine = getHLine(current);
    if (lines[hLine]) lines[hLine].classList.add("highlight");

    inputItems.forEach((item) => {
        item.style.visibility = "hidden";
    });

    if (current === 3) {
        inputItems[0].style.visibility = "visible";
        inputItems[0].value = firstName;
    }

    if (current === 7) {
        inputItems[1].style.visibility = "visible";
        inputItems[1].value = lastName;
    }

    out1.innerText = current >= 1 ? "Enter your firstname:" : "";
    out2.innerText = current >= 1 && current !== 3 && firstName !== "" ? firstName : "";

    out3.innerText = "";
    if (current >= 4 && firstName !== "") {
        out3.innerText = `Hello ${firstName}`;
    }

    out4.innerText = current >= 5 ? "Enter your lastname:" : "";

    out5.innerText = current >= 5 && current !== 7 && lastName !== ""
        ? lastName
        : "";

    out6.innerText = current === 8 && firstName !== "" && lastName !== ""
        ? `Hello ${firstName} ${lastName}`
        : "";

    const showFirstMem = current >= 2;
    const showLastMem = current >= 6;

    document.getElementById("mem-item-x").style.visibility = showFirstMem ? "visible" : "hidden";
    document.getElementById("mem-item-y").style.visibility = showLastMem ? "visible" : "hidden";

    if (current < 2) {
        memX.innerText = "";
        memXChars.innerHTML = "";
    }

    if (current < 6) {
        memY.innerText = "";
        memYChars.innerHTML = "";
    }

    if (current !== 3) {
        memXChars.innerHTML = "";
    } else if (memX.innerText !== "" && memXChars.innerHTML === "") {
        createCharDisplay(memXChars, memX.innerText);
    }

    if (current !== 7) {
        memYChars.innerHTML = "";
    } else if (memY.innerText !== "" && memYChars.innerHTML === "") {
        createCharDisplay(memYChars, memY.innerText);
    }

    backBtn.disabled = current <= 0;
    nextBtn.disabled = current >= 8;
}

inputItems[0].addEventListener("keypress", (event) => {
    if (event.key === "Enter" && current === 3) {
        const enteredFirstName = inputItems[0].value.trim();
        if (enteredFirstName === "") return;

        firstName = enteredFirstName;
        out2.innerText = firstName;

        memX.innerText = "";
        memXChars.innerHTML = "";
        animateToMemory(inputItems[0], memX, firstName);

        inputItems[0].style.visibility = "hidden";
    }
});

inputItems[1].addEventListener("keypress", (event) => {
    if (event.key === "Enter" && current === 7) {
        const enteredLastName = inputItems[1].value.trim();
        if (enteredLastName === "") return;

        lastName = enteredLastName;
        out5.innerText = lastName;

        memY.innerText = "";
        memYChars.innerHTML = "";
        animateToMemory(inputItems[1], memY, lastName);

        inputItems[1].style.visibility = "hidden";
    }
});

nextBtn.addEventListener("click", () => {
    if (current === 3 && firstName === "") return;
    if (current === 7 && lastName === "") return;
    if (current >= 8) return;

    current++;
    updateHighlight();
});

backBtn.addEventListener("click", () => {
    if (current <= 0) return;

    current--;

    if (current === 3) {
        firstName = "";
        memX.innerText = "";
        memXChars.innerHTML = "";
        inputItems[0].value = "";
    }

    if (current === 7) {
        lastName = "";
        memY.innerText = "";
        memYChars.innerHTML = "";
        inputItems[1].value = "";
    }

    updateHighlight();
});

updateHighlight();