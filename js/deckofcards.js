const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

const memoryExplanation = document.getElementById("memory-explanation");
const memI = document.getElementById("mem-i");
const memIndex = document.getElementById("mem-index");
const memTemp = document.getElementById("mem-temp");
const memSuit = document.getElementById("mem-suit");
const memRank = document.getElementById("mem-rank");
const itemI = document.getElementById("item-i");
const itemIndex = document.getElementById("item-index");
const itemTemp = document.getElementById("item-temp");
const itemSuit = document.getElementById("item-suit");
const itemRank = document.getElementById("item-rank");
const deckContainer = document.getElementById("deck-container");

const arrayCells = [
  document.getElementById("arr-0"),
  document.getElementById("arr-1"),
  document.getElementById("arr-2"),
  document.getElementById("arr-3"),
];

const calcLeft = document.getElementById("calc-left");
const calcOp = document.getElementById("calc-op");
const calcRight = document.getElementById("calc-right");
const calcEq = document.getElementById("calc-eq");
const calcResult = document.getElementById("calc-result");

const outLine1 = document.getElementById("ou1");
const outLine2 = document.getElementById("ou2");
const outLine3 = document.getElementById("ou3");
const outLine4 = document.getElementById("ou4");

// Line indices (0-based) matching the <span> elements in #high:
//  0: public class DeckOfCards {
//  1:   public static void main(String[] args) {
//  2:     int[] deck = new int[52];
//  3:     String[] suits = {...}
//  4:     String[] ranks = {"Ace", ...
//  5:       "9", "10", ...}
//  6:     for (int i = 0; i < deck.length; i++)   <-- init loop
//  7:       deck[i] = i;
//  8:     for (int i = 0; i < deck.length; i++) {  <-- shuffle loop
//  9:       int index = ...
// 10:       int temp = deck[i];
// 11:       deck[i] = deck[index];
// 12:       deck[index] = temp;
// 13:     }
// 14:     for (int i = 0; i < 4; i++) {            <-- display loop
// 15:       String suit = suits[deck[i] / 13];
// 16:       String rank = ranks[deck[i] % 13];
// 17:       System.out.println(...
// 18:         + rank + " of " + suit);
// 19:     }
// 20:   }
// 21: }

// Pre-computed shuffled deck (first 4 values after 52 swap iterations):
//   deck[0] = 11  →  11/13=0 → suits[0]="Spades",  11%13=11 → ranks[11]="Queen"  → Queen of Spades
//   deck[1] = 25  →  25/13=1 → suits[1]="Hearts",  25%13=12 → ranks[12]="King"   → King of Hearts
//   deck[2] = 36  →  36/13=2 → suits[2]="Diamonds", 36%13=10 → ranks[10]="Jack"  → Jack of Diamonds
//   deck[3] = 51  →  51/13=3 → suits[3]="Clubs",   51%13=12 → ranks[12]="King"   → King of Clubs

let current = -1;
let navDirection = "none";
let prevSnapshot = null;

const steps = [
  // Step 0: main method
  {
    msg: "Enter main method.",
    hl: [1],
    i: "",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["", "", "", ""],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 1: declare deck
  {
    msg: "Declare deck - an array of 52 integers. All elements are initialized to 0.",
    hl: [2],
    i: "",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "0", "0", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 2: declare suits
  {
    msg: 'Declare suits array: ["Spades", "Hearts", "Diamonds", "Clubs"].',
    hl: [3],
    i: "",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "0", "0", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 3: declare ranks
  {
    msg: 'Declare ranks array: ["Ace", "2", ..., "10", "Jack", "Queen", "King"] - 13 values (index 0-12).',
    hl: [4, 5],
    i: "",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "0", "0", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },

  // --- Init loop ---
  // Step 4: for header i=0
  {
    msg: "Initialize loop: i = 0, 0 < 52 is true. Enter loop body.",
    hl: [6],
    i: "0",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "0", "0", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 5: deck[0] = 0
  {
    msg: "Assign deck[0] = 0.",
    hl: [7],
    i: "0",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "0", "0", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 6: for header i=1
  {
    msg: "i = 1, 1 < 52 is true. Enter loop body.",
    hl: [6],
    i: "1",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "0", "0", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 7: deck[1] = 1
  {
    msg: "Assign deck[1] = 1.",
    hl: [7],
    i: "1",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "1", "0", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 8: for header i=2
  {
    msg: "i = 2, 2 < 52 is true. Enter loop body.",
    hl: [6],
    i: "2",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "1", "0", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 9: deck[2] = 2
  {
    msg: "Assign deck[2] = 2.",
    hl: [7],
    i: "2",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "1", "2", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 10: for header i=3
  {
    msg: "i = 3, 3 < 52 is true. Enter loop body.",
    hl: [6],
    i: "3",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "1", "2", "0"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 11: deck[3] = 3
  {
    msg: "Assign deck[3] = 3.",
    hl: [7],
    i: "3",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 12: init loop ends
  {
    msg: "Loop continues for i = 4 to 51 setting deck[i] = i. At i = 52, 52 < 52 is false. Loop ends.",
    hl: [6],
    i: "52",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },

  // --- Shuffle loop ---
  // Step 13: for header i=0
  {
    msg: "Shuffle loop: i = 0, 0 < 52 is true. Enter loop body.",
    hl: [8],
    i: "0",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 14: index = 35
  {
    msg: "index = (int)(Math.random() * 52) = 35.",
    hl: [9],
    i: "0",
    index: "35",
    temp: "",
    suit: "",
    rank: "",
    deck: ["0", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 15: temp = deck[0] = 0
  {
    msg: "temp = deck[0] = 0. Save current value before swapping.",
    hl: [10],
    i: "0",
    index: "35",
    temp: "0",
    suit: "",
    rank: "",
    deck: ["0", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 16: deck[0] = deck[35] = 35
  {
    msg: "deck[0] = deck[35] = 35.",
    hl: [11],
    i: "0",
    index: "35",
    temp: "0",
    suit: "",
    rank: "",
    deck: ["35", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 17: deck[35] = temp = 0
  {
    msg: "deck[35] = temp = 0. Swap complete.",
    hl: [12],
    i: "0",
    index: "35",
    temp: "0",
    suit: "",
    rank: "",
    deck: ["35", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 18: for header i=1
  {
    msg: "i = 1, 1 < 52 is true. Enter loop body.",
    hl: [8],
    i: "1",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["35", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 19: index = 24
  {
    msg: "index = (int)(Math.random() * 52) = 24.",
    hl: [9],
    i: "1",
    index: "24",
    temp: "",
    suit: "",
    rank: "",
    deck: ["35", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 20: temp = deck[1] = 1
  {
    msg: "temp = deck[1] = 1. Save current value before swapping.",
    hl: [10],
    i: "1",
    index: "24",
    temp: "1",
    suit: "",
    rank: "",
    deck: ["35", "1", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 21: deck[1] = deck[24] = 24
  {
    msg: "deck[1] = deck[24] = 24.",
    hl: [11],
    i: "1",
    index: "24",
    temp: "1",
    suit: "",
    rank: "",
    deck: ["35", "24", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 22: deck[24] = temp = 1
  {
    msg: "deck[24] = temp = 1. Swap complete.",
    hl: [12],
    i: "1",
    index: "24",
    temp: "1",
    suit: "",
    rank: "",
    deck: ["35", "24", "2", "3"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 23: shuffle loop ends
  {
    msg: "Loop continues for i = 2 to 51, swapping each card randomly. At i = 52, loop ends. Deck is fully shuffled.",
    hl: [8],
    i: "52",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },

  // --- Display loop ---
  // Step 24: for header i=0
  {
    msg: "Display loop: i = 0, 0 < 4 is true. Enter loop body.",
    hl: [14],
    i: "0",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 25: suit i=0
  {
    msg: 'suit = suits[11 / 13] = suits[0] = "Spades".',
    hl: [15],
    i: "0",
    index: "",
    temp: "",
    suit: "Spades",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: { left: "11", op: "/", right: "13", result: "0" },
  },
  // Step 26: rank i=0
  {
    msg: 'rank = ranks[11 % 13] = ranks[11] = "Queen".',
    hl: [16],
    i: "0",
    index: "",
    temp: "",
    suit: "Spades",
    rank: "Queen",
    deck: ["11", "25", "36", "51"],
    out1: "",
    out2: "",
    out3: "",
    out4: "",
    calc: { left: "11", op: "%", right: "13", result: "11" },
  },
  // Step 27: print i=0
  {
    msg: "Print: Card number 11: Queen of Spades.",
    hl: [17, 18],
    i: "0",
    index: "",
    temp: "",
    suit: "Spades",
    rank: "Queen",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 28: for header i=1
  {
    msg: "i = 1, 1 < 4 is true. Enter loop body.",
    hl: [14],
    i: "1",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 29: suit i=1
  {
    msg: 'suit = suits[25 / 13] = suits[1] = "Hearts".',
    hl: [15],
    i: "1",
    index: "",
    temp: "",
    suit: "Hearts",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "",
    out3: "",
    out4: "",
    calc: { left: "25", op: "/", right: "13", result: "1" },
  },
  // Step 30: rank i=1
  {
    msg: 'rank = ranks[25 % 13] = ranks[12] = "King".',
    hl: [16],
    i: "1",
    index: "",
    temp: "",
    suit: "Hearts",
    rank: "King",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "",
    out3: "",
    out4: "",
    calc: { left: "25", op: "%", right: "13", result: "12" },
  },
  // Step 31: print i=1
  {
    msg: "Print: Card number 25: King of Hearts.",
    hl: [17, 18],
    i: "1",
    index: "",
    temp: "",
    suit: "Hearts",
    rank: "King",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 32: for header i=2
  {
    msg: "i = 2, 2 < 4 is true. Enter loop body.",
    hl: [14],
    i: "2",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "",
    out4: "",
    calc: null,
  },
  // Step 33: suit i=2
  {
    msg: 'suit = suits[36 / 13] = suits[2] = "Diamonds".',
    hl: [15],
    i: "2",
    index: "",
    temp: "",
    suit: "Diamonds",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "",
    out4: "",
    calc: { left: "36", op: "/", right: "13", result: "2" },
  },
  // Step 34: rank i=2
  {
    msg: 'rank = ranks[36 % 13] = ranks[10] = "Jack".',
    hl: [16],
    i: "2",
    index: "",
    temp: "",
    suit: "Diamonds",
    rank: "Jack",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "",
    out4: "",
    calc: { left: "36", op: "%", right: "13", result: "10" },
  },
  // Step 35: print i=2
  {
    msg: "Print: Card number 36: Jack of Diamonds.",
    hl: [17, 18],
    i: "2",
    index: "",
    temp: "",
    suit: "Diamonds",
    rank: "Jack",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "Card number 36: Jack of Diamonds",
    out4: "",
    calc: null,
  },
  // Step 36: for header i=3
  {
    msg: "i = 3, 3 < 4 is true. Enter loop body.",
    hl: [14],
    i: "3",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "Card number 36: Jack of Diamonds",
    out4: "",
    calc: null,
  },
  // Step 37: suit i=3
  {
    msg: 'suit = suits[51 / 13] = suits[3] = "Clubs".',
    hl: [15],
    i: "3",
    index: "",
    temp: "",
    suit: "Clubs",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "Card number 36: Jack of Diamonds",
    out4: "",
    calc: { left: "51", op: "/", right: "13", result: "3" },
  },
  // Step 38: rank i=3
  {
    msg: 'rank = ranks[51 % 13] = ranks[12] = "King".',
    hl: [16],
    i: "3",
    index: "",
    temp: "",
    suit: "Clubs",
    rank: "King",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "Card number 36: Jack of Diamonds",
    out4: "",
    calc: { left: "51", op: "%", right: "13", result: "12" },
  },
  // Step 39: print i=3
  {
    msg: "Print: Card number 51: King of Clubs.",
    hl: [17, 18],
    i: "3",
    index: "",
    temp: "",
    suit: "Clubs",
    rank: "King",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "Card number 36: Jack of Diamonds",
    out4: "Card number 51: King of Clubs",
    calc: null,
  },
  // Step 40: display loop ends
  {
    msg: "i = 4, 4 < 4 is false. Loop ends. All 4 cards have been displayed.",
    hl: [14],
    i: "4",
    index: "",
    temp: "",
    suit: "",
    rank: "",
    deck: ["11", "25", "36", "51"],
    out1: "Card number 11: Queen of Spades",
    out2: "Card number 25: King of Hearts",
    out3: "Card number 36: Jack of Diamonds",
    out4: "Card number 51: King of Clubs",
    calc: null,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function clearHighlights() {
  lines.forEach((l) => l.classList.remove("highlight"));
}

function animateToMemory(
  sourceElement,
  targetElement,
  finalValue,
  duration = 700,
) {
  if (!targetElement) return;
  if (!sourceElement) {
    targetElement.innerText = String(finalValue);
    return;
  }

  const rectStart = sourceElement.getBoundingClientRect();
  const rectEnd = targetElement.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = String(finalValue);
  flying.style.position = "fixed";
  flying.style.transition = `all ${duration}ms ease-in-out`;
  flying.style.zIndex = "99999";

  document.body.appendChild(flying);

  flying.style.left = `${rectStart.left + rectStart.width / 2}px`;
  flying.style.top = `${rectStart.top + rectStart.height / 2}px`;

  // force layout so browser applies start position before moving
  void flying.offsetWidth;

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    targetElement.innerText = String(finalValue);
    if (document.body.contains(flying)) document.body.removeChild(flying);
  };

  requestAnimationFrame(() => {
    flying.style.left = `${rectEnd.left + rectEnd.width / 2}px`;
    flying.style.top = `${rectEnd.top + rectEnd.height / 2}px`;
  });

  flying.addEventListener("transitionend", finish, { once: true });
  setTimeout(finish, duration + 120);
}

function snapshotFromStep(step) {
  return {
    i: step.i || "",
    index: step.index || "",
    temp: step.temp || "",
    suit: step.suit || "",
    rank: step.rank || "",
    deck: Array.isArray(step.deck) ? [...step.deck] : [],
    out1: step.out1 || "",
    out2: step.out2 || "",
    out3: step.out3 || "",
    out4: step.out4 || "",
  };
}

function animateChanges(step) {
  if (navDirection !== "forward" || !prevSnapshot) return;

  const next = snapshotFromStep(step);
  const src =
    step.hl.length > 0 && lines[step.hl[0]] ? lines[step.hl[0]] : null;

  if (prevSnapshot.i !== next.i && next.i !== "") {
    memI.innerText = "";
    animateToMemory(src, memI, next.i);
  }
  if (prevSnapshot.index !== next.index && next.index !== "") {
    memIndex.innerText = "";
    animateToMemory(src, memIndex, next.index);
  }
  if (prevSnapshot.temp !== next.temp && next.temp !== "") {
    memTemp.innerText = "";
    animateToMemory(src, memTemp, next.temp);
  }
  if (prevSnapshot.suit !== next.suit && next.suit !== "") {
    memSuit.innerText = "";
    animateToMemory(src, memSuit, next.suit);
  }
  if (prevSnapshot.rank !== next.rank && next.rank !== "") {
    memRank.innerText = "";
    animateToMemory(src, memRank, next.rank);
  }

  arrayCells.forEach((cell, idx) => {
    if (!cell) return;
    const prevVal =
      idx < prevSnapshot.deck.length ? prevSnapshot.deck[idx] : "";
    const nextVal = idx < next.deck.length ? next.deck[idx] : "";
    if (prevVal === nextVal || nextVal === "") return;
    cell.innerText = "";
    animateToMemory(src, cell, nextVal);
  });

  if (prevSnapshot.out1 !== next.out1 && next.out1 !== "") {
    outLine1.innerText = "";
    animateToMemory(src, outLine1, next.out1);
  }
  if (prevSnapshot.out2 !== next.out2 && next.out2 !== "") {
    outLine2.innerText = "";
    animateToMemory(src, outLine2, next.out2);
  }
  if (prevSnapshot.out3 !== next.out3 && next.out3 !== "") {
    outLine3.innerText = "";
    animateToMemory(src, outLine3, next.out3);
  }
  if (prevSnapshot.out4 !== next.out4 && next.out4 !== "") {
    outLine4.innerText = "";
    animateToMemory(src, outLine4, next.out4);
  }
}

function setCalc(calc) {
  if (!calc) {
    calcLeft.innerText =
      calcOp.innerText =
      calcRight.innerText =
      calcEq.innerText =
      calcResult.innerText =
        "";
    [calcLeft, calcOp, calcRight, calcEq, calcResult].forEach((el) => {
      el.style.display = "none";
    });
    return;
  }
  calcLeft.innerText = calc.left;
  calcOp.innerText = calc.op;
  calcRight.innerText = calc.right;
  calcEq.innerText = "=";
  calcResult.innerText = calc.result;
  [calcLeft, calcRight, calcResult].forEach((el) => {
    el.style.display = "flex";
  });
  [calcOp, calcEq].forEach((el) => {
    el.style.display = "block";
  });
}

// ── Render ─────────────────────────────────────────────────────────────────

function renderStep() {
  clearHighlights();

  if (current < 0) {
    memoryExplanation.style.display = "none";
    itemI.style.display = "none";
    itemIndex.style.display = "none";
    itemTemp.style.display = "none";
    itemSuit.style.display = "none";
    itemRank.style.display = "none";
    deckContainer.style.display = "none";
    memI.innerText =
      memIndex.innerText =
      memTemp.innerText =
      memSuit.innerText =
      memRank.innerText =
        "";
    arrayCells.forEach((c) => {
      if (c) c.innerText = "";
    });
    setCalc(null);
    outLine1.innerText =
      outLine2.innerText =
      outLine3.innerText =
      outLine4.innerText =
        "";
    prevSnapshot = null;
    backBtn.disabled = true;
    nextBtn.disabled = false;
    return;
  }

  const step = steps[current];
  const isForward = navDirection === "forward";
  const nextSnapshot = snapshotFromStep(step);

  const changedField = (key) =>
    isForward &&
    !!prevSnapshot &&
    prevSnapshot[key] !== nextSnapshot[key] &&
    nextSnapshot[key] !== "";

  memoryExplanation.style.display = "block";
  memoryExplanation.innerText = step.msg;

  // Progressive declaration visibility (like other examples)
  itemI.style.display = current >= 4 ? "flex" : "none";
  itemIndex.style.display = current >= 14 ? "flex" : "none";
  itemTemp.style.display = current >= 15 ? "flex" : "none";
  itemSuit.style.display = current >= 25 ? "flex" : "none";
  itemRank.style.display = current >= 26 ? "flex" : "none";
  deckContainer.style.display = current >= 1 ? "flex" : "none";

  step.hl.forEach((idx) => {
    if (idx >= 0 && lines[idx]) lines[idx].classList.add("highlight");
  });

  memI.innerText = changedField("i") ? "" : step.i;
  memIndex.innerText = changedField("index") ? "" : step.index;
  memTemp.innerText = changedField("temp") ? "" : step.temp;
  memSuit.innerText = changedField("suit") ? "" : step.suit;
  memRank.innerText = changedField("rank") ? "" : step.rank;

  arrayCells.forEach((cell, i) => {
    if (!cell) return;
    const nextVal = i < step.deck.length ? step.deck[i] : "";
    const prevVal =
      prevSnapshot && i < prevSnapshot.deck.length ? prevSnapshot.deck[i] : "";
    const changed =
      isForward && !!prevSnapshot && prevVal !== nextVal && nextVal !== "";
    cell.innerText = changed ? "" : nextVal;
  });

  setCalc(step.calc);

  outLine1.innerText = changedField("out1") ? "" : step.out1 || "";
  outLine2.innerText = changedField("out2") ? "" : step.out2 || "";
  outLine3.innerText = changedField("out3") ? "" : step.out3 || "";
  outLine4.innerText = changedField("out4") ? "" : step.out4 || "";

  animateChanges(step);
  prevSnapshot = snapshotFromStep(step);

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps.length - 1;
}

// ── Button handlers ────────────────────────────────────────────────────────

nextBtn.addEventListener("click", () => {
  if (current >= steps.length - 1) return;
  current++;
  navDirection = "forward";
  renderStep();
  navDirection = "none";
});

backBtn.addEventListener("click", () => {
  if (current <= -1) return;
  current--;
  navDirection = "backward";
  renderStep();
  navDirection = "none";
});

renderStep();
