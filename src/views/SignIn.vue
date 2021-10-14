<template>
	<!-- eslint-disable max-len -->
	<main class='min-h-screen bg-white flex'>

		<div class='flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:w-1/2 lg:flex-none lg:px-20 xl:px-24'>
			<div class='mx-auto w-full max-w-sm lg:w-96'>
				<div>
					<img class='h-16 w-auto' src='logo.png' alt='Workflow' />
					<h2 class='mt-6 text-2xl font-extrabold text-gray-900'>
						Sign in to your account
					</h2>
				</div>

				<div class='mt-8'>
					<div class='mt-6'>
						<form @submit='signIn' class='space-y-6'>
							<div class='space-y-1'>
								<label for='apiToken' class='block text-sm font-medium text-gray-700'>
									Qualtrics API Token
								</label>
								<div class='mt-1'>
									<input
										id='apiToken'
										name='apiToken'
										v-model='apiToken'
										type='password'
										autocomplete='current-password'
										:disabled='signingIn'
										required
										v-focus
										class='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50' />
								</div>
							</div>

							<div>
								<label for='datacenter' class='block text-sm font-medium text-gray-700'>
									Qualtrics Data Center
								</label>
								<div class='mt-1'>
									<select-menu
										:options='dataCenters'
										v-model='dataCenter'
										:disabled='signingIn'
									/>
									<!-- <input id='datacenter' name='datacenter' type='email' autocomplete='email' required='' class='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' /> -->
								</div>
							</div>

							<div class='flex items-center justify-between'>
								<div class='flex items-center'>
									<input
										id='rememberMe'
										name='rememberMe'
										v-model='rememberMe'
										type='checkbox'
										:disabled='signingIn'
										class='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-default'
									/>
									<label for='remember-me' class='ml-2 block text-sm text-gray-900'>
										Remember me
									</label>
								</div>

								<div class='text-sm'>
									<a href='https://www.qualtrics.com/support/integrations/api-integration/overview/#GeneratingAnAPIToken' target='_blank' class='font-medium text-blue-600 hover:text-blue-500 visited:text-blue-500'>
										Forgot your API token?
									</a>
								</div>
							</div>

							<div>
								<button type='submit' class='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed' :disabled='signingIn'>
									<template v-if='signingIn'>
										<svg class='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
											<circle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle>
											<path class='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
										</svg>
										Processing
									</template>
									<template v-else>
										Sign in
									</template>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<div class='hidden lg:block relative w-0 flex-1 bg-blue-700'>
			<img class='absolute inset-0 h-full w-full object-cover' :src='background' alt='' />
		</div>

	</main>
</template>

<script lang='ts'>
import { computed, defineComponent, ref } from 'vue';
import SelectMenu from '@/components/SelectMenu.vue';
import BACKGROUNDS from '@/reference/images';
import { DATA_CENTERS } from '@/reference';
import { ApiError, SelectOption, User } from '@/types';

export default defineComponent({
	components: {
		SelectMenu
	},
	setup() {
		const background = computed<string>(
			() => BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
		);
		const dataCenters = computed<SelectOption[]>(() => {
			const entries = Object.entries(DATA_CENTERS);
			return entries.map((entry) => {
				const value = entry[0];
				const label = entry[1];
				const option: SelectOption = { value, label };
				return option;
			});
		});
		const dataCenter = ref<string>('syd1');
		const apiToken = ref<string>('');
		const rememberMe = ref<boolean>(false);
		const signingIn = ref<boolean>(false);
		return {
			background,
			dataCenters,
			dataCenter,
			apiToken,
			rememberMe,
			signingIn
		};
	},
	mounted() {
		if (window.api === undefined) {
			return;
		}
		window.api.on('signedIn', ({ user }: { user: User }) => {
			console.log('user', user);
			this.signingIn = false;
		});
		window.api.on('signInFailed', ({ error }: { error: ApiError }) => {
			console.log('error', error);
			this.signingIn = false;
		});
	},
	methods: {
		signIn(e: Event): void {
			e.preventDefault();
			/* eslint-disable prefer-destructuring */
			const apiToken = this.apiToken;
			const dataCenter = this.dataCenter;
			// TODO:
			console.log('window.api', window.api);
			console.log('window.api.signIn', window.api.signIn);
			window.api && window.api.signIn({ apiToken, dataCenter });
			this.signingIn = true;
		}
	}
});
</script>
