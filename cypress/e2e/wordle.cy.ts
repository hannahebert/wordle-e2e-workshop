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
});
