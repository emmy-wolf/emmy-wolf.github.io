// Define arrays of story elements
const characters = ['Willy the Goblin', 'Big Daddy', 'Father Christmas'];
const locations = ['the spooky forest', 'the desert', 'the ocean'];
const actions = ['found a mysterious object', 'met a strange creature', 'discovered a hidden treasure'];

// Function to generate a random story
function generateStory() {
  const customName = document.getElementById('customname').value;
  const isUK = document.getElementById('uk').checked;
  const name = customName !== '' ? customName : 'Bob';
  const location = locations[Math.floor(Math.random() * locations.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const temperature = isUK ? `${Math.floor(Math.random() * 20) + 10} centigrade` : `${Math.floor(Math.random() * 50) + 50} Fahrenheit`;

  const story = `${name} went to ${location} and ${action}. The temperature was ${temperature}.`;

  const storyParagraph = document.querySelector('.story');
  storyParagraph.textContent = story;
  storyParagraph.style.visibility = 'visible';
}

// Event listener for the button
document.querySelector('.randomize').addEventListener('click', generateStory);
