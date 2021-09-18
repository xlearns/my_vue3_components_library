<template>
	<div class="wxFormItem">
		<label
			:for="labelFor"
			v-if="label"
			:class="{ 'label-required': isRequired }"
			>{{ label }}</label
		>
		<slot></slot>
		<div v-if="isShowMes" class="message">{{ message }}</div>
	</div>
</template>
<script>
import {
	defineComponent,
	inject,
	provide,
	toRefs,
	onMounted,
	computed,
	reactive,
	getCurrentInstance,
} from "vue";
import AsyncValidator from "async-validator";
import { dispatch, broadcast } from "@/components/wx/utils/emitter";
export default defineComponent({
	name: "wxFormItem",
	props: {
		label: { type: String, default: "" },
		prop: { type: String },
	},
	setup(props, context) {
		const { proxy } = getCurrentInstance();
		const status = reactive({
			isRequired: false,
			isShowMes: false,
			message: "",
			initialValue: "",
			labelFor: "input" + new Date().valueOf(),
		});
		const form = inject("form");
		const fieldValue = computed(() => {
			return form.model[props.prop];
		});
		const methods = {
			setRules() {
				let rules = methods.getRules();
				if (rules.length) {
					rules.forEach((rule) => {
						if (rule.required !== undefined) status.isRequired = rule.required;
					});
				}
				provide("form-blur", methods.onFieldBlur);
				provide("form-change", methods.onFieldChange);
			},
			getRules() {
				let formRules = form.rules;
				formRules = formRules ? formRules[props.prop] : [];
				return formRules;
			},
			// 过滤出符合要求的 rule 规则
			getFilteredRule(trigger) {
				const rules = methods.getRules();
				return rules.filter(
					(rule) => !rule.trigger || rule.trigger.indexOf(trigger) !== -1
				);
			},
			/**
			 * 校验表单数据
			 * @param trigger 触发校验类型
			 * @param callback 回调函数
			 */
			validate(trigger, cb) {
				let rules = methods.getFilteredRule(trigger);
				if (!rules || rules.length === 0) return true;
				// 使用 async-validator
				const validator = new AsyncValidator({ [props.prop]: rules });
				let model = { [props.prop]: fieldValue };
				validator.validate(model, { firstFields: true }, (errors) => {
					status.isShowMes = errors ? true : false;
					status.message = errors ? errors[0].message : "";
					if (cb) cb(status.message);
				});
			},
			resetField() {
				state.message = "";
				form.model[props.prop] = state.initialValue;
			},
			onFieldBlur() {
				methods.validate("blur");
			},
			onFieldChange() {
				methods.validate("change");
			},
		};
		onMounted(() => {
			if (props) {
				dispatch(proxy, "wxForm", "form-add", proxy);
				// 设置初始值
				status.initialValue = fieldValue;
				methods.setRules();
			}
		});
		return {
			...methods,
			...toRefs(status),
		};
	},
});
</script>
<style lang="scss">
@import "@/components/wx/form/item/wxFormItem.scss";
</style>
