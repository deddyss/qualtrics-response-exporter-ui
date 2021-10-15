import { ApiAction } from '@/types';

const SET = {
	CONFIGURATION: 'setConfiguration',
	QUALTRICS: 'setQualtrics',
	USER: 'setUser',
	SURVEYS: 'setSurveys',
	SELECTED_IDS: 'setSelectedIds',
	EXPORT_OPTIONS: 'setExportOptions'
};

const RESET = {
	CONFIGURATION: 'resetConfiguration',
	QUALTRICS: 'resetQualtrics',
	USER: 'resetUser',
	SURVEYS: 'resetSurveys',
	SELECTED_IDS: 'resetSelectedIds',
	EXPORT_OPTIONS: 'resetExportOptions'
};

export const MUTATION = { SET, RESET };

export const ACTION = {
	SIGN_IN: 'signIn' as ApiAction,
	SIGN_OFF: 'signOff'
};

export const GETTER = {
	IS_USER_AUTHORIZED: 'isUserAuthorized'
};
