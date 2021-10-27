<template>
	<div class="pb-5 lg:grid lg:grid-cols-10 lg:gap-8">
		<aside class="lg:col-span-2">
			<Summary :exportProgress="exportProgress" class="sticky top-28"/>
		</aside>
		<main class="lg:col-span-8" style="height: 3000px;">
			<OngoingList :exportProgress="exportProgress" />
			<CompletedList :exportProgress="exportProgress" />
		</main>

		<BackToTop />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import Summary from '@/components/export/progress/Summary.vue';
import OngoingList from '@/components/export/progress/OngoingList.vue';
import CompletedList from '@/components/export/progress/CompletedList.vue';
import BackToTop from '@/components/BackToTop.vue';
import { GETTER } from '@/reference/store';

export default defineComponent({
	components: {
		Summary,
		OngoingList,
		CompletedList,
		BackToTop
	},
	computed: {
		...mapGetters({
			exportProgress: GETTER.EXPORT_PROGRESS
		})
	}
});
</script>
