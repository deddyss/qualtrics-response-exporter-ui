<template>
	<div>

		<Toolbar
			v-model:keyword="keyword"
			v-model:activeOnly="activeOnly"
			v-model:sortCriteria="sortCriteria"
			:isLoading="isLoading"
			@reload="reload"
		/>

		<TableSkeleton v-if="surveys.length === 0 && isLoading"/>
		<Table v-else
			v-model:selectedIds="selectedIds"
			:surveys="surveys"
			:keyword="keyword"
			:activeOnly="activeOnly"
			:sortCriteria="sortCriteria"
		/>

		<Footer
			:shown="footerShown"
			:selectedIds="selectedIds"
			@proceed="goToExportOptions"
		/>
		<BackToTop :class="footerShown ? 'bottom-28 sm:bottom-24' :  ''"/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { mapGetters, useStore } from 'vuex';
import Toolbar from '@/components/survey/Toolbar.vue';
import Table from '@/components/survey/Table.vue';
import TableSkeleton from '@/components/survey/TableSkeleton.vue';
import Footer from '@/components/survey/Footer.vue';
import BackToTop from '@/components/BackToTop.vue';
import { GETTER, MUTATION } from '@/reference/store';
import { Current, SortCriteria, State } from '@/types';
import PATH from '@/reference/path';

export default defineComponent({
	components: {
		Toolbar,
		Table,
		TableSkeleton,
		Footer,
		BackToTop
	},
	setup() {
		const store = useStore<State>();
		const keyword = ref<string>(store.state.current.keyword);
		const activeOnly = ref<boolean>(store.state.current.activeOnly);
		const sortCriteria = ref<SortCriteria>(store.state.current.sortCriteria);
		const selectedIds = ref<Array<string>>(store.state.selectedIds);
		const footerShown = computed(() => selectedIds.value.length > 0);
		return {
			keyword,
			activeOnly,
			sortCriteria,
			selectedIds,
			footerShown
		};
	},
	watch: {
		selectedIds: {
			handler(values: string[]) {
				this.$store.commit(MUTATION.SET.SELECTED_IDS, values);
				// TODO: save to file if remember me checkbox is checked
			},
			deep: true
		},
		keyword(value: string) {
			this.$store.commit(MUTATION.SET.CURRENT, { keyword: value } as Current);
		},
		activeOnly(value: boolean) {
			this.$store.commit(MUTATION.SET.CURRENT, { activeOnly: value } as Current);
		},
		sortCriteria: {
			handler(value: SortCriteria) {
				this.$store.commit(MUTATION.SET.CURRENT, { sortCriteria: value } as Current);
			},
			deep: true
		}
	},
	computed: {
		...mapGetters({
			surveys: GETTER.SURVEYS,
			isLoading: GETTER.IS_LOADING
		})
	},
	methods: {
		goToExportOptions() {
			const { SURVEY } = PATH;
			const { EXPORT } = SURVEY;
			this.$router.push({ path: SURVEY.URI + EXPORT.OPTIONS.URI, name: EXPORT.OPTIONS.NAME });
		},
		reload() {
			// TODO:
			this.$store.commit(MUTATION.SET.CURRENT, { isLoading: true } as Current);
			setTimeout(() => {
				this.$store.commit(MUTATION.SET.CURRENT, { isLoading: false } as Current);
			}, 3000);
		}
	}
});
</script>
