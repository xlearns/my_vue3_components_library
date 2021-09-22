<template>
	<div class="wxform">
		<input ref="input" :type="type" v-model="value" @blur="handleBlur" />
	</div>
</template>
<script>
import {
	defineComponent,
	reactive,
	toRefs,
	getCurrentInstance,
	watch,
	computed,
} from "vue";
// import { dispatch, broadcast } from "@/components/wx/utils/emitter";
import { useStore } from "vuex";

export default defineComponent({
	name: "wxInput",
	props: {
		modelValue: {},
		type: { type: String, default: "text" },
	},
	setup(props, context) {
		const store = useStore();
		let status = reactive({
			currentValue: "",
			value: props.modelValue,
		});
		let { proxy } = getCurrentInstance();
		watch(
			() => status.value,
			(count, prevCount) => {
				context.emit("update:modelValue", count);
				store.dispatch("formChange", count);
			}
		);
		watch(
			() => {
				return store.state.wxClearAll;
			},
			() => {
				status.value = "";
			}
		);
		let methods = {
			handleBlur() {
				store.dispatch("formBlur", status.currentValue);
			},
		};
		return {
			...toRefs(status),
			...methods,
		};
	},
});
</script>

<style lang="scss">
@import "@/components/wx/form/wxform.scss";
</style>
