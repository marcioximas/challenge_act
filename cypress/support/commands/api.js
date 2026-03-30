const userTemplate = require('../../fixtures/user-template.json');

const uniqueId = () => `${Date.now()}${Cypress._.random(1000, 9999)}`;

const getApiUrl = () => {
  const envConfig = Cypress.config('env') || {};
  return envConfig.apiUrl || 'https://serverest.dev';
};

const apiRequest = (requestConfig) => {
  return cy.request({
    ...requestConfig,
    url: `${getApiUrl()}${requestConfig.path}`
  });
};

Cypress.buildUser = (overrides = {}) => {
  const id = uniqueId();

  return {
    nome: `${userTemplate.nomePrefix} ${id}`,
    email: `${userTemplate.emailPrefix}.${id}@${userTemplate.emailDomain}`,
    password: userTemplate.password,
    administrador: userTemplate.administrador,
    ...overrides
  };
};

Cypress.Commands.add('buildUser', (overrides = {}) => {
  return cy.wrap(Cypress.buildUser(overrides), { log: false });
});

Cypress.Commands.add('apiCreateUser', (user) => {
  return apiRequest({
    method: 'POST',
    path: '/usuarios',
    body: user,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('apiLogin', ({ email, password }) => {
  return apiRequest({
    method: 'POST',
    path: '/login',
    body: { email, password }
  });
});

Cypress.Commands.add('apiCreateProduct', ({ token, product }) => {
  return apiRequest({
    method: 'POST',
    path: '/produtos',
    headers: { Authorization: token },
    body: product,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('apiListProducts', () => {
  return apiRequest({
    method: 'GET',
    path: '/produtos'
  });
});

Cypress.Commands.add('apiCreateCart', ({ token, products }) => {
  return apiRequest({
    method: 'POST',
    path: '/carrinhos',
    headers: { Authorization: token },
    body: { produtos: products },
    failOnStatusCode: false
  });
});

Cypress.Commands.add('apiCancelPurchase', (token) => {
  return apiRequest({
    method: 'DELETE',
    path: '/carrinhos/cancelar-compra',
    headers: { Authorization: token },
    failOnStatusCode: false
  });
});

Cypress.Commands.add('apiDeleteProduct', ({ token, productId }) => {
  return apiRequest({
    method: 'DELETE',
    path: `/produtos/${productId}`,
    headers: { Authorization: token },
    failOnStatusCode: false
  });
});

Cypress.Commands.add('apiDeleteUser', (userId) => {
  return apiRequest({
    method: 'DELETE',
    path: `/usuarios/${userId}`,
    failOnStatusCode: false
  });
});
