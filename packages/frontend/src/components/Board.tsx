import type { GuessResult } from '@wordle/shared';

const STATUS_COLOR: Record<string, string> = {
  correct: 'var(--color-correct)',
  present: 'var(--color-present)',
  absent: 'var(--color-absent)',
};

interface Props {
  guesses: GuessResult[][];
  currentInput: string;
  maxAttempts: number;
  wordLength: number;
}

export function Board({ guesses, currentInput, maxAttempts, wordLength }: Props) {
  const rows = Array.from({ length: maxAttempts }, (_, rowIndex) => {
    const submitted = guesses[rowIndex];
    const isCurrentRow = rowIndex === guesses.length;

    return (
      <div key={rowIndex} style={{ display: 'flex', gap: '6px' }}>
        {Array.from({ length: wordLength }, (_, colIndex) => {
          let letter = '';
          let bg = 'var(--color-empty)';
          let border = '2px solid var(--color-border)';
          let color = 'var(--color-text)';

          if (submitted) {
            letter = submitted[colIndex].letter.toUpperCase();
            bg = STATUS_COLOR[submitted[colIndex].status];
            border = `2px solid ${bg}`;
            color = '#fff';
          } else if (isCurrentRow) {
            letter = (currentInput[colIndex] ?? '').toUpperCase();
            if (letter) border = '2px solid #878a8c';
          }

          return (
            <div
              key={colIndex}
              data-testid={`tile-${rowIndex}-${colIndex}`}
              style={{
                width: 62,
                height: 62,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 700,
                background: bg,
                border,
                color,
                textTransform: 'uppercase',
                userSelect: 'none',
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  });

  return <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>{rows}</div>;
}
