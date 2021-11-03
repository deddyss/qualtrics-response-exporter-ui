<template>
	<div>

		<Toolbar
			v-model:keyword="keyword"
			v-model:activeOnly="activeOnly"
			v-model:sortCriteria="sortCriteria"
			:isLoading="isLoading"
			@reload="reload"
		/>

		<!-- <TableSkeleton v-if="surveys.length === 0 && isLoading"/> -->
		<TableSkeleton v-if="isLoading"/>
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
import { ACTION, GETTER, MUTATION } from '@/reference/store';
import { Current, SortCriteria, State, Survey } from '@/types';
import { ROUTE } from '@/reference/path';

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
		const sortCriteria = ref<SortCriteria>({ ...store.state.current.sortCriteria });
		const selectedIds = ref<Array<string>>([...store.state.selectedIds]);
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
			this.$store.commit(MUTATION.SET.CURRENT, { keyword: value } as Partial<Current>);
		},
		activeOnly(value: boolean) {
			this.$store.commit(MUTATION.SET.CURRENT, { activeOnly: value } as Partial<Current>);
		},
		sortCriteria: {
			handler(value: SortCriteria) {
				this.$store.commit(MUTATION.SET.CURRENT, { sortCriteria: value } as Partial<Current>);
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
	mounted() {
		this.$nextTick(() => {
			const isSurveysEmpty = (this.surveys as Survey[]).length === 0;
			if (isSurveysEmpty) {
				this.$store.dispatch(ACTION.RETRIEVE_SURVEYS);
			}
		});
	},
	methods: {
		goToExportOptions() {
			this.$router.push(ROUTE.EXPORT_OPTIONS);
		},
		reload() {
			// TODO:
			this.selectedIds = [];
			this.$store.dispatch(ACTION.RETRIEVE_SURVEYS);
		}
	}
});
</script>
