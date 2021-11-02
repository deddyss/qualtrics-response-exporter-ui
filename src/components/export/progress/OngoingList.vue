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
				<div class="relative flex-shrink-0 w-full lg:w-80 -mt-3 sm:-mt-4 lg:mt-0 mb-1 lg:mb-0">
					<span
						class="absolute text-gray-500 -top-1"
						:class="[
							item.status === 'downloading' ? 'text-blue-700' : '',
							item.status === 'exporting' ? 'text-blue-500' : '',
							item.status === 'failed' ? 'text-red-500' : ''
						]"
					>
						{{ item.status }}
					</span>
					<LineProgressBar
						:progress="item.progress"
						barClass="bg-blue-500"
					/>
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import LineProgressBar from '@/components/export/progress/LineProgressBar.vue';
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
	components: {
		LineProgressBar
	},
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
					const { id, name, exportStatus, exportProgress, downloadProgress } = survey;
					let status: OngoingStatus = 'pending';
					let progress = 0;
					if (exportProgress) {
						if (exportStatus === 'inProgress') {
							status = 'exporting';
						}
						else if (exportStatus === 'failed') {
							status = 'failed';
							progress = -exportProgress;
						}
					}
					if (downloadProgress) {
						status = 'downloading';
						progress = downloadProgress;
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
