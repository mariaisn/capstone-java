// Night mode toggle
const toggle = document.getElementById("toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("night-mode");
  });
}

const lines = document.querySelectorAll("#high span");

const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const conIn = document.getElementById("console-input");
const conBox = document.getElementById("console");

const memItems = document.querySelectorAll(".mem-item");

const mem = {
  s: document.getElementById("mem-s"),
  low: document.getElementById("mem-l"),
  high: document.getElementById("mem-h"),
  pal: document.getElementById("mem-p"),
  ref: document.getElementById("mem-r"),
};

const num = {
  low: document.getElementById("num-low"),
  length: document.getElementById("num-length"),
  high: document.getElementById("num-high"),
  one: document.getElementById("num-one"),
  sum: document.getElementById("num-sum"),
  bool: document.getElementById("num-bool"),
};

const opp = {
  min: document.getElementById("minus-op"),
  plus: document.getElementById("plus-op"),
  less: document.getElementById("less-op"),
  notE: document.getElementById("notE-op"),
  equal: document.getElementById("equal-op"),
};

const ini = {
  low: document.getElementById("ini-low"),
  high: document.getElementById("ini-high"),
  pal: document.getElementById("ini-isP"),
  plus: document.getElementById("ini-plus"),
  min: document.getElementById("ini-minus"),
  isF: document.getElementById("ini-isF"),
};
const print = {
  e: document.getElementById("print-E"),
  is: document.getElementById("print-is"),
  not: document.getElementById("print-not"),
};

const steps = 33;
const inputSteps = [4];
let current = -1;
let prev = -1;

let sArr;
const outArr = [];
let history = [];

let low = 0;
let high;
let boolVal;
let sVal;
let highVal;

const memoryExplanation = document.getElementById("memory-explanation");
const stepMessages = [
  "Importing the Scanner Class",
  "Creating object named input from Scanner Class to get user input",
  "Print Enter a string: ",
  "Declare s",
  "Receive input from user",
  "Assign input to s",
  "Declare low",
  "Assign 0 to low",
  "Declare high",
  "Subtract length of s and 1",
  "Calculate high",
  "Assign to high",
  "Declare isPalindrome",
  "Assign true to isPalindrome",
  "Enter while loop",
  "Check if low is less than high",
  "Condition is",
  "Check if character at low does not equal character at high",
  "Condition is",
  "Assign false to isPalindrome",
  "Break out of while loop",
  "Add one to low",
  "Calculate sum",
  "Assign sum to low",
  "Subtract one from high",
  "Calculate difference",
  "Assign difference to high",
  "Exit while loop",
  "Check if isPalindrome is true",
  "Print s + is a palindrome",
  "Enter else statement",
  "print s + is not a palindrome",
  "Exit if else statement",
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
    if (targetElement === mem.s) {
      setReferenceValue(mem.s, mem.ref, finalValue);
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
  sArr = targetElement._storedArray;
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
    [9, 11, 8],
    [15, 16, 12],
    [17, 18, 13],
    [21, 23, 16],
    [24, 26, 17],
  ];

  for (const [start, end, line] of ranges) {
    if (step >= start && step <= end) return line;
  }

  //fix holds
  let temp = 0;
  if (step > 5) temp = temp - 1;
  if (step > 11) temp = temp - 2;
  if (step > 16) temp = temp - 1;
  if (step > 18) temp = temp - 1;
  if (step > 23) temp = temp - 2;
  if (step > 26) temp = temp - 2;

  return step + temp;
}

conIn.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const value = conIn.value;

    const source = pushOut(value);
    source.style.color = "goldenrod";

    if (current === 4) {
      sVal = String(value);
      animateToMemory(source, mem.s, sVal);
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

function pushOut(text) {
  const row = addOutRow(text);
  outArr.push(row);

  return row;
}

function popOut() {
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

  if (current >= 0) {
    memoryExplanation.style.display = "flex";
  }

  memItems.forEach((item) => (item.style.display = "none"));

  Object.values(opp).forEach((op) => (op.style.display = "none"));
  Object.values(num).forEach((el) => {
    el.style.display = "none";
    el.innerText = "";
  });

  //receive input
  if (current === 4) {
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

  //hide variables during math
  function hideRanges(ranges, element) {
    ranges.forEach(([start, end]) => {
      if (current >= start && current <= end) {
        element.style.display = "none";
        element.innerText = "";
      }
    });
  }

  hideRanges(
    [
      [9, 11],
      [24, 26],
      [15, 16],
      [17, 18],
    ],
    num.high,
  );
  hideRanges(
    [
      [9, 11],
      [24, 26],
      [21, 23],
    ],
    num.one,
  );
  hideRanges(
    [
      [15, 16],
      [17, 18],
      [21, 23],
    ],
    num.low,
  );

  //adjust low and high when going back
  if (current === 23 && prev >= 23) {
    low--;
  }

  if (current === 26 && prev === 14) {
    high++;
  }

  //delete number from variables
  if (current < 5) {
    mem.s.innerText = "";
    mem.ref.innerText = "";
  }

  const delVal = [
    { step: 7, variable: "low" },
    { step: 11, variable: "high" },
    { step: 13, variable: "pal" },
  ];

  delVal.forEach(({ step, variable }) => {
    if (current < step) mem[variable].innerText = "";
  });

  //declare variables
  const declVar = [
    [3, 0], //s
    [6, 1], //low
    [8, 2], //high
    [12, 3], //isPalandrome
  ];

  declVar.forEach(([step, i]) => {
    if (current >= step) {
      memItems[i].style.display = "flex";
    }
  });

  //assign variables
  const iniVar = [
    { step: 7, from: "low", to: "low", value: 0 },
    { step: 13, from: "pal", to: "pal", value: "true" },
    { step: 19, from: "isF", to: "pal", value: "false" },
  ];

  iniVar.forEach(({ step, from, to, value }) => {
    if (current === step && prev < step) {
      animateToMemory(ini[from], mem[to], value);
    }
  });

  if (current >= 9 && current <= 11) {
    num.high.style.display = "flex";
    num.one.style.display = "flex";
    opp.min.style.display = "flex";

    if (current === 9) {
      animateToMemory(ini.high, num.high, sArr.length);
      animateToMemory(ini.high, num.one, 1);
    } else {
      if (current >= 10 && current <= 11) {
        num.high.innerText = sArr.length;
        num.one.innerText = 1;
        opp.min.style.display = "flex";
        opp.equal.style.display = "flex";

        high = sArr.length - 1;
        num.sum.style.display = "flex";
        num.sum.innerText = high;

        if (current === 11 && prev < 11) {
          animateToMemory(num.sum, mem.high, high);
        }
      }
    }
  }

  if (current >= 15 && current <= 16) {
    num.low.style.display = "flex";
    num.high.style.display = "flex";
    opp.less.style.display = "flex";

    // if entering the window, animate them down
    if (current === 15) {
      animateToMemory(mem.low, num.low, low);
      animateToMemory(mem.high, num.high, high);
    } else {
      // keep them visible if already in window
      if (current === 16) {
        num.low.innerText = low;
        num.high.innerText = high;
      }
    }
  }

  if (current === 16) {
    num.bool.style.display = "flex";
    num.bool.innerText = low < high ? "true" : "false";
  }

  if (current >= 17 && current <= 18) {
    num.low.style.display = "flex";
    num.high.style.display = "flex";
    opp.notE.style.display = "flex";

    if (current === 17) {
      animateToMemory(mem.ref, num.low, sArr.charAt(low));
      animateToMemory(mem.ref, num.high, sArr.charAt(high));
    } else {
      if (current === 18) {
        num.low.innerText = sArr.charAt(low);
        num.high.innerText = sArr.charAt(high);
      }
    }
  }

  if (current === 18) {
    num.bool.style.display = "flex";
    num.bool.innerText =
      sArr.charAt(low) !== sArr.charAt(high) ? "true" : "false";
  }

  if (current === 18 && prev > 18) {
    mem.pal.innerText = "true";
  }

  if (current >= 21 && current <= 23) {
    num.low.style.display = "flex";
    num.one.style.display = "flex";
    opp.plus.style.display = "flex";

    // if entering the window, animate them down
    if (current === 21) {
      animateToMemory(mem.low, num.low, low);
      animateToMemory(ini.plus, num.one, 1);
      opp.plus.style.display = "flex";
    } else {
      // keep them visible if already in window
      if (current >= 22 && current <= 23) {
        num.low.innerText = low;
        num.one.innerText = 1;
        opp.plus.style.display = "flex";
        opp.equal.style.display = "flex";

        if (current === 22 && prev >= 22) {
          mem.low.innerText = low;
        }
      }
    }
  }

  if (current >= 22 && current <= 23) {
    num.sum.style.display = "flex";
    num.sum.innerText = low + 1;

    if (current === 23 && prev < 23) {
      animateToMemory(num.sum, mem.low, low + 1);
    }
  }

  if (current === 24 && prev < 24) {
    low++;
  }

  if (current >= 24 && current <= 26) {
    num.high.style.display = "flex";
    num.one.style.display = "flex";
    opp.min.style.display = "flex";

    if (current === 24 && prev < 24) {
      animateToMemory(mem.high, num.high, high);
      animateToMemory(ini.min, num.one, 1);
      opp.min.style.display = "flex";
    } else {
      if (current >= 25 && current <= 26) {
        num.high.innerText = high;
        num.one.innerText = 1;
        opp.min.style.display = "flex";
        opp.equal.style.display = "flex";

        if (current === 25 && prev >= 25) {
          mem.high.innerText = high;
        }
      }
    }
  }

  if (current >= 25 && current <= 26) {
    num.sum.style.display = "flex";
    num.sum.innerText = high - 1;

    if (current === 26 && prev < 26) {
      animateToMemory(num.sum, mem.high, high - 1);
    }
  }

  if (current === 14 && prev === 26) {
    high--;
  }

  const printOut = [
    { step: 2, output: "Enter a string: ", from: "e" },
    { step: 29, output: sArr + " is a palindrome", from: "is" },
    { step: 31, output: sArr + " is not a palindrome", from: "not" },
  ];

  printOut.forEach(({ step, output, from }) => {
    if (current === step && prev < step) {
      const x = pushOut(output);
      animateToMemory(print[from], x, output);
    }
  });

  const delOut = [1, 4, 28, 29];

  delOut.forEach((step) => {
    if (current === step && prev > step) {
      popOut();
    }
  });

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1 || current === 4;

  prev = current;
}

nextBtn.addEventListener("click", () => {
  if (current === 4) return;

  if (current < steps - 1) {
    history.push(current);

    if (current === 16) {
      current = low < high ? 17 : 27;
    } else if (current === 18) {
      current = sArr.charAt(low) !== sArr.charAt(high) ? 19 : 21;
    } else if (current === 20) {
      current = 27;
    } else if (current === 26) {
      current = 14;
    } else if (current === 28) {
      current = mem.pal.innerText === "true" ? 29 : 30;
    } else if (current === 29) {
      current = 32;
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
