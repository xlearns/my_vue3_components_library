<template>
	<transition name="el-message-fade" @after-leave="handleAfterLeave">
		<div class="wxMessage" ref="wxMessage">
			<div class="content">
				<span class="icon"></span>
				<div class="content_body">
					<slot></slot>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import {
	defineComponent,
	reactive,
	toRefs,
	computed,
	getCurrentInstance,
} from "vue";
export default defineComponent({
	name: "wxMessage",
	setup() {
		const state = reactive({
			verticalOffset: 20,
			duration: 1200,
		});
		const { proxy } = getCurrentInstance();
		const positionStyle = computed(() => {
			return {
				top: `${state.verticalOffset}px`,
			};
		});
		const methods = {
			handleAfterLeave() {
				console.log(1);
			},
		};
		setTimeout(() => {
			proxy.$refs.wxMessage &&
				proxy.$refs.wxMessage.parentNode.removeChild(proxy.$refs.wxMessage);
		}, state.duration);
		return {
			...methods,
			...toRefs(state),
			positionStyle,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/wx/message/src/message.scss";
</style>
