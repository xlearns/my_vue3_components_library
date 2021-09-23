<template>
	<div class="authoritymanage">
		<div class="head-title split-line">权限管理</div>
		<div class="operate"></div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance } from "vue";
import "@/css/authoritymanage.scss";
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
