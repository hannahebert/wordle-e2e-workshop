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
});
