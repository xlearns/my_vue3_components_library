<template>
	<div class="gateway">
		<!-- <div class="head-title split-line">网关列表</div> -->
		<div class="data-list" v-if="first_loader">
			<div class="operate">
				<div class="left">
					<el-form ref="formDom" :inline="true" :model="form">
						<el-form-item label="网关地址:">
							<el-input
								size="mini"
								v-model="form.key1"
								placeholder="请输入"
							></el-input>
						</el-form-item>
						<el-form-item label="网关状态:">
							<el-select v-model="form.key2" placeholder="请选择" size="mini">
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
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
				:headTitle="headTitle"
				:tableData="tableData"
				:selection="true"
				:number="true"
				@def="def"
				:operate="operate"
				:curPage="middlePage"
				:isLoading="!loader"
				:total="page.total"
				@handleSelectionChange="handleSelectionChange"
			/>
			<!-- 分页 -->
			<Pagination
				:total="page.total"
				:pageSize="page.pageSize"
				:pageNo="page.pageNo"
				@handleCurrentChange="handleCurrentChange"
				@sizeChange="handleSizeChange"
			/>
		</div>
		<div v-else>
			<Loading type="0" />
		</div>
		<!-- 模态框 -->
		<el-dialog
			:title="type === 'add' ? '添加网关管理' : '修改网关管理'"
			v-model="addDialog"
			width="40%"
		>
			<el-form
				:model="formInfo"
				:rules="rules"
				label-width="80px"
				ref="formDom"
				class="add_user"
			>
				<el-form-item label="网关名称" prop="gateway_name" class="user_name">
					<el-input
						v-model="formInfo.gateway_name"
						autocomplete="off"
						class=""
					></el-input>
				</el-form-item>

				<el-form-item
					label="公网IP"
					prop="ip_address"
					:rules="ip_address"
					class="addrules"
				>
					<el-input
						v-model="formInfo.ip_address"
						autocomplete="off"
						class=""
					></el-input>
				</el-form-item>
				<el-form-item
					label="局域网IP"
					prop="LAN_IP"
					:rules="LAN_IP"
					class="addrules"
				>
					<el-input v-model="formInfo.LAN_IP" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="端口" prop="port" :rules="port" class="addrules">
					<el-input v-model="formInfo.port" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<template #footer class="dialog-footer">
				<el-button @click="resetData" size="medium" type="danger"
					>取 消</el-button
				>
				<el-button type="success" size="medium" @click="addUser"
					>确 定</el-button
				>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts">
import {
	defineComponent,
	getCurrentInstance,
	reactive,
	toRefs,
	ref,
} from "vue";
import "@/css/gateway.scss";
import {
	selectAllGateway,
	existGatewayName,
	addGateway,
	updateGateway,
	deleteGateway,
} from "../../utils/api";
import Table from "../../components/Table.vue";
import Loading from "../../components/Loading.vue";
import Pagination from "../../components/Pagination.vue";
import { ElNotification } from "element-plus";
export default defineComponent({
	components: {
		Pagination,
		Loading,
		Table,
	},
	setup() {
		const { proxy }: any = getCurrentInstance();
		const state = reactive({
			headTitle: [
				{ label: "网关名称", val: "gateway_name" },
				{ label: "ip地址", val: "LAN_IP" },
				{ label: "状态", val: "availability" },
				{ label: "资源占用量", val: "key3" },
				{ label: "通信数据量", val: "key4" },
				{ label: "建立连接数", val: "key5" },
			],
			operate: ["详情", "自定义", "删除"],
			type: "add",
			addDialog: false,
			gateway_id: "",
			loader: false,
			rules: {
				LAN_IP: [
					{
						validator: (rule: any, value: any, callback: any) => {
							const re = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/g;
							if (value === "") {
								callback(new Error("请输入局域网IP"));
							} else if (!re.test(value)) {
								callback(new Error("请输入正确局域网IP"));
							} else {
								callback();
							}
						},
						trigger: ["blur", "change"],
					},
				],
				ip_address: [
					{
						validator: (rule: any, value: any, callback: any) => {
							const re = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/g;
							if (value === "") {
								callback(new Error("请输入公网IP"));
							} else if (!re.test(value)) {
								callback(new Error("请输入正确公网IP"));
							} else {
								callback();
							}
						},
						trigger: ["blur", "change"],
					},
				],
				port: [
					{
						validator: (rule: any, value: any, callback: any) => {
							const re = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/g;
							if (value === "") {
								callback(new Error("请输入端口号"));
							} else if (!re.test(value)) {
								callback(new Error("请输入正确端口号"));
							} else {
								callback();
							}
						},
						trigger: ["blur", "change"],
					},
				],
				gateway_name: [
					{
						validator: (rule: any, value: any, callback: any) => {
							if (value === "") {
								callback(new Error("请输入网关名称"));
							} else {
								const obj = {} as any;
								obj.gateway_name = value;
								obj.obj = state.type != "add" ? state.gateway_id : null;
								existGatewayName(obj).then(
									(res: any) => {
										if (res.errorCode != 1) {
											callback(new Error(res.message));
										} else {
											callback();
										}
									},
									(error) => {
										ElNotification({
											type: "error",
											title: "失败",
											message: error.message,
										});
										methods.reset();
									}
								);
							}
						},
						trigger: "blur",
					},
				],
			},
			formInfo: {
				gateway_name: "",
				ip_address: "",
				LAN_IP: "",
				port: "",
			},
			form: {
				key1: "",
				key2: "",
			} as any,
			options: [
				{ label: "在线可用", value: 1 },
				{ label: "下线", value: 0 },
				{ label: "忙碌", value: 2 },
				{ label: "不可用", value: -1 },
			],
			tableData: [] as any,
			page: {
				total: 10,
				pageSize: 10,
				pageNo: 1,
			},
			multipleSelection: [],
			first_loader: false,
			middlePage: 1,
		});
		const getTable = function(bool: any, isMessage: any) {
			const data = {} as any;
			data.pageNo = state.page.pageNo;
			data.pageSize = state.page.pageSize;
			if (bool) {
				data.key1 = state.form.key1 ? String(state.form.key1) : null;
				data.key2 =
					state.form.key2 || state.form.key2 == "0"
						? String(state.form.key2)
						: null;
			}
			selectAllGateway(data).then(
				(res: any) => {
					if (res.errorCode != 1) {
						proxy.$message.error(res.message);
						return;
					}
					state.tableData = res.gateway_list;
					state.page.total = res.sum;
					state.loader = true;
					if (!state.first_loader) {
						state.first_loader = true;
					}
					state.middlePage = state.page.pageNo;
					isMessage && proxy.$message.success(res.message);
				},
				(error) => {
					ElNotification({
						type: "error",
						title: "失败",
						message: error.message,
					});
					methods.reset();
				}
			);
		};
		const methods = {
			def(type: any, val: any) {
				if (type == "详情") {
					console.log(type, val);
				} else if (type == "自定义") {
					console.log(type, val);
				} else if (type == "删除") {
					methods.del(val);
				}
			},
			handleSizeChange(val: any) {
				state.loader = false;
				state.page.pageSize = val;
				state.page.pageNo = 1;
				getTable(false, false);
			},
			handleCurrentChange(val: number) {
				state.loader = false;
				state.page.pageNo = val;
				getTable(true, false);
			},
			handleSelectionChange(val: any) {
				//多删
				state.multipleSelection = val;
			},
			select() {
				getTable(true, true);
			},
			reset() {
				proxy.$refs.formDom.resetFields();
				Object.keys(state.form).forEach((item) => {
					state.form[item] = null;
				});
			},
			multipleDelete() {
				let obj = [] as any;
				console.log(state.multipleSelection);
				obj = state.multipleSelection.map((v: any) => {
					return v.id;
				});
				if (state.multipleSelection.length <= 0) {
					proxy.$message.warning("最少选择一条数据");
					return;
				}
				proxy
					.$confirm("此操作将删除已选择数据, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						deleteGateway({
							id_list: obj,
						}).then(
							(res: any) => {
								if (res.errorCode != 1) {
									proxy.$message.error(res.message);
									return;
								}
								proxy.$message.success(res.message);
								getTable(false, false);
							},
							(error) => {
								ElNotification({
									type: "error",
									title: "失败",
									message: error.message,
								});
								methods.reset();
							}
						);
					})
					.catch(() => {
						proxy.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},
			add() {
				state.addDialog = true;
			},
			details() {
				console.log(1);
			},
			handleClick() {
				console.log(1);
			},
			del(v: any) {
				const id = v.id;
				const obj = [] as any;
				obj[0] = id;
				proxy
					.$confirm("此操作将删除已选择数据, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						deleteGateway({
							id_list: obj,
						}).then(
							(res: any) => {
								if (res.errorCode != 1) {
									proxy.$message.error(res.message);
									return;
								}
								proxy.$message.success(res.message);
								getTable(false, false);
							},
							(error) => {
								ElNotification({
									type: "error",
									title: "失败",
									message: error.message,
								});
								methods.reset();
							}
						);
					})
					.catch(() => {
						proxy.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},
			resetData() {
				proxy.$refs["formDom"].resetFields();
				state.addDialog = false;
			},
			addUser() {
				proxy.$refs["formDom"].validate((valid: any) => {
					if (valid) {
						if (state.type == "add") {
							//添加
							const obj = {} as any;
							obj.gateway_name = state.formInfo.gateway_name;
							obj.ip_address = state.formInfo.ip_address;
							obj.LAN_IP = state.formInfo.LAN_IP;
							obj.port = Number(state.formInfo.port);
							addGateway(obj).then(
								(res: any) => {
									if (res.errorCode != 1) {
										proxy.$message.success(res.message);
										return;
									}
									proxy.$refs["formDom"].resetFields();
									state.addDialog = false;
									proxy.$message.success(res.message);
									getTable(false, false);
								},
								(error) => {
									ElNotification({
										type: "error",
										title: "失败",
										message: error.message,
									});
									methods.reset();
								}
							);
						} else {
							updateGateway(state.formInfo).then(
								(res: any) => {
									if (res.errorCode != 1) {
										proxy.$message.success(res.message);
										return;
									}
									proxy.$refs["formDom"].resetFields();
									state.addDialog = false;
									proxy.$message.success(res.message);
									getTable(false, false);
								},
								(error) => {
									ElNotification({
										type: "error",
										title: "失败",
										message: error.message,
									});
									methods.reset();
								}
							);
						}
					} else {
						return false;
					}
				});
			},
		};

		getTable(false, false);
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>
