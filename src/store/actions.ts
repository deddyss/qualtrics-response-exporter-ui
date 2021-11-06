import { toRaw } from 'vue';
import { ActionContext, ActionTree } from 'vuex';
import { ApiAuthorization, Current, ExportProgress, Qualtrics, QualtricsAuthorization, Settings, State, Survey } from '@/types';
import { ACTION, MUTATION } from '@/reference/store';
// import surveys from './dummy/surveys';

const { SAVE_SETTINGS, SAVE_QUALTRICS, SELECT_DIRECTORY, OPEN_DIRECTORY, SIGN_IN, SIGN_OFF, RETRIEVE_SURVEYS, EXPORT_RESPONSES, START_OVER } = ACTION;
const API_NOT_ACCESSIBLE_ERROR = new Error('API cannot be accessed');

/* eslint-disable arrow-body-style */
const actions: ActionTree<State, State> = {
	[SAVE_SETTINGS]: ({ commit }: ActionContext<State, State>, settings: Settings) => {
		return new Promise<void>((resolve, reject) => {
			if (window.api) {
				commit(MUTATION.SET.SETTINGS, settings);
				window.api.saveSettings({ settings: toRaw(settings) });
				resolve();
			}
			else {
				reject(API_NOT_ACCESSIBLE_ERROR);
			}
		});
	},
	[SAVE_QUALTRICS]: (context: ActionContext<State, State>, auth: QualtricsAuthorization) => {
		return new Promise<void>((resolve, reject) => {
			if (window.api) {
				window.api.saveQualtrics({ auth });
				resolve();
			}
			else {
				reject(API_NOT_ACCESSIBLE_ERROR);
			}
		});
	},
	[SELECT_DIRECTORY]: ({ state }: ActionContext<State, State>) => {
		return new Promise<string>((resolve, reject) => {
			if (window.api) {
				const { exportDirectory: path } = state.settings;
				window.api.selectDirectory({ path }).then(resolve);
			}
			else {
				reject(API_NOT_ACCESSIBLE_ERROR);
			}
		});
	},
	[OPEN_DIRECTORY]: ({ state }: ActionContext<State, State>) => {
		return new Promise<void>((resolve, reject) => {
			if (window.api) {
				const { exportDirectory: path } = state.current;
				window.api.openDirectory({ path });
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
				window.api.signIn({ auth });
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
			commit(MUTATION.RESET.CURRENT);
			commit(MUTATION.RESET.SURVEYS);
			commit(MUTATION.RESET.SELECTED_IDS);
			commit(MUTATION.RESET.EXPORT_OPTIONS);
			resolve();
		});
	},
	[RETRIEVE_SURVEYS]: ({ commit, state }: ActionContext<State, State>) => {
		return new Promise<void>((resolve, reject) => {
			if (window.api) {
				commit(MUTATION.SET.CURRENT, { isLoading: true } as Partial<Current>);

				const { dataCenter, apiToken } = state.qualtrics;
				const auth = { dataCenter, apiToken } as ApiAuthorization;
				window.api.retrieveSurveys({ auth });
				resolve();
			}
			else {
				reject(API_NOT_ACCESSIBLE_ERROR);
			}
		});
	},
	[EXPORT_RESPONSES]: ({ commit, state }: ActionContext<State, State>) => {
		const { surveys, selectedIds, exportOptions, settings, qualtrics } = state;
		const composeExportProgressState = (): ExportProgress => {
			const getSurveyName = (id: string) => {
				const survey: Survey | undefined = surveys.find((item) => item.id === id);
				return survey?.name ?? '';
			};

			const exportProgress: ExportProgress = {};
			selectedIds.forEach((id) => {
				const name = getSurveyName(id);
				exportProgress[id] = { id, name };
			});
			return exportProgress;
		};

		return new Promise<void>((resolve, reject) => {
			if (window.api) {
				const { exportDirectory } = settings;
				const { dataCenter, apiToken } = qualtrics;
				const auth = { dataCenter, apiToken } as ApiAuthorization;
				const exportProgress = composeExportProgressState();

				commit(MUTATION.RESET.EXPORT_PROGRESS);
				commit(MUTATION.SET.EXPORT_PROGRESS, exportProgress);
				commit(MUTATION.SET.CURRENT, { isExporting: true } as Partial<Current>);

				window.api.exportResponses({
					auth,
					selectedIds: toRaw(selectedIds),
					surveys: toRaw(surveys),
					exportOptions: toRaw(exportOptions),
					exportDirectory
				});
				resolve();
			}
			else {
				reject(API_NOT_ACCESSIBLE_ERROR);
			}
		});
	},
	[START_OVER]: ({ commit }: ActionContext<State, State>) => {
		return new Promise<void>((resolve) => {
			commit(MUTATION.RESET.CURRENT);
			commit(MUTATION.RESET.SELECTED_IDS);
			commit(MUTATION.RESET.EXPORT_OPTIONS);
			commit(MUTATION.RESET.EXPORT_PROGRESS);
			resolve();
		});
	}
};

export default actions;
