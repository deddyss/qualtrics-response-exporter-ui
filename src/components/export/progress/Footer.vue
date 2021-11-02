<template>
	<TransitionRoot as="template"
		enter="transform transition ease-in duration-200"
		enter-from="translate-y-full"
		enter-to="translate-y-0"
		leave="transform transition ease-out duration-200"
		leave-from="translate-y-0"
		leave-to="translate-y-full"
		:show="shown"
	>
		<div
			class="fixed z-20 inset-x-0 bottom-0"
		>
			<div class="bg-green-600">
				<div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
					<div class="flex items-center justify-between flex-wrap">
						<div class="flex-1 flex items-center">
							<p class="ml-3 font-medium text-white truncate">
								Export process has been completed
							</p>
						</div>
						<div class="order-1 mt-2 px-3 sm:px-0 flex-shrink-0 w-full md:mt-0 md:w-auto">
							<a href="javascript:;"
								class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50"
								@click="openExportDirectory"
							>
								Open export directory
							</a>
						</div>
						<div class="order-2 md:ml-2 mt-2 px-3 sm:px-0 flex-shrink-0 w-full md:mt-0 md:w-auto">
							<a href="javascript:;"
								class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800"
								@click="startOver"
							>
								Start over
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</TransitionRoot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TransitionRoot } from '@headlessui/vue';

export default defineComponent({
	components: {
		TransitionRoot
	},
	props: {
		shown: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: [
		'openExportDirectory',
		'startOver'
	],
	methods: {
		openExportDirectory() {
			this.$emit('openExportDirectory');
		},
		startOver() {
			this.$emit('startOver');
		}
	}
});
</script>
