<template>
	<div>
		<Toolbar
			v-model:keyword="keyword"
			v-model:activeOnly="activeOnly"
			v-model:sortCriteria="sortCriteria"
		/>
		<Table
			v-model:selectedIds="selectedIds"
			:surveys="surveys"
			:keyword="keyword"
			:activeOnly="activeOnly"
			:sortCriteria="sortCriteria"
		/>
		<Footer
			:selectedIds="selectedIds"
			@proceed="goToExportOptions"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters, useStore } from 'vuex';
import Toolbar from '@/components/survey/Toolbar.vue';
import Table from '@/components/survey/Table.vue';
import Footer from '@/components/survey/Footer.vue';
import { GETTER, MUTATION } from '@/reference/store';
import { SortCriteria, State } from '@/types';
import PATH from '@/reference/path';

export default defineComponent({
	components: {
		Toolbar,
		Table,
		Footer
	},
	setup() {
		const store = useStore<State>();
		const selectedIds = ref<Array<string>>(store.state.selectedIds);
		// TODO: keyword should retrieved from and set to store
		const keyword = ref<string>('');
		// TODO: activeOnly should retrieved from and set to store
		const activeOnly = ref<boolean>(false);
		// TODO: sortCriteria should retrieved from and set to store
		const sortCriteria = ref<SortCriteria>({ by: 'lastModified', order: 'descending' });
		return {
			selectedIds,
			keyword,
			activeOnly,
			sortCriteria
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
			// TODO: store commit
			console.log('keyword', value);
		},
		activeOnly(value: boolean) {
			// TODO: store commit
			console.log('activeOnly', value);
		},
		sortCriteria: {
			handler(value: SortCriteria) {
				// TODO: store commit
				console.log('sortCriteria', value);
			},
			deep: true
		}
	},
	computed: {
		...mapGetters({
			surveys: GETTER.SURVEYS
		})
	},
	methods: {
		goToExportOptions() {
			const { SURVEY } = PATH;
			const { EXPORT } = SURVEY;
			this.$router.push({ path: SURVEY.URI + EXPORT.OPTIONS.URI, name: EXPORT.OPTIONS.NAME });
		}
	}
});
</script>
