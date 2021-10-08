<template>
	<form class="wx-form">
		<slot></slot>
	</form>
</template>
<script lang="ts">
import { defineComponent, provide, toRefs, reactive, onMounted } from "vue";

export default defineComponent({
	name: "wxForm",
	props: {
		modelValue: {
			type: Object,
			default: () => {
				return {};
			},
		},
		rules: {
			type: Object,
			default: () => {
				return {};
			},
		},
		showMessage: {
			type: Boolean,
			default: true,
		},
		size: {
			type: String,
		},
		disable: {
			type: Boolean,
			default: true,
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			//初始化
			value: "",
		});
		let formItemData = [];
		provide("formProps", props);
		provide("addFormItem", (formItem) => {
			formItemData.push(formItem);
		});
		const setValue = (obj, type?) => {
			if (type !== "reset") {
				//obj变成响应式
				state.value = JSON.stringify(obj);
			}
			//obj添加到modelValue中
			Object.assign(props.modelValue, obj);
		};
		const reset = () => {
			setValue(JSON.parse(state.value), "reset");
			//清楚提示
			formItemData &&
				formItemData.forEach((item) => {
					item.clear();
				});
		};
		const validate = (item) => {
			let stateArr = [];
			let itemAll = formItemData;
			if (item && item.length > 0) {
				itemAll = formItemData.filter((mi) => {
					return item.indexOf(mi) !== -1;
				});
			}
			return new Promise((resolve, reject) => {
				if (!formItemData.length) return console.error("没有fornItem");
				formItemData.forEach((item) => {
					item
						.validate()
						.then(() => {
							stateArr.push("true");
							//通过
							success();
						})
						.catch((res) => {
							stateArr.push(res);
							success();
						});
				});
				const success = () => {
					if (stateArr.length === itemAll.length) {
						const tips = stateArr.filter((i) => {
							return i !== "true";
						});
						if (tips.length > 0) {
							//fail
							reject(tips);
						} else {
							//success
							resolve(props.modelValue);
						}
					}
				};
			});
		};
		onMounted(() => {
			setValue(props.modelValue);
		});
		return {
			...toRefs(state),
			validate,
			reset,
		};
	},
});
</script>
