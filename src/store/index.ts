import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { State } from '@/types';
import initialState from './init';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import createElectronApiPlugin from './plugin';

export default createStore<State>({
	state: { ...initialState },
	getters,
	mutations,
	actions,
	plugins: [
		createPersistedState({ storage: window.sessionStorage }),
		createElectronApiPlugin()
	]
});
