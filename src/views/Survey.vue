<template>
	<div>
		<navigation-bar
			:menu-items="menuItems"
			:current-path="currentPath"
			:disabled="menuDisabled"
			@click="menuClicked"
			@profile="profileShown = true"
			class="sticky top-0 z-10"
		/>
		<user-profile :user="user" v-model:shown="profileShown" class="z-10"/>
		<main class="relative">
			Survey
			<router-view v-slot='{ Component }'>
				<transition name='fade' mode='out-in'>
					<component :is='Component' />
				</transition>
			</router-view>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import NavigationBar from '@/components/NavigationBar.vue';
import UserProfile from '@/components/UserProfile.vue';
import PATH from '@/reference/path';
import { NavigationMenuItem, State, User } from '@/types';

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

		const currentPath = ref<string>(route.path);
		const menuDisabled = ref<boolean>(false);
		const profileShown = ref<boolean>(false);
		const user = ref<User>(store.state.user as User);
		return {
			menuItems,
			menuDisabled,
			currentPath,
			profileShown,
			user
		};
	},
	methods: {
		menuClicked(menuItem: NavigationMenuItem) {
			const { path, name } = menuItem;
			this.$router.push({ path, name });
			this.currentPath = path;
		}
	}
});
</script>
