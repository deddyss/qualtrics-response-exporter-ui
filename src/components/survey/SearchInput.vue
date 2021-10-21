<template>
	<div class="min-w-0">
		<label for="search" class="sr-only">Search</label>
		<div class="relative rounded-md shadow">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<SearchIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
			</div>
			<input type="search" name="search" id="search" class="form-input focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10" placeholder="Search" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SearchIcon } from '@heroicons/vue/solid';

export default defineComponent({
	components: {
		SearchIcon
	}
});
</script>
