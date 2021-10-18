module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/vue3-essential',
		'@vue/airbnb',
		'@vue/typescript/recommended',
	],
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		// custom: bracestyle
		'brace-style': ['error', 'stroustrup'],
		// custom: semicolon
		semi: ['error', 'always'],
		// custom: indent
		indent: ['error', 'tab'],
		// custom: disable no-tabs
		'no-tabs': 0,
		// custom: comma dangle
		'comma-dangle': ['error', 'never'],
		// custom: linebreak
		'linebreak-style': 0,
		// custom: no underscore dangle
		'no-underscore-dangle': ['error', {
			allowAfterThis: true
		}],
		// custom: prefer template
		'prefer-template': 0,
		// custom: lines between class members
		'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
		// custom: object curly newline
		'object-curly-newline': 0,
		// custom: no-nested-ternary
		'no-nested-ternary': 0,
		// custom: no-underscore-dangle
		'no-underscore-dangle': 0,
		// custom: no-unused-expressions
		'no-unused-expressions': ['error', { allowShortCircuit: true }],
		// custom: max-len
		"max-len": 0,
		// custom: import no-unresolved
		'import/no-unresolved': 0,
		// custom: import no-extraneous-dependencies
		'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)',
			],
			env: {
				jest: true,
			},
		},
	],
	globals: {
		__static: "readonly"
	}
};
