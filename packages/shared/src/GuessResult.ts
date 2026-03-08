import type { LetterStatus } from './LetterStatus';

export interface GuessResult {
  letter: string;
  status: LetterStatus;
}