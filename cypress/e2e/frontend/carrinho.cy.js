import { frontLocators } from '../../support/locators/front';

describe('Frontend - Adição de produto ao carrinho', () => {
  let createdUserIds = [];
  let productTemplates;

  beforeEach(() => {
    cy.fixture('product-templates').then((fixtureData) => {
      productTemplates = fixtureData;
    });
  });

  const trackCreatedUser = (user) => {
    return cy.apiCreateUser(user).then((response) => {
      expect(response.status).to.eq(201);
      createdUserIds.push(response.body._id);
    });
  };

  const createProductAsAdmin = ({ admin, product }) => {
    return cy.apiLogin(admin).then((loginResponse) => {
      const token = loginResponse.body.authorization;
      expect(token).to.be.a('string').and.not.be.empty;

      return cy.apiCreateProduct({ token, product }).then((createResponse) => {
        expect(createResponse.status).to.eq(201);
      });
    });
  };

  afterEach(() => {
    if (!createdUserIds.length) {
      return;
    }

    cy.wrap(createdUserIds.splice(0), { log: false }).each((userId) => {
      cy.apiDeleteUser(userId);
    });
  });

  it('deve adicionar um produto ao carrinho e exibi-lo na listagem', () => {
    const admin = Cypress.buildUser({ administrador: 'true' });
    const client = Cypress.buildUser();
    const product = {
      nome: `${productTemplates.cart.namePrefix} ${Date.now()}`,
      preco: productTemplates.cart.preco,
      descricao: productTemplates.cart.descricao,
      quantidade: productTemplates.cart.quantidade
    };

    trackCreatedUser(admin);
    trackCreatedUser(client);
    createProductAsAdmin({ admin, product });

    cy.uiLogin(client);
    cy.url().should('include', frontLocators.routes.home);

    cy.contains(frontLocators.home.productTitle, product.nome)
      .should('be.visible')
      .closest(frontLocators.home.productCard)
      .within(() => {
        cy.contains('button', frontLocators.text.addToCartButton).click();
      });
    cy.url().should('include', frontLocators.routes.shoppingList);
    cy.contains(product.nome).should('be.visible');
  });
});
