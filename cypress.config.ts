import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Die baseUrl ist die Adresse, auf der das Frontend läuft.
    // cy.visit('/') navigiert dann automatisch dorthin.
    baseUrl: 'http://localhost:5173',
  },
});
