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
	qualtrics: {
		accessible: window.api !== undefined,
		dataCenter: 'syd1'
	},
	surveys,
	selectedIds: [],
	exportOptions: {
		withContinuation: false,
		format: 'csv',
		compressFile: false
	}
} as State);

export default initialState;
