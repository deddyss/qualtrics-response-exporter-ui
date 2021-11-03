<template>
	<div>
		<header class="relative h-72 bg-gray-100">
			<div class="absolute inset-0">
				<img class="w-full h-full object-cover" src="background.svg" alt="" />
				<div class="absolute inset-0 bg-gray-100 mix-blend-multiply" aria-hidden="true" />
			</div>
			<div class="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 sm:py-24 md:py-28">
				<h1 class="text-3xl font-bold text-white leading-tight">Settings</h1>
			</div>
		</header>

		<main class='relative -mt-36 sm:-mt-32 md:-mt-28 max-w-7xl mx-auto px-6 lg:px-8'>
			<ul class="bg-white shadow-xl rounded-2xl divide-y max-w-7xl mx-auto">
				<li
					v-for="question in questions" :key="question.id"
					class="p-4 sm:px-6 lg:px-8 flex flex-wrap gap-4 sm:gap-6"
				>
					<div class="flex-1">
						<dt class="text-sm font-semibold text-gray-900">
							{{ question.title }}
						</dt>
						<dd class="text-sm text-gray-500">{{ question.description }}</dd>
						<p
							v-if="question.type === 'path'"
							class="text-sm text-blue-500 font-medium"
						>
							{{ localSettings[question.id] }}
						</p>
					</div>
					<div class="flex-shrink-0 w-full sm:mt-0 sm:w-auto">
						<span class="sr-only">{{ question.title }}</span>
						<!-- select -->
						<Select
							v-if="question.type === 'select'"
							:options="toSelectOptions(question.options)"
							v-model="localSettings[question.id]"
							buttonClass="w-28 text-blue-500 font-medium hover:bg-blue-100 ocus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							optionClass="w-28"
						/>

						<!-- boolean -->
						<Switch
							v-else-if="question.type === 'boolean'"
							v-model="localSettings[question.id]"
							class=" mt-0 sm:mt-2 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "
							:class="localSettings[question.id] ? 'bg-blue-600' : 'bg-gray-200'"
						>
							<span class="sr-only">{{ question.title }}</span>
							<span
								aria-hidden="true"
								class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
								:class="localSettings[question.id] ? 'translate-x-5' : 'translate-x-0'"
							/>
						</Switch>

						<!-- path -->
						<div v-else-if="question.type === 'path'">
							<button
								type="button"
								class="relative w-28 text-left h-10 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500"
								@click="triggerDirectorySelector"
							>
								browse ...
							</button>
						</div>
					</div>
				</li>
			</ul>

			<div class="pt-6 pb-6 sm:pt-8 sm:pb-8 flex justify-start sm:justify-end">
				<button
					type="button"
					class="relative w-full sm:w-44 text-center h-10 sm:h-12 px-4 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					@click="goBack"
				>
					<ArrowSmLeftIcon class="h-5 sm:h-6 -ml-3 -mt-0.5 text-white inline" aria-hidden="true" />
					Go back
				</button>
			</div>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, toRaw } from 'vue';
import { useStore } from 'vuex';
import { Switch } from '@headlessui/vue';
import { ArrowSmLeftIcon } from '@heroicons/vue/outline';
import Select from '@/components/Select.vue';
import { ACTION, MUTATION } from '@/reference/store';
import { Qualtrics, SelectOption, Settings, State } from '@/types';

interface Setting {
	id: string;
	title: string;
	description: string;
	type: 'boolean' | 'select' | 'path';
	options?: string[];
}

const questions: Array<Setting> = [
	{
		id: 'rememberMe',
		title: 'Remember me',
		description: 'When this option is enabled, the application will remember your Qualtrics API token so you don\'t have to sign-in manually. Conversely, stored API token will be deleted',
		type: 'boolean'
	},
	{
		id: 'navigationMenuPosition',
		title: 'Navigation menu position',
		description: 'By default, navigation menu position will be left aligned. But you can change it to the center as well',
		type: 'select',
		options: ['left', 'center']
	},
	{
		id: 'exportDirectory',
		title: 'Export directory',
		description: 'All successfully exported survey responses will be saved to this directory',
		type: 'path'
	}
];

export default defineComponent({
	components: {
		Switch,
		Select,
		ArrowSmLeftIcon
	},
	setup() {
		const store = useStore<State>();
		const localSettings = ref<Settings>({ ...store.state.settings });
		return {
			questions,
			localSettings
		};
	},
	watch: {
		localSettings: {
			handler(settings: Settings) {
				this.$store.dispatch(ACTION.SAVE_SETTINGS, toRaw(settings));

				const { apiToken } = this.$store.state.qualtrics;
				// unset api token if remember-me option value is false
				if (settings.rememberMe === false && apiToken !== undefined) {
					this.$store.commit(MUTATION.SET.QUALTRICS, { apiToken: undefined } as Partial<Qualtrics>);
					this.$store.dispatch(ACTION.SAVE_QUALTRICS);
				}
			},
			deep: true
		}
	},
	methods: {
		toSelectOptions(strings: Array<string>): Array<SelectOption> {
			const options: Array<string> = [...strings];
			return options.map((value: string) => ({ value, label: value } as SelectOption));
		},
		triggerDirectorySelector() {
			if (window.api) {
				window.api.selectDirectory(
					this.localSettings.exportDirectory
				).then((path: string) => {
					this.localSettings.exportDirectory = path;
				});
			}
		},
		goBack() {
			this.$router.back();
		}
	}
});
</script>
