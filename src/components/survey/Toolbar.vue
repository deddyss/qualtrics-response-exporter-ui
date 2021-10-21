<template>
	<div class="mx-auto pt-3">
		<div class="flex items-center justify-between flex-wrap gap-3">
			<div class="flex-1 flex items-center">
				<SearchInput class="flex-1"/>
			</div>
			<div class="order-1 flex-shrink-0 w-full sm:mt-0 sm:w-auto">
				<div class="flex items-center justify-between gap-3">
					<div class="order-2">
						<SortButton v-model="localSortCriteria" />
					</div>
					<div class="order-3 flex-1">
						<SynchronizeButton />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import SearchInput from '@/components/survey/SearchInput.vue';
import SortButton from '@/components/survey/SortButton.vue';
import SynchronizeButton from '@/components/survey/SynchronizeButton.vue';
import { SortCriteria } from '@/types';

export default defineComponent({
	components: {
		SearchInput,
		SortButton,
		SynchronizeButton
	},
	props: {
		sortCriteria: {
			type: Object as PropType<SortCriteria>,
			required: false,
			default: () => ({ by: 'lastModified', order: 'descending' } as SortCriteria)
		}
	},
	emits: [
		'update:sortCriteria'
	],
	setup(props) {
		const localSortCriteria = ref<SortCriteria>(props.sortCriteria);
		return {
			localSortCriteria
		};
	},
	watch: {
		localSortCriteria: {
			handler(value: SortCriteria) {
				this.$emit('update:sortCriteria', value);
			},
			deep: true
		}
	}

});
</script>
