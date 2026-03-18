describe("User Input", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/game").as("newGame");
    cy.visit("/");
    cy.wait("@newGame");
    cy.getByTestId("keyboard-key-a").should("be.enabled");
  });

  it("types letters via the virtual keyboard", () => {
    cy.getByTestId("keyboard-key-h").click();
    cy.getByTestId("keyboard-key-e").click();
    cy.getByTestId("keyboard-key-l").click();

    cy.getByTestId("tile-0-0")
      .should("have.text", "H")
      .and("have.class", "tile--filled");
    cy.getByTestId("tile-0-1")
      .should("have.text", "E")
      .and("have.class", "tile--filled");
    cy.getByTestId("tile-0-2")
      .should("have.text", "L")
      .and("have.class", "tile--filled");
    cy.getByTestId("tile-0-3").should("have.text", "");
  });

  it("types letters via the physical keyboard", () => {
    cy.get("body").type("wor", { delay: 50 });

    cy.getByTestId("tile-0-0")
      .should("have.text", "W")
      .and("have.class", "tile--filled");
    cy.getByTestId("tile-0-1")
      .should("have.text", "O")
      .and("have.class", "tile--filled");
    cy.getByTestId("tile-0-2")
      .should("have.text", "R")
      .and("have.class", "tile--filled");
    cy.getByTestId("tile-0-3").should("have.text", "");
  });

  it("deletes letters via the virtual keyboard", () => {
    cy.getByTestId("keyboard-key-a").click();
    cy.getByTestId("keyboard-key-b").click();
    cy.getByTestId("keyboard-key-c").click();

    cy.getByTestId("tile-0-2").should("have.text", "C");

    cy.getByTestId("keyboard-key-del").click();
    cy.getByTestId("tile-0-2").should("have.text", "");
    cy.getByTestId("tile-0-1").should("have.text", "B");

    cy.getByTestId("keyboard-key-del").click();
    cy.getByTestId("tile-0-1").should("have.text", "");
    cy.getByTestId("tile-0-0").should("have.text", "A");

    cy.getByTestId("keyboard-key-del").click();
    cy.getByTestId("tile-0-0").should("have.text", "");
  });

  it("deletes letters via the physical keyboard (Backspace)", () => {
    cy.get("body").type("hi");

    cy.getByTestId("tile-0-0").should("have.text", "H");
    cy.getByTestId("tile-0-1").should("have.text", "I");

    cy.get("body").type("{backspace}");
    cy.getByTestId("tile-0-0").should("have.text", "X");
    cy.getByTestId("tile-0-1").should("have.text", "");

    cy.get("body").type("{backspace}");
    cy.getByTestId("tile-0-0").should("have.text", "");
    cy.getByTestId("tile-0-1").should("have.text", "");
  });

  it("does not exceed 5 letters per row", () => {
    cy.get("body").type("abcde");

    cy.getByTestId("tile-0-4").should("have.text", "E");

    // Typing a 6th letter should have no effect
    cy.get("body").type("f");
    cy.getByTestId("tile-0-4").should("have.text", "E");
  });
});
