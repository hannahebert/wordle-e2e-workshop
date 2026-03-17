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
      cy.get('[data-testid="keyboard-key-a"]').should('be.enabled');
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

    it('shows letters in tiles when typing on physical keyboard', () => {
      const letters = ['H', 'A', 'L', 'L', 'O'];

      cy.get('body').type('hallo');

      letters.forEach((letter, col) => {
        cy.get(`[data-testid="tile-0-${col}"]`)
          .should('have.text', letter)
          .and('have.class', 'tile--filled');
      });
    });

    it('removes last letter when pressing Backspace', () => {
      cy.get('body').type('hal{backspace}');

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

  describe('Game End', () => {
    const gameId = 'test-game-456';

    beforeEach(() => {
      cy.intercept('POST', '/api/game', {
        statusCode: 200,
        body: { gameId, wordLength: 5, maxAttempts: 6 },
      }).as('newGame');

      cy.visit('/');
      cy.wait('@newGame');
    });

    function typeWord(word: string) {
      for (const letter of word) {
        cy.get(`[data-testid="keyboard-key-${letter}"]`).click();
      }
      cy.get('[data-testid="submit-button"]').click();
    }

    it('shows winning message when game is won', () => {
      const responses = [
        {
          result: [
            { letter: 's', status: 'absent' },
            { letter: 't', status: 'absent' },
            { letter: 'e', status: 'absent' },
            { letter: 'r', status: 'absent' },
            { letter: 'n', status: 'absent' },
          ],
          status: 'in_progress',
        },
        {
          result: [
            { letter: 'k', status: 'correct' },
            { letter: 'r', status: 'correct' },
            { letter: 'a', status: 'correct' },
            { letter: 'f', status: 'correct' },
            { letter: 't', status: 'correct' },
          ],
          status: 'won',
        },
      ];

      let callCount = 0;
      cy.intercept('POST', `/api/game/${gameId}/guess`, (req) => {
        req.reply({ statusCode: 200, body: responses[callCount++] });
      }).as('guess');

      // Guess 1: "stern"
      typeWord('stern');
      cy.wait('@guess');

      // Wait for reveal animation to finish — keyboard re-enables
      cy.get('[data-testid="submit-button"]').should('not.be.disabled');

      // Guess 2: "kraft" — wins the game
      typeWord('kraft');
      cy.wait('@guess');

      // All tiles in row 1 should be correct
      for (let col = 0; col < 5; col++) {
        cy.get(`[data-testid="tile-1-${col}"]`).should('have.class', 'tile--correct');
      }

      // Winning toast
      cy.get('[data-testid="toast-message"]').should('have.text', 'Gewonnen!');

      // Keyboard disabled
      cy.get('[data-testid="submit-button"]').should('be.disabled');

      // "Neues Spiel" button visible
      cy.contains('Neues Spiel').should('be.visible');
    });

    it('shows solution when game is lost', () => {
      const words = ['stern', 'blume', 'audio', 'lymph', 'fixen', 'joker'];

      const responses = words.map((word, i) => ({
        result: [...word].map((letter) => ({ letter, status: 'absent' })),
        status: i < 5 ? 'in_progress' : 'lost',
        ...(i === 5 ? { solution: 'kraft' } : {}),
      }));

      let callCount = 0;
      cy.intercept('POST', `/api/game/${gameId}/guess`, (req) => {
        req.reply({ statusCode: 200, body: responses[callCount++] });
      }).as('guess');

      words.forEach((word, i) => {
        typeWord(word);
        cy.wait('@guess');

        if (i < 5) {
          // Wait for reveal animation to finish before typing next word
          cy.get('[data-testid="submit-button"]').should('not.be.disabled');
        }
      });

      // Loss toast with solution
      cy.get('[data-testid="toast-message"]').should(
        'have.text',
        'Leider verloren. Das Wort war: KRAFT',
      );

      // All 6 rows filled with absent tiles
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
          cy.get(`[data-testid="tile-${row}-${col}"]`).should('have.class', 'tile--absent');
        }
      }

      // Keyboard disabled
      cy.get('[data-testid="submit-button"]').should('be.disabled');

      // "Neues Spiel" button visible
      cy.contains('Neues Spiel').should('be.visible');
    });
  });
});
