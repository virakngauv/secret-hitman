import { shuffledArray } from "./util/index.js";

export function generateRandomRoomCode() {
  // TODO: filter against a bad word filter
  const allowed = "bcdfghkpqrstvz";
  // const vowels = "aeiou";
  const lastCharacter = "23456789y";

  let randomRoomCode = "";

  randomRoomCode += allowed.charAt(Math.floor(Math.random() * allowed.length));
  randomRoomCode += allowed.charAt(Math.floor(Math.random() * allowed.length));
  randomRoomCode += allowed.charAt(Math.floor(Math.random() * allowed.length));
  randomRoomCode += allowed.charAt(Math.floor(Math.random() * allowed.length));

  // randomRoomCode += allowed.charAt(Math.floor(Math.random() * allowed.length));
  // randomRoomCode += vowels.charAt(Math.floor(Math.random() * vowels.length));
  // randomRoomCode += allowed.charAt(Math.floor(Math.random() * allowed.length));
  // randomRoomCode += vowels.charAt(Math.floor(Math.random() * vowels.length));
  // randomRoomCode += allowed.charAt(Math.floor(Math.random() * allowed.length));
  // randomRoomCode += vowels.charAt(Math.floor(Math.random() * vowels.length));
  randomRoomCode += lastCharacter.charAt(Math.floor(Math.random() * lastCharacter.length));
  
  if (Math.random() < 0.001) {
    randomRoomCode = generateWhosOnFirstCode();
  }

  return randomRoomCode;
}

function generateWhosOnFirstCode() {
  // Try to make people say "the room code is [complicated, long, short, etc.]"
  const options = [
    "complicated",
    "long",
    "kinda-long",
    "short",
    "funny",
    "hard-to-spell",
    "three-words-all-lowercase",
  ];

  const whosOnFirstCode = shuffledArray(options).pop();

  return whosOnFirstCode;
}
