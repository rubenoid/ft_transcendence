module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
	  project: 'tsconfig.json',
	  sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin', 'react'],
	extends: [
	  'plugin:@typescript-eslint/recommended',
	  'plugin:prettier/recommended',
	  "plugin:react/recommended",
	  'plugin:react/jsx-runtime',
	],
	root: true,
	env: {
	  node: true,
	  jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		"camelcase": "error",
		"@typescript-eslint/no-unused-vars": "off",
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'react/jsx-uses-react': 'error',
		'react/jsx-uses-vars': 'error',
		'react/button-has-type' : 'error'
	},
	settings: {
		react: {
			pragma: "React",
			version: "detect",
		}
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		}
	}
  };
  