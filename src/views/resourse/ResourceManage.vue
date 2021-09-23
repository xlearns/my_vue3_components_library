<template>
	<div class="resourcemanage">
		<div v-if="first_loader" class="all">
			<div class="operate">
				<div class="left">
					<div>
						<span class="label">文件名称：</span>
						<el-input
							size="mini"
							v-model="form.key1"
							placeholder="请输入"
						></el-input>
					</div>
					<div>
						<span class="label operation-time">文件等级：</span>
						<el-select v-model="form.key2" size="mini" placeholder="请选择">
							<el-option
								v-for="item in user_level_option_new"
								:key="item"
								:label="item"
								:value="item"
							>
							</el-option>
						</el-select>
					</div>
					<div class="right">
						<el-button type="primary" size="mini" v-debounce="[select]"
							>查询</el-button
						>
						<el-button size="mini" @click="reset(true)">重置</el-button>
					</div>
				</div>
			</div>
			<div class="operate--bottom">
				<el-select v-model="form.key3" size="mini" placeholder="请选择排列方式">
					<el-option label="按导入时间排序" value="resource_time"> </el-option>
					<el-option label="按名称排序" value="resource_name"> </el-option>
					<el-option label="按等级排序" value="resource_level"> </el-option>
				</el-select>

				<el-dropdown size="mini" @command="handleCommand" class="all_delete">
					<el-button type="primary" size="mini">
						上传<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="0">上传文件</el-dropdown-item>
							<el-dropdown-item command="1">上传文件夹</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<el-button
					class="all_delete"
					type="danger"
					size="mini"
					@click="multipleDelete"
					>删除</el-button
				>
			</div>
			<div class="seleced">
				<span class="seleced_logo"></span>
				已勾选
				<span class="color_blue"
					>&nbsp;{{ multipleSelection.length }}&nbsp;</span
				>项
			</div>
			<div class="content">
				<Table
					:isLoading="!loader"
					:headTitle="headTitle"
					:tableData="tableData"
					:selection="true"
					:number="true"
					@def="def"
					:curPage="middlePage"
					:operate="operate"
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
		</div>
		<div v-else>
			<Loading type="0" />
		</div>
		<!--修改App模态框  -->
		<el-dialog title="修改APP" v-model="addDialog" width="400px" @open="open">
			<div>
				<el-form ref="formDom" :model="formInfo" label-width="80px">
					<el-form-item label="文件名称">
						<el-input
							v-model="formInfo.resource_name"
							:disabled="true"
						></el-input>
					</el-form-item>
					<el-form-item label="文件类型">
						<el-input
							v-model="formInfo.resource_type"
							:disabled="true"
						></el-input>
					</el-form-item>
					<el-form-item label="存储位置">
						<el-input
							v-model="formInfo.resource_path"
							:disabled="true"
						></el-input>
					</el-form-item>
					<el-form-item label="上传时间">
						<el-input
							v-model="formInfo.resource_time"
							:disabled="true"
						></el-input>
					</el-form-item>
					<el-form-item label="部门">
						<el-input
							v-model="formInfo.resource_groupname"
							:disabled="true"
						></el-input>
					</el-form-item>
					<el-form-item label="文件等级">
						<el-select
							v-model="formInfo.resource_level"
							placeholder="请选择"
							style="width: 100%"
						>
							<el-option
								v-for="item in user_level_option"
								:key="item.value"
								:label="item"
								:value="item"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			<template #footer class="dialog-footer">
				<el-button size="medium" type="danger" @click="cancelUpload"
					>取 消</el-button
				>
				<el-button type="success" size="medium" @click="submitUpload"
					>确 定</el-button
				>
			</template>
		</el-dialog>
		<!-- 回收站模态框 -->
		<el-dialog title="回收站" v-model="recycleVisible">
			<el-table
				:data="recycleData"
				border
				style="width: 100%"
				@selection-change="handleSelectionChange"
			>
				<el-table-column prop="date" label="序号">
					<template #="scope">
						{{ scope.$index + 1 }}
					</template></el-table-column
				>
				<el-table-column prop="resource_name" label="文件名称">
				</el-table-column>
				<el-table-column prop="expire_time" label="过期时间">
					<template #default="scope">
						{{ formattingTime(scope.row.expire_time) }}
					</template>
				</el-table-column>
				<el-table-column prop="resource_type" label="文件类型">
				</el-table-column>
				<el-table-column prop="resource_path" label="存储位置">
				</el-table-column>
				<el-table-column prop="resource_time" label="上传时间">
					<template #default="scope">
						{{ formattingTime(scope.row.resource_time) }}
					</template>
				</el-table-column>
				<el-table-column prop="resource_groupname" label="部门">
				</el-table-column>
				<el-table-column prop="resource_level" label="文件等级">
				</el-table-column>
				<el-table-column label="操作" width="50">
					<template #default="scope">
						<div class="obtn">
							<el-button @click="restore(scope.row)" type="text" size="small"
								>恢复</el-button
							>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				:total="recycle_page.total"
				:pageSize="recycle_page.pageSize"
				:pageNo="recycle_page.pageNo"
				@handleCurrentChange="recycle_handleCurrentChange"
				@sizeChange="recycle_handleSizeChange"
			/>
		</el-dialog>
		<!-- 文件上传模态框 -->
		<el-dialog
			:title="way == 0 ? '文件上传' : '文件夹上传'"
			v-model="uploadVisible"
			@close="close"
			:close-on-click-modal="false"
		>
			<el-steps :active="stepIndex" simple>
				<el-step title="步骤 1" icon="el-icon-edit"></el-step>
				<el-step title="步骤 2" icon="el-icon-upload"></el-step>
			</el-steps>
			<div v-if="stepIndex == 1">
				<!-- 等级 -->
				<el-form class="oform">
					<el-form-item label="文件等级:">
						<el-select
							v-model="resource_level"
							size="medium"
							placeholder="请选择"
							style="width: 100%"
						>
							<el-option
								v-for="item in user_level_option"
								:key="item"
								:label="item"
								:value="item"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属部门:">
						<el-select
							v-model="group_id"
							placeholder="请选择"
							@change="selectAll"
						>
							<!-- <el-option label="全部" :value="0"> </el-option> -->
							<el-option
								v-for="item in group_list"
								:key="item"
								:label="item.group_name"
								:value="item.group_id"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			<div v-else>
				<!-- 上传 -->
				<div v-if="way == 0">
					<!-- 文件上传 -->
					<el-upload
						class="upload-demo"
						ref="upload"
						drag
						action="/api/resource/upload"
						multiple
						name="files"
						:data="{ resource_level: resource_level }"
						:file-list="fileList"
						:auto-upload="false"
						:on-success="uploadFinsh"
						:on-error="uploadFinsh"
					>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">
							将文件拖到此处，或<em>点击上传</em>
						</div>
					</el-upload>
				</div>
				<div v-else>
					<!-- 文件夹上传 -->
					<div class="folder" @click="click_input">
						<i class="folder_icon el-icon-upload"
							><span> 点击上传文件夹</span>
						</i>
						<input
							@change="folader_change"
							id="folder"
							type="file"
							name="files"
							ref="folder"
							webkitdirectory
							mozdirectory
						/>
					</div>
					<!-- 文件 -->
					<ul class="folder_context">
						<li v-for="(item, index) in folder_context" :key="index">
							{{ item }}
						</li>
					</ul>
				</div>
			</div>
			<template #footer class="dialog-footer">
				<div v-if="stepIndex == 1">
					<el-button type="success" size="medium" @click="next"
						>下一步</el-button
					>
				</div>
				<div v-else>
					<el-button size="medium" type="danger" @click="exit">取 消</el-button>
					<el-button type="success" size="medium" @click="ok">确 定</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 结果模态框 -->
		<el-dialog v-model="finsiVisible">
			<el-table :data="finsihdata" style="width: 100%">
				<el-table-column prop="name" label="文件名字" width="180">
				</el-table-column>
				<el-table-column prop="percentage" label="完成率" width="180">
				</el-table-column>
				<el-table-column prop="size" label="文件大小"> </el-table-column>
				<el-table-column prop="status" label="上传状态"> </el-table-column>
			</el-table>
		</el-dialog>
		<!-- 文件夹进度条 -->
		<el-dialog v-model="loading_folder" :before-close="loading_before_close">
			<el-progress type="circle" :percentage="loaded"></el-progress>
		</el-dialog>
	</div>
</template>
<script lang="ts">
import { VITE_SERVER_IP } from "@/utils/config";
import { defineComponent, reactive, toRefs, getCurrentInstance } from "vue";
import Pagination from "../../components/Pagination.vue";
import Loading from "../../components/Loading.vue";
import Table from "../../components/Table.vue";
import "@/css/resourcemanage.scss";
import {
	getAllResource,
	delRecycle_res,
	recycle_res,
	updateResource,
	queryUserList,
} from "@/utils/api";
import { ElNotification } from "element-plus";
export default defineComponent({
	components: {
		Pagination,
		Table,
		Loading,
	},
	setup() {
		const { proxy }: any = getCurrentInstance();
		const state = reactive({
			headTitle: [
				{ label: "文件名称", val: "resource_name" },
				{ label: "文件类型", val: "resource_type" },
				{ label: "存储位置", val: "resource_path" },
				{ label: "上传时间", val: "resource_time" },
				{ label: "所属部门", val: "resource_groupname" },
				{ label: "文件等级", val: "resource_level" },
			],
			operate: ["查看", "编辑", "删除"],
			fileList: [],
			folder_context: [] as any,
			loading_folder: false,
			stepIndex: 1,
			finsihdata: [],
			first_loader: false,
			user_level_option_new: ["全部", 1, 2, 3, 4, 5],
			user_level_option: [1, 2, 3, 4, 5],
			type: "add",
			resource_level: 1,
			formInfo: {} as any,
			finsiVisible: false,
			form: {
				key1: "",
				key2: "",
				key3: "",
				key4: "",
				key5: "",
			} as any,
			way: 0,
			addDialog: false,
			recycleVisible: false,
			page: {
				total: 10,
				pageSize: 10,
				pageNo: 1,
			},
			recycle_page: {
				total: 10,
				pageSize: 10,
				pageNo: 1,
			},
			middlePage: 1,
			ready: false,
			tableData: [],
			loader: false,
			recycleSum: 0,
			recycleData: [],
			multipleSelection: [] as any,
			uploadVisible: false,
			folderData: null as any,
			loaded: 0,
			xhr: null as any,
			group_id: [],
			group_list: [
				{
					group_id: "",
					group_name: "",
					group_description: null,
					group_level: "",
				},
			] as any,
		});
		const getRecycleTable = function () {
			const data = {} as any;
			data.pageNo = state.recycle_page.pageNo;
			data.pageSize = state.recycle_page.pageSize;
			data.key4 = 1;
			getAllResource(data).then(
				(res: any) => {
					if (res.errorCode != 1) {
						proxy.$message.error(res.message);
						return;
					}
					state.recycleData = res.resource_list;
					state.recycle_page.total = res.sum;
					state.loader = true;
				},
				(error: any) => {
					ElNotification({
						type: "error",
						title: "失败",
						message: error.message,
					});
					methods.reset();
				}
			);
		};
		const getTable = function (bool: any, isMessage: any) {
			const data = {} as any;
			data.pageNo = state.page.pageNo;
			data.pageSize = state.page.pageSize;
			data.key4 = 0;
			if (bool) {
				data.key1 = state.form.key1 ? String(state.form.key1) : null;
				data.key3 = state.form.key3 ? String(state.form.key3) : null;
				if (state.form.key2 && state.form.key2 != "全部") {
					data.key2 = String(state.form.key2);
				} else {
					data.key2 = null;
				}
			}
			getAllResource(data).then(
				(res: any) => {
					if (res.errorCode != 1) {
						proxy.$message.error(res.message);
						return;
					}
					state.tableData = res.resource_list;
					state.page.total = res.sum;
					state.middlePage = state.page.pageNo;
					state.recycleSum = res.recycleSum;
					state.first_loader = true;
					state.loader = true;
					isMessage && proxy.$message.success(res.message);
				},
				(error: any) => {
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
				if (type == "编辑") {
					methods.handleClick(val);
				} else if (type == "查看") {
					console.log(type, val);
				} else if (type == "删除") {
					methods.del(val);
				}
			},
			loading_before_close(done: any) {
				proxy
					.$confirm("确认停止上传吗？")
					.then((_: any) => {
						state.xhr.abort();
						done();
					})
					.catch((_: any) => {});
			},
			click_input() {
				proxy.$nextTick(() => {
					// if(!state.ready)return proxy.message.error('不能重复上传')
					proxy.$refs.folder.dispatchEvent(new MouseEvent("click"));
				});
			},
			folader_change() {
				const folder: any = document.querySelector("#folder");
				const list: any = folder.files;
				state.folder_context = Array.from(list).map((v: any) => {
					return v.webkitRelativePath;
				});
			},
			uploadFiles() {
				const method = "POST";
				const folder: any = document.querySelector("#folder");
				const url = `${VITE_SERVER_IP}/resource/upload`;
				const files = folder.files;
				const xhr = new XMLHttpRequest();
				state.xhr = xhr;
				const formData = new FormData();
				formData.append("resource_level", String(state.resource_level));
				for (const index in files) {
					formData.append("files", files[index]);
				}
				if (folder.files.length <= 0) {
					return proxy.$message.error("请上传文件夹");
				}
				xhr.open(method, url);
				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
						const data: any = JSON.parse(xhr.responseText);
						proxy.$message.success(data.message);
						getTable(false, false);
						methods.close();
					}
				};
				xhr.upload.onprogress = function (event) {
					//进度条
					const { loaded, total } = event;
					const num: any = Math.floor((loaded / total) * 100);
					state.loaded = num;
				};
				xhr.send(formData);
			},
			handleFileUpload(event: any) {
				proxy.$nextTick(() => {
					const folder: any = document.querySelector("#folder");
					state.folderData = new FormData(folder);
				});
			},
			uploadFinsh(response: any, file: any, fileList: any) {
				if (
					fileList.every((v: any) => {
						return v.status == "success";
					})
				) {
					getTable(false, false);
					state.finsihdata = fileList;
					state.finsiVisible = true;
				}
			},
			next() {
				if (!state.resource_level) {
					return proxy.$message.error("请选择文件等级！");
				}
				state.stepIndex = 2;
			},
			close() {
				proxy.$refs.upload?.abort && proxy.$refs.upload?.abort();
				proxy.$refs.upload?.clearFiles && proxy.$refs.upload?.clearFiles();
				proxy.$refs.folder?.abort && proxy.$refs.folder?.abort();
				proxy.$refs.folder?.clearFiles && proxy.$refs.folder?.clearFiles();
				state.folder_context = [];
				state.loading_folder = false;
				state.stepIndex = 1;
				state.resource_level = 1;
			},
			exit() {
				methods.close();
			},
			ok() {
				if (state.way == 0) {
					//文件上传
					proxy.$refs.upload?.submit();
				} else {
					state.loading_folder = true;
					methods.uploadFiles();
				}
			},
			cancelUpload() {
				state.addDialog = false;
			},
			submitUpload() {
				const obj = {} as any;
				obj.resource_name = state.formInfo.resource_name;
				obj.resource_id = state.formInfo.resource_id;
				obj.resource_type = state.formInfo.resource_type;
				obj.resource_path = state.formInfo.resource_path;
				obj.resource_level = state.formInfo.resource_level;
				obj.resource_groupname = state.formInfo.resource_groupname;
				updateResource(obj).then(
					(res: any) => {
						if (res.errorCode != 1) {
							proxy.$message.error(res.message);
							return;
						}
						state.addDialog = false;
						proxy.$message.success(res.message);
						getTable(false, false);
					},
					(error: any) => {
						const result = error.message ? error.message : "失败";
						proxy.$message.error(result);
					}
				);
			},
			handleClick(res: any) {
				state.type = "编辑";
				state.formInfo.resource_id = res.resource_id;
				state.formInfo.resource_name = res.resource_name;
				state.formInfo.resource_type = res.resource_type;
				state.formInfo.resource_path = res.resource_path;
				state.formInfo.resource_time = methods.formattingTime(
					res.resource_time
				);
				state.formInfo.resource_level = res.resource_level;
				state.formInfo.resource_groupname = res.resource_groupname
					? res.resource_groupname
					: null;
				state.addDialog = true;
			},
			del(v: any) {
				const id = v.resource_id;
				const obj = [] as any;
				obj[0] = id;
				proxy
					.$confirm("此操作将删除已选择数据, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						recycle_res({
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
			open() {
				proxy.$forceUpdate();
			},
			restore(val: any) {
				const { resource_id } = val;
				delRecycle_res({ resource_id: resource_id }).then((res: any) => {
					if (res.errorCode != 1) {
						return proxy.$message.error(res.message);
					}
					proxy.$message.success(res.message);
					getRecycleTable();
					getTable(false, false);
				});
			},
			recycle_handleCurrentChange(val: number) {
				state.recycle_page.pageNo = val;
				getRecycleTable();
			},
			recycle_handleSizeChange(val: any) {
				state.recycle_page.pageSize = val;
				state.recycle_page.pageNo = 1;
				getRecycleTable();
			},
			showrecycle() {
				state.recycleVisible = true;
				getRecycleTable();
			},
			handleSelectionChange(val: any) {
				//多删
				state.multipleSelection = val;
			},
			handleCurrentChange(val: number) {
				state.page.pageNo = val;
				state.loader = false;
				getTable(true, false);
			},
			select() {
				getTable(true, true);
			},
			reset(kg = false) {
				proxy.$refs["formDom"] && proxy.$refs["formDom"].resetFields();
				Object.keys(state.form).forEach((item) => {
					state.form[item] = null;
				});
				if (!kg) return;
				getTable(false, false);
			},
			handleSizeChange(val: any) {
				state.page.pageSize = val;
				state.page.pageNo = 1;
				getTable(false, false);
			},
			multipleDelete() {
				let obj = [] as any;
				obj = state.multipleSelection.map((v: any) => {
					return v.resource_id;
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
						recycle_res({
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
			handleCommand(v: any) {
				state.way = v;
				state.uploadVisible = true;
			},
			formattingTime(time: any) {
				let result = "";
				if (time) {
					const data = new Date(time);
					const year = data.getFullYear();
					const month = data.getMonth();
					const day = data.getDate();
					result = `${year}/${month}/${day}`;
				}
				return result;
			},
			getGroupList() {
				queryUserList({
					pageSize: 10,
					pageNo: 1,
				}).then((res) => {
					state.group_list = res.group_list;
				});
			},
			selectAll(val: any) {},
		};
		getTable(false, false);
		methods.getGroupList();
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>
