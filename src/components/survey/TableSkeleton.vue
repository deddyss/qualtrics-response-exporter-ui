<template>
	<div class="flex flex-col">
		<div class="-my-2 overflow-x-auto -mx-2 sm:-mx-6 lg:-mx-8">
			<div
				class="py-6 align-middle inline-block min-w-full px-2 sm:px-6 lg:px-8 pb-10"
			>
				<div class="shadow-lg overflow-hidden border-b border-gray-200 rounded-lg">
					<table class="min-w-full divide-y divide-gray-100">
						<thead class="bg-white">
							<tr class="animate-pulse">
								<th scope="col" class="pl-6 py-4 w-12" title="Select / unselect all">
									<div class="rounded bg-blue-200 h-6 w-6"></div>
								</th>
								<th
									v-for="header in headers"
									:key="header.id" scope="col"
									class="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider"
									:class="header.class"
								>
									{{ header.name }}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(row, idx) in rows"
								:key="idx"
								class="animate-pulse"
								:class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
							>
								<td class="pl-7 py-4 whitespace-nowrap w-12">
									<div class="rounded bg-blue-200 h-4 w-4"></div>
								</td>
								<td class="px-6 py-4 w-auto">
									<div class="rounded h-4 bg-gray-200" :class="row.class"></div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center w-32">
									<div class="rounded-full h-4 w-20" :class="row.isActive ? 'bg-green-200' : 'bg-gray-200'"></div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap w-36 hidden lg:table-cell">
									<div class="rounded-full bg-gray-200 h-4 w-28"></div>
								</td>
								<td class="px-4 py-4 whitespace-nowrap w-36 hidden lg:table-cell">
									<div class="rounded-full bg-gray-200 h-4 w-28"></div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Header } from '@/types';

interface DummyRow {
	class: string;
	isActive?: boolean;
}

const headers: Array<Header> = [
	{ id: 'name', name: 'Name', class: 'text-left w-auto' },
	{ id: 'isActive', name: 'Status', class: 'text-center whitespace-nowrap w-32' },
	{ id: 'creationDate', name: 'Creation Date', class: 'text-center whitespace-nowrap hidden lg:table-cell w-36' },
	{ id: 'lastModified', name: 'Last Modified', class: 'text-center whitespace-nowrap hidden lg:table-cell w-36' }
];

const rows: Array<DummyRow> = [
	{ class: 'w-1/2', isActive: true },
	{ class: 'w-3/4', isActive: true },
	{ class: 'w-2/3', isActive: true },
	{ class: 'w-3/4', isActive: true },
	{ class: 'w-full', isActive: true }
];

export default defineComponent({
	setup() {
		return {
			headers,
			rows
		};
	}
});
</script>
