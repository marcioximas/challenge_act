const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://front.serverest.dev',
    env: {
      apiUrl: process.env.CYPRESS_API_URL || 'https://serverest.dev'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
