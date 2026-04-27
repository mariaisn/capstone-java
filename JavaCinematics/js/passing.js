const lines = document.querySelectorAll("#high span");


const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const conBox = document.getElementById("console");

const memItems = document.querySelectorAll(".mem-item");

const mem = {
    a: document.getElementById("mem-a"),
    r: document.getElementById("mem-r"),
    n1: document.getElementById("mem-n1"),
    n2: document.getElementById("mem-n2"),
    t1: document.getElementById("mem-t1"),
    arr: document.getElementById("mem-arr"),
    ref: document.getElementById("mem-ref"),
    t2: document.getElementById("mem-t2"),
    get char1() { return this.r.querySelector('.char-box:nth-child(1)'); },
    get char2() { return this.r.querySelector('.char-box:nth-child(2)'); },
};

const ini ={
    a: document.getElementById("ini-a"),
    t1: document.getElementById("ini-t1"),
    t2: document.getElementById("ini-t2")
};

const print = {
    bS: document.getElementById("print-bS"),
    arS: document.getElementById("print-arS"),
    aS: document.getElementById("print-aS"),
    rS: document.getElementById("print-rS"),
    bF: document.getElementById("print-bF"),
    arF: document.getElementById("print-arF"),
    aF: document.getElementById("print-aF"),
    rF: document.getElementById("print-rF"),
};

const meth = {
    main: document.getElementById("meth-main"),
    swap: document.getElementById("meth-swap"),
    first: document.getElementById("meth-first")
};

const steps = 27;
let current = -1;
let prev = -1;

let aArr;
const outArr = [];
let history = [];
let mainComplete = false;
let swapComplete = false;
let firstComplete = false;
let jumped = false;



const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
  "Enter main method",
  "Declare array a",
  "Assign {1, 2} to a",
  "Print Before invoking swap",
  "Print array is {1, 2}",
  "Call method swap",
  "Returned to call, continue in main",
  "Print After invoking swap",
  "Print array is {1, 2}",
  "Print Before invoking swapFirstTwoInArray",
  "Print array is {1, 2}",
  "Call method swapFirstTwoInArray",
  "Returned to call, continue in main",
  "Print After invoking swapFirstTwoInArray",
  "Print array is {2, 1}",
  "Enter swap, declare and initialize n1 and n2",
  "Declare temp",
  "Assign n1 to temp",
  "Assign n2 to n1",
  "Assign temp to n2",
  "Class finished return to call",
  "Enter swapFirstTwoInArray, declare and initialize arr to reference of a",
  "Declare temp",
  "Assign arr[0] to temp",
  "Assign arr[1] to arr[0]",
  "Assign temp to arr[1]",
  "Class finished return to call"
];



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
    if (targetElement === mem.a) {
      setReferenceValue(mem.a, mem.r, finalValue);
    }  else {
      targetElement.innerText = finalValue;
    }

    document.body.removeChild(flying);
  });
}



function setReferenceValue(targetElement, charsElement, storedValue) {
  targetElement.innerText = "ref";
  targetElement.dataset.storedValue = storedValue;
  targetElement._storedArray = storedValue;
  aArr = targetElement._storedArray;
  createCharDisplay(charsElement, storedValue);
  mem.char1 = charsElement.querySelector('.char-box:nth-child(1)');
  mem.char2 = charsElement.querySelector('.char-box:nth-child(2)');
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


function getHLine(step) {
  if (step < 0) return -1;

  const ranges = [
    [5, 6, 5],
    [11,12,10]
  ];

  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

    //fix holds
  let temp = 0;
  if (step > 6) temp = temp - 1;
  if (step > 12) temp = temp - 1;

  return step + temp;
}



function addOutRow(text) {
  const row = document.createElement("div");
  row.className = "console-row";

  const span = document.createElement("span");
  span.innerText = text;

  row.appendChild(span);
  conBox.appendChild(row);

  return row;
}

function pushOut(text){
  const row = addOutRow(text);
  outArr.push(row);

  return row;
}

function popOut(){
  const row = outArr.pop();
  if (row) {
    row.remove();
  }
}




function updateUI() {
  if (current >= 0 && current < stepMessages.length) {
        memoryExplanation.innerText = stepMessages[current];
    } 

    lines.forEach((line) => line.classList.remove("highlight"));

    const hLine = getHLine(current);

    if (lines[hLine]) {
    lines[hLine].classList.add("highlight");
    }

    Object.values(meth).forEach(m => m.style.display="none");

    if(current >=0){
     memoryExplanation.style.display="flex";
     meth.main.style.display="flex";
     meth.main.parentElement.style.display="flex";
    }

    if(current >=15 || swapComplete){
        meth.swap.style.display="flex";
        meth.swap.parentElement.style.display="flex";
    } 

    if(current >= 21 || firstComplete){
        meth.first.style.display="flex";
        meth.first.parentElement.style.display="flex";
    }

    memItems.forEach((item) => (item.style.display = "none"));


    if(current === 0){
        mainComplete = false;
    }
    if(current === 1){
        mainComplete = true;
    }

    if(current === 19){
        swapComplete = false;
    }
    if(current === 20){
        swapComplete = true;
    }

    if(current === 25){
        firstComplete = false;
    }
    if(current === 26){
        firstComplete = true;
    }


    //fix numbers going back
    const fixNum = [
      {step: 17, variable: "n1", value: 1},
      {step: 18, variable: "n2", value: 2},
      {step: 23, variable: "char1", value: 1},
      {step: 24, variable: "char2", value: 2},
    ]

    fixNum.forEach(({step, variable, value}) => {
      if(current === step && prev > step){
        mem[variable].innerText = value;
      }
    });

    //delete numbers when going back
    if (current < 2){
      mem.a.innerText = "";
      mem.r.innerText = "";
    }

    const delVal = [
      {step: 5, variable: "n1"},
      {step: 5, variable: "n2"},
      {step: 16, variable: "t1"},
      {step: 11, variable: "arr"},
      {step: 22, variable: "t2"},
    ]
    delVal.forEach(({step, variable}) => {
      if(current === step && prev > step){mem[variable].innerText = "";}
    });

    //declare variables
    const declVar = [
        [1, mainComplete, 0],
        [15, swapComplete, 1],
        [15, swapComplete, 2],
        [16, swapComplete, 3],
        [21, firstComplete, 4],
        [22, firstComplete, 5]
    ]

    declVar.forEach(([step, correct,i]) => {
        if(current >= step || correct){
            memItems[i].style.display = "flex";
        }
    });


    //assign variables
    const assignVar = [
        {step: 2, from: ini.a, to: mem.a, value: [1,2]},
        {step: 15, from: mem.r, to: mem.n1, value: 1},
        {step: 15, from: mem.r, to: mem.n2, value: 2},
        {step: 17, from: mem.n1, to: mem.t1, value: 1},
        {step: 18, from: mem.n2, to: mem.n1, value: 2},
        {step: 19, from: mem.t1, to: mem.n2, value: 1},
        {step: 21, from: mem.a , to: mem.arr, value: "ref"},
        {step: 23, from: mem.char1, to: mem.t2, value: 1},
        {step: 24, from: mem.char2, to: mem.char1, value: 2},
        {step: 25, from: mem.t2, to: mem.char2, value: 1},
    ]

    assignVar.forEach(({step, from, to, value}) => {
        if(current === step && prev < step){
            animateToMemory(from, to, value);
        }
    });



    const printOut = [
    {step: 3, output: "Before invoking swap", from: "bS"},
    {step: 4, output: "array is {" + mem.char1.innerText + ", " + mem.char2.innerText + "}", from: "arS"},
    {step: 7, output: "After invoking swap", from: "aS"},
    {step: 8, output: "array is {" + mem.char1.innerText + ", " + mem.char2.innerText + "}", from: "rS"},
    {step: 9, output: "Before invoking swapFirstTwoInArray", from: "bF"},
    {step: 10, output: "array is {" + mem.char1.innerText + ", " + mem.char2.innerText + "}", from: "arF"},
    {step: 13, output: "After invoking swapFirstTwoInArray", from: "aF"},
    {step: 14, output: "array is {" + mem.char1.innerText + ", " + mem.char2.innerText + "}", from: "rF"},
  ]

  printOut.forEach(({step, output, from}) => {
    if(current === step && prev < step){
      const x = pushOut(output);
      animateToMemory(print[from], x, output);
    }
  })

  const delOut = [2, 3, 6, 7, 8, 9, 12, 13];

  delOut.forEach(step => {
    if (current === step && prev > step && !jumped) {
      popOut();
    }
  })


    backBtn.disabled = current <= 0;
    nextBtn.disabled = (current === 14);

    prev = current;
}




nextBtn.addEventListener("click", () => {
  if (current <= steps - 1) {
    if (current === 5) {
  current = 15;
  jumped = true;
} else if (current === 20) {
  current = 6;
  jumped = true;
} else if (current === 11) {
  current = 21;
  jumped = true;
} else if (current === 26) {
  current = 12;
  jumped = true;
} else {
  current++;
  jumped = false;
}
    updateUI();
    updateMemoryExplanation();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    if (current === 15) {
  current = 5;
  jumped = true;
} else if (current === 6) {
  current = 20;
  jumped = true;
} else if (current === 21) {
  current = 11;
  jumped = true;
} else if (current === 12) {
  current = 26;
  jumped = true;
} else {
  current--;
  jumped = false;
}
    updateUI();
    updateMemoryExplanation();
  }
});

function updateMemoryExplanation() {
    if (current < stepMessages.length) {
        memoryExplanation.innerText = stepMessages[current];
    } else {
        memoryExplanation.innerText = "Done!";
    }
}

updateUI();
updateMemoryExplanation();