import { Plugin, Store } from 'vuex';
import { ApiAuthorization, ApiError, Qualtrics, State, User } from '@/types';
import { MUTATION } from '@/reference/store';

interface SignedInParam { user: User, auth: ApiAuthorization }
interface SignInFailedParam { error: ApiError, auth: ApiAuthorization }

const ERROR_MESSAGE_TIMEOUT = 2500;

/* eslint-disable arrow-body-style */
const createElectronApiPlugin = (): Plugin<State> => {
	return (store: Store<State>) => {
		if (window.api === undefined) return;

		window.api.on('signedIn', (param: SignedInParam) => {
			const { user, auth } = param;
			store.commit(MUTATION.SET.USER, user);
			store.commit(MUTATION.SET.QUALTRICS, auth as Qualtrics);
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
