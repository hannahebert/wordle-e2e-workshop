import type { LetterStatus } from '@wordle/shared';

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['del', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
];

const STATUS_COLOR: Record<LetterStatus, string> = {
  correct: 'var(--color-correct)',
  present: 'var(--color-present)',
  absent: 'var(--color-absent)',
};

interface Props {
  letterStatuses: Record<string, LetterStatus>;
  onKey: (key: string) => void;
  disabled: boolean;
}

export function Keyboard({ letterStatuses, onKey, disabled }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: '6px' }}>
          {row.map((key) => {
            const status = letterStatuses[key];
            const isSpecial = key === 'enter' || key === 'del';
            const bg = status ? STATUS_COLOR[status] : 'var(--color-key-bg)';
            const color = status ? '#fff' : 'var(--color-text)';

            const testId =
              key === 'enter'
                ? 'submit-button'
                : key === 'del'
                  ? 'keyboard-key-del'
                  : `keyboard-key-${key}`;

            return (
              <button
                key={key}
                data-testid={testId}
                onClick={() => onKey(key)}
                disabled={disabled}
                style={{
                  minWidth: isSpecial ? 65 : 43,
                  height: 58,
                  border: 'none',
                  borderRadius: '4px',
                  background: bg,
                  color,
                  fontSize: isSpecial ? '0.75rem' : '1rem',
                  fontWeight: 700,
                  cursor: disabled ? 'default' : 'pointer',
                  textTransform: 'uppercase',
                  padding: '0 4px',
                }}
              >
                {key === 'del' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
