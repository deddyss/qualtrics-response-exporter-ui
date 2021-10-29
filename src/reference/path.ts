export const PATH = {
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

export const ROUTE = {
	HOME: {
		path: PATH.HOME,
		name: 'Home'
	},
	SIGN_IN: {
		path: PATH.SIGNIN.URI,
		name: PATH.SIGNIN.NAME
	},
	SURVEY_LIST: {
		path: PATH.SURVEY.URI + PATH.SURVEY.LIST.URI,
		name: PATH.SURVEY.LIST.NAME
	},
	EXPORT_OPTIONS: {
		path: PATH.SURVEY.URI + PATH.SURVEY.EXPORT.OPTIONS.URI,
		name: PATH.SURVEY.EXPORT.OPTIONS.NAME
	},
	EXPORT_PROGRESS: {
		path: PATH.SURVEY.URI + PATH.SURVEY.EXPORT.PROGRESS.URI,
		name: PATH.SURVEY.EXPORT.PROGRESS.NAME
	}
};
