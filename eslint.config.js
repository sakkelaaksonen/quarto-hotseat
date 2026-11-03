import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['quarto-ui.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['quarto-engine.js', 'piece.js', 'tests/**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
