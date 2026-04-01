const lines = document.querySelectorAll("#high span");


const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const conIn = document.getElementById("console-input");
const conBox = document.getElementById("console");

const memItems = document.querySelectorAll(".mem-item");

const mem = {
    c1: document.getElementById("mem-c1"),
    c2: document.getElementById("mem-c2"),
    r1: document.getElementById("mem-r1"),
    r2: document.getElementById("mem-r2")
};

const str = {
    c1: document.getElementById("str-c1"),
    c2: document.getElementById("str-c2"),
    sum: document.getElementById("str-sum"),
    zero: document.getElementById("str-zero"),
    bool: document.getElementById("str-bool")
};

const numZ = document.getElementById("num-zero");

const opp = {
    min: document.getElementById("minus-op"),
    less: document.getElementById("less-op"),
    equal: document.getElementById("equal-op"),
    equal2: document.getElementById("equal2-op")
};

const print = {
    c1: document.getElementById("print-c1"),
    c2: document.getElementById("print-c2"),
    a1: document.getElementById("print-a1"),
    a2: document.getElementById("print-a2")
};


const steps = 18;
let current = -1;
let prev = -1;
let boolval;

const outArr = [];
let history = [];


let city1, city2;
let c1Arr, c2Arr;




const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
  "Importing the Scanner Class",
  "The statement creates an object for performing console input and assigns the object to the reference variable named in",
  "Print Enter the first city: ",
  "Declare city1",
  "Receive input from user",
  "Assign input to city1",
  "Print Enter the second city: ",
  "Declare city2",
  "Receive input from user",
  "Assign input to city2",
  "Calculate if city1 is less than, equal to, or greater than city2 using compareTo",
  "Calculate results",
  "Compare results to zero",
  "Condition is",
  "Print cities in alphabetical order",
  "Enter else statement",
  "Print cities in alphabetical order",
  "Exit if else statement"
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
    if (targetElement === mem.c1) {
      setReferenceValue(mem.c1, mem.r1, finalValue);
    } else if (targetElement === mem.c2) {
      setReferenceValue(mem.c2, mem.r2, finalValue);
    } else if (targetElement === str.c1) {
        createCharDisplay(str.c1, city1);
    }else if (targetElement === str.c2) {
        createCharDisplay(str.c2, city2);
    } else {
      targetElement.innerText = finalValue;
    }

    document.body.removeChild(flying);
  });
}



function setReferenceValue(targetElement, charsElement, storedValue) {
  targetElement.innerText = "ref";
  targetElement.dataset.storedValue = storedValue;
  targetElement._storedArray = storedValue;
  
  if(current === 4){ c1Arr = targetElement._storedArray;}
  else if(current === 8){ c2Arr = targetElement._storedArray;}
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


function getHLine(step) {
  if (step < 0) return -1;

  const ranges = [
    [4, 5, 4],
    [8,9,7],
    [10,13,8]
  ];

  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

    //fix holds
  let temp = 0;
  if (step > 5) temp = temp - 1;
  if (step > 9) temp = temp - 1;
  if (step > 13) temp = temp - 3;

  return step + temp;
}

conIn.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {

  const value = conIn.value;

  const source = pushOut(value);
  source.style.color="goldenrod";

  if (current === 4) {
    city1 = String(value);
    animateToMemory(source,mem.c1, city1);
  }

  if(current === 8){
    city2 = String(value);
    animateToMemory(source,mem.c2, city2);
  }

    history.push(current);
    conIn.value = "";
    conIn.style.display = "none";
    current++;
    updateUI();
    updateMemoryExplanation();
  }
});




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
 lines.forEach((line) => line.classList.remove("highlight"));

  const hLine = getHLine(current);

  if (lines[hLine]) {
    lines[hLine].classList.add("highlight");
  }

  if(current >=0){
     memoryExplanation.style.display="flex";
  }

  memItems.forEach((item) => (item.style.display = "none"));

  Object.values(opp).forEach(op => op.style.display="none");
  Object.values(str).forEach(el => {
    el.style.display = "none";
    el.innerText = "";
  });


  const inputSteps = [4, 8];

  if (inputSteps.includes(current)) {
    conIn.style.display = "block";
    
    if (document.activeElement !== conIn) {
        conIn.focus();
    }

    conIn.onblur = () => {
        if (inputSteps.includes(current)) {
            conIn.focus();
        }
    };
  } else {
      conIn.style.display = "none";
      conIn.onblur = null;
  }

  //delete strings inside variables when going back
  const delString = [
    {step: 5, v: "c1", ref: "r1"},
    {step: 9, v: "c2", ref: "r2"},
  ];

    delString.forEach(({step, v, ref}) => {
        if(current < step){
            mem[v].innerText = "";
            mem[ref].innerText = "";
        }
    })




  const declVar = [
    [3, 0], //city1
    [7,1], //city2
  ]

  declVar.forEach(([step, i]) => {
    if (current >= step) {
    memItems[i].style.display = "flex";
    }
  })


  if(current >= 10 &&  current <= 13){
    if(current >= 10 && current <= 11){
        str.c1.style.display = "flex";
        str.c2.style.display = "flex";
        opp.min.style.display = "flex";
        if (current === 10){
            animateToMemory(mem.r1, str.c1, city1);
            animateToMemory(mem.r2, str.c2, city2);
        }
        if(current === 11){
            createCharDisplay(str.c1, city1);
            createCharDisplay(str.c2, city2);
            opp.equal.style.display = "flex";
            str.sum.style.display = "flex";
            str.sum.innerText = city1.localeCompare(city2);
        }
    }
    if(current >=12 && current <= 13){
        str.sum.style.display = "flex";
        str.zero.style.display = "flex";
        opp.less.style.display = "flex";
        str.sum.innerText = city1.localeCompare(city2);
        if(current === 12){
            animateToMemory(numZ, str.zero, 0);
        }
        if (current === 13){
            str.zero.innerText = 0;
            opp.equal2.style.display = "flex";
            str.bool.style.display = "flex";
            boolval = (city1.localeCompare(city2) < 0);
            str.bool.innerText = boolval;
        }
    }
  }




  const printOut = [
    {step: 2, output: "Enter the first city: ", from: "c1"},
    {step: 6, output: "Enter the second city: ", from: "c2"},
    {step: 14, output: "The cities in alphabetical order are: " + city1 + " " + city2, from: "a1"},
    {step: 16, output: "The cities in alphabetical order are: " + city2 + " " + city1, from: "a2"},
  ]



  printOut.forEach(({step, output, from}) => {
    if(current === step && prev < step){
      const x = pushOut(output);
      animateToMemory(print[from], x, output);
    }
  })

  const delOut = [1, 4, 5, 8, 13, 15];

  delOut.forEach(step => {
    if (current === step && prev > step) {
      popOut();
    }
  })


  backBtn.disabled = current <= 0;
  nextBtn.disabled = (current >= steps - 1 || current === 4 || current === 8);
  prev = current;
}

nextBtn.addEventListener("click", () => {
  if (current < steps - 1) {
    history.push(current);

    if (current === 13) {
      current = boolval ? 14 : 15;
    } else if (current === 14) {
      current = 17;
    } else {
      current++;
    }

    updateUI();
    updateMemoryExplanation();
  }
});

backBtn.addEventListener("click", () => {
  if (history.length > 0) {
    current = history.pop();
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