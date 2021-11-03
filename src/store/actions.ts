import { ActionContext, ActionTree } from 'vuex';
import { ApiAuthorization, Current, ExportProgress, Qualtrics, Settings, State, Survey } from '@/types';
import { ACTION, MUTATION } from '@/reference/store';

const { SAVE_SETTINGS, SAVE_QUALTRICS, SIGN_IN, SIGN_OFF, START_EXPORT, START_OVER } = ACTION;
const API_NOT_ACCESSIBLE_ERROR = new Error('API cannot be accessed');

/* eslint-disable arrow-body-style */
const actions: ActionTree<State, State> = {
	[SAVE_SETTINGS]: ({ commit }: ActionContext<State, State>, settings: Settings) => {
		return new Promise<void>((resolve, reject) => {
			commit(MUTATION.SET.SETTINGS, settings);
			if (window.api) {
				window.api.saveSettings(settings);
				resolve();
			}
			else {
				reject(API_NOT_ACCESSIBLE_ERROR);
			}
		});
	},
	[SAVE_QUALTRICS]: ({ state }: ActionContext<State, State>) => {
		return new Promise<void>((resolve, reject) => {
			if (window.api) {
				const { dataCenter, apiToken } = state.qualtrics;
				window.api.saveQualtrics({ dataCenter, apiToken });
				resolve();
			}
			else {
				reject(API_NOT_ACCESSIBLE_ERROR);
			}
		});
	},
	[SIGN_IN]: (context: ActionContext<State, State>, auth: ApiAuthorization) => {
		return new Promise<void>((resolve, reject) => {
			if (window.api) {
				window.api.signIn(auth);
				resolve();
			}
			else {
				reject(API_NOT_ACCESSIBLE_ERROR);
			}
		});
	},
	[SIGN_OFF]: ({ commit, state }: ActionContext<State, State>) => {
		return new Promise<void>((resolve) => {
			commit(MUTATION.RESET.USER);
			if (!state.settings.rememberMe) {
				commit(MUTATION.SET.QUALTRICS, { apiToken: undefined } as Qualtrics);
			}
			// TODO: make all configurations, preferences and changes persisted
			resolve();
		});
	},
	[START_EXPORT]: ({ commit, state }: ActionContext<State, State>) => {
		const composeExportProgressState = (): ExportProgress => {
			const { surveys, selectedIds } = state;
			const getSurveyName = (id: string) => {
				const survey: Survey | undefined = surveys.find((item) => item.id === id);
				return survey?.name ?? '';
			};

			const exportProgress: ExportProgress = {};
			selectedIds.forEach((id) => {
				const name = getSurveyName(id);
				exportProgress[id] = { id, name };
			});
			console.log(exportProgress);
			return exportProgress;
		};

		return new Promise<void>((resolve) => {
			// eslint-disable-next-line
			const exportProgress = composeExportProgressState();
			// TODO: update export progress
			// commit(MUTATION.SET.EXPORT_PROGRESS, exportProgress);
			commit(MUTATION.SET.CURRENT, { isExporting: true } as Partial<Current>);
			// TODO: call API
			resolve();
		});
	},
	[START_OVER]: ({ commit }: ActionContext<State, State>) => {
		return new Promise<void>((resolve) => {
			commit(MUTATION.RESET.CURRENT);
			commit(MUTATION.RESET.SELECTED_IDS);
			commit(MUTATION.RESET.EXPORT_OPTIONS);
			// TODO: reset export progress
			// commit(MUTATION.RESET.EXPORT_PROGRESS);
			// TODO: do we need to reset selected ID's and export options, or updated it with persisted configuration
			resolve();
		});
	}
};

export default actions;
