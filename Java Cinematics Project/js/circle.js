// select all lines
const lines = document.querySelectorAll("#high span");

// button
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// memory squares
const memRadius = document.getElementById("mem-radius");
const memArea = document.getElementById("mem-area");

// calc row (these are also .mem-item)
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

const RADIUS_VAL = 20;
const PI_VAL = 3.14159;
const AREA_VAL = (RADIUS_VAL * RADIUS_VAL * PI_VAL).toFixed(3); // 1256.636

// steps
// -1 = before start
// 0  = declare radius
// 1  = declare area
// 2  = radius = 20
// 3  = start compute (move radius/radius/pi into calc row)
// 4  = show result in calc row
// 5  = store area into memory
// 6  = println line highlighted (no movement yet)
// 7  = print output (move radius + area into output)
const steps = 7;
let current = -1;




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
  if (step === 2) return 2; // 2: radius = 20;

  // 3-5: compute and store area
  if (step >= 3 && step <= 5) return 4;

  // 6-7: println
  if (step >= 6) return 6;

  return 6;
}




function updateHighlight() {
  // highlight
  lines.forEach((line) => line.classList.remove("highlight"));
  const hLine = getHLine(current);

  if (lines[hLine]) lines[hLine].classList.add("highlight");

  // keep "chunk" highlighted for assignment/expression
  if (hLine === 2) {
    if (lines[3]) lines[3].classList.add("highlight"); // "= 20"
  }
  if (hLine === 4) {
    if (lines[5]) lines[5].classList.add("highlight"); // "3.14159"
  }

  // hide all memory items by default
  memItems.forEach((item) => (item.style.display = "none"));

  // hide operators by default
  mul1.style.display = "none";
  mul2.style.display = "none";
  eqOp.style.display = "none";

  // clear output when going backwards
  if (current < 7) out1.innerHTML = "";

  // show squares when declared
  if (current >= 0) memItems[0].style.display = "flex"; // radius
  if (current >= 1) memItems[1].style.display = "flex"; // area

  // clear values when going backwards
  if (current < 2) memRadius.innerText = "";
  if (current < 5) memArea.innerText = "";

  // clear calc row when going backwards before compute
  if (current < 3) {
    numR1.innerText = "";
    numR2.innerText = "";
    numPi.innerText = "";
    valResult.innerText = "";
  }




  // step 2: animate 20 into radius
  if (current === 2 && memRadius.innerText === "") {
    animateToMemory(document.getElementById("val-radius"), memRadius, String(RADIUS_VAL));
  }

  // step 3-5: compute window
  const inCompute = current >= 3 && current <= 5;
  if (inCompute) {
    // show calc row value boxes
    numR1.style.display = "flex";
    numR2.style.display = "flex";
    numPi.style.display = "flex";

    mul1.style.display = "flex";
    mul2.style.display = "flex";

    // entering compute: animate values down once
    if (current === 3 && numR1.innerText === "" && numR2.innerText === "" && numPi.innerText === "") {
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



  // step 4: show result
  if (current === 4) {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = AREA_VAL;
  }


  // step 5: store area into memory
  if (current === 5 && memArea.innerText === "") {
    eqOp.style.display = "flex";
    valResult.style.display = "flex";
    valResult.innerText = AREA_VAL;
    animateToMemory(valResult, memArea, AREA_VAL);
  }


  // step 7: print output
  if (current === 7 && out1.innerHTML === "") {
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