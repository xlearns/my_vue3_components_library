<template>
	<div :class="{ [`wx-btn-group`]: true }">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import pType from "../../utils/pType";
import { provide, defineComponent } from "vue";

export default defineComponent({
	name: `wxButtonGroup`,
	props: {
		size: pType.string(),
		round: pType.bool(),
		disabled: pType.bool(),
		width: pType.string(),
	},
	emits: ["click"],
	setup(props, { emit }) {
		provide("groupConfig", props);
		provide("btnClick", (event: Element, name: string) => {
			if (!props.disabled) {
				emit("click", event, name);
			}
		});
		return {};
	},
});
</script>
