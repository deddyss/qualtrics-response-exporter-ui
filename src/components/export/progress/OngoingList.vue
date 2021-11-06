<template>
	<div class="rounded-lg bg-white shadow-lg mt-6 mb-6 sm:mt-8 sm:mb-8 lg:mt-0" v-show="shown">
		<h3 class="text-base lg:text-lg font-medium text-white bg-blue-600 w-full border-b rounded-t-lg p-4 sm:px-6 lg:px-8">
			Download Queue
		</h3>
		<ul class="divide-y divide-gray-100">
			<li
				v-for="(item, idx) in ongoingItems"
				:key="item.id"
				class="p-4 text-sm sm:px-6 lg:px-8 flex flex-wrap gap-4 sm:gap-6"
				:class="[
					idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
					idx === ongoingItems.length - 1 ? 'rounded-b-lg' : ''
				]"
			>
				<div class="flex-1 font-medium text-gray-900">{{ item.name }}</div>
				<!-- <div class="relative flex-shrink-0 w-full lg:w-auto -mt-3 sm:-mt-4 lg:mt-0 mb-1 lg:mb-0"> -->
				<div class="relative flex-shrink-0 text-left lg:text-right w-full lg:w-auto -mt-2 sm:-mt-4 lg:mt-0">
					<span
						class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-200 text-gray-600"
						:class="[
							item.status === 'downloading' ? 'bg-green-200 text-green-700': '',
							item.status === 'exporting' ? 'bg-blue-100 text-blue-600': '',
							item.status === 'failed' ? 'bg-red-100 text-red-600': ''
						]"
					>
						<svg
							v-if="item.status === 'downloading' | item.status === 'exporting'"
							class="hidden lg:block animate-spin mr-2 h-3 w-3"
							:class="[
								item.status === 'downloading' ? 'text-green-500': '',
								item.status === 'exporting' ? 'text-blue-400': '',
							]"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						{{ item.status }}
						<svg
							v-if="item.status === 'downloading' | item.status === 'exporting'"
							class="block lg:hidden animate-spin ml-2 h-3 w-3"
							:class="[
								item.status === 'downloading' ? 'text-green-500': '',
								item.status === 'exporting' ? 'text-blue-400': '',
							]"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					</span>
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ExportProgress, ExportProgressDetail } from '@/types';

type OngoingStatus = 'pending' | 'exporting' | 'failed' | 'downloading';
interface OngoingItem {
	id: string;
	name: string;
	status: OngoingStatus;
	progress: number;
}

const compareProgress = (first: OngoingItem, second: OngoingItem) => (second.progress - first.progress);
const compareStatus = (first: OngoingItem, second: OngoingItem) => {
	if (first.status !== second.status) {
		return first.status === 'exporting' ? -1 : 1;
	}
	return 0;
};

export default defineComponent({
	props: {
		exportProgress: {
			type: Object as PropType<ExportProgress>,
			required: true
		}
	},
	setup(props) {
		const ongoingItems = computed<Array<OngoingItem>>(
			() => {
				const values: Array<ExportProgressDetail> = Object.values(props.exportProgress);
				const filtered: Array<ExportProgressDetail> = values.filter(
					(survey) => survey.downloadProgress === undefined || survey.downloadProgress < 100
				);
				const mapped: Array<OngoingItem> = filtered.map((survey) => {
					const { id, name, exportStatus, downloadProgress } = survey;
					let status: OngoingStatus = 'pending';
					let progress = 0;
					if (exportStatus === 'inProgress') {
						status = 'exporting';
					}
					else if (exportStatus === 'failed') {
						status = 'failed';
						progress = -99;
					}
					else if (exportStatus === 'complete') {
						status = 'downloading';
						progress = downloadProgress ?? 50;
					}
					return { id, name, status, progress } as OngoingItem;
				});
				const result: Array<OngoingItem> = mapped.sort(compareProgress || compareStatus);
				return result;
			}
		);
		const shown = computed<boolean>(() => ongoingItems.value.length > 0);
		return {
			ongoingItems,
			shown
		};
	}
});
</script>
