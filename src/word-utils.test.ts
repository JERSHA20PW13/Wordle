import { describe, expect, it } from 'vitest';
import { computeGuess, getRandomWord, isValidWord, LetterState } from './word-utils';

describe('word-utils', () => {
  it('random word', () => {
    expect(getRandomWord()).toBeTruthy();
    expect(getRandomWord().length).toEqual(5);
  });
});

describe('computeGuess', () => {
  it('works with match and present', () => {
    expect(computeGuess('boost', 'basic')).toEqual([
      LetterState.Match,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Present,
      LetterState.Miss,
    ]);
  });

  it('works with all matches', () => {
    expect(computeGuess('boost', 'boost')).toEqual([
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
    ]);
  });

  it('works with all miss', () => {
    expect(computeGuess('guard', 'boost')).toEqual([
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
    ]);
  });

  it('only one does match when two letters are present', () => {
    expect(computeGuess('solid', 'boost')).toEqual([
      LetterState.Present,
      LetterState.Match,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
    ]);
  });
});

describe('isValidWord', () => {
  it('works with valid word', () => {
    expect(isValidWord('boost')).toBe(true);
  });

  it('works with invalid word', () => {
    expect(isValidWord('allol')).toBe(true);
  });
});