<template>
	<div class="w-auto">
		Progress Bar
		<LineProgressBar :progress="progress" />
		<CircleProgressBar :progress="progress" />
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LineProgressBar from '@/components/export/LineProgressBar.vue';
import CircleProgressBar from '@/components/export/CircleProgressBar.vue';

export default defineComponent({
	components: {
		LineProgressBar,
		CircleProgressBar
	},
	setup() {
		const progress = ref<number>(0);
		return {
			progress
		};
	},
	mounted() {
		this.incrementProgress();
	},
	methods: {
		incrementProgress() {
			this.progress += 4;
			if (this.progress < 100) {
				setTimeout(this.incrementProgress, 1_00);
			}
		}
	}
});
</script>
