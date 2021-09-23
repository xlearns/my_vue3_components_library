<template>
	<div class="usermanage">
		<!-- <div class="head-title split-line">系统用户管理</div> -->
		<div v-if="first_loader" class="data-list">
			<div class="operate">
				<div class="left">
					<el-form ref="formDom" :inline="true" :model="formSelect">
						<el-form-item label="账号:">
							<el-input
								size="mini"
								v-model="formSelect.key1"
								placeholder="请输入"
							></el-input>
						</el-form-item>
						<el-form-item label="角色:">
							<el-select
								v-model="formSelect.key2"
								placeholder="请选择"
								size="mini"
								clearable
								@clear="clear"
							>
								<el-option
									v-for="item in rule_list"
									:key="item.role_id"
									:label="item.role_name"
									:value="item.role_id"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div class="right">
						<el-button type="primary" size="mini" @click="select"
							>查询</el-button
						>
						<el-button size="mini" @click="reset">重置</el-button>
						<el-button type="success" size="mini" @click="add">添加</el-button>
						<el-button type="danger" size="mini" @click="multipleDelete"
							>删除</el-button
						>
					</div>
				</div>
			</div>
			<div class="seleced">
				<span class="seleced_logo"></span>
				已勾选
				<span class="color_blue"
					>&nbsp;{{ multipleSelection.length }}&nbsp;</span
				>项
			</div>
			<Table
				:tableData="tableData"
				:headTitle="headTitle"
				:operate="operate"
				@def="def"
				@handleSelectionChange="handleSelectionChange"
				:selection="true"
				:curPage="middlePage"
				:isLoading="!loader"
				:number="true"
				:total="total"
			/>
			<Pagination
				:pageNo="pageConfig.pageNo"
				:pageSize="pageConfig.pageSize"
				:total="total"
				@handleCurrentChange="handleCurrentChange"
				@handleSizeChange="handleSizeChange"
			/>
		</div>
		<div v-else>
			<Loading type="0" />
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance } from "vue";
import Table from "@/components/Table.vue";
import Pagination from "../../components/Pagination.vue";
import Loading from "../../components/Loading.vue";
import { getAllAdmin } from "@/utils/api";
import "@/css/usermanage.scss";
export default defineComponent({
	components: { Table, Pagination, Loading },
	setup() {
		const { proxy }: any = getCurrentInstance();
		const state = reactive({
			tableData: [],
			formSelect: {
				key1: null,
				key2: null,
			} as any,
			loader: false,
			headTitle: [
				{
					label: "账号",
					val: "admin_name",
				},
				{
					label: "角色",
					val: "role_name",
				},
				{
					label: "权限",
					val: "role",
				},
			],
			operate: ["编辑", "删除"],
			pageConfig: {
				pageNo: 1,
				pageSize: 10,
			},
			total: 0,
			addorEdit: "add",
			dialogVisible: false,
			rule_list: [{ role_name: "", role_id: 0 }],
			first_loader: false,
			middlePage: 1,
			multipleSelection: [],
		});
		const methods = {
			getTableData() {
				getAllAdmin(state.pageConfig).then((res) => {
					state.tableData = res.adminList;
					state.total = res.adminSum;
					state.loader = true;
					if (!state.first_loader) {
						state.first_loader = true;
					}
					state.middlePage = state.pageConfig.pageNo;
					state.rule_list = res.roleList.map((item: any) => ({
						role_name: item.role_name,
						role_id: item.role_id,
					}));
				});
			},
			clear() {
				state.formSelect.key2 = null;
			},
			handleSelectionChange(val: any) {
				state.multipleSelection = val;
			},
			select() {
				const obj = { ...state.formSelect, ...state.pageConfig };
				getAllAdmin(obj).then((res) => {
					state.tableData = res.adminList;
					state.total = res.sum;
					state.loader = true;
				});
			},
			reset() {
				Object.keys(state.formSelect).forEach((item: any) => {
					state.formSelect[item] = null;
				});
				methods.getTableData();
			},
			//切页
			handleCurrentChange(val: any) {
				state.loader = false;
				state.pageConfig.pageNo = val;
				methods.getTableData();
			},
			handleSizeChange(val: any) {
				state.loader = false;
				state.pageConfig.pageSize = val;
				methods.getTableData();
			},
		};
		methods.getTableData();
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>
