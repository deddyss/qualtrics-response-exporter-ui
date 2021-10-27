<template>
	<div>
		<dl class="rounded-lg bg-white shadow-lg grid grid-cols-3 lg:grid-cols-none">
			<div class="p-4 grid place-items-center">
				<CircleProgressBar :progress="progress" class="w-24 md:w-32 lg:w-auto" />
			</div>
			<div class="flex flex-col lg:border-t lg:border-b border-gray-200 p-6 text-center justify-center border-l border-r">
				<dt class="order-2 mt-2 text-md md:text-lg leading-6 font-medium text-gray-500">
					Completed
				</dt>
				<dd class="order-1 text-2xl md:text-3xl lg:text-4xl font-extrabold text-green-500">
					{{ completed }}
				</dd>
			</div>
			<div class="flex flex-col p-6 text-center justify-center">
				<dt class="order-2 mt-2 text-md md:text-lg leading-6 font-medium text-gray-500">
					Remaining
				</dt>
				<dd class="order-1 text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-500">
					{{remaining }}
				</dd>
			</div>
		</dl>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import CircleProgressBar from '@/components/export/progress/CircleProgressBar.vue';
import { ExportProgress } from '@/types';

export default defineComponent({
	components: {
		CircleProgressBar
	},
	props: {
		exportProgress: {
			type: Object as PropType<ExportProgress>,
			required: true
		}
	},
	setup(props) {
		const total = ref<number>(Object.keys(props.exportProgress).length);
		const completed = computed<number>(
			() => Object.values(props.exportProgress).filter(
				(detail) => detail.downloadProgress === 100 && detail.downloadedTime !== undefined
			).length
		);
		const progress = computed<number>(
			() => Math.round((completed.value / total.value) * 100)
		);
		const remaining = computed<number>(() => total.value - completed.value);
		return {
			completed,
			progress,
			remaining
		};
	}
});
</script>
