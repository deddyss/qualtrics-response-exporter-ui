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
			NAME: 'Survey List'
		},
		EXPORT: {
			OPTIONS: {
				URI: '/export/options',
				NAME: 'Export Options'
			},
			PROGRESS: {
				URI: '/export/progress',
				NAME: 'Export Progress'
			}
		}
	}
};

export default PATH;
