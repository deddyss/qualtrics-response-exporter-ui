import { Plugin, Store } from 'vuex';
import { Current, Qualtrics, QualtricsAuthorization, ReadyParam, RetrieveSurveysFailedParam, SignedInParam, SignInFailedParam, State, SurveysRetrievedParam } from '@/types';
import { ACTION, MUTATION } from '@/reference/store';

const ERROR_MESSAGE_TIMEOUT = 2500;

/* eslint-disable arrow-body-style */
const createElectronApiPlugin = (): Plugin<State> => {
	return (store: Store<State>) => {
		if (window.api === undefined) return;

		// ready
		// -------------------------------------------------------------------------
		window.api.on('ready', (param: ReadyParam) => {
			const { settings, qualtrics } = param;
			if (qualtrics) {
				store.commit(MUTATION.SET.QUALTRICS, qualtrics);
			}
			store.commit(MUTATION.SET.SETTINGS, settings);
			store.commit(MUTATION.SET.CURRENT, { appReady: true } as Partial<Current>);
		});

		// sign in
		// -------------------------------------------------------------------------
		window.api.on('signedIn', (param: SignedInParam) => {
			const { user, auth } = param;
			store.commit(MUTATION.SET.USER, user);
			store.commit(MUTATION.SET.QUALTRICS, auth as Partial<Qualtrics>);

			const { rememberMe } = store.state.settings;
			if (rememberMe) {
				// save qualtrics authorization to file
				store.dispatch(ACTION.SAVE_QUALTRICS, auth as QualtricsAuthorization);
			}
		});
		window.api.on('signInFailed', (param: SignInFailedParam) => {
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
		window.api.on('surveysRetrieved', (param: SurveysRetrievedParam) => {
			const { surveys } = param;
			store.commit(MUTATION.SET.SURVEYS, surveys);
			store.commit(MUTATION.SET.CURRENT, { isLoading: false } as Partial<Current>);
		});
		window.api.on('retrieveSurveysFailed', (param: RetrieveSurveysFailedParam) => {
			const { error } = param;
			const errorMessage = error.message ?? error.statusText;
			store.commit(MUTATION.SET.CURRENT, { isLoading: false, errorMessage } as Partial<Current>);
		});
	};
};

export default createElectronApiPlugin;
