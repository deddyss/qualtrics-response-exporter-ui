import { Plugin, Store } from 'vuex';
import { Current, Qualtrics, ReadyParam, SignedInParam, SignInFailedParam, State } from '@/types';
import { ACTION, MUTATION } from '@/reference/store';

const ERROR_MESSAGE_TIMEOUT = 2500;

/* eslint-disable arrow-body-style */
const createElectronApiPlugin = (): Plugin<State> => {
	return (store: Store<State>) => {
		if (window.api === undefined) return;

		window.api.on('ready', (param: ReadyParam) => {
			const { settings, qualtrics } = param;
			if (qualtrics) {
				store.commit(MUTATION.SET.QUALTRICS, qualtrics);
			}
			store.commit(MUTATION.SET.SETTINGS, settings);
			store.commit(MUTATION.SET.CURRENT, { appReady: true } as Partial<Current>);
		});

		window.api.on('signedIn', (param: SignedInParam) => {
			const { user, auth } = param;
			store.commit(MUTATION.SET.USER, user);
			store.commit(MUTATION.SET.QUALTRICS, auth as Qualtrics);

			const { rememberMe } = store.state.settings;
			if (rememberMe) {
				// save qualtrics configuration
				store.dispatch(ACTION.SAVE_QUALTRICS);
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
	};
};

export default createElectronApiPlugin;
