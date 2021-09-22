<template>
	<button class="wx-button" @click="handleClick">
		<slot></slot>
	</button>
</template>
<script>
import { defineComponent } from "vue";
import { debounce } from "throttle-debounce";

export default defineComponent({
	emits: ["click"],
	setup(props, context) {
		const throttleFunc = debounce(180, false, () => {
			context.emit("click");
		});
		const methods = {
			handleClick() {
				throttleFunc();
			},
		};

		return { ...methods };
	},
});
</script>

<style lang="scss">
@import "@/components/wx/button/wxButton.scss";
</style>
