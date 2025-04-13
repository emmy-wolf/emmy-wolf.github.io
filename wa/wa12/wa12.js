const quoteText = document.querySelector('#js-quote-text');
const answerText = document.querySelector('#js-answer-text');
const newQuoteButton = document.querySelector("#js-new-quote");
const revealButton = document.querySelector('#js-reveal-answer');
const artistInput = document.getElementById('js-artist-guess');
const titleInput = document.getElementById('js-title-guess');
const scoreDisplay = document.getElementById('js-score');

let score = 0;
let current = {
  artist: '',
  title: '',
  lyrics: ''
};

const songs = [
  { artist: "Olivia Rodrigo", title: "Good 4 U" },
  { artist: "Queen", title: "Bohemian Rhapsody" },
  { artist: "Bon Jovi", title: "Livin' on a Prayer" },
  { artist: "Toto", title: "Africa" },
  { artist: "Taylor Swift", title: "Shake It Off" },
  { artist: "Sabrina Carpenter", title: "Espresso"},
  { artist: "Morgan Wallen", title: "Whiskey Glasses"},
];

// Add event listeners
newQuoteButton.addEventListener('click', getLyric);
revealButton.addEventListener('click', revealAnswer);

async function getLyric() {
  answerText.textContent = "";
  artistInput.value = "";
  titleInput.value = "";

  const song = songs[Math.floor(Math.random() * songs.length)];
  current.artist = song.artist;
  current.title = song.title;

  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${song.artist}/${song.title}`);
    if (!response.ok) throw Error("API request failed");

    const data = await response.json();
    const lyrics = data.lyrics;

    if (!lyrics || lyrics.trim() === "") {
      quoteText.textContent = "⚠️ Couldn't find lyrics for this song. Try another!";
      return;
    }

    const lines = lyrics.split('\n').filter(line => line.trim() !== "");
    const start = Math.floor(Math.random() * Math.max(1, lines.length - 3));
    const snippet = lines.slice(start, start + 3).join('\n');

    current.lyrics = snippet;
    quoteText.textContent = `"${snippet}"`;

  } catch (err) {
    console.error("Error fetching lyrics:", err);
    quoteText.textContent = "⚠️ Failed to load lyrics. Try again!";
  }
}

function revealAnswer() {
  const artistGuess = artistInput.value.trim().toLowerCase();
  const titleGuess = titleInput.value.trim().toLowerCase();
  const correctArtist = current.artist.toLowerCase();
  const correctTitle = current.title.toLowerCase();

  let result = "";
  let pointsEarned = 0;

  if (artistGuess === correctArtist) {
    result += "✅ Correct Artist! ";
    pointsEarned++;
  } else {
    result += `❌ Artist was ${current.artist}. `;
  }

  if (titleGuess === correctTitle) {
    result += "✅ Correct Title!";
    pointsEarned++;
  } else {
    result += `❌ Title was "${current.title}".`;
  }

  score += pointsEarned;
  scoreDisplay.textContent = `Score: ${score}`;
  answerText.textContent = result;
}

getLyric(); // Load the first lyric on page load
