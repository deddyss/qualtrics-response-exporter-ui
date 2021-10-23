<template>
	<div class="min-w-0">
		<label for="search" class="sr-only">Search</label>
		<div class="relative rounded-md shadow">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<SearchIcon class="h-5 w-5 text-gray-400" :class="isNotEmpty ? 'text-blue-500' : ''" aria-hidden="true" />
			</div>
			<input type="search" v-model="keyword" class="form-input focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10" placeholder="Search" v-focus />
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { debouncedWatch } from '@vueuse/core';
import { SearchIcon } from '@heroicons/vue/solid';

export default defineComponent({
	components: {
		SearchIcon
	},
	props: {
		modelValue: {
			type: String,
			required: true
		}
	},
	emits: [
		'update:modelValue'
	],
	setup(props, { emit }) {
		const keyword = ref<string>(props.modelValue);
		const isNotEmpty = computed(() => keyword.value.trim().length > 0);

		debouncedWatch(
			keyword,
			() => {
				emit('update:modelValue', keyword.value);
			},
			{ debounce: 500 }
		);

		return {
			keyword,
			isNotEmpty
		};
	}
});
</script>
