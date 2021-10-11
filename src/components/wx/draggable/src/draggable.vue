<template>
	<div class="drag-container">
		<!-- grid列表拖拽 -->
		<el-row :gutter="25">
			<el-col :xs="25" :sm="8" :md="8" :lg="8">
				<el-card>
					<template #header>
						<div class="card-header">
							<span>grid列表拖拽</span>
						</div>
					</template>
					<draggable
						v-model="gridLists"
						class="grid-container"
						item-key="grid"
						animation="300"
						chosenClass="chosen"
						forceFallback="true"
					>
						<template #item="{ element }">
							<div :class="'item' + ' ' + 'item-' + element.num">
								{{ element.num }}
							</div>
						</template>
					</draggable>
				</el-card>
			</el-col>

			<el-col :xs="25" :sm="8" :md="8" :lg="8">
				<el-card>
					<template #header>
						<div class="card-header">
							<span>单列拖拽</span>
						</div>
					</template>
					<!-- 单列拖拽 -->
					<draggable
						v-model="lists"
						item-key="name"
						@change="change"
						chosen-class="chosen"
						force-fallback="true"
						animation="300"
					>
						<template #item="{ element, index }">
							<div class="item-single">{{ element.name }} {{ index }}</div>
						</template>
					</draggable>
				</el-card>
			</el-col>

			<el-col :xs="25" :sm="8" :md="8" :lg="8">
				<el-card>
					<template #header>
						<div class="card-header">
							<span>拖拽实现元素位置切换</span>
						</div>
					</template>
					<!-- 拖拽实现元素位置切换 -->
					<div class="cut-container">
						<div
							class="item-cut"
							v-for="(item, index) in cutLists"
							:key="index"
						>
							<p>{{ item.name }}</p>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import draggable from "vuedraggable";

let gridLists = ref<Array<Object>>([
	{ grid: "cn", num: 1 },
	{ grid: "cn", num: 2 },
	{ grid: "cn", num: 3 },
	{ grid: "cn", num: 4 },
	{ grid: "cn", num: 5 },
	{ grid: "cn", num: 6 },
	{ grid: "cn", num: 7 },
	{ grid: "cn", num: 8 },
	{ grid: "cn", num: 9 },
]);

let lists = ref<Array<Object>>([
	{ people: "cn", id: 1, name: "www.itxst.com" },
	{ people: "cn", id: 2, name: "www.baidu.com" },
	{ people: "cn", id: 3, name: "www.taobao.com" },
	{ people: "cn", id: 4, name: "www.google.com" },
]);

let cutLists = ref<Array<Object>>([
	{ people: "cn", id: 1, name: "cut1" },
	{ people: "cn", id: 2, name: "cut2" },
	{ people: "cn", id: 3, name: "cut3" },
	{ people: "cn", id: 4, name: "cut4" },
]);

const change = (evt: any): void => {
	console.log("evt: ", evt);
};

onMounted(() => {
	console.log(draggable);
	// 使用原生sortable实现元素位置切换
	// @ts-ignore
	// eslint-disable-next-line no-undef
	new Sortable(document.querySelector(".cut-container"), {
		swap: true,
		forceFallback: true,
		chosenClass: "chosen",
		swapClass: "highlight",
		animation: 300,
	});
});
</script>

<style lang="scss" scoped>
@import "@/components/wx/draggable/src/draggable.scss";
</style>
