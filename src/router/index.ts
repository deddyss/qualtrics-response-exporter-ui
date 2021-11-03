import { nextTick } from 'vue';
import { createRouter, createWebHashHistory, RouteMeta, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Settings from '@/views/Settings.vue';
import SignIn from '@/views/SignIn.vue';
import Survey from '@/views/Survey.vue';
import SurveyList from '@/views/survey/SurveyList.vue';
import ExportOptions from '@/views/export/ExportOptions.vue';
import ExportProgress from '@/views/export/ExportProgress.vue';
import NotFound from '@/views/NotFound.vue';
import { PATH, ROUTE } from '@/reference/path';
import { GETTER } from '@/reference/store';
import store from '@/store';

const requiresAuthMeta: RouteMeta = { requiresAuth: true };

const appTitle: string = document.title;

const routes: Array<RouteRecordRaw> = [
	{
		...ROUTE.HOME,
		component: Home
	},
	{
		...ROUTE.SETTINGS,
		component: Settings
	},
	{
		...ROUTE.SIGN_IN,
		component: SignIn
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		// component: () => import(/* webpackChunkName: "about" */ '@/views/SignIn.vue')
	},
	{
		path: PATH.SURVEY.URI,
		component: Survey,
		meta: requiresAuthMeta,
		children: [
			{
				path: PATH.SURVEY.URI + PATH.SURVEY.INDEX.URI,
				redirect: PATH.SURVEY.URI + PATH.SURVEY.LIST.URI
			},
			{
				...ROUTE.SURVEY_LIST,
				component: SurveyList,
				meta: requiresAuthMeta
			},
			{
				path: PATH.SURVEY.URI + PATH.SURVEY.EXPORT.INDEX.URI,
				redirect: PATH.SURVEY.URI + PATH.SURVEY.EXPORT.OPTIONS.URI
			},
			{
				...ROUTE.EXPORT_OPTIONS,
				component: ExportOptions,
				meta: requiresAuthMeta
			},
			{
				...ROUTE.EXPORT_PROGRESS,
				component: ExportProgress,
				meta: requiresAuthMeta
			}
		]
	},
	{
		path: '/:catchAll(.*)',
		name: 'Page Not Found',
		component: NotFound
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

// handle authorization checking
router.beforeEach((to, from, next) => {
	if (to.matched.some((route) => route.meta.requiresAuth)) {
		const isUserAuthorized: boolean = store.getters[GETTER.IS_USER_AUTHORIZED];
		if (!isUserAuthorized) {
			next(ROUTE.SIGN_IN);
			return;
		}
	}

	// go back to export-options page if export format is unset yet
	if (to.path === ROUTE.EXPORT_PROGRESS.path && store.state.exportOptions.format === '') {
		next(ROUTE.EXPORT_OPTIONS);
		return;
	}

	// go back to survey-list page if there is no selected IDs
	if (to.path === ROUTE.EXPORT_OPTIONS.path && store.state.selectedIds.length === 0) {
		next(ROUTE.SURVEY_LIST);
		return;
	}
	next();
});

// handle page title
router.afterEach((to) => {
	nextTick(() => {
		document.title = to.name ? `${to.name.toString()} | ${appTitle}` : appTitle;
	});
});

if (window.api !== undefined) {
	// listening for menu click event
	window.api.on('settingsMenuClicked', () => {
		router.push(ROUTE.SETTINGS);
	});
}

export default router;
