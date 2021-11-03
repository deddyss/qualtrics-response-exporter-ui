<template>
	<div class='flex justify-center items-center bg-white h-screen space-x-2'>
		<div class='bg-blue-500 w-3 h-3 rounded-full animate-bounce circle'></div>
		<div class='bg-blue-600 w-3 h-3 rounded-full animate-bounce circle'></div>
		<div class='bg-blue-700 w-3 h-3 rounded-full animate-bounce circle'></div>
		<div class='bg-blue-800 w-3 h-3 rounded-full animate-bounce circle'></div>
	</div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { ROUTE } from '@/reference/path';
import { ACTION, GETTER } from '@/reference/store';

const DELAY_TIME = 3_000;

export default defineComponent({
	computed: {
		...mapGetters({
			isAppReady: GETTER.IS_APP_READY,
			isUserAuthorized: GETTER.IS_USER_AUTHORIZED
		}),
		authorizationError(): string {
			return this.$store.state.qualtrics.errorMessage ?? '';
		}
	},
	watch: {
		isAppReady(ready: boolean) {
			if (ready) {
				// give some delay
				setTimeout(() => {
					this.autoLoginOrGoToSignInPage();
				}, DELAY_TIME);
			}
		},
		isUserAuthorized(authorized: boolean) {
			if (authorized) {
				this.$router.push(ROUTE.SURVEY_LIST);
			}
		},
		authorizationError() {
			this.goToSignInPage();
		}
	},
	methods: {
		autoLoginOrGoToSignInPage() {
			const { rememberMe } = this.$store.state.settings;
			const { dataCenter, apiToken } = this.$store.state.qualtrics;

			if (rememberMe && apiToken) {
				// auto login
				this.$store.dispatch(ACTION.SIGN_IN, { apiToken, dataCenter });
			}
			else {
				this.goToSignInPage();
			}
		},
		goToSignInPage() {
			this.$router.push(ROUTE.SIGN_IN);
		}
	}
});
</script>

<style scoped>
.circle:nth-child(1) {
	animation-delay: 0.1s;
}
.circle:nth-child(2) {
	animation-delay: 0.2s;
}
.circle:nth-child(3) {
	animation-delay: 0.3s;
}
.circle:nth-child(4) {
	animation-delay: 0.4s;
}
</style>
