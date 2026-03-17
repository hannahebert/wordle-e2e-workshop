describe('Wordle with cy.prompt', () => {
  it('plays a full game using natural language', () => {
    cy.prompt([
      'visit http://localhost:5173',
      'verify the text "Wordle" is visible on the page',
      'verify the element with data-testid "tile-0-0" exists',
      'verify the element with data-testid "tile-5-4" exists',
      'verify the element with data-testid "keyboard-key-q" is visible',
      'click the element with data-testid "keyboard-key-s"',
      'click the element with data-testid "keyboard-key-t"',
      'click the element with data-testid "keyboard-key-e"',
      'click the element with data-testid "keyboard-key-r"',
      'click the element with data-testid "keyboard-key-n"',
      'click the element with data-testid "submit-button"',
      'verify the element with data-testid "tile-0-0" has text',
    ]);
  });

  it('can type and delete letters', () => {
    cy.prompt([
      'visit http://localhost:5173',
      'click the element with data-testid "keyboard-key-h"',
      'click the element with data-testid "keyboard-key-a"',
      'click the element with data-testid "keyboard-key-l"',
      'verify the element with data-testid "tile-0-0" contains the text "H"',
      'verify the element with data-testid "tile-0-1" contains the text "A"',
      'verify the element with data-testid "tile-0-2" contains the text "L"',
      'click the element with data-testid "keyboard-key-del"',
      'verify the element with data-testid "tile-0-2" has no text content',
      'verify the element with data-testid "tile-0-1" contains the text "A"',
    ]);
  });

  it('shows a winning message when all letters are correct', () => {
    const gameId = 'prompt-test-game';

    cy.intercept('POST', '/api/game', {
      statusCode: 200,
      body: { gameId, wordLength: 5, maxAttempts: 6 },
    });

    cy.intercept('POST', `/api/game/${gameId}/guess`, {
      statusCode: 200,
      body: {
        result: [
          { letter: 'k', status: 'correct' },
          { letter: 'r', status: 'correct' },
          { letter: 'a', status: 'correct' },
          { letter: 'f', status: 'correct' },
          { letter: 't', status: 'correct' },
        ],
        status: 'won',
      },
    });

    cy.prompt([
      'visit http://localhost:5173',
      'click the element with data-testid "keyboard-key-k"',
      'click the element with data-testid "keyboard-key-r"',
      'click the element with data-testid "keyboard-key-a"',
      'click the element with data-testid "keyboard-key-f"',
      'click the element with data-testid "keyboard-key-t"',
      'click the element with data-testid "submit-button"',
      'verify the element with data-testid "tile-0-0" has the CSS class "tile--correct"',
      'verify the element with data-testid "tile-0-4" has the CSS class "tile--correct"',
      'verify the element with data-testid "toast-message" contains the text "Gewonnen!"',
      'verify the element with data-testid "submit-button" is disabled',
      'verify the text "Neues Spiel" is visible on the page',
    ]);
  });
});
