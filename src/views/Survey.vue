<template>
	<div>
		<navigation-bar
			:menu-items="menuItems"
			:current-path="currentPath"
			:disabled="menuDisabled"
			@click="menuClicked"
			class="sticky top-0 z-20"
		/>
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
import NavigationBar from '@/components/NavigationBar.vue';
import { NavigationMenuItem } from '@/types';
import PATH from '@/reference/path';

const { SURVEY } = PATH;
const { EXPORT } = SURVEY;

const menuItems: NavigationMenuItem[] = [
	{ path: SURVEY.URI + SURVEY.LIST.URI, name: SURVEY.LIST.NAME, description: SURVEY.LIST.DESCRIPTION },
	{ path: SURVEY.URI + EXPORT.OPTIONS.URI, name: EXPORT.OPTIONS.NAME, description: EXPORT.OPTIONS.DESCRIPTION },
	{ path: SURVEY.URI + EXPORT.PROGRESS.URI, name: EXPORT.PROGRESS.NAME, description: EXPORT.PROGRESS.DESCRIPTION }
];

export default defineComponent({
	components: {
		NavigationBar
	},
	setup() {
		const route = useRoute();
		const currentPath = ref<string>(route.path);
		const menuDisabled = ref<boolean>(false);
		return {
			menuItems,
			menuDisabled,
			currentPath
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
