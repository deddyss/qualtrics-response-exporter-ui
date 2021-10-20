const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	// mode: 'jit',
	purge: [
		'./public/**/*.html',
		'./src/**/*.{js,jsx,ts,tsx,vue}'
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			fontFamily: {
				sans: [ 'Inter var', ...defaultTheme.fontFamily.sans ]
			}
		},
	},
	variants: {
		extend: {
			cursor: ['disabled'],
			pointerEvents: ['disabled'],
			opacity: ['disabled'],
			backgroundColor: ['disabled'],
			borderStyle: ['responsive', 'hover'],
			borderWidth: ['responsive', 'hover'],
			// ringColor: ['focus'],
			// ringOffsetColor: ['focus'],
			// ringOffsetWidth: ['focus'],
			// ringOpacity: ['focus'],
			// ringWidth: ['focus']
		},
	},
	plugins: [
		// '@tailwindcss/forms'
		// I use strategy class because default strategy above doesn't work well in this project
		require('@tailwindcss/forms')({
			strategy: 'class',
		})
	],
}
