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
		]"
	>
		<i class="wx-icon-loading" v-if="loading"></i>
		<slot></slot>
	</button>
</template>

<script lang="ts">
import { toRefs, computed, defineComponent, inject, ref } from "vue";
export default defineComponent({
	name: `wxButton`,
	props: {
		size: {
			type: String,
			validator(val: string): boolean {
				return ["medium", "small", "mini", ""].includes(val);
			},
		},
		type: {
			type: String,
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
	},
	setup(props: any, { emit }) {},
});
</script>

<style lang="scss" scoped>
@import "@/components/wx/button/src/wxButton.scss";
</style>
