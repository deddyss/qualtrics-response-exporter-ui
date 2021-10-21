<template>
	<div class="flex flex-col">
		<!-- <div class="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8"> -->
		<div class="-my-2 overflow-x-auto -mx-2 sm:-mx-6 lg:-mx-8">
			<div
				class="py-6 align-middle inline-block min-w-full px-2 sm:px-6 lg:px-8"
				:class="localSelectedIds.length > 0 ? 'pb-24' : 'pb-10'"
			>
				<div class="shadow-lg overflow-hidden border-b border-gray-200 rounded-lg">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-white">
							<tr>
								<th scope="col" class="pl-6 py-4" title="Select / unselect all">
									<span class="sr-only">Select / unselect all</span>
									<input
										type="checkbox"
										ref="selectAllCheckbox"
										class="form-checkbox focus:ring-blue-500 h-6 w-6 text-blue-600 border-2 border-blue-300 rounded cursor-pointer"
										v-focus
										@click="selectAll"
									/>
								</th>
								<th
									v-for="header in headers"
									:key="header.id" scope="col"
									class="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
									:class="[
										header.left ? 'text-left' : 'text-center',
										header.hideable ? 'hidden lg:table-cell' : '',
										header.nowrap ? 'whitespace-nowrap' : ''
									]"
								>
									{{ header.name }}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(survey, idx) in filteredSurveys"
								:key="survey.id"
								class="cursor-pointer hover:bg-blue-50"
								:class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
								@click="select(survey)"
							>
								<td class="pl-6 py-4 whitespace-nowrap text-center text-sm font-medium">
									<input
										type="checkbox"
										:id="survey.id"
										:value="survey.id"
										v-model="localSelectedIds"
										class="form-checkbox h-4 w-4 focus:ring-blue-500 text-blue-600 border-2 border-gray-300 rounded cursor-pointer"
									/>
								</td>
								<td class="px-6 py-4 text-sm font-medium text-gray-900 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
									{{ survey.name }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
									<span
										class="px-2 inline-flex text-xs leading-5 font-medium rounded-full"
										:class="survey.isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'"
									>
										{{ survey.isActive ? 'active' : 'inactive' }}
									</span>
								</td>
								<td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center hidden lg:table-cell">
									{{ survey.creationDate.substring(0, 10) }}
								</td>
								<td
									class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center hidden lg:table-cell"
									:class="survey.lastModified.substring(0, 10) !== survey.creationDate.substring(0, 10) ? 'text-yellow-500 font-medium' : ''"
								>
									{{ survey.lastModified.substring(0, 10) }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue';
import { SortCriteria, Survey } from '@/types';

interface Header {
	id: string;
	name: string;
	left?: boolean;
	hideable?: boolean;
	nowrap?: boolean;
}

const headers: Array<Header> = [
	{ id: 'name', name: 'Name', left: true },
	{ id: 'isActive', name: 'Status' },
	{ id: 'creationDate', name: 'Creation Date', hideable: true, nowrap: true },
	{ id: 'lastModified', name: 'Last Modified', hideable: true, nowrap: true }
];

export default defineComponent({
	props: {
		surveys: {
			type: Array as PropType<Array<Survey>>,
			required: false,
			default: () => []
		},
		selectedIds: {
			type: Array as PropType<Array<string>>,
			required: false,
			default: () => []
		},
		sortCriteria: {
			type: Object as PropType<SortCriteria>,
			required: true
		},
		activeOnly: {
			type: Boolean,
			required: true
		}
	},
	emits: [
		'update:selectedIds'
	],
	setup(props) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const selectAllCheckbox = ref<HTMLInputElement>(null as any);
		const filteredSurveys = reactive<Survey[]>(props.surveys);
		const localSelectedIds = ref<string[]>(props.selectedIds);

		onMounted(() => {
			if (localSelectedIds.value.length === filteredSurveys.length) {
				selectAllCheckbox.value.checked = true;
			}
		});

		return {
			headers,
			selectAllCheckbox,
			filteredSurveys,
			localSelectedIds
		};
	},
	watch: {
		sortCriteria: {
			handler() {
				this.sortSurveys();
			},
			deep: true
		},
		activeOnly() {
			this.filterSurveys();
		}
		// localSelectedIds(values: string[]) {
		// 	console.log(values);
		// }
	},
	methods: {
		filterSurveys() {
			if (this.activeOnly) {
				this.filteredSurveys = this.surveys.filter((survey) => survey.isActive === true);
			}
			else {
				this.filteredSurveys = [...this.surveys];
			}

			this.sortSurveys();

			// filter selected ids
			if (this.localSelectedIds.length > 0) {
				const filteredSurveyIds: string[] = this.filteredSurveys.map((survey) => survey.id);
				this.localSelectedIds = this.localSelectedIds.filter((id) => filteredSurveyIds.includes(id));
				this.$emit('update:selectedIds', this.localSelectedIds);
				this.evaluateSelectAllCheckbox();
			}
		},
		sortSurveys() {
			this.filteredSurveys.sort((first, second) => {
				const firstValue: string | boolean = first[this.sortCriteria.by];
				const secondValue: string | boolean = second[this.sortCriteria.by];
				if (typeof firstValue === 'string' && typeof secondValue === 'string') {
					return this.sortCriteria.order === 'ascending' ? firstValue.localeCompare(secondValue) : secondValue.localeCompare(firstValue);
				}
				return this.sortCriteria.order === 'descending' ? Number(firstValue) - Number(secondValue) : Number(secondValue) - Number(firstValue);
			});
		},
		selectAll() {
			if (this.selectAllCheckbox.checked) {
				this.filteredSurveys.forEach((survey: Survey) => {
					if (!this.localSelectedIds.includes(survey.id)) {
						this.localSelectedIds.push(survey.id);
					}
				});
			}
			else {
				this.localSelectedIds = [];
			}
			this.$emit('update:selectedIds', this.localSelectedIds);
		},
		select(survey: Survey) {
			const index: number = this.localSelectedIds.findIndex((id: string) => id === survey.id);
			// survey already checked
			if (index >= 0) {
				this.localSelectedIds.splice(index, 1);
			}
			else {
				this.localSelectedIds.push(survey.id);
			}
			this.$emit('update:selectedIds', this.localSelectedIds);
			this.evaluateSelectAllCheckbox();
		},
		evaluateSelectAllCheckbox() {
			if (this.localSelectedIds.length === this.filteredSurveys.length) {
				this.selectAllCheckbox.checked = true;
			}
			else {
				this.selectAllCheckbox.checked = false;
			}
		}
	}
});
</script>
