describe('API - Usuários', () => {
  let createdUserIds = [];
  let apiMessages;

  beforeEach(() => {
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

  it('deve cadastrar um novo usuário com sucesso', () => {
    const user = Cypress.buildUser();

    cy.apiCreateUser(user).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq(apiMessages.success.created);
      expect(response.body._id).to.be.a('string').and.not.be.empty;
      createdUserIds.push(response.body._id);
    });
  });

  it('deve autenticar um usuário e retornar o token', () => {
    const user = Cypress.buildUser({ administrador: 'true' });

    cy.apiCreateUser(user).then((response) => {
      expect(response.status).to.eq(201);
      createdUserIds.push(response.body._id);
    });

    cy.apiLogin(user).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq(apiMessages.success.login);
      expect(response.body.authorization).to.be.a('string').and.not.be.empty;
    });
  });
});
