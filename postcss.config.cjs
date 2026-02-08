module.exports = {
	plugins: [
		require('@csstools/postcss-oklab-function')({
			preserve: true,
			enableProgressiveCustomProperties: true,
			subFeatures: {
				displayP3: true,
			},
		}),
		require('@csstools/postcss-design-tokens')({}),
		// require("cssnano")({
		// 	preset: [ 'default', {
		// 		svgo: false,
		// 		discardComments: {
		// 			removeAll: true,
		// 		},
		// 	},
		//  ],
		// })
	],
}
