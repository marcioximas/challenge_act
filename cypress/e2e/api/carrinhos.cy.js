describe('API - Carrinhos', () => {
  let createdUserIds = [];
  let apiMessages;
  let token = null;

  beforeEach(() => {
    cy.fixture('api-messages').then((fixtureData) => {
      apiMessages = fixtureData;
    });
  });

  afterEach(() => {
    if (token) {
      cy.apiCancelPurchase(token);
      token = null;
    }

    if (!createdUserIds.length) {
      return;
    }

    cy.wrap(createdUserIds.splice(0), { log: false }).each((userId) => {
      cy.apiDeleteUser(userId);
    });
  });

  it('deve criar carrinho com produto existente', () => {
    const client = Cypress.buildUser();

    cy.apiCreateUser(client).then((createUserResponse) => {
      expect(createUserResponse.status).to.eq(201);
      createdUserIds.push(createUserResponse.body._id);
    });

    cy.apiLogin(client).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      token = loginResponse.body.authorization;
      expect(token).to.be.a('string').and.not.be.empty;
    });

    cy.apiListProducts().then((listProductsResponse) => {
      expect(listProductsResponse.status).to.eq(200);
      expect(listProductsResponse.body.produtos).to.be.an('array').and.not.be.empty;

      const availableProduct = listProductsResponse.body.produtos.find(
        (product) => Number(product.quantidade) > 0
      );

      expect(availableProduct, 'produto disponível para carrinho').to.exist;

      cy.apiCreateCart({
        token,
        products: [{ idProduto: availableProduct._id, quantidade: 1 }]
      }).then((createCartResponse) => {
        expect(createCartResponse.status).to.eq(201);
        expect(createCartResponse.body.message).to.eq(apiMessages.success.created);
        expect(createCartResponse.body._id).to.be.a('string').and.not.be.empty;
      });
    });
  });
});
