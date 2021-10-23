<template>
	<TransitionRoot as="template"
		enter="transform transition ease-in-out duration-200"
		enter-from="translate-y-full"
		enter-to="translate-y-0"
		leave="transform transition ease-in-out duration-200"
		leave-from="translate-y-0"
		leave-to="translate-y-full"
		:show="selectedIds.length > 0"
	>
		<div
			class="fixed z-20 inset-x-0 bottom-0"
		>
			<div class="bg-blue-600">
				<div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
					<div class="flex items-center justify-between flex-wrap">
						<div class="flex-1 flex items-center">
							<p class="ml-3 font-medium text-white truncate">
								<span :class="selectedIds.length > 0 ? 'inline' : 'hidden'">
									{{ selectedIds.length }} survey{{ selectedIds.length > 1 ? 's have' : ' has' }} been selected
								</span>
							</p>
						</div>
						<div class="order-1 mt-2 px-3 sm:px-0 flex-shrink-0 w-full sm:mt-0 sm:w-auto">
							<a href="javascript:;"
								class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
								@click="proceed"
							>
								Proceed
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</TransitionRoot>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TransitionRoot } from '@headlessui/vue';

export default defineComponent({
	components: {
		TransitionRoot
	},
	props: {
		selectedIds: {
			type: Array as PropType<Array<string>>,
			required: false,
			default: () => []
		}
	},
	emits: [
		'proceed'
	],
	methods: {
		proceed() {
			this.$emit('proceed');
		}
	}
});
</script>
