<template>
	<div
		class="pb-0 lg:grid lg:grid-cols-10 lg:gap-8"
		:class="footerShown ? 'pb-36 md:pb-20' : ''"
	>
		<aside class="lg:col-span-2">
			<Summary
				:exportProgress="exportProgress"
				@clickCompleted="scrollToCompleted"
				@clickRemaining="scrollToOngoing"
				class="sticky top-28"
			/>
		</aside>
		<main class="lg:col-span-8">
			<OngoingList :exportProgress="exportProgress" ref="ongoing" />
			<CompletedList :exportProgress="exportProgress" ref="completed" />
		</main>

		<Footer :shown="footerShown" @openExportDirectory="openExportDirectory" @startOver="startOver" />
		<BackToTop :class="footerShown ? 'bottom-40 md:bottom-24' :  ''"/>
	</div>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, ref } from 'vue';
import { mapGetters } from 'vuex';
import Summary from '@/components/export/progress/Summary.vue';
import OngoingList from '@/components/export/progress/OngoingList.vue';
import CompletedList from '@/components/export/progress/CompletedList.vue';
import Footer from '@/components/export/progress/Footer.vue';
import BackToTop from '@/components/BackToTop.vue';
import { ACTION, GETTER } from '@/reference/store';
import { ExportProgress, ExportProgressDetail } from '@/types';
import { ROUTE } from '@/reference/path';

const NAVIGATION_BAR_HEIGHT_PLUS_MARGIN = 80 + 24;

export default defineComponent({
	components: {
		Summary,
		OngoingList,
		CompletedList,
		Footer,
		BackToTop
	},
	setup() {
		/* eslint-disable @typescript-eslint/no-explicit-any */
		const ongoing = ref<ComponentPublicInstance>(null as any);
		const completed = ref<ComponentPublicInstance>(null as any);
		return {
			ongoing,
			completed
		};
	},
	computed: {
		...mapGetters({
			exportProgress: GETTER.EXPORT_PROGRESS
		}),
		footerShown(): boolean {
			const values: Array<ExportProgressDetail> = Object.values(this.exportProgress as ExportProgress);
			const completed: Array<ExportProgressDetail> = values.filter(
				(survey) => survey.downloadProgress === 100 && survey.downloadedTime !== undefined
			);
			const failed: Array<ExportProgressDetail> = values.filter(
				(survey) => survey.exportStatus === 'failed'
			);
			const result: boolean = values.length > 0 && values.length === (completed.length + failed.length);
			return result;
		}
	},
	methods: {
		scrollToOngoing() {
			const ongoing: HTMLElement = this.ongoing.$el;
			window.scrollTo({ top: ongoing.offsetTop - NAVIGATION_BAR_HEIGHT_PLUS_MARGIN });
		},
		scrollToCompleted() {
			const completed: HTMLElement = this.completed.$el;
			window.scrollTo({ top: completed.offsetTop - NAVIGATION_BAR_HEIGHT_PLUS_MARGIN });
		},
		openExportDirectory() {
			this.$store.dispatch(ACTION.OPEN_DIRECTORY);
		},
		startOver() {
			this.$store.dispatch(ACTION.START_OVER).then(() => {
				this.$router.push(ROUTE.SURVEY_LIST);
			});
		}
	}
});
</script>
