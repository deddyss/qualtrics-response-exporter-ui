const PATH = {
	HOME: '/',
	SIGNIN: {
		URI: '/signin',
		NAME: 'Sign-in'
	},
	SURVEY: {
		URI: '/survey',
		NAME: 'Survey Dashboard',
		INDEX: {
			URI: '/'
		},
		LIST: {
			URI: '/list',
			NAME: 'Survey List',
			DESCRIPTION: 'Select survey you want to export'
		},
		EXPORT: {
			INDEX: {
				URI: '/'
			},
			OPTIONS: {
				URI: '/export/options',
				NAME: 'Export Options',
				DESCRIPTION: 'Format, compress, continuation, etc'
			},
			PROGRESS: {
				URI: '/export/progress',
				NAME: 'Export Progress',
				DESCRIPTION: 'Monitor progress and remaining items'
			}
		}
	}
};

export default PATH;
