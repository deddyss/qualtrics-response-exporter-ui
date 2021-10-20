<template>
	<div class="flex flex-col">
		<div class="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
			<div
				class="py-6 align-middle inline-block min-w-full px-2 sm:px-6 lg:px-8"
				:class="checkedIds.length > 0 ? 'pb-24' : 'pb-10'"
			>
				<div class="shadow-lg overflow-hidden border-b border-gray-200 rounded-lg">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-100">
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
								<th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Name / Title
								</th>
								<th scope="col" class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th scope="col" class="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
									Creation Date
								</th>
								<th scope="col" class="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
									Last Modified
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
										v-model="checkedIds"
										class="form-checkbox h-4 w-4 focus:ring-blue-500 text-blue-600 border-2 border-gray-300 rounded cursor-pointer"
									/>
								</td>
								<td class="px-6 py-4 text-sm font-medium text-gray-900 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
									{{ survey.name }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
									<span
										class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
										:class="survey.isActive ? 'bg-green-300 text-green-900' : 'bg-gray-200 text-gray-500'"
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
import { Survey } from '@/types';

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
		}
	},
	emits: [
		'update:selectedIds'
	],
	setup(props) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const selectAllCheckbox = ref<HTMLInputElement>(null as any);
		const filteredSurveys = reactive<Survey[]>(props.surveys);
		const checkedIds = ref<string[]>(props.selectedIds);

		onMounted(() => {
			if (checkedIds.value.length === filteredSurveys.length) {
				selectAllCheckbox.value.checked = true;
			}
		});

		return {
			selectAllCheckbox,
			filteredSurveys,
			checkedIds
		};
	},
	// watch: {
	// 	checkedIds(values: string[]) {
	// 		console.log(values);
	// 	}
	// },
	methods: {
		selectAll(): void {
			if (this.selectAllCheckbox.checked) {
				this.filteredSurveys.forEach((survey: Survey) => {
					if (!this.checkedIds.includes(survey.id)) {
						this.checkedIds.push(survey.id);
					}
				});
			}
			else {
				this.checkedIds = [];
			}
			this.$emit('update:selectedIds', this.checkedIds);
		},
		select(survey: Survey) {
			const index: number = this.checkedIds.findIndex((id: string) => id === survey.id);
			// survey already checked
			if (index >= 0) {
				this.checkedIds.splice(index, 1);
			}
			else {
				this.checkedIds.push(survey.id);
			}
			this.$emit('update:selectedIds', this.checkedIds);

			if (this.checkedIds.length === this.filteredSurveys.length) {
				this.selectAllCheckbox.checked = true;
			}
			else {
				this.selectAllCheckbox.checked = false;
			}
		}
	}
});
</script>
