<template>
	<button
		type="button"
		class="relative flex w-full lg:w-32 justify-center text-center h-10 px-4 py-2 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
		:disabled="active"
		@click="click"
	>
		<span class="sr-only">Reload</span>
		<template v-if="active">
			<svg class="animate-spin -ml-1 md:mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<span class="hidden md:block">Loading</span>
		</template>
		<template v-else>
			<RefreshIcon class="block md:hidden md:mr-2 h-5 w-5 text-white" aria-hidden="true" />
			<span class="hidden md:block">Reload</span>
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
