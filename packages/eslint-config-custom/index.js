module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'turbo',
    'prettier',
  ],
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  parser: '@typescript-eslint/parser',
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['index.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': 'error',
  },
};
