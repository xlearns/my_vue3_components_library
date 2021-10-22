<template>
	<div class="bd-scrollLoader container-main">
		<div class="loading" v-if="topLoading">
			<div class="loader">loading</div>
		</div>

		<div :style="'min-height:' + realMinHeight + 'px; overflow-x:hidden'">
			<slot></slot>
		</div>

		<div class="loading" v-if="bottonLoading">
			<div class="loader">loading</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	computed,
	defineComponent,
	toRefs,
	reactive,
	onMounted,
	nextTick,
	onUnmounted,
} from "vue";

export default defineComponent({
	name: "bd-scroll",
	props: {
		minHeight: {
			type: Number,
			default: 800,
		},
		dom: {},
	},
	setup(props, { emit }) {
		const state = reactive({
			topLoading: false,
			bottonLoading: false,
			bottonDone: {} as any,
			topDone: {} as any,
			scrollContainer: {} as any,
			scrollTop: 0,
			ele: {} as any,
			stopTopLoading: false, //是否停止传播滚动到顶部事件
			stopBottonLoading: false, //是否停止传播滚动到底部事件
		});
		const realMinHeight = computed(() => {
			return props.minHeight + 30;
		});
		const scrollFn = function () {
			if (props.dom) {
				state.scrollTop = state.ele.scrollTop;
			} else {
				state.scrollTop = document.documentElement.scrollTop;
			}
			if (state.scrollTop <= 0 && !state.stopTopLoading) {
				if (state.topLoading) return;
				state.topLoading = true;
				emit("top", state.topDone);
			}
			if (
				!props.dom &&
				state.scrollContainer.offsetHeight -
					state.scrollTop -
					window.innerHeight <=
					0 &&
				!state.stopBottonLoading
			) {
				if (state.bottonLoading) return;
				state.bottonLoading = true;
				state.scrollTop += 40;
				emit("botton", state.bottonDone);
			} else if (
				props.dom &&
				state.scrollContainer.offsetHeight -
					state.scrollTop -
					state.ele.offsetHeight -
					48 -
					4 <=
					0 &&
				!state.stopBottonLoading
			) {
				if (state.bottonLoading) return;
				state.bottonLoading = true;
				state.scrollTop += 40;
				emit("botton", state.bottonDone);
			}
		};
		const listenScroll = function () {
			state.topDone = (stopTopLoading: any) => {
				state.topLoading = false;
				if (stopTopLoading) state.stopTopLoading = true;
			};

			state.bottonDone = (stopBottonLoading: any) => {
				state.bottonLoading = false;
				if (stopBottonLoading) state.stopBottonLoading = true;
			};
			nextTick(() => {
				state.scrollContainer = document.querySelector(".bd-scrollLoader");

				if (props.dom) {
					state.ele = document.querySelector(props.dom);
				} else {
					state.ele = window;
				}

				state.ele.onscroll = scrollFn;
			});
		};
		onMounted(() => {
			listenScroll();
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", scrollFn);
		});
		const statethods = {};
		return {
			...toRefs(state),
			realMinHeight,
		};
	},
});
</script>
<style scoped>
.container-main {
	margin: 0 auto;
	overflow: auto;
	overflow-x: hidden;
	padding: 0;
}
.loading {
	width: 100%;
	height: 40px;
	position: relative;
	overflow: hidden;
	text-align: center;
	margin: 5px 0;
	color: #999;
	font-size: 13px;
}
.loading-icon {
	color: #707070;
}
.loader {
	font-size: 10px;
	margin: 8px auto;
	text-indent: -9999em;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: #999;
	background: -moz-linear-gradient(left, #999 10%, rgba(255, 255, 255, 0) 42%);
	background: -webkit-linear-gradient(
		left,
		#999 10%,
		rgba(255, 255, 255, 0) 42%
	);
	background: -o-linear-gradient(left, #999 10%, rgba(255, 255, 255, 0) 42%);
	background: -ms-linear-gradient(left, #999 10%, rgba(255, 255, 255, 0) 42%);
	background: linear-gradient(to right, #999 10%, rgba(255, 255, 255, 0) 42%);
	position: relative;
	-webkit-animation: rotate 1s infinite linear;
	animation: rotate 1s infinite linear;
}
.loader:before {
	width: 50%;
	height: 50%;
	background: #999;
	border-radius: 100% 0 0 0;
	position: absolute;
	top: 0;
	left: 0;
	content: "";
}
.loader:after {
	background: #f5f5f5;
	width: 72%;
	height: 75%;
	border-radius: 68%;
	content: "";
	margin: auto;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}
@keyframes rotate {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
</style>
