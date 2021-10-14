<template>
	<!-- <div ref="dragVerify"></div> -->
	<div class="drag-verify-container">
		<div :style="dragVerifyImgStyle">
			<img
				ref="checkImg"
				crossOrigin="anonymous"
				:src="imgsrc"
				@load="checkimgLoaded"
				style="width: 100%"
				alt=""
			/>
			<canvas ref="maincanvas" class="main-canvas"></canvas>
			<canvas
				ref="movecanvas"
				:class="{ goFirst: isOk, goKeep: isKeep }"
				class="move-canvas"
			></canvas>
			<div class="refresh" v-if="showRefresh && !isPassing">
				<i :class="refreshIcon" @click="refreshimg"></i>
			</div>
			<div class="tips success" v-if="showTips && isPassing">
				{{ successTip }}
			</div>
			<div class="tips danger" v-if="showTips && !isPassing && showErrorTip">
				{{ failTip }}
			</div>
		</div>
		<div
			ref="dragVerify"
			class="drag_verify"
			:style="dragVerifyStyle"
			@mousemove="dragMoving"
			@mouseup="dragFinish"
			@mouseleave="dragFinish"
			@touchmove="dragMoving"
			@touchend="dragFinish"
		>
			<div
				class="dv_progress_bar"
				:class="{ goFirst2: isOk }"
				ref="progressBar"
				:style="progressBarStyle"
			>
				{{ successMessage }}
			</div>
			<div class="dv_text" :style="textStyle" ref="message">
				{{ message }}
			</div>

			<div
				class="dv_handler dv_handler_bg"
				:class="{ goFirst: isOk }"
				@mousedown="dragStart"
				@touchstart="dragStart"
				ref="handler"
				:style="handlerStyle"
			>
				<i :class="handlerIcon"></i>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import {
	defineComponent,
	onMounted,
	reactive,
	toRefs,
	ref,
	computed,
} from "vue";

export default defineComponent({
	name: "wxCaptcha",
	props: {
		isPassing: {
			type: Boolean,
			default: false,
		},
		width: {
			type: Number,
			default: 250,
		},
		height: {
			type: Number,
			default: 40,
		},
		text: {
			type: String,
			default: "swiping to the right side",
		},
		successText: {
			type: String,
			default: "success",
		},
		background: {
			type: String,
			default: "#eee",
		},
		progressBarBg: {
			type: String,
			default: "#76c61d",
		},
		completedBg: {
			type: String,
			default: "#76c61d",
		},
		circle: {
			type: Boolean,
			default: false,
		},
		radius: {
			type: String,
			default: "4px",
		},
		handlerIcon: {
			type: String,
		},
		successIcon: {
			type: String,
		},
		handlerBg: {
			type: String,
			default: "#fff",
		},
		textSize: {
			type: String,
			default: "14px",
		},
		textColor: {
			type: String,
			default: "#333",
		},
		imgsrc: {
			type: String,
		},
		barWidth: {
			type: Number,
			default: 40,
		},
		barRadius: {
			type: Number,
			default: 8,
		},
		showRefresh: {
			type: Boolean,
			default: false,
		},
		refreshIcon: {
			type: String,
		},
		showTips: {
			type: Boolean,
			default: true,
		},
		successTip: {
			type: String,
			default: "验证通过，超过80%用户",
		},
		failTip: {
			type: String,
			default: "验证未通过，拖动滑块将悬浮图像正确合并",
		},
		diffWidth: {
			type: Number,
			default: 20,
		},
	},
	setup(props, { emit }) {
		const dragVerify = ref();
		const checkImg = ref();
		const maincanvas = ref();
		const movecanvas = ref();
		const handler = ref();
		const progressBar = ref();
		let state = reactive({
			isMoving: false,
			x: 0,
			isOk: false,
			isKeep: false,
			clipBarx: 0,
			showErrorTip: false,
		});
		const init = function () {
			const dragEl = dragVerify.value;
			dragEl.style.setProperty("--textColor", props.textColor);
			dragEl.style.setProperty("--width", Math.floor(props.width / 2) + "px");
			dragEl.style.setProperty("--pwidth", -Math.floor(props.width / 2) + "px");
		};
		const resize = function () {};
		let methods = {
			draw(ctx: any, x: number, y: number, operation: any) {
				let l = props.barWidth;
				let r = props.barRadius;
				const PI = Math.PI;
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
				ctx.lineTo(x + l, y);
				ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
				ctx.lineTo(x + l, y + l);
				ctx.lineTo(x, y + l);
				ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
				ctx.lineTo(x, y);
				ctx.lineWidth = 2;
				ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
				ctx.stroke();
				ctx[operation]();
				ctx.globalCompositeOperation = "destination-over";
			},
			checkimgLoaded() {
				let barWidth = props.barWidth;
				let imgHeight = checkImg.value.height;
				let imgWidth = checkImg.value.width;
				let halfWidth = Math.floor(props.width / 2);
				let refreshHeigth = 25;
				let tipHeight = 20;
				let x =
					halfWidth +
					Math.ceil(
						Math.random() * (halfWidth - barWidth - props.barRadius - 5)
					);
				let y =
					refreshHeigth +
					Math.floor(
						Math.random() * (imgHeight - barWidth - refreshHeigth - tipHeight)
					);
				let __maincanvas = maincanvas.value;
				__maincanvas.setAttribute("width", imgWidth);
				__maincanvas.setAttribute("height", imgHeight);
				__maincanvas.style.display = "block";
				let canvasCtx = maincanvas.value.getContext("2d");
				this.draw(canvasCtx, x, y, "fill");
				state.clipBarx = x;
				let __moveCanvas = movecanvas.value;
				__moveCanvas.setAttribute("width", imgWidth);
				__moveCanvas.setAttribute("height", imgHeight);
				__moveCanvas.style.display = "block";
				const L = barWidth + props.barRadius * 2 + 3; //实际宽度
				let moveCtx = __moveCanvas.getContext("2d");
				moveCtx.clearRect(0, 0, imgWidth, imgHeight);
				this.draw(moveCtx, x, y, "clip");
				moveCtx.drawImage(checkImg.value, 0, 0, imgWidth, imgHeight);
				y = y - props.barRadius * 2 - 1;
				const ImageData = moveCtx.getImageData(x, y, L, L);
				__moveCanvas.setAttribute("width", L);
				__moveCanvas.setAttribute("height", imgHeight);
				moveCtx.putImageData(ImageData, 0, y);
			},
			dragStart(e: any) {
				if (!props.isPassing) {
					state.isMoving = true;
					state.x = e.pageX || e.touches[0].pageX;
				}
				state.showErrorTip = false;
				emit("handlerMove");
			},
			dragMoving(e: any) {
				if (state.isMoving && !props.isPassing) {
					let _x = (e.pageX || e.touches[0].pageX) - state.x;
					let __handler = handler.value;
					let __progressBar = progressBar.value;
					let __movecanvas = movecanvas.value;
					__handler.style.left = _x + "px";
					__progressBar.style.width = _x + props.height / 2 + "px";
					__movecanvas.style.left = _x + "px";
				}
			},
			dragFinish(e: any) {
				if (state.isMoving && !props.isPassing) {
					var _x = (e.pageX || e.changedTouches[0].pageX) - this.x;
					if (Math.abs(_x - state.clipBarx) > props.diffWidth) {
						state.isOk = true;
						let __handler = handler.value;
						let __progressBar = progressBar.value;
						let __movecanvas = movecanvas.value;
						setTimeout(function () {
							__handler.style.left = "0";
							__progressBar.style.width = "0";
							__movecanvas.style.left = "0";
							state.isOk = false;
						}, 500);
						emit("passfail");
						state.showErrorTip = true;
					} else {
						methods.passVerify();
					}
					state.isMoving = false;
				}
			},
			passVerify() {
				emit("update:isPassing", true);
				state.isMoving = false;
				let __handler = handler.value;
				let __progressBar = progressBar.value;
				let __message: any = message.value;
				let __movecanvas = movecanvas.value;
				let __maincanvas = maincanvas.value;

				__handler.children[0].className = props.successIcon;
				__progressBar.style.background = props.completedBg;
				__message.style["-webkit-text-fill-color"] = "unset";
				__message.style.animation = "slidetounlock2 3s infinite";
				progressBar.value.style.color = "#fff";
				progressBar.value.style.fontSize = props.textSize;
				state.isKeep = true;
				setTimeout(() => {
					__movecanvas.style.left = state.clipBarx + "px";
					setTimeout(() => {
						state.isKeep = false;
						__maincanvas.style.display = "none";
						__movecanvas.style.display = "none";
					}, 200);
				}, 100);
				emit("passcallback");
			},
			reset() {
				methods.reImg();
				methods.checkimgLoaded();
			},
			reImg() {
				emit("update:isPassing", false);
				// const oriData = this.$options.data();
				// for (const key in oriData) {
				// 	if (Object.prototype.hasOwnProperty.call(oriData, key)) {
				// 		this[key] = oriData[key];
				// 	}
				// }
				// var handler = this.$refs.handler;
				// var message = this.$refs.message;
				// handler.style.left = "0";
				// this.$refs.progressBar.style.width = "0";
				// handler.children[0].className = this.handlerIcon;
				// message.style["-webkit-text-fill-color"] = "transparent";
				// message.style.animation = "slidetounlock 3s infinite";
				// message.style.color = this.background;
				// this.$refs.movecanvas.style.left = "0px";
			},
			refreshimg() {
				emit("refresh");
			},
		};
		const handlerStyle = computed(() => {
			return {
				width: props.height + "px",
				height: props.height + "px",
				background: props.handlerBg,
			};
		});
		const message = computed(() => {
			return {
				width: props.height + "px",
				height: props.height + "px",
				background: props.handlerBg,
			};
		});
		const successMessage = computed(() => {
			return {
				width: props.height + "px",
				height: props.height + "px",
				background: props.handlerBg,
			};
		});
		const dragVerifyStyle = computed(() => {
			return {
				width: props.height + "px",
				height: props.height + "px",
				background: props.handlerBg,
			};
		});
		const dragVerifyImgStyle = computed(() => {
			return {
				width: props.height + "px",
				height: props.height + "px",
				background: props.handlerBg,
			};
		});
		const progressBarStyle = computed(() => {
			return {
				width: props.height + "px",
				height: props.height + "px",
				background: props.handlerBg,
			};
		});
		const textStyle = computed(() => {
			return {
				width: props.height + "px",
				height: props.height + "px",
				background: props.handlerBg,
			};
		});

		onMounted(() => {
			init();
			window.addEventListener("resize", resize);
		});
		return {
			...methods,
			...toRefs(state),
			dragVerify,
			handlerStyle,
			progressBarStyle,
			textStyle,
			dragVerifyImgStyle,
			dragVerifyStyle,
			successMessage,
			message,
			checkImg,
			maincanvas,
			movecanvas,
			handler,
			progressBar,
		};
	},
});
</script>
