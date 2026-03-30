# challenge_act

## Guideline de Fixtures e Nomenclatura

Para manter os testes legiveis e faceis de manter, use este padrao:

1. Separe fixtures por dominio
- cypress/fixtures/product-templates.json: templates de payload de produtos.
- cypress/fixtures/api-messages.json: mensagens esperadas de resposta da API.
- cypress/fixtures/user-template.json: base para criacao de usuarios.

2. Evite dados fixos hardcoded nos specs
- Nao repetir strings de mensagem e payload inline dentro dos testes.
- Carregue dados via cy.fixture(...).

3. Padrao de nomes internos nos arquivos de teste
- productTemplates para dados de cypress/fixtures/product-templates.json.
- apiMessages para dados de cypress/fixtures/api-messages.json.

4. O que nao vai para fixture
- Estado de execucao do teste (ex.: createdUserIds, token, ids gerados em runtime).
- Valores dinamicos por execucao (ex.: prefixo + Date.now()).

### Exemplo rapido

```js
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
```
