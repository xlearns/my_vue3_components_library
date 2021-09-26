<template>
	<div class="informationmanage">
		<div class="head-title split-line">设备信息管理</div>
		<div class="operate"></div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance } from "vue";
import "@/css/informationmanage.scss";
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
