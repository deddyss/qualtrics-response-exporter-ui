<template>
	<div>
		<Table :surveys="surveys" v-model:selectedIds="selectedIds"/>
		<Footer :selectedIds="selectedIds" @proceed="goToExportOptions"/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters, useStore } from 'vuex';
import Table from '@/components/survey/Table.vue';
import Footer from '@/components/survey/Footer.vue';
import { GETTER, MUTATION } from '@/reference/store';
import { State } from '@/types';
import PATH from '@/reference/path';

export default defineComponent({
	components: {
		Table,
		Footer
	},
	setup() {
		const store = useStore<State>();
		const selectedIds = ref<Array<string>>(store.state.selectedIds);
		return {
			selectedIds
		};
	},
	watch: {
		selectedIds: {
			handler(values: string[]) {
				this.$store.commit(MUTATION.SET.SELECTED_IDS, values);
				// TODO: store to file if remember me checkbox is checked
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
