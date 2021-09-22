<template>
	<div>
		<slot></slot>
	</div>
</template>
<script>
import {
	defineComponent,
	reactive,
	toRefs,
	provide,
	getCurrentInstance,
	inject,
} from "vue";

export default defineComponent({
	name: "wxForm",
	props: {
		model: { type: Object },
		rules: { type: Object },
	},
	setup(props) {
		let status = reactive({
			fields: [],
		});
		let { proxy } = getCurrentInstance();
		provide("form", props);
		provide("form-add", (field) => {
			if (field) status.fields.push(field);
		});
		provide("form-remove", (field) => {
			if (field.prop) status.fields.splice(status.fields.indexOf(field), 1);
		});

		let methods = {
			resetFields() {
				status.fields.forEach((field) => field.resetField());
			},
		};
		return {
			...toRefs(status),
			...methods,
		};
	},
});
</script>
