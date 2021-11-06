<template>
	<div :class="footerShown ? 'pb-5' : 'pb-0'">
		<div>
			<!-- basic options -->
			<ul
				class="bg-white shadow-lg rounded-lg divide-y"
				:class="showAdvancedOptions ? 'rounded-b-none' : '' "
			>
				<li
					v-for="question in basicExportQuestions"
					:key="question.id"
					class="p-4 sm:px-6 lg:px-8 flex flex-wrap gap-4 sm:gap-6"
				>
					<Option :question="question" v-model="exportOptions[question.id]" />
				</li>
			</ul>

			<!-- advanced options -->
			<transition name="slidedown">
				<ul v-if="showAdvancedOptions" class="bg-white shadow-lg rounded-b-lg border-t divide-y">
					<li
						v-for="question in advancedExportQuestions"
						:key="question.id"
						class="p-4 sm:px-6 lg:px-8 flex flex-wrap gap-4 sm:gap-6"
					>
						<Option :question="question" v-model="exportOptions[question.id]" />
					</li>
				</ul>
			</transition>
		</div>

		<div class="px-4 py-4 mb-2 text-left lg:text-right">
			<a href="javascript:;"
				class="text-center font-medium text-blue-600 hover:text-blue-500"
				@click="toggleAdvancedQuestion"
			>
				Show {{ showAdvancedOptions ? 'less' : 'more' }} options
			</a>
		</div>

		<Footer :shown="footerShown" @proceed="startExport"/>
		<BackToTop :class="footerShown ? 'bottom-24' :  ''"/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import Option from '@/components/export/options/Option.vue';
import Footer from '@/components/export/options/Footer.vue';
import BackToTop from '@/components/BackToTop.vue';
import { BASIC, ADVANCED } from '@/reference/exportOptions';
import { Current, ExportOptionQuestion, ExportOptions, State } from '@/types';
import { ACTION, MUTATION } from '@/reference/store';
import { ROUTE } from '@/reference/path';

export default defineComponent({
	components: {
		Option,
		Footer,
		BackToTop
	},
	setup() {
		const store = useStore<State>();
		const showAdvancedOptions = ref<boolean>(store.state.current.showAdvancedOptions);
		const exportOptions = ref<ExportOptions>({ ...store.state.exportOptions });
		const footerShown = computed(() => exportOptions.value.format !== '');

		const basicExportQuestions = ref<Array<ExportOptionQuestion>>(BASIC);
		const advancedExportQuestions = ref<Array<ExportOptionQuestion>>(ADVANCED);

		return {
			showAdvancedOptions,
			exportOptions,
			footerShown,
			basicExportQuestions,
			advancedExportQuestions
		};
	},
	watch: {
		exportOptions: {
			handler(value: ExportOptions) {
				this.$store.commit(MUTATION.SET.EXPORT_OPTIONS, value);
			},
			deep: true
		}
	},
	methods: {
		toggleAdvancedQuestion() {
			this.showAdvancedOptions = !this.showAdvancedOptions;
			if (this.showAdvancedOptions === false) {
				// reset advanced options' value
				const resetAdvancedOptionValues: Partial<ExportOptions> = {};
				this.advancedExportQuestions.forEach((question) => {
					resetAdvancedOptionValues[question.id] = question.type === 'boolean' ? false : '';
				});
				// merge into export options
				this.exportOptions = { ...this.exportOptions, ...resetAdvancedOptionValues };
			}

			const { showAdvancedOptions } = this;
			this.$store.commit(MUTATION.SET.CURRENT, { showAdvancedOptions } as Partial<Current>);
		},
		startExport() {
			this.$store.dispatch(ACTION.EXPORT_RESPONSES).then(() => {
				this.$router.push(ROUTE.EXPORT_PROGRESS);
			});
		}
	}
});
</script>
