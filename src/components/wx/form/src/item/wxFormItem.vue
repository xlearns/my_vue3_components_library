<template>
	<div class="wxFormItem">
		<div class="flex">
			<label
				:for="labelFor"
				v-if="label"
				:class="{ 'label-required': isRequired }"
				>{{ label }}</label
			>
			<div class="flex-body">
				<slot></slot>
				<div v-if="isShowMes" class="message">{{ message }}</div>
			</div>
		</div>
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
	watch,
	onUnmounted,
} from "vue";
import AsyncValidator from "async-validator";
// import { dispatch, broadcast } from "@/components/wx/utils/emitter";
import { useStore } from "vuex";
export default defineComponent({
	name: "wxFormItem",
	props: {
		label: { type: String, default: "" },
		prop: { type: String },
	},
	setup(props, context) {
		const { proxy } = getCurrentInstance();
		const store = useStore();
		const status = reactive({
			isRequired: false,
			isShowMes: false,
			message: "",
			initialValue: "",

			labelFor: "input" + new Date().valueOf(),
		});
		const form = inject("form");
		watch(
			() => {
				// return [store.state.wxFormValue, store.state.wxClearAll];
				return store.state.wxFormValue;
			},
			() => {
				methods.onFieldChange();
			}
		);
		watch(
			() => {
				return store.state.iswxFormBlur;
			},
			() => {
				methods.onFieldBlur();
			}
		);
		const methods = {
			fieldValue() {
				return form.model[props.prop];
			},
			setRules() {
				let rules = methods.getRules();
				if (rules.length) {
					rules.forEach((rule) => {
						if (rule.required) status.isRequired = rule;
					});
				}
			},
			getRules() {
				let formRules = form.rules;
				// console.log(formRules, props.prop);
				formRules = formRules ? formRules[props.prop] : [];
				return formRules;
			},
			// 过滤出符合要求的 rule 规则
			getFilteredRule(trigger) {
				const rules = methods.getRules();
				const res = rules.filter(
					(rule) => rule.trigger || rule.trigger.indexOf(trigger) !== -1
				);
				return res;
			},
			validate(trigger, cb) {
				let rules = methods.getFilteredRule(trigger);

				if (!rules || rules.length === 0) return true;
				const validator = new AsyncValidator({ [props.prop]: rules });
				let model = { [props.prop]: methods.fieldValue() };

				validator.validate(model, { firstFields: true }, (errors) => {
					status.isShowMes = errors ? true : false;
					status.message = errors
						? rules[0].settings
							? rules[0].fn()
							: errors[0].message
						: "";
					if (cb) cb(status.message);
				});
			},
			resetField() {
				status.message = "";
				// Object.keys(form.model).forEach((item) => {
				// 	form.model[item] = status.initialValue;
				// });
				// console.log(form.model);
				form.model[props.prop] = status.initialValue;
			},
			onFieldBlur() {
				// console.log("blur");
				methods.validate("blur");
			},
			onFieldChange() {
				// console.log("change");
				methods.validate("change");
			},
		};
		onMounted(() => {
			if (props) {
				store.dispatch("formAdd", proxy);
				// 设置初始值
				status.initialValue = methods.fieldValue();
				methods.setRules();
			}
		});
		onUnmounted(() => {
			store.dispatch("formRemove", proxy);
		});
		return {
			...methods,
			...toRefs(status),
		};
	},
});
</script>
<style lang="scss">
@import "@/components/wx/form/src/item/wxFormItem.scss";
</style>
