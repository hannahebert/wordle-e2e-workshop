import type { GuessResult, GameState, GameStatus } from '@wordle/shared';
import { getRandomWord } from './words';

interface StoredGame {
  id: string;
  word: string;
  guesses: GuessResult[][];
  status: GameStatus;
  maxAttempts: number;
}

const games = new Map<string, StoredGame>();
const MAX_ATTEMPTS = 6;

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function evaluateGuess(guess: string, target: string): GuessResult[] {
  const result: GuessResult[] = guess.split('').map((letter) => ({
    letter,
    status: 'absent' as const,
  }));

  const targetChars = target.split('');
  const used = new Array(target.length).fill(false);

  // First pass: correct positions
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = { letter: guess[i], status: 'correct' };
      used[i] = true;
    }
  }

  // Second pass: present (wrong position)
  for (let i = 0; i < guess.length; i++) {
    if (result[i].status === 'correct') continue;
    for (let j = 0; j < targetChars.length; j++) {
      if (!used[j] && guess[i] === targetChars[j]) {
        result[i] = { letter: guess[i], status: 'present' };
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

export function createGame(): GameState {
  const id = generateId();
  const game: StoredGame = {
    id,
    word: getRandomWord(),
    guesses: [],
    status: 'in_progress',
    maxAttempts: MAX_ATTEMPTS,
  };
  games.set(id, game);
  return toGameState(game);
}

export function getGame(gameId: string): GameState | null {
  const game = games.get(gameId);
  return game ? toGameState(game) : null;
}

export function submitGuess(
  gameId: string,
  word: string,
): { result: GuessResult[]; status: GameStatus } | { error: string } {
  const game = games.get(gameId);
  if (!game) return { error: 'Game not found' };
  if (game.status !== 'in_progress') return { error: 'Game is already over' };
  if (word.length !== game.word.length) return { error: `Word must be ${game.word.length} letters` };

  const result = evaluateGuess(word.toLowerCase(), game.word);
  game.guesses.push(result);

  const won = result.every((r) => r.status === 'correct');
  if (won) {
    game.status = 'won';
  } else if (game.guesses.length >= game.maxAttempts) {
    game.status = 'lost';
  }

  return { result, status: game.status };
}

function toGameState(game: StoredGame): GameState {
  return {
    gameId: game.id,
    wordLength: game.word.length,
    maxAttempts: game.maxAttempts,
    guesses: game.guesses,
    status: game.status,
  };
}
