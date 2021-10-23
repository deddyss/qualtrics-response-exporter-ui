<template>
	<div class="mx-auto">
		<div class="flex flex-wrap gap-3">
			<div class="flex-1 flex">
				<SearchInput v-model="localKeyword" class="flex-1"/>
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
						<ReloadButton :active="isLoading" @click="reload"/>
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
import ReloadButton from '@/components/survey/ReloadButton.vue';
import { SortCriteria } from '@/types';

export default defineComponent({
	components: {
		SearchInput,
		ActiveOnlyCheckbox,
		SortButton,
		ReloadButton
	},
	props: {
		keyword: {
			type: String,
			required: false,
			default: ''
		},
		activeOnly: {
			type: Boolean,
			required: false,
			default: false
		},
		sortCriteria: {
			type: Object as PropType<SortCriteria>,
			required: false,
			default: () => ({ by: 'lastModified', order: 'descending' } as SortCriteria)
		},
		isLoading: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: [
		'update:keyword',
		'update:activeOnly',
		'update:sortCriteria',
		'reload'
	],
	setup(props) {
		const localKeyword = ref<string>(props.keyword);
		const localActiveOnly = ref<boolean>(props.activeOnly);
		const localSortCriteria = ref<SortCriteria>(props.sortCriteria);
		return {
			localKeyword,
			localActiveOnly,
			localSortCriteria
		};
	},
	watch: {
		localKeyword(value: string) {
			this.$emit('update:keyword', value);
		},
		localActiveOnly(value: boolean) {
			this.$emit('update:activeOnly', value);
		},
		localSortCriteria: {
			handler(value: SortCriteria) {
				this.$emit('update:sortCriteria', value);
			},
			deep: true
		}
	},
	methods: {
		reload() {
			this.$emit('reload');
		}
	}
});
</script>
