<template>
	<!-- Global notification live region, render this permanently at the end of the document -->
	<div aria-live="assertive" class="fixed z-30 inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
		<div class="w-full flex flex-col items-center space-y-4 sm:items-end">
			<!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
			<transition
				enter-active-class="transform ease-out duration-300 transition"
				enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
				enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
				leave-active-class="transition ease-in duration-100"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<div v-if="shown"
					class="max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
					:class="backgroundClass"
				>
					<div class="p-4">
						<div class="flex items-start">
							<div class="flex-shrink-0">
								<XCircleIcon v-if="type === 'error'" class="h-6 w-6 text-red-500" aria-hidden="true" />
								<ExclamationIcon v-else-if="type === 'warning'" class="h-6 w-6 text-yellow-500" aria-hidden="true" />
								<CheckCircleIcon v-else-if="type === 'success'" class="h-6 w-6 text-green-500" aria-hidden="true" />
								<InformationCircleIcon v-else class="h-6 w-6 text-blue-500" aria-hidden="true" />
							</div>
							<div class="ml-3 w-0 flex-1 pt-0.5">
								<p class="text-sm font-medium text-gray-900">
									{{ title }}
								</p>
								<p v-for="(item, index) in messages" :key="item.id"
									class="text-sm text-gray-500"
									:class="index === 0 ? 'mt-1 text-gray-600' : ''"
								>
									{{ messages.length > 1 ? `&#8226; ` : '' }}{{ item.text }}
								</p>
								<div class="mt-4">
									<button type="button" class="w-28 flex px-3 py-2 border border-transparent shadow-sm text-sm leading-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="close" >
										<span class="flex-1 text-left">Close</span>
										<span class="flex-shrink-0 text-blue-300">{{ timeCounter > 0 ? `(${timeCounter}s)` : '' }}</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script lang='ts'>
import { defineComponent, ref, PropType, computed } from 'vue';
import { InformationCircleIcon, CheckCircleIcon, ExclamationIcon, XCircleIcon } from '@heroicons/vue/solid';
import { NotificationType } from '@/types';

interface Message {
	id: number;
	text: string;
}

const NOTIFICATION_TIME_IN_SECONDS = 30;

export default defineComponent({
	components: {
		InformationCircleIcon,
		ExclamationIcon,
		XCircleIcon,
		CheckCircleIcon
	},
	props: {
		type: {
			type: String as PropType<NotificationType>,
			required: false,
			default: 'warning' as NotificationType
		},
		title: {
			type: String,
			required: false,
			default: 'Uh oh, something went wrong.'
		},
		message: {
			type: String,
			required: false
		}
	},
	emits: [
		'close'
	],
	setup(props) {
		const shown = ref<boolean>(false);
		const timeCounter = ref<number>(NOTIFICATION_TIME_IN_SECONDS);
		const timeoutId = ref<number>(0);
		const messages = ref<Array<Message>>([]);
		const backgroundClass = computed<string>(() => {
			if (props.type === 'error') {
				return 'bg-red-50';
			}
			if (props.type === 'warning') {
				return 'bg-yellow-50';
			}
			if (props.type === 'success') {
				return 'bg-green-50';
			}
			return 'bg-blue-50';
		});

		return {
			shown,
			timeCounter,
			timeoutId,
			messages,
			backgroundClass
		};
	},
	mounted() {
		this.$nextTick(() => {
			if (this.message) {
				this.messages.push({ id: (new Date()).getTime(), text: this.message });
				this.shown = true;
				this.handleTimeCounter();
			}
		});
	},
	watch: {
		message(text?: string) {
			if (text) {
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
					this.timeoutId = 0;
				}

				this.shown = true;
				this.messages.unshift({ id: (new Date()).getTime(), text });
				this.timeCounter = NOTIFICATION_TIME_IN_SECONDS;
				this.handleTimeCounter();
			}
		}
	},
	methods: {
		handleTimeCounter() {
			if (this.timeCounter <= 0) {
				this.close();
				return;
			}

			this.timeoutId = window.setTimeout(() => {
				this.timeCounter -= 1;
				this.handleTimeCounter();
			}, 1_000);
		},
		close() {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = 0;
			}
			this.messages = [];
			this.shown = false;
			this.$emit('close');
		}
	}
});
</script>
