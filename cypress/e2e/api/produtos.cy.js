describe('API - Produtos', () => {
  let createdUserIds = [];
  let productTemplates;
  let apiMessages;

  beforeEach(() => {
    cy.fixture('product-templates').then((fixtureData) => {
      productTemplates = fixtureData;
    });

    cy.fixture('api-messages').then((fixtureData) => {
      apiMessages = fixtureData;
    });
  });

  afterEach(() => {
    if (!createdUserIds.length) {
      return;
    }

    cy.wrap(createdUserIds.splice(0), { log: false }).each((userId) => {
      cy.apiDeleteUser(userId);
    });
  });

  it('deve cadastrar e excluir um produto com usuário administrador', () => {
    const admin = Cypress.buildUser({ administrador: 'true' });
    const productName = `${productTemplates.api.namePrefix} ${Date.now()}`;
    const product = {
      nome: productName,
      preco: productTemplates.api.preco,
      descricao: productTemplates.api.descricao,
      quantidade: productTemplates.api.quantidade
    };

    cy.apiCreateUser(admin).then((response) => {
      expect(response.status).to.eq(201);
      createdUserIds.push(response.body._id);
    });

    cy.apiLogin(admin).then((loginResponse) => {
      const token = loginResponse.body.authorization;

      cy.apiCreateProduct({ token, product }).then((createResponse) => {
        expect(createResponse.status).to.eq(201);
        expect(createResponse.body.message).to.eq(apiMessages.success.created);
        expect(createResponse.body._id).to.be.a('string').and.not.be.empty;

        cy.apiDeleteProduct({ token, productId: createResponse.body._id }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
          expect(deleteResponse.body.message).to.eq(apiMessages.success.deleted);
        });
      });
    });
  });
});
