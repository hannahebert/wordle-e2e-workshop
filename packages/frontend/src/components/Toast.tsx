interface Props {
  message: string;
}

export function Toast({ message }: Props) {
  return (
    <div
      data-testid="toast-message"
      style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1a1a1b',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '6px',
        fontWeight: 600,
        fontSize: '0.9rem',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}
