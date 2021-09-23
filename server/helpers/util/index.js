import crypto from "crypto";

export function shuffledArray(array) {
  for (let i = 0; i < array.length; i++) {
    let randomIndex = Math.floor(Math.random() * (i + 1));

    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

export function generateRandomId() {
  return crypto.randomBytes(8).toString("hex");
}
