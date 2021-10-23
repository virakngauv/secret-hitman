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
  
  return randomRoomCode;
}
