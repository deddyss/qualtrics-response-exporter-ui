import { ApiAction } from '@/types';

const SET = {
	SETTINGS: 'setSettings',
	CURRENT: 'setCurrent',
	QUALTRICS: 'setQualtrics',
	USER: 'setUser',
	SURVEYS: 'setSurveys',
	SELECTED_IDS: 'setSelectedIds',
	EXPORT_OPTIONS: 'setExportOptions',
	EXPORT_PROGRESS: 'setExportProgress'
};

const RESET = {
	SETTINGS: 'resetSettings',
	CURRENT: 'resetCurrent',
	QUALTRICS: 'resetQualtrics',
	USER: 'resetUser',
	SURVEYS: 'resetSurveys',
	SELECTED_IDS: 'resetSelectedIds',
	EXPORT_OPTIONS: 'resetExportOptions',
	EXPORT_PROGRESS: 'resetExportProgress'
};

export const MUTATION = { SET, RESET };

export const ACTION = {
	SIGN_IN: 'signIn' as ApiAction,
	SIGN_OFF: 'signOff',
	START_EXPORT: 'startExport',
	START_OVER: 'startOver'
};

export const GETTER = {
	IS_USER_AUTHORIZED: 'isUserAuthorized',
	NAVIGATION_MENU_POSITION: 'getNavigationMenuPosition',
	SETTINGS: 'getSettings',
	SURVEYS: 'getSurveys',
	SELECTED_IDS: 'getSelectedIds',
	EXPORT_PROGRESS: 'getExportProgress',
	ERROR_MESSAGE: 'getErrorMessage',
	IS_LOADING: 'isLoading',
	IS_EXPORTING: 'isExporting'
};
