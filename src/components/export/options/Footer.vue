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
			<div class="bg-blue-600">
				<div class="max-w-7xl mx-auto py-3 px-6 lg:px-8">
					<div class="flex justify-end">
						<a href="javascript:;"
							class="flex-1 sm:flex-none text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
							@click="proceed"
						>
							Start export now
						</a>
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
		'proceed'
	],
	methods: {
		proceed() {
			this.$emit('proceed');
		}
	}
});
</script>
