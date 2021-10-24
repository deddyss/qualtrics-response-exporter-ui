import { State } from '@/types';
// TODO: remove dummy surveys once UI development done
import surveys from './dummySurveys';

const initialState = Object.freeze({
	configuration: {
		rememberApiToken: false,
		rememberSurveys: false,
		rememberSelectedIds: false,
		navigationMenuPosition: 'left'
	},
	current: {
		keyword: '',
		activeOnly: false,
		sortCriteria: {
			by: 'lastModified',
			order: 'descending'
		},
		isLoading: false,
		showAdvancedOptions: false
	},
	qualtrics: {
		accessible: window.api !== undefined,
		dataCenter: 'syd1'
	},
	surveys,
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
	}
} as State);

export default initialState;
