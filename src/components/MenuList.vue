<template>
	<div>
		<el-menu
			router
			:collapse="isCollapse"
			:default-active="$route.path"
			class="el-menu-vertical-demo"
			text-color="#fff"
			active-text-color="#ffd04b"
			:collapse-transition="istran"
			:uniqueOpened="true"
		>
			<!-- 遍历菜单 -->
			<template v-for="item in olist">
				<!-- 含有子菜单 -->
				<template v-if="item.children.length > 0">
					<!-- 第一层 含有子菜单菜单 -->
					<el-submenu :index="item.menu_id + ''" :key="item.menu_id">
						<template #title>
							<img :src="icon[item.menu_name]" alt="" />
							<span>{{ item.menu_name }}</span>
							<!-- <i :class="[item.menu_icon ? item.menu_icon : '']"></i> -->
						</template>

						<!-- 第二层 子菜单遍历 -->
						<template v-for="subItem in item.children">
							<!-- 第三层 子菜单含有子菜单 -->
							<el-submenu
								v-if="subItem.children.length > 0"
								:index="subItem.menu_id + ''"
								:key="subItem.menu_id"
							>
								<template #title>
									<!-- <i :class="[subItem.menu_icon ? subItem.menu_icon : '']"></i> -->
									<span>{{ subItem.menu_name }}</span>
								</template>
								<el-menu-item
									v-for="(threeItem, i) in subItem.children"
									:key="i"
									:index="threeItem.menu_url + ''"
								>
									<!-- <i
										:class="[threeItem.menu_icon ? threeItem.menu_icon : '']"
									></i> -->
									<template #title>{{ threeItem.menu_name + 123 }}</template>
								</el-menu-item>
							</el-submenu>

							<!-- 子菜单不含子菜单 -->
							<el-menu-item
								v-else
								:index="
									subItem.menu_url
										? subItem.menu_url + ''
										: subItem.menu_id + ''
								"
								:key="subItem.menu_id"
							>
								<!-- <i :class="[subItem.menu_icon ? subItem.menu_icon : '']"></i> -->
								<template #title>{{ subItem.menu_name }}</template>
							</el-menu-item>
						</template>
					</el-submenu>
				</template>

				<!-- 第一层 不含子菜单  -->
				<template v-else>
					<el-menu-item
						:index="item.menu_url ? item.menu_url + '' : item.menu_id + ''"
						:key="item.menu_id"
					>
						<!-- <i :class="[item.menu_icon ? item.menu_icon : '']"></i> -->
						<img :src="icon[item.menu_name]" alt="" />
						<template #title>{{ item.menu_name }}</template>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import "../css/menuList.scss";
import ziyuan from "@/assets/nav/ziyuan.png";
import guanli from "@/assets/nav/guanli.png";
import kexin from "@/assets/nav/kexin.png";
import shezhi from "@/assets/nav/shezhi.png";
import rizhi from "@/assets/nav/rizhi.png";
import wangg from "@/assets/nav/wangg.png";
import yonghu from "@/assets/nav/yonghu.png";

export default defineComponent({
	props: {
		list: Array,
		isCollapse: Boolean,
	},
	setup(props: any) {
		const olist: any = reactive(props.list);
		const state = reactive({
			istran: true,
			// isCollapse: false,
			icon: {
				资源管理: ziyuan,
				网关管理: guanli,
				可信工作域版本管理: kexin,
				部门管理: shezhi,
				终端用户管理: yonghu,
				系统日志: rizhi,
				系统用户管理: wangg,
			},
		});
		const methods = {};

		return {
			...toRefs(state),
			...methods,
			olist,
		};
	},
});
</script>
