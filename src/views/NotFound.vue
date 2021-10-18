<template>
	<div class="min-h-screen pt-16 pb-12 flex flex-col bg-white">
		<main class="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex-shrink-0 flex justify-center">
				<a href="/" class="inline-flex">
					<span class="sr-only">Qualtrics Response Exporter</span>
					<img class="h-16 w-auto" src="logo.png" alt="Qualtrics Response Exporter" />
				</a>
			</div>
			<div class="py-16">
				<div class="text-center">
					<p class="text-sm font-semibold text-blue-600 uppercase tracking-wide">404 error</p>
					<h1 class="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found.</h1>
					<p class="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>
					<div class="mt-6">
						<a href="#" @click="goBackHome" class="text-base font-medium text-blue-600 hover:text-blue-500">Go back home<span aria-hidden="true"> &rarr;</span></a>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PATH from '@/reference/path';

export default defineComponent({
	methods: {
		goBackHome() {
			this.$router.push({ path: PATH.HOME });
		}
	}
});
</script>
