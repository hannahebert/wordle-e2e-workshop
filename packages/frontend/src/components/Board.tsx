import type { GuessResult } from '@wordle/shared';

const STATUS_CLASS: Record<string, string> = {
  correct: 'tile--correct',
  present: 'tile--present',
  absent: 'tile--absent',
};

interface Props {
  guesses: GuessResult[][];
  currentInput: string;
  maxAttempts: number;
  wordLength: number;
  revealingRow: number | null;
}

export function Board({ guesses, currentInput, maxAttempts, wordLength, revealingRow }: Props) {
  return (
    <div className="board">
      {Array.from({ length: maxAttempts }, (_, rowIndex) => {
        const submitted = guesses[rowIndex];
        const isCurrentRow = rowIndex === guesses.length;
        const isRevealing = rowIndex === revealingRow;

        return (
          <div key={rowIndex} className="board__row">
            {Array.from({ length: wordLength }, (_, colIndex) => {
              let letter = '';
              let className = 'tile';
              let animationDelay: string | undefined;

              if (submitted) {
                letter = submitted[colIndex].letter.toUpperCase();
                className = `tile ${STATUS_CLASS[submitted[colIndex].status]}`;
                if (isRevealing) {
                  className += ' tile--revealing';
                  animationDelay = `${colIndex * 150}ms`;
                }
              } else if (isCurrentRow) {
                letter = (currentInput[colIndex] ?? '').toUpperCase();
                if (letter) className = 'tile tile--filled';
              }

              return (
                <div
                  key={colIndex}
                  data-testid={`tile-${rowIndex}-${colIndex}`}
                  className={className}
                  style={animationDelay ? { animationDelay } : undefined}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
