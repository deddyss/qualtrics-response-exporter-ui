<!-- This example requires Tailwind CSS v2.0+ -->
<template>
	<Disclosure as="nav" class="bg-white" v-slot="{ open }">
		<div class="mx-auto px-6 lg:pl-0 shadow bg-gray-50">
			<div class="relative flex justify-between h-20">
				<div class="absolute inset-y-0 left-0 flex items-center lg:hidden">
					<!-- mobile menu button -->
					<DisclosureButton
						class="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
						:class="[
							open ? 'bg-blue-100' : '',
							disabled ? 'opacity-50' : ''
						]"
					>
						<span class="sr-only">Open main menu</span>
						<MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
						<XIcon v-else class="block h-6 w-6" aria-hidden="true" />
					</DisclosureButton>
				</div>
				<div
					class="flex-1 flex items-stretch justify-center"
					:class="menuPosition === 'center' ? 'lg:justify-center' : 'lg:justify-start'"
				>
					<div class="flex-shrink-0 flex items-center">
						<!-- <img class="block lg:hidden h-8 w-auto mr-2" src="logo.png" alt="Qualtrics Response Exporter" /> -->
						<h1 class="block lg:hidden h-8 w-auto text-xl font-semibold mt-1">{{ title }}</h1>
					</div>
					<div class="hidden lg:flex lg:space-x-8">
						<ol role="list" class="rounded-md overflow-hidden lg:flex lg:border-gray-200 lg:rounded-none">
							<li
								v-for="(step, stepIdx) in steps"
								:key="step.id"
								class="relative overflow-hidden lg:flex-2"
							>
								<div :class="stepIdx === (steps.length - 1) ? 'hover:border-r' : ''">
									<a
										href="javascript:;"
										@click.prevent="click(step)"
										:class="[
											step.status !== 'current' ? 'group' : '',
											disabled ? 'cursor-not-allowed opacity-50' : ''
										]"
										:aria-current="step.status === 'current' ? 'step' : ''"
									>
										<!-- bottom border -->
										<span
											class="absolute top-0 left-0 w-1 h-full lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
											:class="step.status === 'current' ? 'bg-blue-600' : !disabled ? 'bg-transparent group-hover:bg-gray-200' : ''"
											aria-hidden="true"
										/>
										<span class="px-6 py-5 flex items-start text-sm font-medium">
											<span class="flex-shrink-0 pt-0">
												<!-- step icon -->
												<span v-if="step.status === 'complete'"
													class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-blue-500"
													:class="disabled ? 'opacity-50' : ''"
												>
													<CheckIcon class="w-5 h-5 text-blue-500" aria-hidden="true" />
												</span>
												<span v-else-if="step.status === 'current'"
													class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600"
													:class="disabled ? 'opacity-50' : ''"
												>
													<span class="text-white text-xs font-bold">{{ step.id }}</span>
												</span>
												<span v-else
													class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300"
													:class="disabled ? 'opacity-50' : ''"
												>
													<span class="text-gray-500 text-xs">{{ step.id }}</span>
												</span>
											</span>
											<span class="mt-0.5 ml-4 min-w-0 flex flex-col">
												<!-- step name -->
												<span v-if="step.status === 'complete'"
													class="text-xs font-semibold text-gray-600 tracking-wide uppercase"
													:class="disabled ? 'opacity-70': ''"
												>{{ step.name }}</span>
												<span v-else-if="step.status === 'current'"
													class="text-xs font-bold text-blue-700 tracking-wide uppercase"
													:class="disabled ? 'opacity-70': ''"
												>{{ step.name }}</span>
												<span v-else
													class="text-xs font-semibold text-gray-500 tracking-wide uppercase"
													:class="disabled ? 'opacity-70': ''"
												>{{ step.name }}</span>
												<!-- step description -->
												<span
													class="text-sm font-medium text-gray-500 truncate"
													:class="disabled ? 'opacity-70': ''"
												>{{ step.description }}</span>
											</span>
										</span>
									</a>

									<template v-if="(stepIdx !== 0)">
										<!-- separator -->
										<div class="hidden absolute top-0 left-0 w-3 inset-0 lg:block" aria-hidden="true">
											<svg class="h-full w-full text-gray-300" viewBox="0 0 12 82" fill="none" preserveAspectRatio="none">
												<path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vector-effect="non-scaling-stroke" />
											</svg>
										</div>
									</template>
								</div>
							</li>
						</ol>
					</div>
				</div>
				<div class="absolute inset-y-0 right-0 flex items-center lg:pr-2 static">
					<!-- profile dropdown -->
					<Menu as="div" class="relative">
						<div>
							<MenuButton class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								<span class="sr-only">Open user menu</span>
								<UserCircleIcon class="h-8 w-8 text-blue-600" aria-hidden="true" />
							</MenuButton>
						</div>
						<transition
							enter-active-class="transition ease-out duration-200"
							enter-from-class="transform opacity-0 scale-95"
							enter-to-class="transform opacity-100 scale-100"
							leave-active-class="transition ease-in duration-75"
							leave-from-class="transform opacity-100 scale-100"
							leave-to-class="transform opacity-0 scale-95"
						>
							<MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
								<MenuItem v-slot="{ active }">
									<a href="#"
										@click.prevent="profile"
										:class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
									>Your Profile</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="javascript:;"
										@click.prevent="signOut"
										:class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
									>Sign out</a>
								</MenuItem>
							</MenuItems>
						</transition>
					</Menu>
				</div>
			</div>
		</div>

		<DisclosurePanel class="lg:hidden">
			<div class="pb-0 space-y-1">
				<ol role="list" class="overflow-hidden shadow">
					<li
						v-for="(step, stepIdx) in steps"
						:key="step.id"
						class="relative overflow-hidden"
					>
						<div :class="[stepIdx === 0 ? 'border-b-0 border-t-0' : '', stepIdx === steps.length - 1 ? 'border-t-0' : '', 'border border-gray-200 overflow-hidden']">
							<a
								href="javascript:;"
								@click.prevent="click(step)"
								:class="[
									step.status !== 'current' ? 'group' : '',
									disabled ? 'cursor-not-allowed opacity-50' : ''
								]"
								:aria-current="step.status === 'current' ? 'step' : ''"
							>
								<!-- left border -->
								<span
									class="absolute top-0 left-0 w-1 h-full"
									:class="step.status === 'current' ? 'bg-blue-600' : !disabled ? 'bg-transparent group-hover:bg-gray-200' : ''"
									aria-hidden="true" />
								<span class="px-6 py-3 flex items-start text-sm font-medium">
									<span class="flex-shrink-0">
										<!-- step icon -->
										<span v-if="step.status === 'complete'"
											class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-blue-500"
											:class="disabled ? 'opacity-50' : ''"
										>
											<CheckIcon class="w-5 h-5 text-blue-500" aria-hidden="true" />
										</span>
										<span v-else-if="step.status === 'current'"
											class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600"
											:class="disabled ? 'opacity-50' : ''"
										>
											<span class="text-white text-xs font-bold">{{ step.id }}</span>
										</span>
										<span v-else
											class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300"
											:class="disabled ? 'opacity-50' : ''"
										>
											<span class="text-gray-500 text-xs">{{ step.id }}</span>
										</span>
									</span>
									<span class="mt-0.5 ml-4 min-w-0 flex flex-col">
										<!-- step name -->
										<span v-if="step.status === 'complete'"
											class="text-xs font-semibold text-gray-600 tracking-wide uppercase"
											:class="disabled ? 'opacity-70': ''"
										>{{ step.name }}</span>
										<span v-else-if="step.status === 'current'"
											class="text-xs font-bold text-blue-700 tracking-wide uppercase"
											:class="disabled ? 'opacity-70': ''"
										>{{ step.name }}</span>
										<span v-else
											class="text-xs font-semibold text-gray-500 tracking-wide uppercase"
											:class="disabled ? 'opacity-70': ''"
										>{{ step.name }}</span>
										<!-- step description -->
										<span
											class="text-sm font-medium text-gray-500"
											:class="disabled ? 'opacity-70': ''"
										>{{ step.description }}</span>
									</span>
								</span>
							</a>
						</div>
					</li>
				</ol>
			</div>
		</DisclosurePanel>
	</Disclosure>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { MenuIcon, XIcon, UserCircleIcon, CheckIcon } from '@heroicons/vue/outline';
import { NavigationMenuItem } from '@/types';

interface StepItem extends NavigationMenuItem {
	id: string;
	status: 'upcoming' | 'current' | 'complete';
}

export default defineComponent({
	components: {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
		MenuIcon,
		XIcon,
		UserCircleIcon,
		CheckIcon
	},
	props: {
		menuItems: {
			type: Array as PropType<Array<NavigationMenuItem>>,
			required: false,
			default: () => []
		},
		menuPosition: {
			type: String,
			required: false,
			default: 'left'
		},
		currentPath: {
			type: String,
			required: false,
			default: ''
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: [
		'click',
		'profile',
		'signout'
	],
	setup(props) {
		// const step = ref<number>(props.menuItems.length > 0 ? 0 : -1);
		const step = computed<number>(() => {
			if (props.currentPath) {
				return props.menuItems.findIndex((item) => item.path === props.currentPath);
			}
			return -1;
		});
		const steps = computed<Array<StepItem>>(() => {
			const result: Array<StepItem> = props.menuItems.map<StepItem>((menuItem, index) => ({
				...menuItem,
				...{
					id: `${index < 10 ? '0' : ''}${index + 1}`,
					status: step.value === index ? 'current' : (step.value < index ? 'upcoming' : 'complete')
				}
			}));
			return result;
		});
		const title = computed<string>(() => {
			if (props.currentPath) {
				return props.menuItems.find((item) => item.path === props.currentPath)?.name ?? '';
			}
			return '';
		});
		return {
			step,
			steps,
			title
		};
	},
	methods: {
		click(stepItem: StepItem): void {
			if (this.disabled) {
				return;
			}
			const { path, name, description } = stepItem;
			this.$emit('click', { path, name, description } as NavigationMenuItem);
		},
		profile(): void {
			this.$emit('profile');
		},
		signOut(): void {
			this.$emit('signout');
		}
	}
});
</script>
