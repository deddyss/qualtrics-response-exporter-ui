<template>
	<div>
		<Toolbar
			v-model:sortCriteria="sortCriteria"
			v-model:activeOnly="activeOnly"
		/>
		<Table
			v-model:selectedIds="selectedIds"
			:surveys="surveys"
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
		// TODO: activeOnly should retrieved from and set to store
		const activeOnly = ref<boolean>(false);
		// TODO: sortCriteria should retrieved from and set to store
		const sortCriteria = ref<SortCriteria>({ by: 'lastModified', order: 'descending' });
		return {
			selectedIds,
			activeOnly,
			sortCriteria
		};
	},
	watch: {
		selectedIds: {
			handler(values: string[]) {
				this.$store.commit(MUTATION.SET.SELECTED_IDS, values);
				// TODO: store to file if remember me checkbox is checked
			},
			deep: true
		},
		sortCriteria: {
			handler(value: SortCriteria) {
				console.log(value);
			},
			deep: true
		},
		activeOnly(value: boolean) {
			console.log(value);
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
