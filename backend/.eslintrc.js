module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin',
    "unused-imports", "@typescript-eslint"],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "unused-imports/no-unused-imports": "error",
    "camelcase": "error",
    "@typescript-eslint/no-unused-vars": "off",
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': "off",
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
  },
  overrides: [{
	"files": ["*.ts", "*.tsx"],
	"rules": {
		"@typescript-eslint/explicit-function-return-type": ["error", {"allowExpressions": true}]
	}
  }],
};