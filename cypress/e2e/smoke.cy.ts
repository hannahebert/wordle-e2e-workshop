describe('Wordle Smoke Test', () => {
  it('loads the app and displays the board and keyboard', () => {
    cy.intercept('POST', '/api/game').as('newGame');

    cy.visit('/');

    cy.wait('@newGame');

    // Header is visible
    cy.contains('Wordle').should('be.visible');

    // Board renders — first row, first tile exists
    cy.get('[data-testid="tile-0-0"]').should('exist');

    // Keyboard renders — spot-check a few keys
    cy.get('[data-testid="keyboard-key-a"]').should('be.visible');
    cy.get('[data-testid="keyboard-key-z"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.visible');
    cy.get('[data-testid="keyboard-key-del"]').should('be.visible');

    // Theme toggle is present
    cy.get('[data-testid="theme-toggle"]').should('be.visible');
  });

  it('allows typing letters via the on-screen keyboard', () => {
    cy.intercept('POST', '/api/game').as('newGame');

    cy.visit('/');

    cy.wait('@newGame');

    // Type "hallo" via the on-screen keyboard
    const letters = ['h', 'a', 'l', 'l', 'o'];
    for (const letter of letters) {
      cy.get(`[data-testid="keyboard-key-${letter}"]`).click();
    }

    // Verify tiles in the first row show the typed letters
    letters.forEach((letter, i) => {
      cy.get(`[data-testid="tile-0-${i}"]`).should('contain.text', letter.toUpperCase());
    });
  });
});
