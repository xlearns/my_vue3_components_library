<template>
	<div class="terminal">
		<!-- <div class="head-title split-line">终端用户管理</div> -->
		<div v-if="first_loader" class="data-list">
			<div class="operate">
				<div class="left">
					<div>
						<span class="label">工号：</span>
						<el-input
							size="mini"
							v-model="form.key1"
							placeholder="请输入"
						></el-input>
					</div>
					<div>
						<span class="label operation-time">部门：</span>
						<el-select v-model="form.key2" size="mini" placeholder="请选择">
							<el-option
								v-for="item in new_group_list"
								:key="item"
								:label="item.group_name"
								:value="item.group_id"
							>
							</el-option>
						</el-select>
					</div>
					<div>
						<span class="label operation-time">等级：</span>
						<el-select v-model="form.key3" size="mini" placeholder="请选择">
							<el-option
								v-for="item in user_level_option_new"
								:key="item"
								:label="item"
								:value="item"
							>
							</el-option>
						</el-select>
					</div>
					<!-- <div>
					<span class="label operation-time">型号：</span>
					<el-input
						class="enter-input"
						size="mini"
						v-model="form.key4"
						placeholder="请输入"
					></el-input>
				</div> -->
					<div>
						<span class="label operation-time">姓名：</span>
						<el-input
							class="enter-input"
							size="mini"
							v-model="form.key5"
							placeholder="请输入"
						></el-input>
					</div>
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
				@handleSelectionChange="handleSelectionChange"
				:curPage="middlePage"
				:isLoading="!loader"
				:total="page.total"
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
			:title="type === 'add' ? '添加用户管理' : '修改用户管理'"
			v-model="addDialog"
			width="40%"
			@open="open"
		>
			<el-form
				:model="formInfo"
				:rules="rules"
				label-width="80px"
				ref="formDom"
				class="add_user"
			>
				<el-form-item label="用户姓名" prop="user_name" class="user_name">
					<el-input
						v-model="formInfo.user_real_name"
						autocomplete="off"
						class=""
					></el-input>
				</el-form-item>
				<el-form-item label="所属部门" prop="group_id" class="user_name">
					<el-select
						v-model="formInfo.group_id"
						placeholder="请选择"
						multiple
						@change="selectAll"
					>
						<el-option label="全部" :value="0"> </el-option>
						<el-option
							v-for="item in group_list"
							:key="item"
							:label="item.group_name"
							:value="item.group_id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="身份证号"
					prop="user_id_card"
					:rules="[
						{
							validator: checkUserIdCard,
							trigger: ['blur'],
						},
					]"
				>
					<el-input
						v-model="formInfo.user_id_card"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item
					label="角色等级"
					prop="user_level"
					:rules="[
						{
							required: true,
							message: '请输入角色等级',
							trigger: ['blur', 'change'],
						},
					]"
				>
					<el-select v-model="formInfo.user_level" placeholder="请选择">
						<el-option
							v-for="item in user_level_option"
							:key="item"
							:label="item"
							:value="item"
						>
						</el-option>
					</el-select>
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
import { defineComponent, getCurrentInstance, reactive, toRefs } from "vue";
import Table from "../../components/Table.vue";
import {
	deleteUser,
	existUserName,
	queryUserList,
	saveUser,
	updateUser,
} from "../../utils/api";
import "@/css/terminal.scss";
import Pagination from "../../components/Pagination.vue";
import Loading from "../../components/Loading.vue";
import { ElNotification } from "element-plus";
export default defineComponent({
	components: {
		Pagination,
		Loading,
		Table,
	},
	setup() {
		const { proxy }: any = getCurrentInstance();
		const checkUserIdCard = (rule: any, value: any, callback: any) => {
			const re = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
			if (!value) {
				return callback(new Error("请输入身份证号"));
			} else if (!re.test(value)) {
				return callback(new Error("身份证号格式输入有误"));
			} else {
				callback();
			}
		};
		const state = reactive({
			headTitle: [
				{ label: "用户工号", val: "user_id" },
				{ label: "用户名", val: "user_name" },
				{ label: "用户姓名", val: "user_real_name" },
				{ label: "所属部门", val: "group_name" },
				{ label: "角色等级", val: "user_level" },
				{ label: "可信状态", val: "" },
				// { label: "SIM卡号", val: "super_sim_card" },
				// { label: "登陆状态", val: "login_state" },
				// { label: "是否注册", val: "user_name" },
			],
			operate: ["查看", "编辑", "删除"],
			addDialog: false,
			user_id: "",
			loader: false,
			type: "add",
			firstLoad: true,
			formInfo: {
				user_real_name: "",
				group_id: [],
				user_id_card: "",
				user_level: "",
				user_id: "",
			} as any,
			rules: {
				group_id: [
					{
						validator: (rule: any, value: any, callback: any) => {
							if (!state.firstLoad) {
								if (value.length <= 0) {
									callback(new Error("请输入所属部门"));
								} else {
									callback();
								}
							} else {
								state.firstLoad = false;
							}
						},
						trigger: ["change"],
					},
				],
				real_: [
					{
						validator: (rule: any, value: any, callback: any) => {
							if (value === "") {
								callback(new Error("请输入用户姓名"));
							} else {
								existUserName({
									real_: value,
									user_id: state.user_id,
								}).then(
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

			multipleSelection: [] as any,
			form: {
				key1: "",
				key2: "",
				key3: "",
				// key4: '',
				key5: "",
			} as any,
			user_level_option_new: ["全部", 1, 2, 3, 4, 5],
			user_level_option: [1, 2, 3, 4, 5],
			tableData: [] as any,
			new_group_list: [
				{
					group_id: "",
					group_name: "全部",
					group_description: null,
					group_level: "",
				},
			] as any,
			// newGroupList:
			group_list: [
				{
					group_id: "",
					group_name: "",
					group_description: null,
					group_level: "",
				},
			] as any,
			page: {
				total: 10,
				pageSize: 10,
				pageNo: 1,
			},
			departmentList: [] as any,
			first_loader: false,
			middlePage: 1,
		});
		const getTable = function(bool: any, isMessage: any) {
			const data = {} as any;
			data.pageNo = state.page.pageNo;
			data.pageSize = state.page.pageSize;
			if (bool) {
				data.key1 = state.form.key1 ? String(state.form.key1) : null;
				data.key2 = state.form.key2 ? String(state.form.key2) : null;
				// data.key3 = state.form.key3 ? String(state.form.key3) : null;
				if (state.form.key3 && state.form.key3 != "全部") {
					data.key3 = String(state.form.key3);
				} else {
					data.key3 = null;
				}
				data.key4 = state.form.key4 ? String(state.form.key4) : null;
				data.key5 = state.form.key5 ? String(state.form.key5) : null;
			}
			queryUserList(data).then(
				(res: any) => {
					if (res.errorCode != 1) {
						proxy.$message.error(res.message);
						return;
					}
					state.tableData = res.user_list;
					state.page.total = res.sum;
					state.group_list = res.group_list;
					state.new_group_list = [
						{
							group_id: "",
							group_name: "全部",
							group_description: null,
							group_level: "",
						},
					];
					state.new_group_list = state.new_group_list.concat(res.group_list);
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
		getTable(false, false);
		const methods = {
			def(type: any, val: any) {
				if (type == "编辑") {
					methods.handleClick(val);
				} else if (type == "查看") {
					console.log(type, val);
				} else if (type == "删除") {
					methods.del(val);
				}
			},
			selectAll(val: any) {
				if (val.includes(0)) {
					state.formInfo.group_id = state.group_list.map((item: any) => {
						return item.group_id;
					});
				}
				console.log(state.formInfo.group_id);

				// if (val.includes('')) {
				//   //全选
				//   const arr = [] as any
				//   state.new_group_list.map((item: any) => {
				//     if (item.group_id) {
				//       arr.push(item.group_id)
				//     }
				//   })
				//   //
				//   state.formInfo.group_id = arr
				//   // console.log(val);
				// }
			},
			open() {
				proxy.$forceUpdate();
			},
			handleSizeChange(val: any) {
				state.loader = false;
				state.page.pageSize = val;
				state.page.pageNo = 1;
				getTable(false, false);
			},
			add() {
				proxy.$refs["formDom"] && proxy.$refs["formDom"].resetFields();
				state.type = "add";
				state.formInfo = {
					user_real_name: "",
					group_id: [],
					user_id_card: "",
					user_level: "",
					user_id: "",
				};
				state.addDialog = true;
			},
			handleClick(res: any) {
				state.type = "编辑";
				state.user_id = res.user_id;
				state.formInfo.user_real_name = res.user_real_name;
				state.formInfo.group_id = res.groupDTOS.map(
					(item: any) => item.group_id
				);
				// state.formInfo.group_id = res.group_id
				state.formInfo.user_id_card = res.user_id_card;
				state.formInfo.user_level = res.user_level;
				state.formInfo.user_id = res.user_id;
				state.addDialog = true;
			},
			multipleDelete() {
				let obj = [] as any;

				if (state.multipleSelection && state.multipleSelection.length <= 0) {
					proxy.$message.warning("最少选择一条数据");
					return;
				} else {
					obj = state.multipleSelection.map((v: any) => {
						return v.user_id;
					});
				}
				proxy
					.$confirm("此操作将删除已选择数据, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						deleteUser({
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
				state.addDialog = false;
				proxy.$refs["formDom"] && proxy.$refs["formDom"].resetFields();
			},
			addUser() {
				proxy.$refs["formDom"].validate((valid: any) => {
					if (valid) {
						if (state.type == "add") {
							//添加
							const obj = {} as any;
							obj.user_real_name = state.formInfo.user_real_name;
							obj.group_id = state.formInfo.group_id;
							obj.user_id_card = state.formInfo.user_id_card;
							obj.user_level = state.formInfo.user_level;
							console.log(obj);

							saveUser(obj).then(
								(res: any) => {
									if (res.errorCode != 1) {
										proxy.$message.success(res.message);
										return;
									}
									proxy.$refs["formDom"] &&
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
							updateUser(state.formInfo).then(
								(res: any) => {
									if (res.errorCode != 1) {
										proxy.$message.success(res.message);
										return;
									}
									proxy.$refs["formDom"] &&
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
			handleSelectionChange(val: any) {
				//多删
				console.log(val);
				state.multipleSelection = val;
			},
			del(v: any) {
				const id = v.user_id;
				const obj = [] as any;
				obj[0] = id;
				proxy
					.$confirm("此操作将删除已选择数据, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						deleteUser({
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
			getInvestInfo() {
				// state.group_list = state.group_list_proxy;
			},
			handleCurrentChange(val: number) {
				state.loader = false;
				state.page.pageNo = val;
				getTable(true, false);
			},
			reset() {
				proxy.$refs["formDom"] && proxy.$refs["formDom"].resetFields();
				Object.keys(state.form).forEach((item) => {
					state.form[item] = null;
				});
			},
			select() {
				getTable(true, true);
			},
		};
		return { ...toRefs(state), ...methods, checkUserIdCard };
	},
});
</script>
