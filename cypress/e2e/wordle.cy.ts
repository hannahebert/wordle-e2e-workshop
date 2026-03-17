describe('Wordle', () => {
  it('loads the app and starts a new game', () => {
    cy.visit('/');

    // Title is visible
    cy.contains('Wordle').should('be.visible');

    // Board renders 6 rows × 5 tiles
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        cy.get(`[data-testid="tile-${row}-${col}"]`).should('exist');
      }
    }

    // Keyboard is present
    cy.get('[data-testid="keyboard-key-q"]').should('be.visible');
    cy.get('[data-testid="keyboard-key-e"]').should('be.visible');
    cy.get('[data-testid="keyboard-key-z"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.visible');
    cy.get('[data-testid="keyboard-key-del"]').should('be.visible');
  });

  describe('User Input', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/game').as('newGame');
      cy.visit('/');
      cy.wait('@newGame');
    });

    it('shows letters in tiles when clicking virtual keyboard', () => {
      const letters = ['h', 'a', 'l', 'l', 'o'];

      letters.forEach((letter) => {
        cy.get(`[data-testid="keyboard-key-${letter}"]`).click();
      });

      letters.forEach((letter, col) => {
        cy.get(`[data-testid="tile-0-${col}"]`)
          .should('have.text', letter.toUpperCase())
          .and('have.class', 'tile--filled');
      });
    });

    it('removes last letter when clicking virtual delete key', () => {
      cy.get('[data-testid="keyboard-key-h"]').click();
      cy.get('[data-testid="keyboard-key-a"]').click();
      cy.get('[data-testid="keyboard-key-l"]').click();

      cy.get('[data-testid="keyboard-key-del"]').click();

      cy.get('[data-testid="tile-0-2"]')
        .should('have.text', '')
        .and('not.have.class', 'tile--filled');
      cy.get('[data-testid="tile-0-1"]')
        .should('have.text', 'A')
        .and('have.class', 'tile--filled');
    });
  });

  describe('Guess Feedback', () => {
    const gameId = 'test-game-123';

    beforeEach(() => {
      cy.intercept('POST', '/api/game', {
        statusCode: 200,
        body: { gameId, wordLength: 5, maxAttempts: 6 },
      }).as('newGame');

      cy.intercept('POST', `/api/game/${gameId}/guess`, {
        statusCode: 200,
        body: {
          result: [
            { letter: 'h', status: 'correct' },
            { letter: 'a', status: 'absent' },
            { letter: 'l', status: 'present' },
            { letter: 'l', status: 'absent' },
            { letter: 'o', status: 'absent' },
          ],
          status: 'in_progress',
        },
      }).as('guess');

      cy.visit('/');
      cy.wait('@newGame');
    });

    it('colors tiles and keyboard keys according to guess result', () => {
      ['h', 'a', 'l', 'l', 'o'].forEach((letter) => {
        cy.get(`[data-testid="keyboard-key-${letter}"]`).click();
      });
      cy.get('[data-testid="submit-button"]').click();
      cy.wait('@guess');

      // Tile coloring
      const expectedTiles: [number, string][] = [
        [0, 'tile--correct'],
        [1, 'tile--absent'],
        [2, 'tile--present'],
        [3, 'tile--absent'],
        [4, 'tile--absent'],
      ];
      expectedTiles.forEach(([col, cls]) => {
        cy.get(`[data-testid="tile-0-${col}"]`).should('have.class', cls);
      });

      // Keyboard key coloring
      cy.get('[data-testid="keyboard-key-h"]').should('have.class', 'key--correct');
      cy.get('[data-testid="keyboard-key-a"]').should('have.class', 'key--absent');
      cy.get('[data-testid="keyboard-key-l"]').should('have.class', 'key--present');
      cy.get('[data-testid="keyboard-key-o"]').should('have.class', 'key--absent');

      // Unused key has no status class
      cy.get('[data-testid="keyboard-key-q"]')
        .should('not.have.class', 'key--correct')
        .and('not.have.class', 'key--present')
        .and('not.have.class', 'key--absent');
    });
  });
});
