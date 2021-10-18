<!-- This example requires Tailwind CSS v2.0+ -->
<template>
	<Disclosure as="nav" class="bg-white" v-slot="{ open }">
		<div class="mx-auto px-6 lg:pl-0 shadow">
			<div class="relative flex justify-between h-16">
				<div class="absolute inset-y-0 left-0 flex items-center lg:hidden">
					<!-- mobile menu button -->
					<DisclosureButton
						class="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
						:class="open ? 'bg-blue-100' : ''"
					>
						<span class="sr-only">Open main menu</span>
						<MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
						<XIcon v-else class="block h-6 w-6" aria-hidden="true" />
					</DisclosureButton>
				</div>
				<div class="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start">
					<div class="flex-shrink-0 flex items-center">
						<h1 class="block lg:hidden h-8 w-auto text-xl font-semibold mt-1">Survey List</h1>
						<!-- <img class="hidden lg:block h-8 w-auto" src="logo.png" alt="Qualtrics Response Exporter" /> -->
					</div>
					<div class="hidden lg:flex lg:space-x-8">
						<ol role="list" class="rounded-md overflow-hidden lg:flex lg:border-gray-200 lg:rounded-none">
							<li v-for="(step, stepIdx) in steps" :key="step.id" class="relative overflow-hidden lg:flex-2">
								<div :class="stepIdx === (steps.length - 1) ? 'hover:border-r' : ''">
									<a
										:href="step.href"
										:class="step.status !== 'current' ? 'group' : ''"
										:aria-current="step.status === 'current' ? 'step' : ''"
									>
										<!-- bottom border -->
										<span
											class="absolute top-0 left-0 w-1 h-full lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
											:class="step.status === 'current' ? 'bg-blue-600' : 'bg-transparent group-hover:bg-gray-200'"
											aria-hidden="true"
										/>
										<span class="px-6 py-3 flex items-start text-sm font-medium">
											<span class="flex-shrink-0">
												<!-- step icon -->
												<span v-if="step.status === 'complete'"
													class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-blue-500">
													<CheckIcon class="w-5 h-5 text-blue-500" aria-hidden="true" />
												</span>
												<span v-else-if="step.status === 'current'"
													class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600">
													<span class="text-white text-xs font-bold">{{ step.id }}</span>
												</span>
												<span v-else
													class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300">
													<span class="text-gray-500 text-xs">{{ step.id }}</span>
												</span>
											</span>
											<span class="mt-0.5 ml-4 min-w-0 flex flex-col">
												<!-- step name -->
												<span v-if="step.status === 'complete'"
													class="text-xs font-semibold tracking-wide uppercase">{{ step.name }}</span>
												<span v-else-if="step.status === 'current'"
													class="text-xs font-semibold text-blue-600 tracking-wide uppercase">{{ step.name }}</span>
												<span v-else
													class="text-xs font-semibold text-gray-500 tracking-wide uppercase">{{ step.name }}</span>
												<!-- step description -->
												<span v-if="step.status === 'complete'"
													class="text-sm font-medium text-gray-500">{{ step.description }}</span>
												<span v-else-if="step.status === 'current'"
													class="text-sm font-medium text-gray-500">{{ step.description }}</span>
												<span v-else
													class="text-sm font-medium text-gray-500">{{ step.description }}</span>
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
				<div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
					<!-- profile dropdown -->
					<Menu as="div" class="ml-3 relative">
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
									<a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Your Profile</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Settings</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
									<a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign out</a>
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
					<li v-for="(step, stepIdx) in steps" :key="step.id" class="relative overflow-hidden">
						<div :class="[stepIdx === 0 ? 'border-b-0 border-t-0' : '', stepIdx === steps.length - 1 ? 'border-t-0' : '', 'border border-gray-200 overflow-hidden']">
							<a
								:href="step.href"
								:class="step.status !== 'current' ? 'group' : ''"
								:aria-current="step.status === 'current' ? 'step' : ''"
							>
								<!-- left border -->
								<span
									class="absolute top-0 left-0 w-1 h-full"
									:class="step.status === 'current' ? 'bg-blue-600' : 'bg-transparent group-hover:bg-gray-300'"
									aria-hidden="true" />
								<span class="px-6 py-3 flex items-start text-sm font-medium">
									<span class="flex-shrink-0">
										<!-- step icon -->
										<span v-if="step.status === 'complete'"
											class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-blue-500">
											<CheckIcon class="w-5 h-5 text-blue-500" aria-hidden="true" />
										</span>
										<span v-else-if="step.status === 'current'"
											class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600">
											<span class="text-white text-xs font-bold">{{ step.id }}</span>
										</span>
										<span v-else
											class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300">
											<span class="text-gray-500 text-xs">{{ step.id }}</span>
										</span>
									</span>
									<span class="mt-0.5 ml-4 min-w-0 flex flex-col">
										<!-- step name -->
										<span v-if="step.status === 'complete'"
											class="text-xs font-semibold tracking-wide uppercase">{{ step.name }}</span>
										<span v-else-if="step.status === 'current'"
											class="text-xs font-semibold text-blue-600 tracking-wide uppercase">{{ step.name }}</span>
										<span v-else
											class="text-xs font-semibold text-gray-500 tracking-wide uppercase">{{ step.name }}</span>
										<!-- step description -->
										<span v-if="step.status === 'complete'"
											class="text-sm font-medium text-gray-500">{{ step.description }}</span>
										<span v-else-if="step.status === 'current'"
											class="text-sm font-medium text-gray-500">{{ step.description }}</span>
										<span v-else
											class="text-sm font-medium text-gray-500">{{ step.description }}</span>
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
import { defineComponent } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { MenuIcon, XIcon, UserCircleIcon, CheckIcon } from '@heroicons/vue/outline';

const steps = [
	{ id: '01', name: 'Survey List', description: 'Select survey you want to export', href: '#', status: 'complete' },
	{ id: '02', name: 'Export Options', description: 'Format, compress, continuation, etc', href: '#', status: 'current' },
	{ id: '03', name: 'Export Progress', description: 'Monitor progress and remaining items', href: '#', status: 'upcoming' }
];

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
	setup() {
		return {
			steps
		};
	}
});
</script>
