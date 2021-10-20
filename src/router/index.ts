import { nextTick } from 'vue';
import { createRouter, createWebHashHistory, RouteMeta, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import SignIn from '@/views/SignIn.vue';
import Survey from '@/views/Survey.vue';
import SurveyList from '@/views/survey/SurveyList.vue';
import ExportOptions from '@/views/export/ExportOptions.vue';
import ExportProgress from '@/views/export/ExportProgress.vue';
import NotFound from '@/views/NotFound.vue';
import PATH from '@/reference/path';
import { GETTER } from '@/reference/store';
import store from '@/store';

// TODO: requiresAuth: true
const requiresAuthMeta: RouteMeta = { requiresAuth: false };

const appTitle: string = document.title;

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: PATH.SIGNIN.URI,
		name: PATH.SIGNIN.NAME,
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
				name: PATH.SURVEY.NAME,
				redirect: PATH.SURVEY.URI + PATH.SURVEY.LIST.URI
			},
			{
				path: PATH.SURVEY.URI + PATH.SURVEY.LIST.URI,
				name: PATH.SURVEY.LIST.NAME,
				component: SurveyList,
				meta: requiresAuthMeta
			},
			{
				path: PATH.SURVEY.URI + PATH.SURVEY.EXPORT.OPTIONS.URI,
				name: PATH.SURVEY.EXPORT.OPTIONS.NAME,
				component: ExportOptions,
				meta: requiresAuthMeta
			},
			{
				path: PATH.SURVEY.URI + PATH.SURVEY.EXPORT.PROGRESS.URI,
				name: PATH.SURVEY.EXPORT.PROGRESS.NAME,
				component: ExportProgress,
				meta: requiresAuthMeta
			}
		]
	},
	{
		path: '/:catchAll(.*)',
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
			next({ path: PATH.SIGNIN.URI, name: PATH.SIGNIN.NAME });
			return;
		}
	}
	next();
});

// handle page title
router.afterEach((to) => {
	nextTick(() => {
		document.title = to.name ? `${to.name.toString()} | ${appTitle}` : appTitle;
	});
});

export default router;
