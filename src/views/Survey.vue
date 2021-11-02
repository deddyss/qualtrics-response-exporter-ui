<template>
	<div>
		<NavigationBar
			:menuItems='menuItems'
			:menuPosition='menuPosition'
			:currentPath='$route.path'
			:disabled='menuDisabled'
			@click='menuClicked'
			@profile='profileShown = true'
			@signout='signOut'
			class='sticky top-0 z-10'
		/>

		<UserProfile
			:user='user'
			v-model:shown='profileShown'
			@signout='signOut'
			class='z-10'
		/>

		<div class='py-6'>
			<header class='hidden lg:block'>
				<div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h1 class='text-3xl font-bold leading-tight text-gray-900'>
						{{ $route.name }}
					</h1>
				</div>
			</header>
			<main class='max-w-7xl mx-auto px-6 py-4 lg:px-8'>
				<router-view v-slot='{ Component }'>
					<transition name='fade' mode='out-in'>
						<component :is='Component' />
					</transition>
				</router-view>
			</main>
		</div>

		<Notification :message='errorMessage' @close="notificationClosed" />
	</div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { mapGetters, useStore } from 'vuex';
import NavigationBar from '@/components/NavigationBar.vue';
import UserProfile from '@/components/UserProfile.vue';
import Notification from '@/components/Notification.vue';
import { PATH, ROUTE } from '@/reference/path';
import { Current, NavigationMenuItem, State, User } from '@/types';
import { ACTION, GETTER, MUTATION } from '@/reference/store';

const { SURVEY } = PATH;
const { EXPORT } = SURVEY;

const menuItems: NavigationMenuItem[] = [
	{ ...ROUTE.SURVEY_LIST, description: SURVEY.LIST.DESCRIPTION },
	{ ...ROUTE.EXPORT_OPTIONS, description: EXPORT.OPTIONS.DESCRIPTION },
	{ ...ROUTE.EXPORT_PROGRESS, description: EXPORT.PROGRESS.DESCRIPTION }
];

export default defineComponent({
	components: {
		NavigationBar,
		UserProfile,
		Notification
	},
	setup() {
		const route = useRoute();
		const store = useStore<State>();

		const routePath = ref<string>(route.path);
		const profileShown = ref<boolean>(false);
		const user = ref<User>(store.state.user as User);
		return {
			menuItems,
			routePath,
			profileShown,
			user
		};
	},
	computed: {
		...mapGetters({
			isUserAuthorized: GETTER.IS_USER_AUTHORIZED,
			menuPosition: GETTER.NAVIGATION_MENU_POSITION,
			selectedIds: GETTER.SELECTED_IDS,
			surveys: GETTER.SURVEYS,
			errorMessage: GETTER.ERROR_MESSAGE,
			isExporting: GETTER.IS_EXPORTING
		}),
		menuDisabled(): boolean | number[] {
			const currentlyExporting = this.isExporting as boolean;
			const noSurveySelected = (this.selectedIds as string[]).length === 0;

			if (currentlyExporting) {
				// disable first and second menu
				return [0, 1];
			}
			if (noSurveySelected) {
				// disable second and third menu
				return [1, 2];
			}
			// disable third menu
			return [2];
		}
	},
	watch: {
		isUserAuthorized(authorized: boolean) {
			if (!authorized) {
				this.$router.push({ path: PATH.SIGNIN.URI });
			}
		}
	},
	mounted() {
		// handle browser back / forward button click event
		window.onpopstate = (event: PopStateEvent) => {
			const current: string = (event.state && event.state.current) ?? '';
			if (current.startsWith(PATH.SURVEY.URI)) {
				this.routePath = current;
			}
		};

		// TODO: remove lines below
		// this.$nextTick(() => {
		// 	setTimeout(() => {
		// 		this.$store.commit(MUTATION.SET.CURRENT, { errorMessage: 'The data is combined into a compressed ZIP file in order to reduce the overall file size.' } as Partial<Current>);
		// 	}, 3_000);
		// 	setTimeout(() => {
		// 		this.$store.commit(MUTATION.SET.CURRENT, { errorMessage: 'Exporting without compression is only recommended for small exports. Large exports may encounter issues when downloading the large files' } as Partial<Current>);
		// 	}, 6_000);
		// 	setTimeout(() => {
		// 		this.$store.commit(MUTATION.SET.CURRENT, { errorMessage: 'Continuation gives you the ability to export new responses since the last export (done with continuation).' } as Partial<Current>);
		// 	}, 40_000);
		// });
	},
	methods: {
		menuClicked(menuItem: NavigationMenuItem): void {
			const { path, name } = menuItem;
			this.$router.push({ path, name });
			this.routePath = path;
		},
		notificationClosed(): void {
			this.$store.commit(MUTATION.SET.CURRENT, { errorMessage: undefined } as Partial<Current>);
		},
		signOut(): void {
			this.$store.dispatch(ACTION.SIGN_OFF);
		}
	}
});
</script>
