<template>
	<div class="error">
		<img src="../assets/wangye@2x.png" alt="" />
		<div>
			<h1>404</h1>
			<p>抱歉，网页走丢了，刷新页面试试～</p>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	setup() {
		return {};
	},
});
</script>
<style lang="scss">
.error {
	height: 100vh;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	h1 {
		color: #666666;
		font-size: 60px;
		margin-bottom: 24px;
	}
	p {
		font-size: 20px;
		font-family: MicrosoftYaHei;
		color: #666666;
	}
	img {
		margin-right: 84px;
		width: 443px;
		height: 342px;
	}
}</style
>>
