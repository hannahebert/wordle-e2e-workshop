import type { GuessResult } from './GuessResult';
import type { GameStatus } from './GameStatus';

export interface GuessResponse {
  result: GuessResult[];
  status: GameStatus;
}
