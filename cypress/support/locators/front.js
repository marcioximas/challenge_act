export const byTestId = (testId) => `[data-testid="${testId}"]`;

export const frontTestIds = {
  auth: {
    email: 'email',
    password: 'senha',
    loginButton: 'entrar'
  },
  registration: {
    name: 'nome',
    email: 'email',
    password: 'password',
    adminCheckbox: 'checkbox',
    submitButton: 'cadastrar'
  },
  adminProduct: {
    name: 'nome',
    price: 'preco',
    description: 'descricao',
    quantity: 'quantity',
    submitButton: 'cadastarProdutos'
  }
};

export const frontLocators = {
  routes: {
    login: '/login',
    home: '/home',
    adminHome: '/admin/home',
    registerUsers: '/cadastrarusuarios',
    shoppingList: '/minhaListaDeProdutos'
  },
  home: {
    productTitle: '.card-title, h5',
    productCard: '.card'
  },
  shared: {
    table: 'table'
  },
  text: {
    registerProductsLink: 'Cadastrar Produtos',
    addToCartButton: /Adicionar/i,
    registrationSuccess: 'Cadastro realizado com sucesso'
  }
};
