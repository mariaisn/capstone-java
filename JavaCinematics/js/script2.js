const lines = document.querySelectorAll("#high span");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

let current = -1; // no line selected

function updateHighlight() {
    lines.forEach(line => line.classList.remove("highlight"));

    if (current >= 0) {
        lines[current].classList.add("highlight");
    }

    backBtn.disabled = current <= 0;
    nextBtn.disabled = current >= lines.length - 1;
}

nextBtn.addEventListener("click", () => {
    if (current < lines.length - 1) {
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

// initial state
updateHighlight();
