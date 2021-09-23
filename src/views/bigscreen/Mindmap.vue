<template>
	<div class="mind">
		<mindmaps
			v-model="data"
			:drag="isdrag"
			:zoom="isdrag"
			:edit="isdrag"
			:center-btn="isdrag"
			:fit-btn="isdrag"
			:add-node-btn="isdrag"
			:download-btn="download"
		></mindmaps>
	</div>
</template>

<script lang="ts">
import mindmaps from "vue3-mindmap";
import "vue3-mindmap/dist/style.css";

import { defineComponent, reactive, toRefs } from "vue"; // @ is an alias to /src
import "@/css/mindmap.scss";
export default defineComponent({
	components: { mindmaps },
	setup() {
		const state = reactive({
			isdrag: true,
			data: [
				{
					name: "如何学习D3",
					children: [
						{
							name: "预备知识",
							children: [{ name: "HTML & CSS" }, { name: "JavaScript" }],
						},
						{
							name: "安装",
							collapse: true,
							children: [{ name: "折叠节点" }],
						},
						{ name: "进阶", left: true },
					],
				},
			],
		});
		return { ...toRefs(state) };
	},
});
</script>
