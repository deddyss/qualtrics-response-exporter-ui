<template>
	<template v-if="question.type === 'select'">
		<div class="flex-1">
			<dt class="text-sm font-semibold text-gray-900">
				{{ question.title }}
				<span v-if="question.required" class="text-red-600">*</span>
			</dt>
			<dd class="text-sm text-gray-500">{{ question.description }}</dd>
		</div>
		<div class="flex-shrink-0 w-full sm:mt-0 sm:w-auto">
			<span class="sr-only">{{ question.title }}</span>
			<Select
				:options="toSelectOptions(question.options)"
				v-model="questionValue"
				:buttonClass="question.id === 'format' ? 'w-28 text-blue-500 font-semibold' : 'w-72 text-blue-500 font-semibold'"
				:optionClass="question.id === 'format' ? 'w-28' : 'w-72'"
			/>
		</div>
	</template>
	<!-- boolean -->
	<SwitchGroup v-else as="template">
		<div class="flex-1">
			<SwitchLabel as="dt" class="text-sm font-semibold text-gray-900">
				{{ question.title }}
				<span v-if="question.required" class="text-red-600">*</span>
			</SwitchLabel>
			<SwitchDescription as="dd" class="text-sm text-gray-500">{{ question.description }}</SwitchDescription>
		</div>
		<div class="flex-shrink-0 w-full sm:mt-0 sm:w-auto">
			<Switch
				v-model="questionValue"
				class=" mt-0 sm:mt-1 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				:class="questionValue ? 'bg-blue-600' : 'bg-gray-200'"
			>
				<span class="sr-only">{{ question.title }}</span>
				<span
					aria-hidden="true"
					class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
					:class="questionValue ? 'translate-x-5' : 'translate-x-0'"
				/>
			</Switch>
		</div>
	</SwitchGroup>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import Select from '@/components/Select.vue';
import { ExportOptionQuestion, SelectOption } from '@/types';

export default defineComponent({
	components: {
		Switch,
		SwitchDescription,
		SwitchGroup,
		SwitchLabel,
		Select
	},
	props: {
		question: {
			type: Object as PropType<ExportOptionQuestion>,
			required: true
		},
		modelValue: {
			type: [String, Boolean],
			required: true
		}
	},
	emits: [
		'update:modelValue'
	],
	setup(props, { emit }) {
		const questionValue = ref<string | boolean>(props.modelValue);
		watch(questionValue, (value?: string | boolean) => {
			emit('update:modelValue', value);
		});
		return {
			questionValue
		};
	},
	methods: {
		toSelectOptions(strings: Array<string>): Array<SelectOption> {
			const options: Array<string> = [...strings];
			if (!options.includes('')) {
				options.unshift('');
			}
			return options.map((value: string) => ({ value, label: value } as SelectOption));
		}
	}
});
</script>
