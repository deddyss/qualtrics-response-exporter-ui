<template>
	<!-- <button
		type="button"
		class="relative flex w-full sm:w-48 justify-center h-10 px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:text-blue-600 focus:text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow"
		@click="click"
	>
		<span class="sr-only">Sort by</span>
		<RefreshIcon class="mr-2.5 mt-0.5 h-5 w-5 text-gray-500" aria-hidden="true" />
		<span class="mt-0.5 mr-5">Synchronize</span>
	</button> -->
	<button
		type="button"
		class="relative flex w-full sm:w-48 justify-center h-10 px-4 py-2 border border-transparent rounded-md shadow text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
		:disabled="active"
		@click="click"
	>
		<span class="sr-only">Synchronize</span>
		<template v-if="active">
			<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			Synchronizing
		</template>
		<template v-else>
			<RefreshIcon class="mr-2.5 h-5 w-5 text-white" aria-hidden="true" />
			<span class="mr-5">Synchronize</span>
		</template>
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RefreshIcon } from '@heroicons/vue/solid';

export default defineComponent({
	components: {
		RefreshIcon
	},
	props: {
		active: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: [
		'click'
	],
	methods: {
		click() {
			this.$emit('click');
		}
	}
});
</script>
