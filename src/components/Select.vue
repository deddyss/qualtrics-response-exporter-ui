<template>
	<Listbox as="div" v-model="selected" :disabled="disabled">
		<div class="mt-1 relative">
			<ListboxButton
				class="relative bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-default"
				:class="buttonClass"
			>
				<span class="block truncate">{{ label ? label : '&nbsp;' }}</span>
				<span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
					<SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
				</span>
			</ListboxButton>

			<transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
				<ListboxOptions
					class="absolute z-10 mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm"
					:class="optionClass"
				>
					<ListboxOption as="template"
						v-for="option in options"
						:key="option.value"
						:value="option.value"
						v-slot="{ active, selected }">
						<li :class="[active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-8 pr-4']">
							<span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
								{{ option.label ? option.label : '&nbsp;' }}
							</span>

							<span v-if="selected && option.label !== ''" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 left-0 flex items-center pl-1.5']">
								<CheckIcon class="h-5 w-5" aria-hidden="true" />
							</span>
						</li>
					</ListboxOption>
				</ListboxOptions>
			</transition>
		</div>
	</Listbox>
</template>

<script lang='ts'>
import { PropType, computed, defineComponent, ref } from 'vue';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid';
import { SelectOption } from '@/types';

export default defineComponent({
	components: {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions,
		CheckIcon,
		SelectorIcon
	},
	props: {
		modelValue: {
			type: String,
			required: false,
			default: ''
		},
		options: {
			type: Array as PropType<Array<SelectOption>>,
			required: false,
			default: () => []
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		buttonClass: {
			type: String,
			required: false,
			default: 'w-full'
		},
		optionClass: {
			type: String,
			required: false,
			default: 'w-full'
		}
	},
	emits: [
		'update:modelValue'
	],
	setup(props) {
		const selected = ref(props.modelValue);
		const label = computed(() => {
			const option = props.options.find((item: SelectOption) => item.value === selected.value);
			return option?.label ?? '';
		});

		return {
			selected,
			label
		};
	},
	watch: {
		selected(value?: string) {
			this.$emit('update:modelValue', value);
		}
	}
});
</script>
