import { GetterTree } from 'vuex';
import { GETTER } from '@/reference/store';
import { ExportOptions, NavigationMenuPosition, State, Survey } from '@/types';

const {
	IS_USER_AUTHORIZED,
	NAVIGATION_MENU_POSITION,
	SURVEYS,
	SELECTED_IDS,
	EXPORT_OPTIONS,
	IS_LOADING
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
	[IS_LOADING]: (state: State): boolean => {
		return state.current.isLoading;
	}
};

export default getters;
