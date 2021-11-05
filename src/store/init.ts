import { State } from '@/types';

const initialState = Object.freeze({
	settings: {
		rememberMe: false,
		navigationMenuPosition: 'left'
	},
	current: {
		appReady: false,
		keyword: '',
		activeOnly: false,
		sortCriteria: {
			by: 'lastModified',
			order: 'descending'
		},
		isLoading: false,
		showAdvancedOptions: false,
		isExporting: false
	},
	qualtrics: {
		accessible: window.api !== undefined,
		dataCenter: 'syd1'
	},
	surveys: [],
	selectedIds: [],
	exportOptions: {
		format: '',
		compress: false,
		allowContinuation: false,
		formatDecimalAsComma: false,
		breakoutSets: false,
		seenUnansweredRecode: false,
		multiselectSeenUnansweredRecode: false,
		includeDisplayOrder: false,
		useLabels: false,
		timeZone: ''
	},
	exportProgress: {}
} as State);

export default initialState;
