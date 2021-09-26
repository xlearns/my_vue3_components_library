<template>
	<div class="wxTable" ref="wxTable">
		<div style="display: none">
			<slot></slot>
		</div>
    <table>
      
    </table>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	setup() {},
});
</script>
<style lang="scss" scoped>
@import "@/components/wx/table/src/table.scss";
</style>
