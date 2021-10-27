<template>
	<ul>
		<li v-for="item in completedItems" :key="item.id" class="block">
			<span>{{ item.name }}</span>
			<span>&nbsp;
				<UseTimeAgo v-slot="{ timeAgo }" :time="new Date(item.downloadedTime)">
					{{ timeAgo }}
				</UseTimeAgo>
			</span>
		</li>
	</ul>
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
		return {
			completedItems
		};
	}
});
</script>
