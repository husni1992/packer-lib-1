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
			ERROR,
			{
				groups: ['builtin', 'external', 'internal', 'unknown'],
				'newlines-between': 'always',
			},
		],
		'sort-imports': [
			'error',
			{
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
				allowSeparatedGroups: true,
			},
		],
		camelcase: [ERROR],
		'@typescript-eslint/ban-ts-comment': WARN,
		'@typescript-eslint/no-unused-vars': [
			ERROR,
			{ args: 'after-used', argsIgnorePattern: '^_' },
		],
		'@typescript-eslint/no-empty-function': ERROR,
		'no-console': [ERROR, { allow: ['warn', 'error'] }],
		'@typescript-eslint/explicit-function-return-type': WARN
	},
};
