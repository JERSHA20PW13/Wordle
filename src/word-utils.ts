import wordBank from './word-bank.json';

export const LETTER_LENGTH = 5;

export function getRandomWord(): string {
    return wordBank.valid[Math.floor(Math.random() * wordBank.valid.length)];
  }

export enum LetterState {
  Miss,
  Present,
  Match,
}

export function computeGuess(guess: string, wordString: string): LetterState[] {
  const result: LetterState[] = [];

  if (guess.length !== wordString.length) {
    return result;
  }
  
  const word = wordString.split('');
  const guessArray = guess.split('');
  const wordLetterCount: Record <string, number> = {};
  
  guessArray.forEach((letter, index) => {
    const currentWordLetter = word[index];
    
    wordLetterCount[currentWordLetter] = wordLetterCount[currentWordLetter] ? wordLetterCount[currentWordLetter]+1 : 1;
    
    if (currentWordLetter === letter) 
    {
      result.push(LetterState.Match);
    } 
    else if (word.includes(letter)) 
    {
      result.push(LetterState.Present);
    } 
    else 
    {
      result.push(LetterState.Miss);
    }
  });

  result.forEach((curResult, resultIndex) => {
    if (curResult !== LetterState.Present) {
      return;
    }

    const guessLetter = guessArray[resultIndex];

    word.forEach((currentWordLetter, wordIndex) => {
      if (currentWordLetter !== guessLetter) {
        return;
      }

      //downgrading
      if (result[wordIndex] === LetterState.Match) {
        result[resultIndex] = LetterState.Miss;
      }

      if (wordLetterCount[guessLetter] <= 0) {
        result[resultIndex] = LetterState.Miss;
      }
    });

  wordLetterCount[guessLetter]--;
  });

  return result;
}

export function isValidWord(word: string): boolean {
  return wordBank.valid.concat(wordBank.invalid).includes(word);
}