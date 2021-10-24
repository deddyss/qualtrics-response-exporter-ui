<template>
	<div>
		<NavigationBar
			:menuItems="menuItems"
			:menuPosition="menuPosition"
			:currentPath="$route.path"
			:disabled="menuDisabled"
			@click="menuClicked"
			@profile="profileShown = true"
			@signout="signOut"
			class="sticky top-0 z-10"
		/>

		<UserProfile
			:user="user"
			v-model:shown="profileShown"
			@signout="signOut"
			class="z-10"
		/>

		<div class="py-6">
			<header class="hidden lg:block">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 class="text-3xl font-bold leading-tight text-gray-900">
						{{ $route.name }}
					</h1>
				</div>
			</header>
			<main class="max-w-7xl mx-auto px-6 py-4 lg:px-8">
				<router-view v-slot='{ Component }'>
					<transition name='fade' mode='out-in'>
						<component :is='Component' />
					</transition>
				</router-view>
			</main>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { mapGetters, useStore } from 'vuex';
import NavigationBar from '@/components/NavigationBar.vue';
import UserProfile from '@/components/UserProfile.vue';
import PATH from '@/reference/path';
import { NavigationMenuItem, State, User } from '@/types';
import { ACTION, GETTER } from '@/reference/store';

const { SURVEY } = PATH;
const { EXPORT } = SURVEY;

const menuItems: NavigationMenuItem[] = [
	{ path: SURVEY.URI + SURVEY.LIST.URI, name: SURVEY.LIST.NAME, description: SURVEY.LIST.DESCRIPTION },
	{ path: SURVEY.URI + EXPORT.OPTIONS.URI, name: EXPORT.OPTIONS.NAME, description: EXPORT.OPTIONS.DESCRIPTION },
	{ path: SURVEY.URI + EXPORT.PROGRESS.URI, name: EXPORT.PROGRESS.NAME, description: EXPORT.PROGRESS.DESCRIPTION }
];

export default defineComponent({
	components: {
		NavigationBar,
		UserProfile
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
			surveys: GETTER.SURVEYS
		}),
		menuDisabled(): boolean | number[] {
			const noSurveySelected = (this.selectedIds as string[]).length === 0;
			if (noSurveySelected) {
				// disable second and third menu
				return [1, 2];
			}
			return false;
		}
	},
	watch: {
		isUserAuthorized(authorized: boolean) {
			console.log('isUserAuthorized', authorized);
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
	},
	methods: {
		menuClicked(menuItem: NavigationMenuItem): void {
			const { path, name } = menuItem;
			this.$router.push({ path, name });
			this.routePath = path;
		},
		signOut(): void {
			console.log('signOut');
			this.$store.dispatch(ACTION.SIGN_OFF);
		}
	}
});
</script>
