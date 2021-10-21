<template>
	<div class="mx-auto pt-3">
		<div class="flex flex-wrap gap-3">
			<div class="flex-1 flex">
				<SearchInput class="flex-1"/>
			</div>
			<div class="order-1 flex-shrink-0 w-full sm:mt-0 sm:w-auto">
				<div class="flex gap-3">
					<div class="order-2">
						<ActiveOnlyCheckbox v-model="localActiveOnly"/>
					</div>
					<div class="order-3">
						<SortButton v-model="localSortCriteria" />
					</div>
					<div class="order-4 flex-1">
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
import ActiveOnlyCheckbox from '@/components/survey/ActiveOnlyCheckbox.vue';
import SortButton from '@/components/survey/SortButton.vue';
import SynchronizeButton from '@/components/survey/SynchronizeButton.vue';
import { SortCriteria } from '@/types';

export default defineComponent({
	components: {
		SearchInput,
		ActiveOnlyCheckbox,
		SortButton,
		SynchronizeButton
	},
	props: {
		sortCriteria: {
			type: Object as PropType<SortCriteria>,
			required: false,
			default: () => ({ by: 'lastModified', order: 'descending' } as SortCriteria)
		},
		activeOnly: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: [
		'update:sortCriteria',
		'update:activeOnly'
	],
	setup(props) {
		const localSortCriteria = ref<SortCriteria>(props.sortCriteria);
		const localActiveOnly = ref<boolean>(props.activeOnly);
		return {
			localSortCriteria,
			localActiveOnly
		};
	},
	watch: {
		localSortCriteria: {
			handler(value: SortCriteria) {
				this.$emit('update:sortCriteria', value);
			},
			deep: true
		},
		localActiveOnly(value: boolean) {
			this.$emit('update:activeOnly', value);
		}
	}

});
</script>
