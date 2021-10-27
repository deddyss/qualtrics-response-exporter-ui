<template>
	<TransitionRoot as="template" :show="open">
		<Dialog as="div"  class="fixed inset-0 overflow-hidden z-20" @close="open = false">
			<div class="absolute inset-0 overflow-hidden">
				<TransitionChild as="template"
					enter="ease-in-out duration-500"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="ease-in-out duration-500"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<DialogOverlay class="absolute inset-0 bg-gray-500 bg-opacity-30 transition-opacity" />
				</TransitionChild>

				<div class="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
					<TransitionChild as="template"
						enter="transform transition ease-in-out duration-500 sm:duration-700"
						enter-from="translate-x-full"
						enter-to="translate-x-0"
						leave="transform transition ease-in-out duration-500 sm:duration-700"
						leave-from="translate-x-0"
						leave-to="translate-x-full"
					>
						<div class="w-screen max-w-sm lg:max-w-md">
							<div class="h-full flex flex-col bg-white shadow-2xl">
								<!-- header -->
								<div class="px-4 py-6 sm:px-6 bg-blue-600 border-b-4 border-blue-600">
									<div class="flex items-start justify-between">
										<h2 id="slide-over-heading" class="text-lg font-medium text-white">
											Profile
										</h2>
										<div class="ml-3 h-7 flex items-center">
											<button type="button" class="rounded-md outline-none text-white hover:text-gray-300 focus:ring-2 focus:ring-white" @click="open = false">
												<span class="sr-only">Close panel</span>
												<XIcon class="h-6 w-6" aria-hidden="true" />
											</button>
										</div>
									</div>
								</div>
								<!-- main -->
								<div class="min-h-0 flex-1 flex flex-col overflow-y-auto">
									<div class="pb-1 sm:pb-6">
										<div>
											<div class="mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6">
												<div class="sm:flex-1">
													<div>
														<div class="flex items-center">
															<UserCircleIcon class="h-14 w-14 text-blue-500" aria-hidden="true" />
															<h3 class="ml-3 text-2xl font-bold capitalize leading-7 text-gray-900 sm:leading-9 sm:truncate">
																{{ user.firstName ? user.firstName.toLowerCase() : '' }} {{ user.lastName ? user.lastName.toLowerCase() : '' }}
															</h3>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="px-4 pt-5 pb-5 sm:px-0 sm:pt-0">
										<dl class="space-y-8 px-4 sm:px-6 sm:space-y-6">
											<div>
												<dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
													Email
												</dt>
												<dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
													{{ user.email }}
												</dd>
											</div>
											<div>
												<dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
													Username
												</dt>
												<dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
													{{ user.userName }}
												</dd>
											</div>
											<div>
												<dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
													Account Type
												</dt>
												<dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
													{{ user.accountType }}
												</dd>
											</div>
											<div>
												<dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
													Brand ID
												</dt>
												<dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
													{{ user.brandId }}
												</dd>
											</div>
											<div>
												<dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
													Data Center
												</dt>
												<dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
													{{ user.datacenter }}
												</dd>
											</div>
										</dl>
									</div>
								</div>
								<!-- footer -->
								<div class="flex-shrink-0 px-4 py-4 flex justify-end">
									<button type="button" class="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="signOut">
										Sign out
									</button>
								</div>
							</div>

						</div>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import {
	Dialog,
	DialogOverlay,
	TransitionChild,
	TransitionRoot
} from '@headlessui/vue';
import { XIcon, UserCircleIcon } from '@heroicons/vue/outline';
import { User } from '@/types';

/* eslint-disable @typescript-eslint/ban-types */
export default defineComponent({
	components: {
		Dialog,
		DialogOverlay,
		TransitionChild,
		TransitionRoot,
		XIcon,
		UserCircleIcon
	},
	props: {
		user: {
			type: Object as PropType<User>,
			required: true,
			default: () => ({})
		},
		shown: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: [
		'update:shown',
		'signout'
	],
	setup(props) {
		const open = ref(props.shown);
		return {
			open
		};
	},
	watch: {
		shown(value: boolean) {
			if (value === true) {
				setTimeout(() => {
					this.open = true;
				}, 100);
			}
		},
		open(value: boolean) {
			if (value === false) {
				this.$emit('update:shown', value);
			}
		}
	},
	methods: {
		signOut(): void {
			this.$emit('signout');
		}
	}
});
</script>
