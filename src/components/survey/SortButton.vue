<template>
	<span class="relative z-0 inline-flex shadow rounded-md">
		<button
			type="button"
			class="relative inline-flex items-center w-40 h-10 px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:text-blue-600 focus:text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
			@click="toggleSortOrder"
		>
			<span class="sr-only">Sort by</span>
			<SortAscendingIcon v-if="sortOrder === 'ascending'"
				class="mr-2.5 mt-0.5 h-5 w-5 text-blue-600" aria-hidden="true" />
			<SortDescendingIcon v-else
				class="mr-2.5 mt-0.5 h-5 w-5 text-blue-600" aria-hidden="true" />
			<span>{{ sortByTitle }}</span>
		</button>
		<Menu as="span" class="-ml-px relative block">
			<MenuButton class="relative inline-flex items-center h-10 px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
				<span class="sr-only">Open options</span>
				<ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
			</MenuButton>
			<transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
				<MenuItems class="origin-top-right absolute right-0 mt-1 mr-0.5 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div class="py-1">
						<MenuItem v-for="item in sortItems" :key="item.name" v-slot="{ active }">
							<a href="javascript:;"
								:class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
								@click="changeSortBy(item.id)"
							>
								{{ item.name }}
							</a>
						</MenuItem>
					</div>
				</MenuItems>
			</transition>
		</Menu>
	</span>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ChevronDownIcon, SortAscendingIcon, SortDescendingIcon } from '@heroicons/vue/solid';
import { SortBy, SortCriteria, SortOrder } from '@/types';

interface SortItem {
	id: SortBy;
	name: string;
}

const items: Array<SortItem> = [
	{ id: 'name', name: 'Name' },
	{ id: 'isActive', name: 'Status' },
	{ id: 'creationDate', name: 'Creation Date' },
	{ id: 'lastModified', name: 'Last Modified' }
];

export default defineComponent({
	components: {
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
		ChevronDownIcon,
		SortAscendingIcon,
		SortDescendingIcon
	},
	props: {
		modelValue: {
			type: Object as PropType<SortCriteria>,
			required: true
		}
	},
	emits: [
		'update:modelValue'
	],
	setup(props) {
		const sortBy = ref<SortBy>(props.modelValue.by);
		const sortOrder = ref<SortOrder>(props.modelValue.order);
		const sortItems = computed<Array<SortItem>>(
			() => items.filter((item) => item.id !== sortBy.value)
		);
		const sortByTitle = computed<string>(
			() => items.find((item) => item.id === sortBy.value)?.name ?? ''
		);
		return {
			sortBy,
			sortOrder,
			sortItems,
			sortByTitle
		};
	},
	methods: {
		notifyParent() {
			this.$emit('update:modelValue', { by: this.sortBy, order: this.sortOrder } as SortCriteria);
		},
		changeSortBy(value: SortBy) {
			this.sortBy = value;
			this.notifyParent();
		},
		toggleSortOrder() {
			this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
			this.notifyParent();
		}
	}
});
</script>
