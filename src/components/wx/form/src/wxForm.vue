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
	watch,
} from "vue";
import { useStore } from "vuex";
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
		let store = useStore();
		status.fields = store.state.wxFormAdd;
		watch(
			() => {
				return store.state.wxFormRemove;
			},
			(field, old) => {
				if (field.prop) status.fields.splice(status.fields.indexOf(field), 1);
			}
		);
		provide("form", props);
		let methods = {
			validate(cb) {
				return new Promise((resolve) => {
					let valid = true,
						count = 0;
					status.fields.forEach((field) => {
						field.validate("", (error) => {
							if (error) valid = false;
							if (++count === status.fields.length) {
								resolve(valid);
								if (typeof cb === "function") cb(valid);
							}
						});
					});
				});
			},
			resetFields() {
				status.fields.forEach((field) => field.resetField());
				store.dispatch("formWxClearAll");
			},
		};
		return {
			...toRefs(status),
			...methods,
		};
	},
});
</script>
