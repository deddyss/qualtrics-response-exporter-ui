import { State } from '@/types';

const initialState = Object.freeze({
	configuration: {
		rememberApiToken: false,
		rememberSurveys: false,
		rememberSelectedIds: false
	},
	qualtrics: {
		accessible: window.api !== undefined,
		dataCenter: 'syd1'
	},
	surveys: [],
	selectedIds: [],
	exportOptions: {
		withContinuation: false,
		format: 'csv',
		compressFile: false
	}
} as State);

export default initialState;
