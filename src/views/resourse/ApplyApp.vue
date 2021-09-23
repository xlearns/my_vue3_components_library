<template>
	<div class="applyapp ">
		<div class="head-title split-line">申请APP</div>
		<div class="operate"></div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance } from "vue";
import "@/css/applyapp.scss";
export default defineComponent({
	setup() {
		const { proxy }: any = getCurrentInstance();
		const state = reactive({});
		const methods = {};
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>
