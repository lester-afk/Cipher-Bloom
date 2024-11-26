// Flower cipher mapping
const flowerCipher = {
  A: "Rose",
  B: "Orchid",
  C: "Tulip",
  D: "Lotus",
  E: "Cherry Blossom",
  F: "Peony",
  G: "Lily",
  H: "Sunflower",
  I: "Dahlia",
  J: "Hydrangea",
  K: "Jasmine",
  L: "Iris",
  M: "Gardenia",
  N: "Magnolia",
  O: "Bird of Paradise",
  P: "Plumeria",
  Q: "Camellia",
  R: "Bleeding Heart",
  S: "Hibiscus",
  T: "Calla Lily",
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

// Encrypt function
function encryptMessage(message) {
  let encryptedMessage = [];
  let previousChar = ""; // To track the previous character

  for (let i = 0; i < message.length; i++) {
    let char = message[i].toUpperCase();
    if (!/[A-Z]/.test(char)) {
      // If not a letter, just append (spaces, punctuation, etc.)
      encryptedMessage.push(char);
      continue;
    }

    let flower;
    if (i === 0) {
      flower = flowerCipher[char];
    } else {
      if (isVowel(previousChar)) {
        let newChar = shiftLetter(char, 2);
        flower = flowerCipher[newChar];
      } else {
        let newChar = shiftLetter(char, -1);
        flower = flowerCipher[newChar];
      }
    }

    encryptedMessage.push(flower);
    previousChar = char; // Update previous character
  }

  return encryptedMessage.join(", "); // Use comma and space as delimiter
}

// Decrypt function (reverse of the encryption logic)
function decryptMessage(encryptedMessage) {
  let reverseFlowerCipher = Object.fromEntries(
    Object.entries(flowerCipher).map(([k, v]) => [v, k])
  );
  let decryptedMessage = [];
  let words = encryptedMessage.split(", "); // Split by comma and space
  let previousChar = ""; // To track the previous character

  for (let i = 0; i < words.length; i++) {
    let flower = words[i];
    let letter = reverseFlowerCipher[flower];

    if (!letter) {
      console.error(`Unknown flower: "${flower}"`);
      continue; // Skip unknown flowers
    }

    if (i === 0) {
      decryptedMessage.push(letter);
    } else {
      if (isVowel(previousChar)) {
        let newChar = shiftLetter(letter, -2);
        decryptedMessage.push(newChar);
      } else {
        let newChar = shiftLetter(letter, 1);
        decryptedMessage.push(newChar);
      }
    }

    previousChar = decryptedMessage[decryptedMessage.length - 1]; // Update previous character
  }

  return decryptedMessage.join("");
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
