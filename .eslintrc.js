const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
	root: true,
	env: {
		node: true,
		es2020: true,
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier', 'import', 'jest'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',

		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',

		'plugin:prettier/recommended',
	],
	rules: {
		'import/order': [
			WARN, // Switch to ERROR once import issues get resolved.
			{
				groups: ['builtin', 'external', 'internal', 'unknown'],
				'newlines-between': 'always',
			},
		],

		camelcase: ERROR,
		'no-prototype-builtins': WARN,

		'@typescript-eslint/ban-ts-comment': WARN,
		'@typescript-eslint/no-unused-vars': [
			ERROR,
			{ args: 'after-used', argsIgnorePattern: '^_' },
		],
		'@typescript-eslint/no-empty-function': ERROR,
	},
};
