import { MutationTree } from 'vuex';
import { MUTATION } from '@/reference/store';
import { Configuration, Current, ExportOptions, Qualtrics, State, Survey, User } from '@/types';
import initialState from './init';

const { SET, RESET } = MUTATION;

const mutations: MutationTree<State> = {
	[SET.CONFIGURATION]: (state: State, configuration: Partial<Configuration>): void => {
		state.configuration = { ...state.configuration, ...configuration };
	},
	[RESET.CONFIGURATION]: (state: State): void => {
		state.configuration = { ...initialState.configuration };
	},
	[SET.CURRENT]: (state: State, current: Partial<Current>): void => {
		state.current = { ...state.current, ...current };
	},
	[RESET.CURRENT]: (state: State): void => {
		state.current = { ...initialState.current };
	},
	[SET.QUALTRICS]: (state: State, qualtrics: Partial<Qualtrics>): void => {
		state.qualtrics = { ...state.qualtrics, ...qualtrics };
	},
	[RESET.QUALTRICS]: (state: State): void => {
		state.qualtrics = { ...initialState.qualtrics };
	},
	[SET.USER]: (state: State, user: User): void => {
		state.user = user;
	},
	[RESET.USER]: (state: State): void => {
		delete state.user;
	},
	[SET.SURVEYS]: (state: State, surveys: Survey[]): void => {
		state.surveys = surveys;
	},
	[RESET.SURVEYS]: (state: State): void => {
		state.surveys = [...initialState.surveys];
	},
	[SET.SELECTED_IDS]: (state: State, selectedIds: string[]): void => {
		state.selectedIds = selectedIds;
	},
	[RESET.SELECTED_IDS]: (state: State): void => {
		state.selectedIds = [...initialState.selectedIds];
	},
	[SET.EXPORT_OPTIONS]: (state: State, exportOptions: Partial<ExportOptions>): void => {
		state.exportOptions = { ...state.exportOptions, ...exportOptions };
	},
	[RESET.EXPORT_OPTIONS]: (state: State): void => {
		state.exportOptions = { ...initialState.exportOptions };
	}
};

export default mutations;
