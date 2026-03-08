interface Props {
  message: string;
}

export function Toast({ message }: Props) {
  return (
    <div data-testid="toast-message" className="toast">
      {message}
    </div>
  );
}
