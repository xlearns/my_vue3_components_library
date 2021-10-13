<template>
	<transition name="dialog-fade">
		<div
			class="wx-dialog_wrapper"
			v-show="modelValue"
			@click.self="handleClose"
		>
			<div class="wx-dialog" :style="{ width: width, marginTop: top }">
				<div class="wx-dialog_header">
					<slot name="title">
						<!-- 将span放到slot内，这样不仅可以定义title文本，还可以定义样式等 -->
						<span class="wx-dialog_title">
							{{ title }}
						</span>
					</slot>
					<button class="wx-dialog_headerbtn" @click="handleClose">
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
		};
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>

<style lang="scss" scoped>
.wx-dialog_wrapper {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow: auto;
	margin: 0;
	z-index: 2001;
	background-color: rgba(0, 0, 0, 0.5);
	.wx-dialog {
		position: relative;
		margin: 15vh auto 50px;
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
		width: 30%;
		&_header {
			padding: 20px 20px 10px;
			.wx-dialog_title {
				line-height: 24px;
				font-size: 18px;
				color: #303133;
			}
			.wx-dialog_headerbtn {
				position: absolute;
				top: 20px;
				right: 20px;
				padding: 0;
				background: transparent;
				border: none;
				outline: none;
				cursor: pointer;
				font-size: 16px;
				.wx-icon-close {
					color: 909399;
				}
			}
		}
		&_body {
			padding: 30px 20px;
			color: #606266;
			font-size: 14px;
			word-break: break-all;
		}
		&_footer {
			padding: 10px 20px 20px;
			text-align: right;
			box-sizing: border-box;
			::v-deep .wx-button:first-child {
				margin-right: 20px;
			}
		}
	}
}
.dialog-fade-enter-active {
	animation: fade 0.3s;
}
.dialog-fade-leave-active {
	animation: fade 0.3s reverse;
}
@keyframes fade {
	0% {
		opacity: 0;
		transform: translateY(-20px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
