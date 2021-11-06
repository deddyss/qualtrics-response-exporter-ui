<template>
	<div>
		<div class="rounded-lg bg-white shadow-lg grid grid-cols-3 lg:grid-cols-none">
			<div class="grid place-items-center">
				<h2 class="hidden lg:block pt-2 -mb-2 text-xs text-center font-medium text-gray-500 uppercase tracking-wider w-full">Overall Progress</h2>
				<CircleProgressBar :progress="progress" class="p-2 lg:p-4 w-28 md:w-36 lg:w-auto" />
			</div>
			<div
				class="flex flex-col border-l border-r lg:border-l-0 lg:border-r-0 lg:border-t lg:border-b border-gray-200 p-6 text-center justify-center cursor-pointer hover:opacity-80 hover:bg-gray-50"
				@click="clickRemaining"
			>
				<dt class="order-2 mt-0 lg:mt-2 text-sm md:text-md lg:text-lg leading-6 font-medium text-gray-500">
					Remaining
				</dt>
				<dd class="order-1 text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-600">
					{{remaining }}
				</dd>
			</div>
			<div
				class="flex flex-col p-6 text-center justify-center cursor-pointer hover:opacity-80 hover:bg-gray-50"
				@click="clickCompleted"
			>
				<dt class="order-2 mt-0 lg:mt-2 text-sm md:text-md lg:text-lg leading-6 font-medium text-gray-500">
					Completed
				</dt>
				<dd class="order-1 text-2xl md:text-3xl lg:text-4xl font-extrabold text-green-600">
					{{ completed }}
				</dd>
			</div>
		</div>
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
	emits: [
		'clickCompleted',
		'clickRemaining'
	],
	setup(props) {
		const total = ref<number>(Object.keys(props.exportProgress).length);
		const completed = computed<number>(
			() => Object.values(props.exportProgress).filter(
				(detail) => detail.downloadProgress === 100 && detail.downloadedTime !== undefined
			).length
		);
		const progress = computed<number>(
			() => (total.value > 0 ? Math.round((completed.value / total.value) * 100) : 0)
		);
		const remaining = computed<number>(() => total.value - completed.value);
		return {
			completed,
			progress,
			remaining
		};
	},
	methods: {
		clickCompleted() {
			this.$emit('clickCompleted');
		},
		clickRemaining() {
			this.$emit('clickRemaining');
		}
	}
});
</script>
