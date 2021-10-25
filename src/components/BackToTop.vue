<template>
	<transition name='fade' mode='out-in'>
		<div class="fixed bottom-8 right-2 xl:right-8 z-30 rounded-full hover:shadow-md" v-show="shown">
			<button
				type="button"
				class="inline-flex items-center p-2 border border-transparent rounded-full shadow-md text-white bg-blue-600 opacity-30 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				title="Back to Top"
				@click="backToTop"
			>
				<ArrowUpIcon class="h-6 w-6" aria-hidden="true" />
			</button>
		</div>
	</transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useWindowScroll } from '@vueuse/core';
import { ArrowUpIcon } from '@heroicons/vue/outline';

const SCROLL_TOP_LIMIT = 100;

export default defineComponent({
	components: {
		ArrowUpIcon
	},
	setup() {
		const { y: scrollTop } = useWindowScroll();
		const shown = ref<boolean>(document.body.scrollTop > SCROLL_TOP_LIMIT);
		watch(scrollTop, () => {
			if (scrollTop.value > SCROLL_TOP_LIMIT) {
				shown.value = true;
			}
			else {
				shown.value = false;
			}
		});
		return {
			shown
		};
	},

	methods: {
		backToTop() {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		}
	}
});
</script>
