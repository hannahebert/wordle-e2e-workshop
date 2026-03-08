import type { NewGameResponse, GuessResponse, GameState } from '@wordle/shared';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function startGame(): Promise<NewGameResponse> {
  const res = await fetch(`${API_URL}/api/game`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start game');
  return res.json();
}

export async function submitGuess(gameId: string, word: string): Promise<GuessResponse> {
  const res = await fetch(`${API_URL}/api/game/${gameId}/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? 'Failed to submit guess');
  }
  return res.json();
}

export async function getGame(gameId: string): Promise<GameState> {
  const res = await fetch(`${API_URL}/api/game/${gameId}`);
  if (!res.ok) throw new Error('Game not found');
  return res.json();
}
