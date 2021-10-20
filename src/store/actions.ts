import { ActionContext, ActionTree } from 'vuex';
import { ApiAuthorization, Qualtrics, State } from '@/types';
import { ACTION, MUTATION } from '@/reference/store';

const { SIGN_IN, SIGN_OFF } = ACTION;

/* eslint-disable arrow-body-style */
const actions: ActionTree<State, State> = {
	[SIGN_IN]: (context: ActionContext<State, State>, auth: ApiAuthorization) => {
		return new Promise<void>((resolve, reject) => {
			if (window.api) {
				window.api.signIn(auth);
				resolve();
			}
			else {
				reject();
			}
		});
	},
	[SIGN_OFF]: ({ commit, state }: ActionContext<State, State>) => {
		return new Promise<void>((resolve) => {
			commit(MUTATION.RESET.USER);
			if (!state.configuration.rememberApiToken) {
				commit(MUTATION.SET.QUALTRICS, { apiToken: undefined } as Qualtrics);
			}
			// TODO: make all configurations, preferences and changes persisted
			resolve();
		});
	}
};

export default actions;
