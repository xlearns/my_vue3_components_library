<template>
	<div class="route">
		<!-- <div class="head-title split-line">网关路由管理</div> -->
		<div class="data-list" v-if="first_loader">
			<div class="operate">
				<el-form :model="formSelect">
					<el-form-item label="服务器端口:">
						<el-input
							size="mini"
							v-model="formSelect.key1"
							placeholder="请输入"
						></el-input>
					</el-form-item>
					<el-form-item label="真实服务器端口:">
						<el-input
							size="mini"
							v-model="formSelect.key2"
							placeholder="请输入"
						></el-input>
					</el-form-item>
				</el-form>
				<div class="btn">
					<el-button type="primary" size="mini" @click="check">查询</el-button>
					<el-button type="success" size="mini" @click="add">添加</el-button>
					<el-button type="danger" size="mini" @click="del">删除</el-button>
					<el-upload
						class="upload-demo"
						action=""
						:before-upload="beforeUpload"
						:http-request="uploadExecl"
						multiple
						:show-file-list="false"
						accept=".xls, .xlsx"
					>
						<el-button size="mini" type="success">execl 导入</el-button>
					</el-upload>
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
				ref="tableRef"
				:tableData="tableData"
				:headTitle="headTitle"
				:operate="operate"
				@def="def"
				@handleSelectionChange="getDelList"
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
		<el-dialog
			:title="addorEdit === 'add' ? '添加' : '编辑'"
			v-model="dialogVisible"
			width="50%"
		>
			<el-form
				:model="form"
				:rules="rules"
				ref="dialogForm"
				label-position="right"
				label-width="120px"
			>
				<el-form-item label="名称" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="真实服务器端口" prop="realHostPort">
					<el-input v-model="form.realHostPort"></el-input>
				</el-form-item>
				<el-form-item label="服务器端口" prop="serverPort">
					<el-input v-model="form.serverPort"></el-input>
				</el-form-item>
				<el-form-item label="域名" prop="domian">
					<el-input v-model="form.domian"></el-input>
				</el-form-item>
				<el-form-item label="代理类型" prop="proxyType">
					<el-select v-model="form.proxyType" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="真实服务器地址" prop="realHost">
					<el-input v-model="form.realHost"></el-input>
				</el-form-item>
				<el-form-item label="代理服务器" prop="clientKey">
					<el-input v-model="form.clientKey"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="form.description"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts">
import {
	defineComponent,
	getCurrentInstance,
	reactive,
	ref,
	toRefs,
} from "vue";
import { getRoute, saveRoute, updateRoute, deleteRoute } from "@/utils/api";
import Table from "@/components/Table.vue";
import Pagination from "../../components/Pagination.vue";
import Loading from "../../components/Loading.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import "@/css/route.scss";
export default defineComponent({
	name: "Route",
	components: { Table, Pagination, Loading },
	setup() {
		const ctx = getCurrentInstance() as any;
		const dialogForm = ref(null) as any;
		const checkPort = (rule: any, value: any, callback: any) => {
			const re = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
			if (!value) {
				if (rule.field === "serverPort")
					return callback(new Error("请输入服务器端口"));
				return callback(new Error("请输入真实服务器端口"));
			} else if (!re.test(value)) {
				return callback(new Error("端口格式输入有误"));
			} else {
				callback();
			}
		};

		const checkIP = (rule: any, value: any, callback: any) => {
			const re = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
			if (!value) {
				if (rule.field === "realHost")
					return callback(new Error("请输入真实服务器地址"));
				return callback(new Error("请输入代理服务器"));
			} else if (!re.test(value)) {
				return callback(new Error("IP地址格式输入有误"));
			} else {
				callback();
			}
		};
		const state = reactive({
			tableData: [],
			multipleSelection: [],
			headTitle: [
				{
					label: "名称",
					val: "name",
				},
				{
					label: "域名",
					val: "domain",
				},
				{
					label: "服务器端口",
					val: "serverPort",
				},
				{
					label: "真实服务器端口",
					val: "realHostPort",
				},
				{
					label: "代理类型",
					val: "proxyType",
				},
				{
					label: "真实服务器地址",
					val: "realHost",
				},
				{
					label: "代理服务器",
					val: "clientKey",
				},
				{
					label: "描述",
					val: "description",
				},
				{
					label: "状态",
					val: "status",
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
			form: {
				name: null,
				domain: null,
				serverPort: null,
				realHostPort: null,
				proxyType: null,
				realHost: null,
				clientKey: null,
				description: null,
			},

			rules: {
				name: [{ required: true, message: "请输入名称", trigger: "blur" }],
				domain: [{ required: true, message: "请输入域名", trigger: "blur" }],
				serverPort: [{ required: true, validator: checkPort, trigger: "blur" }],
				realHostPort: [
					{ required: true, validator: checkPort, trigger: "blur" },
				],
				proxyType: [
					{ required: true, message: "请选择代理类型", trigger: "change" },
				],
				realHost: [{ required: true, validator: checkIP, trigger: "blur" }],
				clientKey: [
					{ required: true, message: "请输入代理服务器", trigger: "blur" },
				],
			},
			options: [
				{
					label: "tcp",
					value: 1,
				},
				{
					label: "http",
					value: 2,
				},
				{
					label: "udp",
					value: 3,
				},
			],
			formSelect: {
				key1: null,
				key2: null,
			},
			del_list: [] as any,
			// loading: true,
			loader: false,
			first_loader: false,
			middlePage: 1,
		});
		const methods = {
			handleSelectionChange(val: any) {
				state.multipleSelection = val;
			},
			getTableData() {
				getRoute(state.pageConfig).then((res) => {
					state.tableData = res.route_list;
					state.total = res.sum;
					state.loader = true;
					if (!state.first_loader) {
						state.first_loader = true;
					}
					state.middlePage = state.pageConfig.pageNo;
				});
			},
			add() {
				state.addorEdit = "add";
				state.dialogVisible = true;
				dialogForm.value?.resetFields();
				state.form.description = null;
			},
			def(type: any, val: any) {
				if (type === "编辑") {
					methods.edit(val);
				} else if (type === "删除") {
					methods.rowDel(val);
				}
			},
			edit(row: any) {
				state.addorEdit = "edit";
				state.dialogVisible = true;
				dialogForm.value?.resetFields();
				ctx.ctx.$nextTick(() => {
					state.form = { ...row };
					console.log(state.form);
				});
			},
			confirm() {
				if (state.addorEdit === "add") {
					methods.addRoute();
				} else {
					methods.editRoute();
				}
			},
			addRoute() {
				dialogForm.value.validate((valid: any) => {
					if (valid) {
						saveRoute(state.form).then((res) => {
							if (res.errorCode === 1) {
								ElMessage.success({
									message: "网关路由添加成功",
									type: "success",
								});
								methods.getTableData();
								dialogForm.value?.resetFields();
								state.form.description = null;
								state.dialogVisible = false;
							}
						});
					}
				});
			},
			editRoute() {
				dialogForm.value.validate((valid: any) => {
					if (valid) {
						updateRoute(state.form).then((res) => {
							if (res.errorCode === 1) {
								ElMessage.success({
									message: "网关路由更新成功",
									type: "success",
								});
								methods.getTableData();
								dialogForm.value?.resetFields();
								state.form.description = null;
								state.dialogVisible = false;
							}
						});
					}
				});
			},
			check() {
				if (state.formSelect.key1 === "") {
					state.formSelect.key1 = null;
				}
				if (state.formSelect.key2 === "") {
					state.formSelect.key2 = null;
				}
				const obj = {
					...state.pageConfig,
					...state.formSelect,
				};
				getRoute(obj).then((res) => {
					state.tableData = res.route_list;
				});
			},
			//得到删除列表的id数组
			getDelList(val: any) {
				state.multipleSelection = val;
				if (Array.isArray(val)) {
					state.del_list = val.map((item: any) => item.id);
				} else {
					state.del_list.push(val.id);
				}
			},
			del() {
				if (state.del_list.length > 0) {
					const obj = { id_list: state.del_list };
					ElMessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					}).then(() => {
						deleteRoute(obj).then((res) => {
							if (res.errorCode === 1) {
								ElMessage.success({
									message: "网关路由删除成功",
									type: "success",
								});
								methods.getTableData();
							}
						});
					});
				} else {
					ElMessage({
						message: "请先选择要删除的数据",
						type: "warning",
					});
				}
			},
			rowDel(row: any) {
				const obj = { id_list: [row.id] };
				ElMessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					deleteRoute(obj).then((res) => {
						if (res.errorCode === 1) {
							ElMessage.success({
								message: "网关路由删除成功",
								type: "success",
							});
							methods.getTableData();
						}
					});
				});
			},
			beforeUpload(file: any) {
				const re = /(\.xls|\.xlsx)$/;
				if (!re.test(file.name)) {
					ElMessage.error("只能上传execl文件");
				}
				return re.test(file.name);
			},
			uploadExecl(param: any) {
				const formData = new FormData();
				formData.append("file", param.file);
				// console.log(formData.get('files'))
				axios
					.post("/api/gatewayRoute/uploadExcel", formData, {
						headers: { "Content-Type": "multipart/form-data" },
					})
					.then((res: any) => {
						if (res.data.errorCode === 1) {
							ElMessageBox.alert(
								`excel导入网关路由信息成功 导入失败的行数为${res.data.errorRoute}`,
								"提示",
								{
									confirmButtonText: "确定",
								}
							);
						}
					});
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
			cancel() {
				dialogForm.value?.resetFields();
				state.dialogVisible = false;
			},
		};

		methods.getTableData();
		return { ...toRefs(state), ...methods, dialogForm };
	},
});
</script>
