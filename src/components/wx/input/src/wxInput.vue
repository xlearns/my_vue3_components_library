<template>
	<div
		:class="{
			['wx-form-input']: true,
			'input-prepend': $slots.prepend,
			'input-append': $slots.append,
		}"
		:style="{ width: width }"
	>
		<!-- 前面内容 -->
		<div v-if="$slots.prepend" class="prepend">
			<slot name="prepend"></slot>
		</div>
		<input
			ref="inputEl"
			:value="modelValue"
			:type="inputType"
			:class="[
				{
					'wx-input-control': true,
				},
				{
					disabled: disabled,
				},
				{
					'has-prefix': $slots.prefix || prefixIcon,
				},
				size ? size : '',
			]"
			:disabled="disabled"
			@input="inputHandler"
			@focus="focusHandler"
			@blur="blurHandler"
		/>
		<!-- 后面内容 -->
		<div v-if="$slots.append" class="append"><slot name="append"></slot></div>
		<!-- 前面icon -->
		<span v-if="$slots.prefix || prefixIcon" class="prefix-icon">
			<i v-if="prefixIcon" class="iconfont" :class="[prefixIcon]"></i>
			<slot name="prefix"></slot>
		</span>
		<span class="suffix-icon">
			<slot name="suffix"></slot>
			<!-- 后面icon -->
			<i v-if="suffixIcon" :class="[suffixIcon]"></i>
			<!-- 清空 -->
			<i
				v-if="clear && modelValue"
				class="iconfont icon-guanbi1"
				@click.stop="clearValue"
			>
			</i>
			<!-- 眼睛 -->
			<i
				v-if="modelValue && showEye && type === 'password'"
				class="iconfont"
				:class="{ 'icon-yanjing-biyan': eyeShow, 'icon-yanjing': !eyeShow }"
				@click.stop="eyeShow = !eyeShow"
			>
			</i>
		</span>
	</div>
</template>
<script lang="ts">
import { ref, defineComponent, computed, watch, inject, onMounted } from "vue";
export default defineComponent({
	name: `wxInput`,
	components: {},
	inheritAttrs: false,
	props: {
		modelValue: {},
		disabled: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		type: {
			type: String,
			default: () => {
				return "text";
			},
		},
		clear: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		showEye: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		prefixIcon: {
			type: String,
		}, // 前缀icon
		suffixIcon: {
			type: String,
		}, // 后缀icon
		width: {
			type: String,
			default: () => {
				return "100%";
			},
		},
		size: {
			type: String,
			default: "medium",
			validator(val: string): boolean {
				return ["medium", "small", "mini", ""].includes(val);
			},
		},
	},
	emits: ["blur", "focus", "update:modelValue", "change"],
	setup(props, { emit, attrs }) {
		const inputEl = ref();
		const eyeShow = ref(false);
		const inputType = computed(() => {
			if (eyeShow.value) {
				return "text";
			} else {
				return props.type;
			}
		});
		const blurHandler = (e: Event) => {
			emit("blur", e);
			const { value } = e.target as HTMLInputElement;
			controlChangeEvent(value, "blur");
		};
		const focusHandler = (e: Event) => {
			emit("focus", e);
			const { value } = e.target as HTMLInputElement;
			controlChangeEvent(value, "focus");
		};
		const inputHandler = (e: Event) => {
			const { value } = e.target as HTMLInputElement;
			emit("update:modelValue", value);
			controlChangeEvent(value);
		};
		const clearValue = () => {
			emit("update:modelValue", "");
			emit("change", "");
		};
		// 通过el.value.focus()设置焦点事件
		const focus = () => {
			inputEl.value.focus();
		};
		const blur = () => {
			inputEl.value.blur();
		};
		watch(
			() => props.modelValue,
			(v: any) => {
				controlChangeEvent(v, "mounted");
			}
		);
		// formItem
		const controlChange: any = inject("controlChange", "");
		const controlChangeEvent = (val: any, type?: string) => {
			controlChange && controlChange(val, type);
		};
		onMounted(() => {
			controlChangeEvent(props.modelValue, "mounted");
		});
		return {
			inputType,
			blurHandler,
			focusHandler,
			inputHandler,
			clearValue,
			eyeShow,
			focus,
			blur,
			inputEl,
		};
	},
});
</script>
