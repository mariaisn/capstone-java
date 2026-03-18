function animateToOutput(sourceElement, targetElement, finalValue) {
  const rectStart = sourceElement.getBoundingClientRect();
  const rectEnd = targetElement.getBoundingClientRect();

  const flying = document.createElement("div");
  flying.className = "fly-value";
  flying.innerText = finalValue;

  flying.style.position = "absolute";
  flying.style.left = rectStart.left + "px";
  flying.style.top = rectStart.top + "px";
  flying.style.transition = "all 0.8s ease-in-out";
  flying.style.zIndex = 1000;

  document.body.appendChild(flying);

  requestAnimationFrame(() => {
    flying.style.left = rectEnd.left + "px";
    flying.style.top = rectEnd.top + "px";
  });

  setTimeout(() => {
    document.body.removeChild(flying);
    targetElement.textContent = finalValue;
  }, 800);
}
// Highlight and explanation logic for Hello World
const lines = document.querySelectorAll("#high span");
// No memory items for Hello World
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");
const out1 = document.getElementById("ou1");
const explanationBox = document.getElementById("memory-explanation");

const explanations = [
  "This is the class declaration.",
  "This is the main method declaration.",
  "This line prints 'Hello, World!' to the output.",
  "End of main method.",
  "End of class.",
];

let current = -1;
const steps = explanations.length;

function updateHighlight() {
  lines.forEach((line) => line.classList.remove("highlight"));

  if (current < 0) {
    explanationBox.style.display = "none";
    explanationBox.textContent = "";
    out1.textContent = "";
    backBtn.disabled = true;
    nextBtn.disabled = false;
    return;
  }

  lines[current].classList.add("highlight");

  explanationBox.style.display = "flex";
  explanationBox.textContent = explanations[current];

  if (current === 2) {
    const codeLine = lines[2];
    animateToOutput(codeLine, out1, "Hello, World!");
  } else if (current > 2) {
    out1.textContent = "Hello, World!";
  } else {
    out1.textContent = "";
  }

  backBtn.disabled = current <= 0;
  nextBtn.disabled = current >= steps - 1;
}

nextBtn.addEventListener("click", () => {
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
const toggle = document.getElementById("toggle");