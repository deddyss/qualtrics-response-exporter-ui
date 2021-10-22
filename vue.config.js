module.exports = {
	pages: {
		index: {
			entry: 'src/main.ts',
			title: 'Qualtrics Response Exporter'
		}
	},
	chainWebpack: (config) => {
		// handle ESM modules
		// https://github.com/vueuse/vueuse/issues/718
		config.module
			.rule('mjs$')
			.test(/\.mjs$/)
			.include
					.add(/node_modules/)
					.end()
			.type('javascript/auto');
	},
	configureWebpack: {
		performance: {
			hints: false
		}
	},
	pluginOptions: {
		electronBuilder: {
			preload: 'src/preload.ts',
			chainWebpackMainProcess: (config) => {
					config.externals([/node_modules/, 'utf-8-validate', 'bufferutil', 'long', 'pino-pretty']);
			},
			builderOptions: {
				appId: 'deddyss.qualtrics.exporter',
				productName: 'Qualtrics Response Exporter',
				win: {
					target: ['portable'],
					icon: 'public/logo.png'
				}
			}
		}
	}
};
