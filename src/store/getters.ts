import { GetterTree } from 'vuex';
import { GETTER } from '@/reference/store';
import { ExportOptions, ExportProgress, NavigationMenuPosition, State, Survey } from '@/types';

const {
	IS_USER_AUTHORIZED,
	NAVIGATION_MENU_POSITION,
	SURVEYS,
	SELECTED_IDS,
	EXPORT_OPTIONS,
	EXPORT_PROGRESS,
	IS_LOADING,
	ERROR_MESSAGE
} = GETTER;

/* eslint-disable arrow-body-style */
const getters: GetterTree<State, State> = {
	[IS_USER_AUTHORIZED]: (state: State): boolean => {
		return state.qualtrics.apiToken !== undefined && state.user !== undefined && state.user.userId !== undefined;
	},
	[NAVIGATION_MENU_POSITION]: (state: State): NavigationMenuPosition => {
		return state.configuration.navigationMenuPosition;
	},
	[SURVEYS]: (state: State): Array<Survey> => {
		return state.surveys;
	},
	[SELECTED_IDS]: (state: State): Array<string> => {
		return state.selectedIds;
	},
	[EXPORT_OPTIONS]: (state: State): ExportOptions => {
		return state.exportOptions;
	},
	[EXPORT_PROGRESS]: (state: State): ExportProgress => {
		return state.exportProgress;
	},
	[IS_LOADING]: (state: State): boolean => {
		return state.current.isLoading;
	},
	[ERROR_MESSAGE]: (state: State): string => {
		return state.current.errorMessage ?? '';
	}
};

export default getters;
