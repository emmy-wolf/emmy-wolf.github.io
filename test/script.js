const phoneNumber = document.getElementById("realNumber");
const input = document.querySelector('input');
const listEl = document.querySelector('ul');

let knownGreens = Array(10).fill(null);
let knownGraysPerPosition = Array(10).fill().map(() => new Set());
let attempts = [];

phoneNumber.addEventListener('click', () => {
  const inputValue = input.value.trim();
  listEl.innerHTML = `${inputValue}`;

  const labelContainer = document.getElementById("digit-labels");
  labelContainer.innerHTML = '';
  for (let i = 0; i < inputValue.length; i++) {
    const span = document.createElement("span");
    span.textContent = inputValue[i];
    span.style.display = "inline-block";
    span.style.marginBottom = "2.5rem";
    span.style.width = "2.5rem";
    span.style.textAlign = "center";
    span.style.fontWeight = "bold";
    labelContainer.appendChild(span);
  }

  const firstGuess = generateSmarterGuess();
  displayRandomNumber(firstGuess);
});

function generateSmarterGuess() {
  let guess = '';
  for (let i = 0; i < 10; i++) {
    if (knownGreens[i]) {
      guess += knownGreens[i];
    } else {
      let digit;
      do {
        digit = Math.floor(Math.random() * 10).toString();
      } while (knownGraysPerPosition[i].has(digit));
      guess += digit;
    }
  }

  if (attempts.includes(guess)) return generateSmarterGuess();
  return guess;
}

function displayRandomNumber(number) {
  const container = document.getElementById("random-number");
  container.innerHTML = '';

  const feedbackControls = document.getElementById("feedback-controls");
  feedbackControls.innerHTML = '';

  for (let i = 0; i < 10; i++) {
    const span = document.createElement("span");
    span.className = "guess-digit";
    span.textContent = number[i];

    // Make green digits persist
    if (knownGreens[i]) {
      span.classList.add("green");
    }

    container.appendChild(span);

    const feedbackBox = document.createElement("div");
    feedbackBox.className = "feedback-box";

    const select = document.createElement("select");
    select.className = "feedback-select";
    select.dataset.index = i;

    ["Gray", "Green"].forEach(color => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      if (color === "Green" && knownGreens[i]) {
        option.selected = true; // Keep it selected if it's green
        select.classList.add("green");
      }
      select.appendChild(option);
    });

    feedbackBox.appendChild(select);
    feedbackControls.appendChild(feedbackBox);
  }

  document.getElementById("submit-feedback").disabled = false;
}

function addGuessToHistory(guess, feedbackArray) {
  const historyContainer = document.getElementById("guess-history");
  const row = document.createElement("div");
  row.className = "guess-row";

  for (let i = 0; i < guess.length; i++) {
    const box = document.createElement("div");
    box.textContent = guess[i];
    box.className = `guess-box ${feedbackArray[i].toLowerCase()}`;
    row.appendChild(box);
  }

  historyContainer.appendChild(row);
}

document.getElementById("submit-feedback").addEventListener("click", () => {
  const lastAttempt = Array.from(document.querySelectorAll(".guess-digit"))
    .map(span => span.textContent)
    .join("");

  const selects = document.querySelectorAll(".feedback-select");
  const feedbackArray = [];

  selects.forEach((select, i) => {
    const feedback = select.value;
    const digit = lastAttempt[i];
    feedbackArray[i] = feedback;

    if (feedback === "Green") {
      knownGreens[i] = digit;
    } else if (feedback === "Gray") {
      if (!knownGreens.includes(digit)) {
        knownGraysPerPosition[i].add(digit);
      }
    }
  });

  addGuessToHistory(lastAttempt, feedbackArray);
  attempts.push(lastAttempt);

  if (knownGreens.every(d => d !== null)) {
    document.getElementById("final-output").textContent = `Success! Your phone number is ${knownGreens.join('')}`;
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } });
    document.getElementById("final-output").scrollIntoView({ behavior: "smooth" });
  } else {
    const nextGuess = generateSmarterGuess();
    displayRandomNumber(nextGuess);
  }
});
