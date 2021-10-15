import { GetterTree } from 'vuex';
import { GETTER } from '@/reference/store';
import { State } from '@/types';

const { IS_USER_AUTHORIZED } = GETTER;

/* eslint-disable arrow-body-style */
const getters: GetterTree<State, State> = {
	[IS_USER_AUTHORIZED]: (state: State): boolean => {
		return state.qualtrics.apiToken !== undefined && state.user !== undefined && state.user.userId !== undefined;
	}
};

export default getters;
