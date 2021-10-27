<!-- reference: https://codepen.io/tommaxwell/pen/XgZoOo -->
<template>
	<svg width="150" viewBox="0 0 20 20">
		<circle class="circle-bg stroke-2" cx="10" cy="10" r="8"/>
		<circle ref="circle" class="circle-progress stroke-2 transition-all ease-linear duration-100" cx="10" cy="10" r="8" :data-percentage="progress"/>
		<text class="circle-text font-bold" x="50%" y="55%">{{ progress }}%</text>
	</svg>
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
		const circle = ref<SVGElement>(null as any);
		return {
			circle
		};
	},
	mounted() {
		this.setCircleDashOffset();
	},
	watch: {
		progress() {
			this.setCircleDashOffset();
		}
	},
	methods: {
		setCircleDashOffset() {
			const offset = -51 - ((51 / 100) * this.progress);
			this.circle.style.strokeDashoffset = offset + '';
		}
	}
});
</script>

<style scoped>
.circle-bg {
	fill: none;
	stroke: rgba(229, 231, 235, 1); /*  gray-200 */
}
.circle-progress {
	fill: none;
	stroke: rgba(16, 185, 129, 1); /* green-500 */
	stroke-dasharray: 51 51;
	stroke-dashoffset: -51;
	stroke-linecap: round;
}
.circle-text {
	fill: rgba(75, 85, 99, 1); /* gray-500 */
	text-anchor: middle;
	font-size: 3px;
}
</style>
