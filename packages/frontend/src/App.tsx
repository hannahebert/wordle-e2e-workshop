import { useState, useEffect, useCallback } from 'react';
import type { GuessResult, LetterStatus } from '@wordle/shared';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { Toast } from './components/Toast';
import { startGame, submitGuess } from './api';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const REVEAL_DELAY_PER_TILE = 150;
const REVEAL_DURATION = 500;

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
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () =>
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '');
      return next;
    });

  const showToast = (msg: string, durationMs = 2000) => {
    setToast(msg);
    setTimeout(() => setToast(null), durationMs);
  };

  const newGame = () =>
    startGame().then((res) => {
      setGameId(res.gameId);
      setGuesses([]);
      setCurrentInput('');
      setGameStatus('in_progress');
      setRevealingRow(null);
    });

  useEffect(() => { newGame(); }, []);

  const handleKey = useCallback(
    async (key: string) => {
      if (gameStatus !== 'in_progress' || !gameId || revealingRow !== null) return;

      if (key === 'enter') {
        if (currentInput.length < WORD_LENGTH) {
          showToast('Zu wenig Buchstaben');
          return;
        }
        try {
          const response = await submitGuess(gameId, currentInput);
          const newGuesses = [...guesses, response.result];
          const rowIndex = newGuesses.length - 1;

          setGuesses(newGuesses);
          setCurrentInput('');
          setRevealingRow(rowIndex);

          const revealTotalMs = (WORD_LENGTH - 1) * REVEAL_DELAY_PER_TILE + REVEAL_DURATION;
          setTimeout(() => {
            setRevealingRow(null);
            setGameStatus(response.status);
            if (response.status === 'won') showToast('Gewonnen!', 4000);
            if (response.status === 'lost') showToast(`Leider verloren. Das Wort war: ${response.solution?.toUpperCase()}`, 4000);
          }, revealTotalMs);
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
    [gameId, gameStatus, currentInput, guesses, revealingRow],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter')          handleKey('enter');
      else if (e.key === 'Backspace') handleKey('del');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  const letterStatuses = buildLetterStatuses(guesses);
  const isGameOver = gameStatus !== 'in_progress';

  if (!gameId) {
    return <>Loading…</>
  }

  return (
    <>
      <header className="header">
        <span>Wordle</span>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Theme wechseln"
          data-testid="theme-toggle"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="main">
        {toast && <Toast message={toast} />}
        <Board
          guesses={guesses}
          currentInput={currentInput}
          maxAttempts={MAX_ATTEMPTS}
          wordLength={WORD_LENGTH}
          revealingRow={revealingRow}
        />
        <Keyboard
          letterStatuses={letterStatuses}
          onKey={handleKey}
          disabled={isGameOver || revealingRow !== null}
        />
        {isGameOver && (
          <button className="new-game-btn" onClick={newGame}>
            Neues Spiel
          </button>
        )}
      </main>
    </>
  );
}
