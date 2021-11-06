<template>
	<div class="rounded-lg bg-white shadow-lg mt-6 sm:mt-8 lg:mt-0" v-show="shown">
		<h3 class="text-base lg:text-lg font-medium text-white bg-green-600 w-full border-b rounded-t-lg p-4 sm:px-6 lg:px-8">
			Completed
		</h3>
		<ul class="divide-y divide-gray-100">
			<li
				v-for="(item, idx) in completedItems"
				:key="item.id"
				class="p-4 text-sm sm:px-6 lg:px-8 flex flex-wrap gap-4 sm:gap-6"
				:class="[
					idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
					idx === completedItems.length - 1 ? 'rounded-b-lg' : ''
				]"
			>
				<div class="flex-1 font-medium text-gray-900">{{ item.name }}</div>
				<div class="relative flex-shrink-0 text-green-700 text-left lg:text-right w-full lg:w-auto -mt-3 sm:-mt-5 lg:mt-0">
					<UseTimeAgo v-slot="{ timeAgo }" :time="new Date(item.downloadedTime)">
						{{ timeAgo }}
					</UseTimeAgo>
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { UseTimeAgo } from '@vueuse/components';
import { ExportProgress, ExportProgressDetail } from '@/types';

interface CompletedItem {
	id: string;
	name: string;
	downloadedTime: number;
}

export default defineComponent({
	components: {
		UseTimeAgo
	},
	props: {
		exportProgress: {
			type: Object as PropType<ExportProgress>,
			required: true
		}
	},
	setup(props) {
		const completedItems = computed<Array<CompletedItem>>(
			() => {
				const values: Array<ExportProgressDetail> = Object.values(props.exportProgress);
				const filtered: Array<ExportProgressDetail> = values.filter(
					(survey) => survey.downloadProgress === 100 && survey.downloadedTime !== undefined
				);
				const mapped: Array<CompletedItem> = filtered.map((survey) => {
					const { id, name, downloadedTime } = survey;
					return { id, name, downloadedTime } as CompletedItem;
				});
				const result: Array<CompletedItem> = mapped.sort(
					(first, second) => second.downloadedTime - first.downloadedTime
				);
				return result;
			}
		);
		const shown = computed<boolean>(() => completedItems.value.length > 0);
		return {
			completedItems,
			shown
		};
	}
});
</script>
