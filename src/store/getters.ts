import { GetterTree } from 'vuex';
import { GETTER } from '@/reference/store';
import { ExportProgress, NavigationMenuPosition, Settings, State, Survey } from '@/types';

const {
	IS_APP_READY,
	IS_USER_AUTHORIZED,
	NAVIGATION_MENU_POSITION,
	SETTINGS,
	SURVEYS,
	SELECTED_IDS,
	EXPORT_PROGRESS,
	ERROR_MESSAGE,
	IS_LOADING,
	IS_EXPORTING
} = GETTER;

/* eslint-disable arrow-body-style */
const getters: GetterTree<State, State> = {
	[IS_APP_READY]: (state: State): boolean => {
		return state.current.appReady;
	},
	[IS_USER_AUTHORIZED]: (state: State): boolean => {
		return state.qualtrics.apiToken !== undefined && state.user !== undefined && state.user.userId !== undefined;
	},
	[NAVIGATION_MENU_POSITION]: (state: State): NavigationMenuPosition => {
		return state.settings.navigationMenuPosition;
	},
	[SETTINGS]: (state: State): Settings => {
		return state.settings;
	},
	[SURVEYS]: (state: State): Array<Survey> => {
		return state.surveys;
	},
	[SELECTED_IDS]: (state: State): Array<string> => {
		return state.selectedIds;
	},
	[EXPORT_PROGRESS]: (state: State): ExportProgress => {
		return state.exportProgress;
	},
	[ERROR_MESSAGE]: (state: State): string => {
		return state.current.errorMessage ?? '';
	},
	[IS_LOADING]: (state: State): boolean => {
		return state.current.isLoading;
	},
	[IS_EXPORTING]: (state: State): boolean => {
		return state.current.isExporting;
	}
};

export default getters;
