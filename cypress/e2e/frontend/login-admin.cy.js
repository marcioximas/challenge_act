import { frontLocators, frontTestIds } from '../../support/locators/front';

describe('Frontend - Login do administrador e cadastro de produto', () => {
  let admin;
  let adminId;
  let productTemplates;
  let product;

  const fillProductForm = () => {
    cy.getByTestId(frontTestIds.adminProduct.name).type(product.nome);
    cy.getByTestId(frontTestIds.adminProduct.price).type(product.preco);
    cy.getByTestId(frontTestIds.adminProduct.description).type(product.descricao);
    cy.getByTestId(frontTestIds.adminProduct.quantity).type(product.quantidade);
  };

  beforeEach(() => {
    admin = Cypress.buildUser({ administrador: 'true' });

    cy.fixture('product-templates').then((fixtureData) => {
      productTemplates = fixtureData;

      product = {
        nome: `${productTemplates.adminUi.namePrefix} ${Date.now()}`,
        preco: productTemplates.adminUi.preco,
        descricao: productTemplates.adminUi.descricao,
        quantidade: productTemplates.adminUi.quantidade
      };
    });

    cy.apiCreateUser(admin).then((response) => {
      expect(response.status).to.eq(201);
      adminId = response.body._id;
    });
  });

  afterEach(() => {
    if (!adminId) {
      return;
    }

    cy.apiDeleteUser(adminId).then(() => {
      adminId = null;
    });
  });

  it('deve permitir que um administrador faça login e cadastre um produto', () => {
    // Arrange + Act
    cy.uiLogin(admin);
    cy.url().should('include', frontLocators.routes.adminHome);

    cy.contains('a', frontLocators.text.registerProductsLink).click();
    fillProductForm();
    cy.getByTestId(frontTestIds.adminProduct.submitButton).click();

    // Assert
    cy.contains(product.nome).should('be.visible');
    cy.get(frontLocators.shared.table).contains('td', product.nome).should('be.visible');
  });
});
