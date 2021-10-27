<!-- reference: https://devdojo.com/tnylea/creating-a-progress-bar-with-tailwind -->
<template>
	<div class="h-8 relative max-w-full overflow-hidden">
		<div class="text-xs w-full text-right text-gray-800">{{ progress }}%</div>
		<div class="w-full h-2 bg-gray-200 absolute top-4 rounded-full"></div>
		<div ref="bar" class="w-0 h-2 bg-green-500 absolute top-4 rounded-full transition-all ease-linear duration-100"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
	props: {
		progress: {
			type: Number,
			required: false,
			default: 0
		}
	},
	setup() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const bar = ref<HTMLElement>(null as any);
		return {
			bar
		};
	},
	watch: {
		progress(value: number) {
			if (value < 0 || value > 100) {
				return;
			}
			this.bar.style.width = `${value}%`;
		}
	}
});
</script>
