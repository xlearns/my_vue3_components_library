<template>
	<div class="versionmanage">
		<!-- <div class="head-title split-line">可信工作域版本管理</div> -->
		<div class="data-list" v-if="first_loader">
			<div class="operator">
				<div class="btn">
					<el-button size="mini" type="success" @click="handleUpload"
						>上传</el-button
					>
				</div>
				<el-dialog
					title="文件上传"
					v-model="dialogVisible1"
					width="30%"
					:before-close="handleClose"
				>
					<el-upload
						class="upload-demo"
						action=""
						:before-upload="beforeUpload"
						:http-request="upload"
						multiple
						:limit="3"
						drag
					>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">
							将文件拖到此处，或<em>点击上传</em>
						</div>
					</el-upload>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="dialogVisible1 = false">取 消</el-button>
							<el-button type="primary" @click="dialogVisible1 = false"
								>确 定</el-button
							>
						</span>
					</template>
				</el-dialog>
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
				:operate="operate"
				:selection="true"
				@def="def"
				:curPage="middlePage"
				:isLoading="!loader"
				:number="true"
				@handleSelectionChange="handleSelectionChange"
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
		<el-dialog title="编辑" v-model="dialogVisible" width="30%">
			<el-form :model="form">
				<el-form-item label="版本号">
					{{ form.sandbox_version }}
				</el-form-item>
				<el-form-item label="更新内容">
					<el-input
						type="textarea"
						:rows="5"
						v-model="form.sandbox_description"
					></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="confirm">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance } from "vue";
import "@/css/versionmanage.scss";
import Pagination from "@/components/Pagination.vue";
import Loading from "../../components/Loading.vue";
import Table from "@/components/Table.vue";
import { getAllSandbox, updateSandbox } from "@/utils/api";
import { ElMessage, ElLoading } from "element-plus";
import axios from "axios";
export default defineComponent({
	components: { Pagination, Table, Loading },
	setup() {
		const { proxy }: any = getCurrentInstance();
		const state = reactive({
			tableData: [],
			multipleSelection: [],
			headTitle: [
				{ label: "版本号", val: "sandbox_version" },
				{ label: "更新日期", val: "sandbox_time" },
				{ label: "应用大小", val: "sandbox_size" },
				{ label: "更新内容", val: "sandbox_description" },
				{ label: "状态", val: "is_default" },
			],
			operate: ["默认版本", "编辑"],
			pageConfig: {
				pageNo: 1,
				pageSize: 10,
			},
			total: 0,
			fileList: {} as any,
			dialogVisible: false,
			form: {
				sandbox_version: "",
				sandbox_description: "",
				is_default: 0,
				sandbox_id: 0,
			},
			loader: false,
			middlePage: 1,
			first_loader: false,
			dialogVisible1: false,
			loading: "" as any,
			// myHeaders: { 'Access-Control-Allow-Origin': '*' },
		});
		const methods = {
			handleSelectionChange(val: any) {
				state.multipleSelection = val;
			},
			getTableData() {
				getAllSandbox(state.pageConfig).then((res) => {
					state.tableData = res.sandbox_list;
					state.total = res.sum;
					state.loader = true;
					if (!state.first_loader) {
						state.first_loader = true;
					}
					state.middlePage = state.pageConfig.pageNo;
				});
			},
			beforeUpload(file: any) {
				const re = /\.apk$/;
				if (!re.test(file.name)) {
					ElMessage.error("只能上传apk文件");
				}
				return re.test(file.name);
			},
			handleUpload() {
				state.dialogVisible1 = true;
			},
			upload(param: any) {
				console.log(param);
				console.log(param.file);
				const formData = new FormData();
				formData.append("files", param.file);
				axios
					.post("/api/sandboxApp/uploadSandbox", formData, {
						headers: { "Content-Type": "multipart/form-data" },
						onUploadProgress: (progressEvent) => {
							const percentCompleted = Math.floor(
								(progressEvent.loaded * 100) / progressEvent.total
							);
							param.onProgress({ percent: percentCompleted });
						},
					})
					.then((res: any) => {
						if (res.data.errorCode === "1") {
							param.onSuccess();
							ElMessage.success({
								message: "文件上传成功",
								type: "success",
							});
							methods.getTableData();
						}
					});
			},
			def(type: any, val: any) {
				if (type === "默认") {
					methods.setDefault(val);
				} else if (type === "编辑") {
					methods.editSandbox(val);
				}
			},
			setDefault(row: any) {
				state.form.is_default = 1;
				const obj = {
					sandbox_description: row.sandbox_description,
					is_default: state.form.is_default,
					sandbox_id: row.sandbox_id,
				};
				updateSandbox(obj).then((res: any) => {
					if (res.errorCode === 1) {
						methods.getTableData();
					}
				});
			},
			//编辑
			editSandbox(row: any) {
				state.dialogVisible = true;
				state.form.sandbox_version = row.sandbox_version;
				state.form.sandbox_description = row.sandbox_description;
				state.form.is_default = row.is_default ? 1 : 0;
				state.form.sandbox_id = row.sandbox_id;
			},
			// 确认修改
			confirm() {
				const obj = {
					sandbox_description: state.form.sandbox_description,
					is_default: state.form.is_default,
					sandbox_id: state.form.sandbox_id,
				};
				console.log(obj);

				updateSandbox(obj).then((res: any) => {
					if (res.errorCode === 1) {
						ElMessage.success({
							message: "版本更新成功",
							type: "success",
						});
						state.dialogVisible = false;
						methods.getTableData();
					}
				});
			},
			handleCurrentChange(val: any) {
				state.loader = false;
				state.pageConfig.pageNo = val;
			},
			handleSizeChange(val: any) {
				state.pageConfig.pageSize = val;
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
		};
		methods.getTableData();
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>
主要修改：VersionManage.vue / VersionManage.css / header.vue / header.css /
tools.scss 中修改了.menu 和 .menu-nav的背景颜色
