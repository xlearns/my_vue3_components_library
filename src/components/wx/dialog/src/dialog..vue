<template>
	<transition name="dialog-fade">
		<div class="wx-dialog_wrapper" v-show="modelValue" @click="otherClick">
			<div
				class="wx-dialog"
				:style="{ width: width, marginTop: top }"
				:class="{
					ifFullscreen: fullscreen,
				}"
			>
				<div class="wx-dialog_header">
					<slot name="title">
						<span class="wx-dialog_title">
							{{ title }}
						</span>
					</slot>
					<button
						v-if="showClose"
						class="wx-dialog_headerbtn"
						@click="handleClose"
					>
						<i class="wx-icon-close iconfont icon-guanbi"></i>
					</button>
				</div>
				<div class="wx-dialog_body">
					<slot></slot>
				</div>
				<div class="wx-dialog_footer">
					<slot name="footer" v-if="$slots.footer"> </slot>
				</div>
			</div>
		</div>
	</transition>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
	name: "wxDialog",
	props: {
		autoClose: {
			type: Function,
			default: () => {
				return;
			},
		},
		callback: {
			type: Function,
			default: () => {
				return;
			},
		},
		title: {
			type: String,
			default: () => {
				return "提示";
			},
		},
		showClose: {
			type: Boolean,
			default: () => {
				return true;
			},
		},
		fullscreen: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		width: {
			type: String,
			default: () => {
				return "50%";
			},
		},
		top: {
			type: String,
			default: () => {
				return "15vh";
			},
		},
		footer: {
			type: Object,
		},
		beforeClose: {
			type: Function,
			default: () => {
				return;
			},
		},
		modelValue: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		closeOnClickModal: {
			type: Boolean,
			default: () => {
				return true;
			},
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			autoTime: props.autoClose,
		});
		let clearTime;
		const autoClose = function () {
			state.autoTime = props.autoClose;
			clearTime = setInterval(() => {
				if (state.autoTime > 1) {
					state.autoTime--;
				} else {
					props.callback && props.callback();
					close();
				}
			}, 1000);
		};

		const methods = {
			handleClose() {
				props.beforeClose && props.beforeClose();
				emit("update:modelValue", false);
			},
			otherClick(e: any) {
				if (
					e.target.className == "wx-dialog_wrapper" &&
					props.closeOnClickModal
				) {
					props.beforeClose && props.beforeClose();
					emit("update:modelValue", false);
				}
			},
		};
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>
