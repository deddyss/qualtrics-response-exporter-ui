<!-- reference: https://devdojo.com/tnylea/creating-a-progress-bar-with-tailwind -->
<template>
	<div class="h-6 relative max-w-full overflow-hidden">
		<div class="text-xs w-full text-right text-gray-800">{{ progress > 0 ? `${progress}%` : '' }}</div>
		<div class="w-full h-2 absolute top-4 rounded-full" :class="lineClass"></div>
		<div ref="bar" class="w-0 h-2 absolute top-4 rounded-full transition-all ease-linear duration-100" :class="barClass"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
	props: {
		progress: {
			type: Number,
			required: false,
			default: 0
		},
		lineClass: {
			type: String,
			required: false,
			default: 'bg-gray-200'
		},
		barClass: {
			type: String,
			required: false,
			default: 'bg-green-500'
		}
	},
	setup(props) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const bar = ref<HTMLElement>(null as any);
		onMounted(() => {
			bar.value.style.width = `${props.progress}%`;
		});
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
