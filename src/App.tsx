import { stat } from "fs";
import React, { useEffect, useRef, useState } from "react"
import Keyboard from "./keyboard";
import { useStore, GUESS_LENGTH } from './store';
import { isValidWord, LETTER_LENGTH } from "./word-utils";
import WordRow from "./wordRow"

export default function App() {
  const state = useStore();
  const [guess, setGuess, addGuessLetter] = useGuess();
  const [showInvalidGuess, setInvalidGuess] = useState(false);
  const addGuess = useStore((s) => s.addGuess);
  const previousGuess = usePrevious(guess);

  useEffect(() => {
    let id: any;
    if(showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 2000);
    }

    return () => clearTimeout(id);
  }, [showInvalidGuess])

  useEffect(() => {
    if (guess.length === 0 && previousGuess?.length === LETTER_LENGTH) {
      if (isValidWord(previousGuess)) 
      {
        addGuess(previousGuess);
        setInvalidGuess(false);
      }
      else
      {
        setInvalidGuess(true);
        setGuess(previousGuess);
      }
    }
  }, [guess]);

  let rows = [...state.rows] ;
  let currentRow = 0;

  if (rows.length < GUESS_LENGTH) {
    currentRow = rows.push({ guess }) - 1;
  }

  const numberofGuessesRemaining = GUESS_LENGTH - rows.length;

  rows = rows.concat(Array(numberofGuessesRemaining).fill(''));

  const isGameOver = state.gameState !== 'playing';

  return (
    <div className='mx-auto w-96 relative'>
      <header className='border-b border-gray-500 pb-2 my-2'>
        <h1 className="text-4xl text-center">Wordle</h1>
      </header>
      
      <main className="grid grid-rows-6 gap-4 mb-4">
        {rows.map(({guess, result}, index) => (
          <WordRow 
            key={index} 
            letters={guess} 
            result={result} 
            className={showInvalidGuess && currentRow === index ? 'animate-bounce': ''}/>
        ))}
      </main>

      <Keyboard 
      onClick={(letter) => {
        addGuessLetter(letter);
      }}/>

      {isGameOver && (
        <div role="modal" className="absolute bg-white rounded border border-gray-500 left-0 right-0 top-1/4 p-6 w-11/12 h-1/2 mx-auto text-center">
          Game Over!

          <WordRow letters={state.answer} className = "items-center justify-items-center" />
          
          <button className="block border rounded border-green-500 bg-green-500 p-2 mt-4 mx-auto shadow" onClick={() => {
            state.newGame();
            setGuess('');
          }}>New Game</button>
        </div>
      )}
    </div>
  );
}

function useGuess(): [string, React.Dispatch<React.SetStateAction<string>>, (letter: string)=> void] {
  const [guess, setGuess] = useState('');
  const addGuessLetter = (letter: string) => {
    setGuess((curGuess) => {
      const newGuess = letter.length === 1 ? curGuess + letter : curGuess;
      switch (letter) {
        case 'Backspace':
          return newGuess.slice(0, -1);
        case 'Enter':
          if (newGuess.length === LETTER_LENGTH) {
            return '';
          }
      }
      if (curGuess.length === LETTER_LENGTH) {
        return curGuess;
      }
      return newGuess;
    });
  }

  const onKeyDown = (e: KeyboardEvent) => {
    let letter = e.key;
    addGuessLetter(letter);
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    }
  }, []);

  return [guess, setGuess, addGuessLetter];
}

function usePrevious<T>(value: T): T {
  const ref: any = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}


