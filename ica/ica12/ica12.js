var newQuoteButton = document.querySelector("#js-new-quote").addEventListener('click', getQuote);
var answerBtn = document.querySelector('#js-tweet').addEventListener('click', displayAnswer);
const quoteText = document.querySelector('#js-quote-text');
const answerText = document.querySelector('#js-answer-text');

var apiEndpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";

let current = {
    question: "",
    answer: ""
};

async function getQuote() {
    try {
        const response = await fetch(apiEndpoint);
        if(!response.ok){
            throw Error(response.statusText);
        }
        const json = await response.json();
        // console.log();
        current.question = json.question;
        current.answer = json.answer;
        displayQuote(current.question);
        answerText.textContent = "";
        //displayAnswer(json.answer);
    }
    catch(err) {
        console.log(err);
        alert('Fail');
    }
}

function displayQuote(quote) {
    quoteText.textContent = quote;
}

function displayAnswer(answer) {
    answerText.textContent = current.answer;
}

getQuote();