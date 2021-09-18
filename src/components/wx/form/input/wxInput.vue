<template>
	<div class="wxform">
		<input
			ref="input"
			:type="type"
			:model-value="modelValue"
			@input="handleInput"
			@blur="handleBlur"
		/>
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
import { dispatch, broadcast } from "@/components/wx/utils/emitter";

export default defineComponent({
	name: "wxInput",
	props: {
		modelValue: {},
		type: { type: String, default: "text" },
	},
	setup(props, context) {
		let status = reactive({
			currentValue: "",
		});
		let { proxy } = getCurrentInstance();
		let methods = {
			handleInput(e) {
				const value = e.target.value;
				context.emit("update:modelValue", value);
				dispatch(proxy, "wxFormItem", "form-change", value);
			},
			handleBlur() {
				dispatch(proxy, "wxFormItem", "form-blur", status.currentValue);
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
