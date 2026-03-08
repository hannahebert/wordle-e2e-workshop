import type { LetterStatus } from '@wordle/shared';

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['del', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
];

const STATUS_CLASS: Record<LetterStatus, string> = {
  correct: 'key--correct',
  present: 'key--present',
  absent:  'key--absent',
};

interface Props {
  letterStatuses: Record<string, LetterStatus>;
  onKey: (key: string) => void;
  disabled: boolean;
}

export function Keyboard({ letterStatuses, onKey, disabled }: Props) {
  return (
    <div className="keyboard">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard__row">
          {row.map((key) => {
            const status = letterStatuses[key];
            const isSpecial = key === 'enter' || key === 'del';

            const testId =
              key === 'enter' ? 'submit-button' :
              key === 'del'   ? 'keyboard-key-del' :
                                `keyboard-key-${key}`;

            const className = [
              'key',
              isSpecial ? 'key--wide' : '',
              status ? STATUS_CLASS[status] : '',
            ].filter(Boolean).join(' ');

            return (
              <button
                key={key}
                data-testid={testId}
                className={className}
                onClick={() => onKey(key)}
                disabled={disabled}
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
