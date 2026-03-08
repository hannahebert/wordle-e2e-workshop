import { useState, useEffect, useCallback } from 'react';
import type { GuessResult, LetterStatus } from '@wordle/shared';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { Toast } from './components/Toast';
import { startGame, submitGuess } from './api';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

function buildLetterStatuses(guesses: GuessResult[][]): Record<string, LetterStatus> {
  const priority: Record<LetterStatus, number> = { correct: 2, present: 1, absent: 0 };
  const statuses: Record<string, LetterStatus> = {};
  for (const guess of guesses) {
    for (const { letter, status } of guess) {
      if (!statuses[letter] || priority[status] > priority[statuses[letter]]) {
        statuses[letter] = status;
      }
    }
  }
  return statuses;
}

export default function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [gameStatus, setGameStatus] = useState<'in_progress' | 'won' | 'lost'>('in_progress');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string, durationMs = 2000) => {
    setToast(msg);
    setTimeout(() => setToast(null), durationMs);
  };

  useEffect(() => {
    startGame().then((res) => {
      setGameId(res.gameId);
      setGuesses([]);
      setCurrentInput('');
      setGameStatus('in_progress');
    });
  }, []);

  const handleKey = useCallback(
    async (key: string) => {
      if (gameStatus !== 'in_progress' || !gameId) return;

      if (key === 'enter') {
        if (currentInput.length < WORD_LENGTH) {
          showToast('Zu wenig Buchstaben');
          return;
        }
        try {
          const response = await submitGuess(gameId, currentInput);
          const newGuesses = [...guesses, response.result];
          setGuesses(newGuesses);
          setCurrentInput('');
          setGameStatus(response.status);
          if (response.status === 'won') showToast('Gewonnen!', 4000);
          if (response.status === 'lost') showToast('Leider verloren.', 4000);
        } catch (err) {
          showToast(err instanceof Error ? err.message : 'Fehler');
        }
        return;
      }

      if (key === 'del') {
        setCurrentInput((prev) => prev.slice(0, -1));
        return;
      }

      if (/^[a-z]$/.test(key) && currentInput.length < WORD_LENGTH) {
        setCurrentInput((prev) => prev + key);
      }
    },
    [gameId, gameStatus, currentInput, guesses],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleKey('enter');
      else if (e.key === 'Backspace') handleKey('del');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  const letterStatuses = buildLetterStatuses(guesses);
  const isGameOver = gameStatus !== 'in_progress';

  return (
    <>
      <header>Wordle</header>
      <main>
        {toast && <Toast message={toast} />}
        <Board
          guesses={guesses}
          currentInput={currentInput}
          maxAttempts={MAX_ATTEMPTS}
          wordLength={WORD_LENGTH}
        />
        <Keyboard
          letterStatuses={letterStatuses}
          onKey={handleKey}
          disabled={isGameOver}
        />
        {isGameOver && (
          <button
            onClick={() =>
              startGame().then((res) => {
                setGameId(res.gameId);
                setGuesses([]);
                setCurrentInput('');
                setGameStatus('in_progress');
              })
            }
            style={{
              marginTop: 16,
              padding: '10px 24px',
              fontSize: '1rem',
              fontWeight: 700,
              background: 'var(--color-correct)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Neues Spiel
          </button>
        )}
      </main>
    </>
  );
}
