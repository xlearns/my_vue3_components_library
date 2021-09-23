<template>
	<el-container class="home">
		<!-- <el-header height="70px">
			<Header />
		</el-header> -->
		<el-container>
			<el-aside>
				<Tools :list="menu" />
			</el-aside>
			<el-main>
				<el-header height="90px" v-if="$route.name != '404'">
					<Header />
				</el-header>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>
<script lang="ts">
import Header from "../components/Header.vue";
import { defineComponent, reactive, toRefs, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import Tools from "../components/Tools.vue";
import "@/css/main.scss";
export default defineComponent({
	components: {
		Header,
		Tools,
	},
	setup() {
		const { proxy }: any = getCurrentInstance();
		const router = useRouter();
		const state = reactive({
			menu: [],
			isCollapse: false,
		});
		const methods = {};

		const getMenus = function () {
			const menu: any = sessionStorage.getItem("menu");
			if (!menu) {
				proxy.$message.error("菜单获取失败，请重新登入");
				sessionStorage.clear();
				router.push("/login");
				return;
			}
			state.menu = JSON.parse(menu);
		};

		getMenus();
		return {
			...methods,
			...toRefs(state),
		};
	},
});
</script>
