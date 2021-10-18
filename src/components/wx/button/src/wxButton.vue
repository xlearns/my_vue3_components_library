<template>
	<button
		class="wx-button"
		:disabled="disabled || loading"
		:class="[
			size ? `wx-button-${size}` : '',
			type ? `wx-button-${type}` : '',
			{ 'is-loading': loading },
			{ 'is-circle': circle },
			{ 'is-disabled': disabled },
			{ 'is-round': round },
			{ 'is-plain': plain },
		]"
		@click="handleClick"
	>
		<i class="wx-icon-loading" v-if="loading"></i>
		<slot></slot>
	</button>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { debounce } from "throttle-debounce";
import screenfull from "screenfull";
export default defineComponent({
	name: `wxButton`,
	//解决两次click
	emits: ["click"],
	props: {
		fullScreen: {
			type: Object,
			default: () => {
				return {
					isEnabled: false,
					error: function () {
						console.log("您的浏览器版本过低不支持全屏显示！");
					},
					success: function () {
						console.log("成功");
					},
				};
			},
		},
		size: {
			type: String,
			default: "medium",
			validator(val: string): boolean {
				return ["medium", "small", "mini", ""].includes(val);
			},
		},
		goTop: {
			type: Object,
			default: () => {
				return {
					isEnabled: false,
					target: "goTop",
					speed: 5,
				};
			},
		},
		type: {
			type: String,
			default: "primary",
			validator(val: string): boolean {
				return ["primary", "success", "warning", "danger"].includes(val);
			},
		},
		disabled: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		loading: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		circle: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		round: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		plain: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
	},
	setup(props: any, { emit }) {
		const state = reactive({
			isFullscreen: false,
		});
		const throttleClick = debounce(200, false, (event: Event) => {
			if (props.fullScreen?.isEnabled) {
				if (!screenfull.isEnabled) {
					props.fullScreen.errpr && props.fullScreen.errpr();
					return false;
				}
				state.isFullscreen = !state.isFullscreen;
				screenfull.toggle();
				props.fullScreen.errpr && props.fullScreen.success();
			} else if (props.goTop?.isEnabled) {
				gotoTop();
			} else {
				emit("click", event);
			}
		});
		const handleClick = function (event: Event) {
			throttleClick(event);
		};
		const gotoTop = function () {
			let _t: any = {};
			let scrollTop =
				document.documentElement.scrollTop || document.body.scrollTop;
			_t.scrollTop = scrollTop;
			_t.timer = setInterval(
				function () {
					_t.scrollTop -= 100;
					if (_t.scrollTop < 100) {
						_t.scrollTop = 0;
						clearInterval(_t.timer);
					}
					scrollTo(0, _t.scrollTop);
				},
				props.goTop?.speed ? props.goTop?.speed : 5
			);
		};
		return {
			handleClick,
			...toRefs(state),
		};
	},
});
</script>
