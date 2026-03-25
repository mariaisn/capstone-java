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
const memoryExplanation = document.getElementById("memory-explanation");

const stepMessages = [
  "Import Scanner",
  "Create Scanner input",
  "Print firstname prompt",
  "Declare firstname",
  "Read firstname",
  "Print firstname greeting",
  "Print lastname prompt",
  "Declare lastname",
  "Read lastname",
  "Print full name greeting",
];

let current = -1;
let firstName = "";
let lastName = "";

function setReferenceValue(targetElement, charsElement, storedValue) {
  targetElement.innerText = "Ref";
  targetElement.dataset.storedValue = storedValue;
  createCharDisplay(charsElement, storedValue);
}

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
    if (targetElement === memX) {
      setReferenceValue(memX, memXChars, finalValue);
    } else if (targetElement === memY) {
      setReferenceValue(memY, memYChars, finalValue);
    } else {
      targetElement.innerText = finalValue;
    }

    document.body.removeChild(flying);
  });
}

function getHLine(step) {
  if (step < 0) return -1;
  if (step === 0) return 0;
  if (step === 1) return 1;
  if (step === 2) return 2;
  if (step === 3) return 3;
  if (step === 4) return 4;
  if (step === 5) return 5;
  if (step === 6) return 6;
  if (step === 7) return 7;
  if (step === 8) return 8;
  return 9;
}

function updateHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));

  const hLine = getHLine(current);
  if (lines[hLine]) lines[hLine].classList.add("highlight");

  inputItems.forEach((item) => {
    item.style.visibility = "hidden";
  });

  if (current === 4) {
    inputItems[0].style.visibility = "visible";
    inputItems[0].value = firstName;
  }

  if (current === 8) {
    inputItems[1].style.visibility = "visible";
    inputItems[1].value = lastName;
  }

  out1.innerText = current >= 2 ? "Enter your firstname:" : "";
  out2.innerText =
    current >= 2 && current !== 4 && firstName !== "" ? firstName : "";

  out3.innerText = "";
  if (current >= 5 && firstName !== "") {
    out3.innerText = `Hello ${firstName}`;
  }

  out4.innerText = current >= 6 ? "Enter your lastname:" : "";

  out5.innerText =
    current >= 6 && current !== 8 && lastName !== "" ? lastName : "";

  out6.innerText =
    current === 9 && firstName !== "" && lastName !== ""
      ? `Hello ${firstName} ${lastName}`
      : "";

  const showFirstMem = current >= 3;
  const showLastMem = current >= 7;

  document.getElementById("mem-item-x").style.visibility = showFirstMem
    ? "visible"
    : "hidden";
  document.getElementById("mem-item-y").style.visibility = showLastMem
    ? "visible"
    : "hidden";

  if (current < 3) {
    memX.innerText = "";
    delete memX.dataset.storedValue;
    memXChars.innerHTML = "";
  }

  if (current < 7) {
    memY.innerText = "";
    delete memY.dataset.storedValue;
    memYChars.innerHTML = "";
  }

  if (current < 4) {
    memXChars.innerHTML = "";
  } else if (memX.dataset.storedValue && memXChars.innerHTML === "") {
    createCharDisplay(memXChars, memX.dataset.storedValue);
  }

  if (current < 8) {
    memYChars.innerHTML = "";
  } else if (memY.dataset.storedValue && memYChars.innerHTML === "") {
    createCharDisplay(memYChars, memY.dataset.storedValue);
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= 9 ;

  updateMemoryExplanation();
}

function updateMemoryExplanation() {
  if (!memoryExplanation) return;

  memoryExplanation.style.display = "flex";
  if (current < 0) {
    memoryExplanation.innerText = "Click Next to begin";
  } else {
    let message = stepMessages[current] || "Done!";

    if (current === 4) {
      message = firstName === "" ? "Input firstname" : "Firstname stored";
    }

    if (current === 8) {
      message = lastName === "" ? "Input lastname" : "Lastname stored";
    }

    memoryExplanation.innerText = message;
  }
}

inputItems[0].addEventListener("keypress", (event) => {
  if (event.key === "Enter" && current === 4) {
    const enteredFirstName = inputItems[0].value.trim();
    if (enteredFirstName === "") return;

    firstName = enteredFirstName;
    out2.innerText = firstName;

    memX.innerText = "";
    memXChars.innerHTML = "";
    animateToMemory(inputItems[0], memX, firstName);

    inputItems[0].style.visibility = "hidden";
    updateMemoryExplanation();
  }
});

inputItems[1].addEventListener("keypress", (event) => {
  if (event.key === "Enter" && current === 8) {
    const enteredLastName = inputItems[1].value.trim();
    if (enteredLastName === "") return;

    lastName = enteredLastName;
    out5.innerText = lastName;

    memY.innerText = "";
    memYChars.innerHTML = "";
    animateToMemory(inputItems[1], memY, lastName);

    inputItems[1].style.visibility = "hidden";
    updateMemoryExplanation();
  }
});

nextBtn.addEventListener("click", () => {
  if (current === 4 && firstName === "") return;
  if (current === 8 && lastName === "") return;
  if (current >= 9) return;

  current++;
  updateHighlight();
});

backBtn.addEventListener("click", () => {
  if (current <= 0) return;

  current--;

  if (current === 4) {
    firstName = "";
    memX.innerText = "";
    delete memX.dataset.storedValue;
    memXChars.innerHTML = "";
    inputItems[0].value = "";
  }

  if (current === 8) {
    lastName = "";
    memY.innerText = "";
    delete memY.dataset.storedValue;
    memYChars.innerHTML = "";
    inputItems[1].value = "";
  }

  updateHighlight();
});

updateHighlight();