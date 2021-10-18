<template>
	<div>
		<navigation-bar class="sticky top-0 z-40"/>
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
import { defineComponent } from 'vue';
import NavigationBar from '@/components/NavigationBar.vue';

export default defineComponent({
	components: {
		NavigationBar
	}
});
</script>
