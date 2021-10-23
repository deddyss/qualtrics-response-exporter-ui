<template>
	<span class="relative z-0 inline-flex shadow rounded-md">
		<span class="relative inline-flex items-center h-10 px-2 py-2 rounded-l-md border border-gray-300 bg-white">
			<label for="select-all" class="sr-only">Select all</label>
			<input id="select-all" type="checkbox" v-model="activeOnly" class="form-checkbox h-4 w-4 mx-1 text-green-500 cursor-pointer focus:ring-green-400 border-gray-300 rounded" />
		</span>
		<div class="-ml-px block w-full px-3 py-2 rounded-l-none rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-default">
			<span>Active only</span>
		</div>
	</span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
	props: {
		modelValue: {
			type: Boolean,
			required: true
		}
	},
	emits: [
		'update:modelValue'
	],
	setup(props) {
		const activeOnly = ref<boolean>(props.modelValue);
		return {
			activeOnly
		};
	},
	watch: {
		activeOnly(value: boolean) {
			this.$emit('update:modelValue', value);
		}
	}
});
</script>
