/** @type {import('eslint').Linter.Config} */
module.exports = [
    // The base ESLint config (equivalent to eslint:recommended)
    {
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: "module",
        },
        globals: {
          browser: "readonly",
          node: "readonly",
          jest: "readonly",
        },
      },
      rules: {
        "no-console": "warn",
        "no-unused-vars": "warn",
        "prettier/prettier": ["error", { endOfLine: "auto" }],
      },
    },
    // Prettier plugin and rules configuration
    {
      plugins: {
        prettier: require("eslint-plugin-prettier"),
      },
      rules: {
        "prettier/prettier": "error",
      },
    },
    // Additional configurations like 'eslint-config-prettier' could be added here directly
    {
      rules: {
        "prettier/prettier": "error",
      },
    },
  ];