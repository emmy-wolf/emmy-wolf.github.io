const phoneNumber = document.getElementById("realNumber");
const input = document.querySelector('input');
const listEl = document.querySelector('ul');
phoneNumber.addEventListener('click', () => {
  const inputValue = input.value;
  listEl.innerHTML = `${inputValue}`;
  const labelContainer = document.getElementById("digit-labels");
  labelContainer.innerHTML = ''; 
  for (let i = 0; i < inputValue.length; i++) {
    const span = document.createElement("span");
    span.textContent = inputValue[i];
    span.style.display = "inline-block";
    span.style.marginBottom = "2.5rem"
    span.style.width = "2.5rem";
    span.style.textAlign = "center";
    span.style.fontWeight = "bold";
    labelContainer.appendChild(span);
  }
});

let attempts = [];
let knownGreens = Array(10).fill(null);
let knownYellows = [];
let knownGrays = new Set();

function generateSmarterGuess() {
  let guess = '';
  const usedPositions = new Set();

  for (let i = 0; i < 10; i++) {
    if (knownGreens[i] !== null) {
      guess += knownGreens[i];
      usedPositions.add(i);
    } else {
      let digit;
      do {
        digit = Math.floor(Math.random() * 10).toString();
      } while (
        knownGrays.has(digit) ||
        (knownYellows.some(y => y.digit === digit && y.position === i))
      );
      guess += digit;
    }
  }

  if (attempts.includes(guess)) return generateSmarterGuess();
  return guess;
}

function displayRandomNumber(number, feedbackArray = []) {
  const container = document.getElementById("random-number");
  container.innerHTML = '';

  const feedbackControls = document.getElementById("feedback-controls");
  feedbackControls.innerHTML = '';

  for (let i = 0; i < 10; i++) {
    const span = document.createElement("span");
    span.className = "guess-digit";
    span.textContent = number[i];

    // Add color only if digit is known green or feedback explicitly given
    if (knownGreens[i] === number[i]) {
      span.classList.add("green");
    }

    container.appendChild(span);

    const feedbackBox = document.createElement("div");
    feedbackBox.className = "feedback-box";

    const select = document.createElement("select");
    select.className = "feedback-select";
    select.dataset.index = i;

    ["Gray", "Yellow", "Green"].forEach(color => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      if (knownGreens[i] !== null && color === "Green") {
        option.selected = true;
        select.classList.add("green");
      }
      select.appendChild(option);
    });

    select.addEventListener("change", function () {
      this.classList.remove("green", "yellow", "gray");
      this.classList.add(this.value.toLowerCase());
    });

    feedbackBox.appendChild(select);
    feedbackControls.appendChild(feedbackBox);
  }
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

function handleSubmitFeedback() {
  const lastAttempt = Array.from(document.querySelectorAll(".guess-digit"))
    .map(span => span.textContent)
    .join("");
  const selects = document.querySelectorAll(".feedback-select");
  const feedbackArray = [];

  selects.forEach((select, i) => {
    const color = select.value;
    feedbackArray[i] = color;

    const digit = lastAttempt[i];
    if (color === "Green") {
      knownGreens[i] = digit;
    } else if (color === "Yellow") {
      knownYellows.push({ digit, position: i });
    } else if (color === "Gray") {
      if (!knownGreens.includes(digit) &&
          !knownYellows.some(y => y.digit === digit)) {
        knownGrays.add(digit);
      }
    }
  });

  addGuessToHistory(lastAttempt, feedbackArray);
  attempts.push(lastAttempt);

  if (knownGreens.every(d => d !== null)) {
    //const success = document.createElement("div");
    document.getElementById("final-output").textContent = `Success! Your phone number is ${knownGreens.join('')}`;

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 }
    });

    // 👇 Scroll to the bottom to reveal final message
    document.getElementById("final-output").scrollIntoView({ behavior: "smooth" });
    } else {
    const nextGuess = generateSmarterGuess();
    displayRandomNumber(nextGuess);
  }
}

document.getElementById("submit-feedback").addEventListener("click", handleSubmitFeedback);
displayRandomNumber(generateSmarterGuess());

// let attempts = [];
// let knownGreens = Array(10).fill(null);
// let knownYellows = [];
// let knownGrays = new Set();
// let realPhoneNumber = '';

// function generateSmarterGuess() {
//   let guess = '';
//   for (let i = 0; i < 10; i++) {
//     if (knownGreens[i] !== null) {
//       guess += knownGreens[i];
//     } else {
//       let digit;
//       do {
//         digit = Math.floor(Math.random() * 10).toString();
//       } while (
//         knownGrays.has(digit) ||
//         (knownYellows.some(y => y.digit === digit && y.position === i))
//       );
//       guess += digit;
//     }
//   }
//   if (attempts.includes(guess)) return generateSmarterGuess();
//   return guess;
// }

// function displayRandomNumber(number) {
//   const container = document.getElementById("random-number");
//   container.innerHTML = '';
//   const feedbackControls = document.getElementById("feedback-controls");
//   feedbackControls.innerHTML = '';

//   for (let i = 0; i < 10; i++) {
//     const span = document.createElement("span");
//     span.className = "guess-digit";
//     span.textContent = number[i];
//     if (knownGreens[i] === number[i]) {
//       span.classList.add("green");
//     }
//     container.appendChild(span);

//     const feedbackBox = document.createElement("div");
//     feedbackBox.className = "feedback-box";

//     const select = document.createElement("select");
//     select.className = "feedback-select";
//     select.dataset.index = i;

//     ["Gray", "Yellow", "Green"].forEach(color => {
//       const option = document.createElement("option");
//       option.value = color;
//       option.textContent = color;
//       if (knownGreens[i] !== null && color === "Green") {
//         option.selected = true;
//         select.classList.add("green");
//       }
//       select.appendChild(option);
//     });

//     select.addEventListener("change", function () {
//       this.classList.remove("green", "yellow", "gray");
//       this.classList.add(this.value.toLowerCase());
//     });

//     feedbackBox.appendChild(select);
//     feedbackControls.appendChild(feedbackBox);
//   }
// }

// function addGuessToHistory(guess, feedbackArray) {
//   const historyContainer = document.getElementById("guess-history");
//   const row = document.createElement("div");
//   row.className = "guess-row";
//   for (let i = 0; i < guess.length; i++) {
//     const box = document.createElement("div");
//     box.textContent = guess[i];
//     box.className = `guess-box ${feedbackArray[i].toLowerCase()}`;
//     row.appendChild(box);
//   }
//   historyContainer.appendChild(row);
// }

// function handleSubmitFeedback() {
//   const lastAttempt = Array.from(document.querySelectorAll(".guess-digit"))
//     .map(span => span.textContent)
//     .join("");
//   const selects = document.querySelectorAll(".feedback-select");
//   const feedbackArray = [];

//   selects.forEach((select, i) => {
//     const color = select.value;
//     feedbackArray[i] = color;

//     const digit = lastAttempt[i];
//     if (color === "Green") {
//       knownGreens[i] = digit;
//     } else if (color === "Yellow") {
//       knownYellows.push({ digit, position: i });
//     } else if (color === "Gray") {
//       if (!knownGreens.includes(digit) &&
//           !knownYellows.some(y => y.digit === digit)) {
//         knownGrays.add(digit);
//       }
//     }
//   });

//   addGuessToHistory(lastAttempt, feedbackArray);
//   attempts.push(lastAttempt);

//   if (knownGreens.every(d => d !== null)) {
//     document.getElementById("final-output").textContent = `Success! Your phone number is ${knownGreens.join('')}`;
//   } else {
//     const nextGuess = generateSmarterGuess();
//     displayRandomNumber(nextGuess);
//   }
// }

// document.getElementById("start-game").addEventListener("click", () => {
//   const input = document.getElementById("real-phone-number").value.trim();
//   if (!/^\d{10}$/.test(input)) {
//     alert("Please enter a valid 10-digit phone number.");
//     return;
//   }

//   realPhoneNumber = input;
//   document.getElementById("display-phone-number").textContent = realPhoneNumber;
//   document.getElementById("phone-entry").style.display = "none";
//   document.getElementById("game-container").style.display = "block";

//   displayRandomNumber(generateSmarterGuess());
// });

// document.getElementById("submit-feedback").addEventListener("click", handleSubmitFeedback);
