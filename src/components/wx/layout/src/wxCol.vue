<template></template>
<script lang="ts">
import {
	defineComponent,
	toRefs,
	unref,
	h,
	computed,
	getCurrentInstance,
} from "vue";

export default defineComponent({
	name: "wxCol",
	props: {
		span: {
			type: Number,
			default: 24,
		},
		tag: {
			type: String,
			default: "div",
		},
		offset: Number,
		pull: Number,
		push: Number,
		xs: [Number, Object],
		sm: [Number, Object],
		md: [Number, Object],
		lg: [Number, Object],
		xl: [Number, Object],
	},
	setup(props, { slots }) {
		const { tag } = toRefs(props);
		const gutter = computed(() => {
			let { parent }: any = getCurrentInstance();
			while (parent && parent.type.componentName !== "wxRow") {
				parent = parent.parent;
			}
			return parent ? parent.props.gutter : 0;
		});
		return () => {
			const classList: any = [];
			const style: any = {};
			if (unref(gutter)) {
				style.paddingLeft = unref(gutter) / 2 + "px";
				style.paddingRight = style.paddingLeft;
			}

			["span", "offset", "pull", "push"].forEach((prop) => {
				if (unref(toRefs(props)[prop]) || unref(toRefs(props)[prop]) === 0) {
					classList.push(
						prop !== "span"
							? `wx-col-${prop}-${unref(toRefs(props)[prop])}`
							: `wx-col-${unref(toRefs(props)[prop])}`
					);
				}
			});
			["xs", "sm", "md", "lg", "xl"].forEach((size) => {
				if (typeof unref(toRefs(props)[size]) === "number") {
					classList.push(`el-col-${size}-${unref(toRefs(props)[size])}`);
				} else if (typeof unref(toRefs(props)[size]) === "object") {
					const propsData = unref(toRefs(props)[size]);
					Object.keys(propsData).forEach((prop) => {
						classList.push(
							prop !== "span"
								? `wx-col-${size}-${prop}-${propsData[prop]}`
								: `wx-col-${size}-${propsData[prop]}`
						);
					});
				}
			});
			return h(
				unref(tag),
				{
					class: ["wx-col", classList],
					style,
				},
				slots.default ? slots.default() : ""
			);
		};
	},
});
</script>
<style lang="scss" scoped>
@import "@/components/wx/layout/src/wxCol.scss";
</style>
