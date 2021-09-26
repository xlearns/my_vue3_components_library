<template>
	<div class="resourcemanage">
		<div class="head-title split-line">申请资源</div>
		<div class="operate"></div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance } from "vue";
import "@/css/applyresources.scss";
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
