import { Plugin, Store } from 'vuex';
import { Current, ExportFailedEventParam, ExportFileProgressEventParam, ExportProgressEventParam, ExportSuccessEventParam, Qualtrics, QualtricsAuthorization, ReadyEventParam, RetrieveSurveysFailedEventParam, SignedInEventParam, SignInFailedEventParam, State, SurveysRetrievedEventParam } from '@/types';
import { ACTION, MUTATION } from '@/reference/store';

const ERROR_MESSAGE_TIMEOUT = 2500;

/* eslint-disable arrow-body-style */
const createElectronApiPlugin = (): Plugin<State> => {
	return (store: Store<State>) => {
		if (window.api === undefined) return;

		// ready
		// -------------------------------------------------------------------------
		window.api.on('ready', (param: ReadyEventParam) => {
			const { settings, qualtrics } = param;
			if (qualtrics) {
				store.commit(MUTATION.SET.QUALTRICS, qualtrics);
			}
			store.commit(MUTATION.SET.SETTINGS, settings);
			store.commit(MUTATION.SET.CURRENT, { appReady: true } as Partial<Current>);
		});

		// sign in
		// -------------------------------------------------------------------------
		window.api.on('signedIn', (param: SignedInEventParam) => {
			const { user, auth } = param;
			store.commit(MUTATION.SET.USER, user);
			store.commit(MUTATION.SET.QUALTRICS, auth as Partial<Qualtrics>);

			const { rememberMe } = store.state.settings;
			if (rememberMe) {
				// save qualtrics authorization to file
				store.dispatch(ACTION.SAVE_QUALTRICS, auth as QualtricsAuthorization);
			}
		});
		window.api.on('signInFailed', (param: SignInFailedEventParam) => {
			const { error, auth } = param;
			const { dataCenter } = auth;
			const errorMessage = error.message ?? error.statusText;
			store.commit(MUTATION.SET.QUALTRICS, { dataCenter, errorMessage } as Qualtrics);
			// remove error message after some delay
			setTimeout(
				() => {
					store.commit(MUTATION.SET.QUALTRICS, { errorMessage: undefined });
				},
				ERROR_MESSAGE_TIMEOUT
			);
		});

		// retrieve surveys
		// -------------------------------------------------------------------------
		window.api.on('surveysRetrieved', (param: SurveysRetrievedEventParam) => {
			const { surveys } = param;
			store.commit(MUTATION.SET.SURVEYS, surveys);
			store.commit(MUTATION.SET.CURRENT, { isLoading: false } as Partial<Current>);
		});
		window.api.on('retrieveSurveysFailed', (param: RetrieveSurveysFailedEventParam) => {
			const { error } = param;
			const errorMessage = error.message ?? error.statusText;
			store.commit(MUTATION.SET.CURRENT, { isLoading: false, errorMessage } as Partial<Current>);
		});

		// export responses
		// -------------------------------------------------------------------------
		window.api.on('exportProgress', (param: ExportProgressEventParam) => {
			const { surveyId, status, percentComplete } = param;
			const exportProgress = { ...store.state.exportProgress };
			const detail = exportProgress[surveyId];
			if (detail) {
				detail.exportStatus = status;
				detail.exportProgress = percentComplete;
				store.commit(MUTATION.SET.EXPORT_PROGRESS, exportProgress);
			}
		});
		window.api.on('exportFileProgress', (param: ExportFileProgressEventParam) => {
			const { surveyId, percentComplete } = param;
			const exportProgress = { ...store.state.exportProgress };
			const detail = exportProgress[surveyId];
			if (detail) {
				if (detail.exportStatus !== 'complete') {
					detail.exportStatus = 'complete';
					detail.exportProgress = 100;
				}
				detail.downloadProgress = percentComplete;
				store.commit(MUTATION.SET.EXPORT_PROGRESS, exportProgress);
			}
		});
		window.api.on('exportSuccess', (param: ExportSuccessEventParam) => {
			const { surveyId } = param;
			const exportProgress = { ...store.state.exportProgress };
			const detail = exportProgress[surveyId];
			if (detail) {
				if (detail.exportStatus !== 'complete' || detail.downloadProgress !== 100) {
					detail.exportStatus = 'complete';
					detail.exportProgress = 100;
					detail.downloadProgress = 100;
					detail.downloadedTime = Date.now();
					store.commit(MUTATION.SET.EXPORT_PROGRESS, exportProgress);
				}
			}
		});
		window.api.on('exportFailed', (param: ExportFailedEventParam) => {
			const { surveyId, errorMessage } = param;
			const exportProgress = { ...store.state.exportProgress };
			const detail = exportProgress[surveyId];
			if (detail) {
				if (detail.exportStatus !== 'failed') {
					detail.exportStatus = 'failed';
					store.commit(MUTATION.SET.EXPORT_PROGRESS, exportProgress);
				}
				store.commit(MUTATION.SET.CURRENT, { errorMessage } as Partial<Current>);
			}
		});
		window.api.on('responsesExported', () => {
			store.commit(MUTATION.SET.CURRENT, { isExporting: false } as Partial<Current>);
		});
	};
};

export default createElectronApiPlugin;
