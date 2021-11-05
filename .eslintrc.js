module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/vue3-essential',
		'@vue/airbnb',
		'@vue/typescript/recommended'
	],
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'brace-style': ['error', 'stroustrup'],
		semi: ['error', 'always'],
		indent: ['error', 'tab'],
		'no-tabs': 0,
		'comma-dangle': ['error', 'never'],
		'linebreak-style': 0,
		'prefer-template': 0,
		'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
		'object-curly-newline': 0,
		'no-nested-ternary': 0,
		'no-underscore-dangle': 0,
		'no-unused-expressions': ['error', { allowShortCircuit: true }],
		'max-len': 0,
		'import/no-unresolved': 0,
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
		'no-await-in-loop': 0,
		'no-cond-assign': 0,
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/no-explicit-any': 0
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)'
			],
			env: {
				jest: true
			}
		}
	],
	globals: {
		__static: 'readonly'
	}
};
