import type { GuessResult } from './GuessResult';
import type { GameStatus } from './GameStatus';

export interface GameState {
  gameId: string;
  wordLength: number;
  maxAttempts: number;
  guesses: GuessResult[][];
  status: GameStatus;
  solution?: string;
}
