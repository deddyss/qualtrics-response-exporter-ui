<template>
	<ul>
		<li v-for="item in completedItems" :key="item.id" class="block">{{ item.name }}</li>
	</ul>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ExportProgress, ExportProgressDetail } from '@/types';

interface CompletedItem {
	id: string;
	name: string;
}

export default defineComponent({
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
				const filtered: Array<ExportProgressDetail> = values.filter((survey) => survey.downloadProgress === 100 && survey.downloadedTime !== undefined);
				const result: Array<CompletedItem> = filtered.map((survey) => ({ id: survey.id, name: survey.name } as CompletedItem));
				return result;
			}
		);
		return {
			completedItems
		};
	}
});
</script>
