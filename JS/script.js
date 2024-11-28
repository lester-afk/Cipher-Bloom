const flowerCipher = {
  A: "Rose",
  B: "Orchid",
  C: "Tulip",
  D: "Lotus",
  E: "Snapdragon",
  F: "Peony",
  G: "Dandelion",
  H: "Sunflower",
  I: "Dahlia",
  J: "Hydrangea",
  K: "Jasmine",
  L: "Iris",
  M: "Gardenia",
  N: "Magnolia",
  O: "Qingxin",
  P: "Plumeria",
  Q: "Camellia",
  R: "Cecilia",
  S: "Hibiscus",
  T: "Dendrobium",
  U: "Lavender",
  V: "Wisteria",
  W: "Anthurium",
  X: "Freesia",
  Y: "Zinnia",
  Z: "Marigold", // Changed to ensure uniqueness
};

// Utility functions
function shiftLetter(letter, shiftAmount) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let index = alphabet.indexOf(letter.toUpperCase());
  if (index === -1) return letter; // Not a letter, return as is

  let newIndex = (index + shiftAmount + 26) % 26; // Handle wrapping around alphabet
  return alphabet[newIndex];
}

function isVowel(letter) {
  return ["A", "E", "I", "O", "U"].includes(letter.toUpperCase());
}

// Adjusted decryption logic to preserve case of original encrypted input
function decryptMessage(encryptedMessage) {
  const reverseFlowerCipher = Object.fromEntries(
    Object.entries(flowerCipher).map(([letter, flower]) => [flower, letter])
  );
  const decryptedMessage = [];
  const flowers = encryptedMessage.split(" "); // Split flowers by space
  let previousChar = ""; // To track the previous decrypted character

  for (let i = 0; i < flowers.length; i++) {
    const flower = flowers[i].trim(); // Clean the flower name

    if (flower === "") {
      // Preserve spaces in the message
      decryptedMessage.push(" ");
      continue;
    }

    const letter = reverseFlowerCipher[flower]; // Get the corresponding letter

    if (!letter) {
      console.error(`Unknown flower: "${flower}"`);
      continue; // Skip unknown flowers
    }

    let decryptedChar;
    if (i === 0) {
      // First letter: No shift applied
      decryptedChar = letter;
    } else {
      // Reverse the shifts for subsequent letters
      if (isVowel(previousChar)) {
        // If the preceding character is a vowel, shift backward by 2
        decryptedChar = shiftLetter(letter, -2);
      } else {
        // If the preceding character is a consonant, shift forward by 1
        decryptedChar = shiftLetter(letter, 1);
      }
    }

    // Preserve the case of the original encrypted flower
    if (flowers[i] === flowers[i].toUpperCase()) {
      // If the flower name is in uppercase, the letter should be uppercase
      decryptedMessage.push(decryptedChar.toUpperCase());
    } else {
      // Otherwise, use the letter as is (lowercase)
      decryptedMessage.push(decryptedChar.toLowerCase());
    }

    // Update previous character for next iteration
    previousChar = decryptedChar;
  }

  return decryptedMessage.join(""); // Combine decrypted characters into a string
}

// Adjusted encryption logic to preserve case
function encryptMessage(message) {
  let encryptedMessage = [];
  let previousChar = ""; // To track the previous character

  for (let i = 0; i < message.length; i++) {
    let char = message[i].toUpperCase(); // Convert to uppercase for uniform processing
    if (!/[A-Z]/.test(char)) {
      // If not a letter, just append (spaces, punctuation, etc.)
      encryptedMessage.push(message[i]); // Preserve the original character (lowercase or punctuation)
      continue;
    }

    let flower;
    if (i === 0) {
      flower = flowerCipher[char]; // First letter uses default flower
    } else {
      // Determine the shift based on the previous character
      if (isVowel(previousChar)) {
        let newChar = shiftLetter(char, 2); // Shift forward by 2 if vowel
        flower = flowerCipher[newChar];
      } else {
        let newChar = shiftLetter(char, -1); // Shift backward by 1 if consonant
        flower = flowerCipher[newChar];
      }
    }

    encryptedMessage.push(flower);
    previousChar = char; // Update previous character
  }

  return encryptedMessage.join(" "); // Use space as delimiter
}

// Event listeners
document.getElementById("encryptBtn").addEventListener("click", function () {
  let inputText = document.getElementById("inputText").value;
  let encrypted = encryptMessage(inputText);
  document.getElementById("resultText").value = encrypted;
});

document.getElementById("decryptBtn").addEventListener("click", function () {
  let inputText = document.getElementById("inputText").value;
  let decrypted = decryptMessage(inputText);
  document.getElementById("resultText").value = decrypted;
});

const toggleButton = document.getElementById("darkModeToggle");
const darkModeIcon = document.getElementById("darkModeIcon");
const darkModeText = document.getElementById("darkModeText");
const body = document.body;

// Check if dark mode is already enabled (using localStorage)
if (localStorage.getItem("darkMode") === "enabled") {
  body.classList.add("dark-mode");
  darkModeIcon.textContent = "☀️"; // Sun icon for light mode
  darkModeText.textContent = "Light Mode";
}

// Add event listener to toggle button
toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    darkModeIcon.textContent = "☀️"; // Sun icon for light mode
    darkModeText.textContent = "Light Mode";
    localStorage.setItem("darkMode", "enabled");
  } else {
    darkModeIcon.textContent = "🌙"; // Moon icon for dark mode
    darkModeText.textContent = "Dark Mode";
    localStorage.setItem("darkMode", "disabled");
  }
});

const copyButton = document.getElementById("copyButton");
const resultText = document.getElementById("resultText");

copyButton.addEventListener("click", () => {
  if (resultText.value.trim() !== "") {
    navigator.clipboard
      .writeText(resultText.value)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  } else {
    alert("Nothing to copy!");
  }
});

const clearButton = document.getElementById("clearButton");
const inputText = document.getElementById("inputText");

clearButton.addEventListener("click", () => {
  inputText.value = ""; // Clears the content of the input textbox
  resultText.value = "";
});

const voiceCommandBtn = document.getElementById("voiceCommandBtn");
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const enterText = document.getElementById("inputText"); // Reference to the input textbox

// Check if the browser supports Speech Recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

  // Start the speech recognition when the button is clicked
  voiceCommandBtn.addEventListener("click", () => {
    recognition.start();
  });

  // Handle speech recognition result
  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript.trim();

    // Display the recognized speech in the input text box
    enterText.value += (enterText.value ? " " : "") + speechResult;

    // Check if the user said "encrypt" or "decrypt"
    if (speechResult.toLowerCase().includes("encrypt")) {
      encryptBtn.click(); // Trigger the Encrypt button click
    } else if (speechResult.toLowerCase().includes("decrypt")) {
      decryptBtn.click(); // Trigger the Decrypt button click
    }
  };

  // Handle speech recognition error
  recognition.onerror = (event) => {
    console.error("Speech Recognition Error: ", event.error);
  };

  // Optional: Add event when the recognition ends
  recognition.onend = () => {
    console.log("Speech recognition service has ended.");
  };
} else {
  alert("Speech Recognition is not supported in this browser.");
}
