<template>
	<div class="wxLoading">
		<canvas class="wxLoadingCtx" width="350" height="350"></canvas>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
export default defineComponent({
	name: "wxLoading",
	setup() {
		const state = reactive({
			M: null,
			PI: 0,
			TWOPI: 0,
			HALFPI: 0,
			ctx: null,
			width: 0,
			height: 0,
			cx: 0,
			cy: 0,
			count: 0,
			sizeBase: 0,
			sizeDiv: 0,
			tick: 0,
		});
		const methods = {
			loop() {
				state.ctx.clearRect(
					-state.width / 2,
					-state.height / 2,
					state.width,
					state.height
				);
				state.ctx.fillStyle = "#fff";
				let angle = state.tick / 8,
					radius = -50 + state.M.sin(state.tick / 15) * 100,
					size;
				for (var i = 0; i < state.count; i++) {
					angle += state.PI / 64;
					radius += i / 30;
					size = state.sizeBase + i / state.sizeDiv;

					state.ctx.beginPath();
					state.ctx.arc(
						state.M.cos(angle) * radius,
						state.M.sin(angle) * radius,
						size,
						0,
						state.TWOPI,
						false
					);
					state.ctx.fillStyle = "hsl(200, 70%, 50%)";
					state.ctx.fill();

					state.ctx.beginPath();
					state.ctx.arc(
						state.M.cos(angle) * -radius,
						state.M.sin(angle) * -radius,
						size,
						0,
						state.TWOPI,
						false
					);
					state.ctx.fillStyle = "hsl(320, 70%, 50%)";
					state.ctx.fill();

					state.ctx.beginPath();
					state.ctx.arc(
						state.M.cos(angle + state.HALFPI) * radius,
						state.M.sin(angle + state.HALFPI) * radius,
						size,
						0,
						state.TWOPI,
						false
					);
					state.ctx.fillStyle = "hsl(60, 70%, 50%)";
					state.ctx.fill();

					state.ctx.beginPath();
					state.ctx.arc(
						state.M.cos(angle + state.HALFPI) * -radius,
						state.M.sin(angle + state.HALFPI) * -radius,
						size,
						0,
						state.TWOPI
					);
					state.ctx.fillStyle = "hsl(0, 0%, 100%)";
					state.ctx.fill();
				}

				state.tick++;
				requestAnimationFrame(methods.loop);
			},
			init() {
				let canvas: any = document.querySelector(".wxLoadingCtx");
				state.M = Math;
				state.PI = state.M.PI;
				state.TWOPI = state.PI * 2;
				state.HALFPI = state.PI / 2;
				state.ctx = canvas.getContext("2d");
				state.width = canvas.width = 350;
				state.height = canvas.height = 350;
				state.cx = state.width / 2;
				state.cy = state.height / 2;
				state.count = 40;
				state.sizeBase = 0.1;
				state.sizeDiv = 5;
				state.tick = 0;
				methods.loop();
			},
		};
		onMounted(() => {
			methods.init();
			state.ctx.translate(state.cx, state.cy);
		});
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>
<style lang="scss" scoped>
@import "@/components/wx/loading/src/loading.scss";
</style>
