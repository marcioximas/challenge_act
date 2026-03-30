import { byTestId, frontLocators, frontTestIds } from '../locators/front';

Cypress.Commands.add('getByTestId', (testId, ...args) => {
  return cy.get(byTestId(testId), ...args);
});

Cypress.Commands.add('uiLogin', ({ email, password }) => {
  cy.visit(frontLocators.routes.login);
  cy.getByTestId(frontTestIds.auth.email).should('be.visible').clear().type(email);
  cy.getByTestId(frontTestIds.auth.password).clear().type(password, { log: false });
  cy.getByTestId(frontTestIds.auth.loginButton).click();
});
