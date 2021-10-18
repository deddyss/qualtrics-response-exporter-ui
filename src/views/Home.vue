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
import PATH from '@/reference/path';

export default defineComponent({
	mounted() {
		setTimeout(() => {
			this.$router.push({
				path: PATH.SIGNIN.URI,
				name: PATH.SIGNIN.NAME
			});
		}, 1000);
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
