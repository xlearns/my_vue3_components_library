<template>
	<div
		:class="{
			className,
			[prefixCls + '-form-item-error']: errorTips !== '',
			[prefixCls + '-form-item']: true,
		}"
	>
		<label
			v-if="label || $slots.label"
			v-show="!labelVisible"
			:class="{ required: isRequired, [prefixCls + '-form-label']: true }"
			:style="labelStyle"
		>
			<slot name="label">{{ label }}</slot>
		</label>
		<div :class="`${prefixCls}-form-box`">
			<slot></slot>
			<template v-if="iconType && messageShow && rules2 && rules2.length > 0">
				<div
					v-if="errorTips === ''"
					:class="`${prefixCls}-form-tips ${iconType}`"
				></div>
				<div
					v-else
					:class="`${prefixCls}-form-tips ${iconType}`"
					v-text="errorTips"
				></div>
			</template>
		</div>
		<slot name="other"></slot>
	</div>
</template>

<script lang="ts">
import Validate from "./validate";
import {
	provide,
	defineComponent,
	reactive,
	computed,
	toRefs,
	inject,
	onMounted,
} from "vue";

export default defineComponent({
	name: `wxFormItem`,
	props: {
		className: {
			type: String,
			default: () => {
				return "";
			},
		},
		label: {
			type: String,
			default: () => {
				return "";
			},
		},
		labelVisible: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		prop: {
			type: String,
			default: () => {
				return "";
			},
		},
		required: {
			type: Boolean,
			default: () => {
				return true;
			},
		},
		verify: {
			type: String,
			default: () => {
				return "";
			},
		},
		// 用于快速验证，formItem带验证规则时，使用默认提示
		rules: {
			type: Array,
			default: function () {
				return [];
			},
		},
		showMessage: {
			type: Boolean,
			default: () => {
				return true;
			},
		},
		trigger: {
			validator: function (value: string) {
				return ["change", "blur"].indexOf(value) !== -1;
			},
			default: () => {
				return "change";
			},
		},
		labelWidth: {
			type: String,
			default: () => {
				return "";
			},
		},
	},
	setup(props: any) {
		const formProps: any = inject("formProps", {});
		let formRules;
		// 取出rules
		if (formProps && formProps.rules && formProps.rules[props.prop]) {
			formRules = formProps.rules[props.prop];
		}
		let rules = [...props.rules];
		// rules不存在的时候，使用form上面的rules
		if (props.rules.length === 0 && !props.verify && formRules) {
			// 使用form的，formItem没有设置时使用form
			rules = [...formRules];
		}

		// 当参数1为空的时候，使用参数2的设置
		const getFormProps = (formItem: any, form: any) => {
			if (form !== undefined) {
				return form;
			} else {
				return formItem;
			}
		};
		const state = reactive({
			prefixCls: "wx",
			errorTips: "", // 有值时表示校验没通过有错误信息
			iconType: "", // 提示类型，
			rules2: rules, //将rules赋值给rules2
			trigger2: getFormProps(props.trigger, formProps.trigger),
			messageShow: getFormProps(props.showMessage, formProps.showMessage), // 优先使用form的
			controlValue: "", // 组件的值，改变事件时*/
		});
		// 有快速校验规则，追加
		if (props.verify) {
			const verifyMsg: { [index: string]: string } = {
				required: "必填字段",
				mobile: "手机号格式不正确",
				tel: "电话号码不正确",
				mail: "请输入正确邮箱",
				digits: "必须为正整数",
				number: "必须为数字",
				phone: "请输入固话或手机",
			};
			const temRule = props.verify.split(",");
			temRule.forEach((item) => {
				state.rules2.push({
					type: item,
					msg: verifyMsg[item],
				});
			});
		}

		const isRequired = computed(() => {
			let bool = false;
			const required = getFormProps(props.required, formProps.required);
			//当rulse2也就是rules存在的时候执行
			if (required && state.rules2 && state.rules2.length > 0) {
				//rules不为一个的时候
				state.rules2.forEach((item) => {
					if (item.type === "required") {
						bool = true;
						return false;
					}
				});
			}
			// 通过formItem写的verify也要添加
			if (
				props.required &&
				props.verify &&
				props.verify.indexOf("required") !== -1
			) {
				bool = true;
			}
			return bool;
		});

		// 如果form组件设置了label的宽
		const labelStyle = computed(() => {
			const width = getFormProps(formProps.labelWidth, props.labelWidth);
			if (width) {
				return {
					width: width,
				};
			} else {
				return null;
			}
		});
		const validate = (value: any) => {
			let value2 = value;
			// 外部调用时没有值
			if (value === undefined) {
				value2 = state.controlValue;
			}
			return new Promise((resolve, reject) => {
				if (state.rules2) {
					const result = Validate(value2, state.rules2);
					if (result === true) {
						// 通过
						state.errorTips = "";
						state.iconType = "iconfont icon-chenggong";
						resolve(state.controlValue);
						// console.log('通过')
					} else {
						state.errorTips = result;
						// state.iconType = "icon-failure";
						state.iconType = "iconfont icon-shibai";
						reject(state.errorTips);
						// console.log('不通过')
					}
				} else {
					// 没有校验规则
					resolve(state.controlValue);
					console.log("没有校验规则通过");
				}
			});
		};
		const focusTips = (value: any) => {
			let typeTips = "";
			state.rules2.forEach((item) => {
				if (item.type === "tips") {
					typeTips = item.msg;
				}
			});
			if (typeTips && !value) {
				// 没有值时才提示
				state.errorTips = typeTips;
				state.iconType = "icon-tips";
			}
		};
		// 清空输入提示，恢复初始状态
		const clearTips = () => {
			state.errorTips = "";
			state.iconType = "";
		};
		const getFormItemFields: any = inject("addFormItem", "");
		const getAllFormItemFields = () => {
			// 所有带校验规则的
			if (state.rules2.length > 0 && getFormItemFields) {
				getFormItemFields({
					validate: validate,
					clear: clearTips,
					prop: props.prop || `prop${new Date().getTime()}`, // 当有prop时随机添加一个
				});
			}
		};
		provide("controlChange", (val: any, type: string) => {
			state.controlValue = val;
			// 将组件值存起来，不触发其他操作，在没有手动触发时也使用validate来校验
			if (type === "mounted") {
				return;
			}
			if (type === "focus") {
				focusTips(val);
			} else if (state.trigger2 === "blur") {
				// 失去焦点校验
				if (type === "blur") {
					validate(val).catch((res) => {
						console.log(res);
					});
				}
			} else {
				//update
				validate(val).catch((res) => {
					//失败
					console.log(res);
				});
			}
		});
		onMounted(() => {
			getAllFormItemFields();
		});
		return {
			...toRefs(state),
			isRequired,
			labelStyle,
			validate,
			clearTips,
		};
	},
});
</script>
<style lang="scss" scoped>
@import "@/components/wx/form/src/item/wxFormItem.scss";
</style>
