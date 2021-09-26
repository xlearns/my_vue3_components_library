<template>
	<div class="managementlog">
		<div class="head-title split-line">终端登录失败日志</div>
		<div class="operate"></div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance } from "vue";
import "@/css/managementlog.scss";
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
