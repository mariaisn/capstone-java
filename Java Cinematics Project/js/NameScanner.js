//select all lines
const lines = document.querySelectorAll("#high span");

//BUTTON CODE
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memX = document.getElementById("mem-x");
const memY = document.getElementById("mem-y");
const memXChars = document.getElementById("mem-x-chars");
const memYChars = document.getElementById("mem-y-chars");
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
const inputItems = document.querySelectorAll(".input-item");

//MATH SYMBOLS
const plusOp = document.getElementById("plus-op");
const equalOp = document.getElementById("equal-op");

//start page with nopthing highlighted
const steps = 9;
let current = -1;

function createCharDisplay(container, str) {
  container.innerHTML = "";

  // Create index row (numbers)
  const indexRow = document.createElement("div");
  indexRow.className = "char-row";

  for (let i = 0; i < str.length; i++) {
    const indexBox = document.createElement("div");
    indexBox.className = "char-index";
    indexBox.innerText = i;
    indexRow.appendChild(indexBox);
  }

  container.appendChild(indexRow);

  // Create character row
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

  // start at code
  flying.style.left = rectStart.left + rectStart.width / 2 + "px";
  flying.style.top = rectStart.top + rectStart.height / 2 + "px";

  requestAnimationFrame(() => {
    // move to center of memory square
    flying.style.left = rectEnd.left + rectEnd.width / 2 + "px";
    flying.style.top = rectEnd.top + rectEnd.height / 2 + "px";
  });

  flying.addEventListener("transitionend", () => {
    // Check if this is a string value (for firstname/lastname variables)
    if (targetElement === memX) {
      targetElement.innerText = finalValue;
      createCharDisplay(memXChars, finalValue);
    } else if (targetElement === memY) {
      targetElement.innerText = finalValue;
      createCharDisplay(memYChars, finalValue);
    } else {
      targetElement.innerText = finalValue;
    }
    document.body.removeChild(flying);
  });
}

function getHLine(step) {
  if (step < 0) return -1;

  // operation highlight windows: [startStep, endStep, spanIndex]
  const ranges = [];

  // if inside an operation window, freeze highlight
  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

  // keep the print line highlighted for the fly-to-output step
  if (step === 100) return 5;

  // otherwise shift step based on how many lines are skipped
  // (we don't step through braces/else lines as separate highlights)
  let shift = 0;

  return step - shift;
}

function updateHighlight() {
  // highlight
  lines.forEach((line) => line.classList.remove("highlight"));

  // call to get proper line to highlight into HLine
  const hLine = getHLine(current);

  if (lines[hLine]) lines[hLine].classList.add("highlight");

  // make the if-statement highlight appear as one continuous block
  // (each if line is split across 3 spans in the HTML)

  memItems.forEach((item) => (item.style.visibility = "hidden"));

  // hide all input items by default
  inputItems.forEach((item) => (item.style.visibility = "hidden"));

  // step 0 declares x
  if (current >= 2) {
    memItems[0].style.visibility = "visible";
  }
  if (current === 1) {
    if (out1) out1.innerText = "Enter your first name";
  }

  // reveal first-name input on its step
  if (current === 3) {
    inputItems[0].style.visibility = "visible";
  }

  // step 2 declares y
  if (current >= 6) {
    memItems[1].style.visibility = "visible";
  }

  // show greeting in output at step 4 using memX
  if (current === 4 && memX.innerText !== "") {
    animateToMemory(memX, out2, "Hello " + memX.innerText);
  }

  // prompt for lastname a step later; include first name if available
  // use out3 so we don't overwrite the first-name greeting in out2
  if (current === 5) {
    if (firstName) {
      out4.innerText = `Enter your last name, ${firstName}`;
    } else {
      out4.innerText = "Enter your last name";
    }
  }

  // reveal last-name input when ready
  if (current === 7) {
    inputItems[1].style.visibility = "visible";
    // leaving the prompt text intact; input should not overwrite it
    // the greeting will appear in out3, so out2 can safely hold the prompt
  }

  // greet lastname after it has moved into memory
  if (current === 8 && memY.innerText !== "") {
    animateToMemory(
      memY,
      out5,
      "Hello " + memX.innerText + " " + memY.innerText,
    );
  }

  // step 4 declares add

  //bring x and y down

  //step 7: add x and y

  // clears values when going backwards
  if (current < 3) memX.innerText = "";
  if (current < 3) inputItems[0].value = ""; // reset first input if we go back before it's used
  if (current < 1) out1.innerText = "";
  if (current < 6) memY.innerText = ""; // clear last-name memory until step6 where input is processed
  if (current < 5) firstName = ""; // also clear stored first name when rewinding before its use
  // clear last-name prompt when going before it
  if (current < 5) out3.innerText = "";
  if (current < 7) inputItems[1].value = ""; // reset last input early
  if (current < 4) out2.innerText = ""; // clears first greeting when going before step4; last-name prompt overwritten by greeting if needed
  if (current < 5) out3.innerText = ""; // clear lastname greeting before its step (also removes prompt when rewinding past step5)
  if (current < 5) out4.innerText = "";
  if (current < 8) out5.innerText = "";
  // clear prompt output

  // clear character displays when moving away from their display steps
  if (current !== 4) memXChars.innerHTML = "";
  if (current !== 8) memYChars.innerHTML = "";

  // recreate character displays when returning to their steps if memory has content
  if (current === 4 && memX.innerText !== "" && memXChars.innerHTML === "") {
    createCharDisplay(memXChars, memX.innerText);
  }
  if (current === 8 && memY.innerText !== "" && memYChars.innerHTML === "") {
    createCharDisplay(memYChars, memY.innerText);
  }

  // animate going forward
  // initiates x

  // the following blocks previously populated outputs with demo values;
  // they are no longer needed for the firstname/lastname flow.

  //if (current === 8 && out3.innerText=== ""){
  //    out3.innerText = 'Hello World';
  //}
  //if (current === 11 && out4.innerText=== ""){
  //    out4.innerText = 'Hello World';
  //}
  //if (current === 14 && out5.innerText=== ""){
  //    out5.innerText = 'H';
  //}
  // show prompt message on first step
  if (current === 1) {
    out1.innerText = "Enter your first name";
  }

  // if(current === 8 && outAns.innerText === ""){
  //outAns.style.visibility="visible";
  //outAns.innerText="18";
  //animateToMemory(memADD, outAns, "D");
  // }

  // hide operators
  plusOp.style.visibility = "hidden";
  equalOp.style.visibility = "hidden";

  // show addition visuals when calculating add
  // START EDITING HERE
  // if (current >=5 && current<=7) {
  plusOp.style.visibility = "visible";
  // }

  //if (current >=6 && current<=7){
  equalOp.style.visibility = "visible";
  // }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1;
}

let firstName = "";
let lastName = "";

inputItems[0].addEventListener("keypress", (event) => {
  if (event.key === "Enter" && current === 3) {
    const enteredFirstName = inputItems[0].value.trim();
    if (enteredFirstName === "") {
      return;
    }
    firstName = enteredFirstName;
    animateToMemory(inputItems[0], memX, firstName);
  }
});

inputItems[1].addEventListener("keypress", (event) => {
  // only accept last name when the input is visible at the correct step
  if (event.key === "Enter" && current === 7) {
    const enteredLastName = inputItems[1].value.trim();
    if (enteredLastName === "") {
      return;
    }
    lastName = enteredLastName;
    animateToMemory(inputItems[1], memY, lastName);
  }
});

nextBtn.addEventListener("click", () => {
  if (current === 3 && firstName.trim() === "") {
    return;
  }

  if (current === 7 && lastName.trim() === "") {
    return;
  }

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