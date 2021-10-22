<template>
	<div class="wxProgress">
		<div
			class="progress"
			:class="{
				aqua: type == 1,
				copper: type == 2,
				candy: type == 3,
				neon: type == 4,
				shine: type == 5,
				zigzag: type == 6,
				diamond: type == 7,
				hearts: type == 8,
				sparkle: type == 9,
				test: type == 10,
			}"
		>
			<div class="progress-text">{{ progress() }}%</div>
			<div class="progress-bar" :style="progress(true)">
				<div class="progress-text">{{ progress() }}%</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "wxProgress",
	props: {
		type: {
			type: Number,
			default: 1,
		},
		cur: {
			type: Number,
			default: 0,
		},
	},
	setup(props) {
		const methods = {
			progress(otype) {
				let cur = props.cur;
				if (cur >= 100) {
					cur = 100;
				}
				cur = Math.floor(cur);
				if (otype) {
					return {
						width: `${cur}%`,
					};
				} else {
					return cur;
				}
			},
		};
		return {
			...methods,
		};
	},
});
</script>
