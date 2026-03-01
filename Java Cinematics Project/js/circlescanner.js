// select all lines
const lines = document.querySelectorAll("#high span");

// button
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// input row in output/console (for show/hide)
const consoleRow = document.getElementById("console-input-row");

// input in output/console
const radiusInput = document.getElementById("radius-input");

// memory squares
const memRadius = document.getElementById("mem-radius");
const memArea = document.getElementById("mem-area");

// calc row
const numR1 = document.getElementById("mem-num-r1");
const numR2 = document.getElementById("mem-num-r2");
const numPi = document.getElementById("mem-num-pi");
const valResult = document.getElementById("val-result");

// operators
const mul1 = document.getElementById("mul-1");
const mul2 = document.getElementById("mul-2");
const eqOp = document.getElementById("eq-op");

// output
const out1 = document.getElementById("ou1");

// all memory items
const memItems = document.querySelectorAll(".mem-item");

const PI_VAL = 3.14159;

// steps
// -1 = before start
// 0  = declare radius
// 1  = declare area
// 2  = create Scanner
// 3  = prompt (show console row here)
// 4  = radius = input.nextInt() (convert decimals -> int here, then lock input after this step)
// 5  = start compute
// 6  = show result
// 7  = store area
// 8  = println highlighted
// 9  = print output
const steps = 9;
let current = -1;

/**
 * Allow users to type decimals, but only keep:
 * - digits 0-9
 * - at most one decimal '.'
 */
function filterDecimalTyping() {
  let v = radiusInput.value;

  // allow only digits and dots
  v = v.replace(/[^\d.]/g, "");

  // allow only one dot
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }

  radiusInput.value = v;
}




// enforce while typing/pasting
radiusInput.addEventListener("input", filterDecimalTyping);
radiusInput.addEventListener("paste", () => setTimeout(filterDecimalTyping, 0));

function getRadius() {
  filterDecimalTyping();

  const raw = radiusInput.value !== "" ? radiusInput.value : radiusInput.placeholder || "20";

  const f = parseFloat(raw);
  if (!Number.isFinite(f)) return 20;

  // truncate decimals/convert into integer
  return Math.trunc(f);
}


function getArea(RADIUS_VAL) {
  return (RADIUS_VAL * RADIUS_VAL * PI_VAL).toFixed(3);
}


function setConsoleVisibility() {
  // show starting at prompt line and onward
  const shouldShow = current >= 3;
  consoleRow.style.display = shouldShow ? "flex" : "none";
}


function setInputLock() {
  // editable only at steps 3 only/when input box is available
  const editable = current === 3;

  radiusInput.readOnly = !editable;
  radiusInput.style.pointerEvents = editable ? "auto" : "none";
}




function animateToMemory(sourceElement, targetElement, finalValue) {
  const rectStart = sourceElement.getBoundingClientRect();
  const rectEnd = targetElement.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = finalValue;

  document.body.appendChild(flying);

  // start at source
  flying.style.left = rectStart.left + rectStart.width / 2 + "px";
  flying.style.top = rectStart.top + rectStart.height / 2 + "px";

  requestAnimationFrame(() => {
    // move to target
    flying.style.left = rectEnd.left + rectEnd.width / 2 + "px";
    flying.style.top = rectEnd.top + rectEnd.height / 2 + "px";
  });

  flying.addEventListener("transitionend", () => {
    targetElement.innerText = finalValue;
    document.body.removeChild(flying);
  });
}




function getHLine(step) {
  if (step < 0) return -1;

  if (step === 0) return 0; // 0: double radius;
  if (step === 1) return 1; // 1: double area;
  if (step === 2) return 2; // 2: Scanner input...
  if (step === 3) return 3; // 3: System.out.print("Enter input here: ");
  if (step === 4) return 4; // 4: radius = input.nextInt();

  // 5-7: compute and store area
  if (step >= 5 && step <= 7) return 6;

  // 8-9: println
  if (step >= 8) return 8;

  return 8;
}




function updateHighlight() {
  // show/hide console row and lock/unlock input based on step
  setConsoleVisibility();
  setInputLock();

  const RADIUS_VAL = getRadius();
  const AREA_VAL = getArea(RADIUS_VAL);

  // highlight
  lines.forEach((line) => line.classList.remove("highlight"));
  const hLine = getHLine(current);
  if (lines[hLine]) lines[hLine].classList.add("highlight");

// keep "chunk" highlighted for assignment/expression
  if (hLine === 4) {
    if (lines[5]) lines[5].classList.add("highlight"); // "= input.nextInt();"
  }
  if (hLine === 6) {
    if (lines[7]) lines[7].classList.add("highlight"); // "3.14159"
  }



  // hide all memory items by default
  memItems.forEach((item) => (item.style.display = "none"));

  // hide operators by default
  mul1.style.display = "none";
  mul2.style.display = "none";
  eqOp.style.display = "none";

  // clear output when going backwards
  if (current < 9) out1.innerHTML = "";

  // show squares when declared
  if (current >= 0) memItems[0].style.display = "flex"; // radius
  if (current >= 1) memItems[1].style.display = "flex"; // area

  // clear values when going backwards
  if (current < 4) memRadius.innerText = "";
  if (current < 7) memArea.innerText = "";

  // clear calc row when going backwards before compute
  if (current < 5) {
    numR1.innerText = "";
    numR2.innerText = "";
    numPi.innerText = "";
    valResult.innerText = "";
  }



  // step 4: "read" input (convert decimals into integer), then animate into memory
  if (current === 4 && memRadius.innerText === "") {
    const fixedInt = String(getRadius()); // 4.7 -> 4
    radiusInput.value = fixedInt; // lock in what was read
    animateToMemory(radiusInput, memRadius, fixedInt);
  }

  // step 5-7: compute window
  const inCompute = current >= 5 && current <= 7;
  if (inCompute) {
    // show calc row value boxes
    numR1.style.display = "flex";
    numR2.style.display = "flex";
    numPi.style.display = "flex";

    mul1.style.display = "flex";
    mul2.style.display = "flex";

    // entering compute: animate values down once
    if (current === 5 && numR1.innerText === "" && numR2.innerText === "" && numPi.innerText === "") {
      // ensure radius is present if user jumped weirdly
      if (memRadius.innerText === "") memRadius.innerText = String(RADIUS_VAL);

      animateToMemory(memRadius, numR1, String(RADIUS_VAL));
      animateToMemory(memRadius, numR2, String(RADIUS_VAL));
      animateToMemory(document.getElementById("lit-pi"), numPi, String(PI_VAL));
    } else {
      numR1.innerText = String(RADIUS_VAL);
      numR2.innerText = String(RADIUS_VAL);
      numPi.innerText = String(PI_VAL);
    }
  }



  // step 6: show result
  if (current === 6) {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = AREA_VAL;
  }


  // step 7: store area into memory
  if (current === 7 && memArea.innerText === "") {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = AREA_VAL;
    animateToMemory(valResult, memArea, AREA_VAL);
  }


  // step 9: print output
  if (current === 9 && out1.innerHTML === "") {
    out1.innerHTML =
      'The area for the circle of radius <span id="out-radius"></span> is <span id="out-area"></span>';

    const outRadius = document.getElementById("out-radius");
    const outArea = document.getElementById("out-area");

    // ensure memory values exist
    if (memRadius.innerText === "") memRadius.innerText = String(RADIUS_VAL);
    if (memArea.innerText === "") memArea.innerText = AREA_VAL;

    animateToMemory(memRadius, outRadius, String(RADIUS_VAL));
    animateToMemory(memArea, outArea, AREA_VAL);
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps;
}


nextBtn.addEventListener("click", () => {
  if (current < steps) {
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