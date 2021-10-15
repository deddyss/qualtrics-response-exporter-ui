import { createApp } from 'vue';
import { Store } from 'vuex';
import App from './App.vue';
import router from './router';
import store from './store';
import { State } from './types';

import '@/assets/style.css';

const app = createApp(App);
app.directive('focus', {
	mounted(el: HTMLElement) {
		el.focus();
	}
});

app.use(store);
app.config.globalProperties.$store = store;
declare module '@vue/runtime-core' {
	// provide typings for `this.$store`
	interface ComponentCustomProperties {
		$store: Store<State>;
	}
}

app.use(router);
app.mount('#app');
