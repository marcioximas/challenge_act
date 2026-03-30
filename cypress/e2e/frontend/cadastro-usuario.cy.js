import { frontLocators, frontTestIds } from '../../support/locators/front';

describe('Frontend - Cadastro de usuário', () => {
  let createdUserIds = [];

  const registerCreateUserIntercept = () => {
    cy.intercept('POST', '**/usuarios').as('createUser');
  };

  const captureCreatedUserId = () => {
    cy.wait('@createUser').then(({ response }) => {
      expect(response.statusCode).to.eq(201);
      createdUserIds.push(response.body._id);
    });
  };

  const fillRegistrationForm = (user) => {
    cy.getByTestId(frontTestIds.registration.name).type(user.nome);
    cy.getByTestId(frontTestIds.registration.email).type(user.email);
    cy.getByTestId(frontTestIds.registration.password).type(user.password, { log: false });
    cy.getByTestId(frontTestIds.registration.adminCheckbox).should('not.be.checked');
  };

  afterEach(() => {
    if (!createdUserIds.length) {
      return;
    }

    cy.wrap(createdUserIds.splice(0), { log: false }).each((userId) => {
      cy.apiDeleteUser(userId);
    });
  });

  it('deve cadastrar um novo usuário cliente com sucesso', () => {
    const user = Cypress.buildUser();

    cy.visit(frontLocators.routes.registerUsers);
    registerCreateUserIntercept();
    fillRegistrationForm(user);
    cy.getByTestId(frontTestIds.registration.submitButton).click();

    captureCreatedUserId();

    cy.url().should('include', frontLocators.routes.registerUsers);
    cy.contains(frontLocators.text.registrationSuccess).should('be.visible');
  });
});
