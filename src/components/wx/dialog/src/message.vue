<template>
	<div class="wxMessage">
		<div class="content">
			<slot></slot>
		</div>
	</div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
	name: "wxMessage",
	setup() {},
});
</script>

<style lang="scss" scoped>
@import "@/components/wx/message/src/message.scss";
</style>
