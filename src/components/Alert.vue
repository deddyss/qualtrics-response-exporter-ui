<template>
	<div class="rounded-md p-4" :class="backgroundClass">
		<div class="flex">
			<div class="flex-shrink-0">
				<XCircleIcon v-if="type === 'error'" class="h-5 w-5 text-red-500" aria-hidden="true" />
				<ExclamationIcon v-else-if="type === 'warning'" class="h-5 w-5 text-yellow-500" aria-hidden="true" />
				<CheckCircleIcon v-else-if="type === 'success'" class="h-5 w-5 text-green-500" aria-hidden="true" />
				<InformationCircleIcon v-else class="h-5 w-5 text-blue-500" aria-hidden="true" />
			</div>
			<div class="ml-3">
				<h3 class="text-sm font-medium" :class="titleClass">
					{{ title }}
				</h3>
				<div v-if="message !== undefined" class="mt-2 text-sm" :class="messageClass">
					<p>
						{{ message }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue';
import { InformationCircleIcon, CheckCircleIcon, ExclamationIcon, XCircleIcon } from '@heroicons/vue/solid';
import { AlertType } from '@/types';

export default defineComponent({
	components: {
		InformationCircleIcon,
		ExclamationIcon,
		XCircleIcon,
		CheckCircleIcon
	},
	props: {
		type: {
			type: String as PropType<AlertType>,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		message: {
			type: String,
			required: false
		}
	},
	setup(props) {
		const backgroundClass = computed<string>(() => {
			if (props.type === 'error') {
				return 'bg-red-50';
			}
			if (props.type === 'warning') {
				return 'bg-yellow-50';
			}
			if (props.type === 'success') {
				return 'bg-green-50';
			}
			return 'bg-blue-50';
		});
		const titleClass = computed<string>(() => {
			if (props.type === 'error') {
				return 'text-red-800';
			}
			if (props.type === 'warning') {
				return 'text-yellow-800';
			}
			if (props.type === 'success') {
				return 'text-green-800';
			}
			return 'text-blue-800';
		});
		const messageClass = computed<string>(() => {
			if (props.type === 'error') {
				return 'text-red-700';
			}
			if (props.type === 'warning') {
				return 'text-yellow-700';
			}
			if (props.type === 'success') {
				return 'text-green-700';
			}
			return 'text-blue-700';
		});
		return {
			backgroundClass,
			titleClass,
			messageClass
		};
	}
});
</script>
