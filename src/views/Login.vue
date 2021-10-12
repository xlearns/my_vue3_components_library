<template>
	<div @keyup.prevent="keyup">
		<wx-table :data="data">
			<wx-column label="日期" prop="date" />
			<wx-column label="姓名" prop="name" />
			<wx-column label="省份" prop="address" />
			<wx-column label="操作">
				<template #default="scope">
					<wx-button @click="delClick(scope)">删除</wx-button>
				</template>
			</wx-column>
		</wx-table>
		<wx-progress :type="otype" :cur="cur"></wx-progress>
		<h3 class="title">登录{{ formData.name }}{{ formData.test }}</h3>
		<div>
			<wx-form v-model="formData" :rules="formRules" ref="form">
				<wx-form-item prop="name" label="name123">
					<wx-input v-model="formData.name" />
				</wx-form-item>
				<wx-form-item prop="address" label="address">
					<wx-input v-model="formData.address" />
				</wx-form-item>
				<wx-form-item prop="age" label="age">
					<wx-input v-model="formData.age" />
				</wx-form-item>
			</wx-form>
			<div>
				<wx-button @click="subtest">提 交</wx-button>
				<wx-button @click="reset" type="danger">重 置</wx-button>
			</div>
			<wx-button @click="subtest">提 交</wx-button>
			<wx-button
				size="medium"
				type="danger"
				:circle="false"
				:disabled="false"
				:round="true"
				:plain="false"
				@click="testaa"
				>hello world</wx-button
			>
			<wx-button
				size="medium"
				type="primary"
				:circle="false"
				:disabled="false"
				:round="true"
				:plain="false"
				@click="testaa"
				>hello world</wx-button
			>
			<wx-button
				size="medium"
				type="danger"
				:circle="false"
				:disabled="false"
				:round="true"
				:plain="true"
				@click="testaa"
				>hello world</wx-button
			>
			<!-- <wx-button @click="resetForm">reset</wx-button> -->
		</div>
		<wx-row>
			<wx-col :span="6"><div style="background: red">123</div></wx-col>
			<wx-col :span="6"><div style="background: red">123</div></wx-col>
			<wx-col :span="6"><div style="background: red">123</div></wx-col>
			<wx-col :span="6"><div style="background: red">123</div></wx-col>
		</wx-row>
		<!-- <wx-loading to="#foot-container"></wx-loading> -->
		<wxDialog :visible="ot" title="测试">
			<WxFormItem label="名字">
				<wx-input />
			</WxFormItem>
			<WxFormItem label="年龄">
				<wx-input />
			</WxFormItem>
			<WxFormItem label="地址">
				<wx-input />
			</WxFormItem>
			<div style="text-align: right">
				<wxButton type="success" @click="ot = !ot">提 交</wxButton>
				<wxButton type="danger">重 置</wxButton>
			</div>
		</wxDialog>
	</div>
</template>

<script lang="ts">
import "@/css/login.scss";
import useStorage from "@/utils/useStorage";
import {
	defineComponent,
	reactive,
	toRefs,
	ref,
	onUnmounted,
	watch,
	getCurrentInstance,
	computed,
} from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElNotification } from "element-plus";
import CanvasVarify from "@/components/DrawCanvas.vue";
import { useStore } from "vuex";
import { login } from "@/utils/api";
import { throttle } from "throttle-debounce";
import performance from "@/utils/performance";
import wxButton from "../components/wx/button/src/wxButton.vue";
import WxFormItem from "../components/wx/form/src/item/wxFormItem.vue";
export default defineComponent({
	components: { wxButton, WxFormItem },
	setup() {
		console.log("白屏时间:", performance.blankTime);
		const router = useRouter();
		const store = useStore();
		const verifyRef = ref(null);
		const { proxy }: any = getCurrentInstance();
		const form = ref();
		const state = reactive({
			ot: true,
			cur: 20,
			otype: 1,
			data: [
				{
					date: "2016-05-03",
					name: "Tom",
					address: "No. 189, Grove St, Los Angeles",
				},
				{
					date: "2016-05-02",
					name: "Tom",
					address: "No. 189, Grove St, Los Angeles",
				},
				{
					date: "2016-05-04",
					name: "Tom",
					address: "No. 189, Grove St, Los Angeles",
				},
				{
					date: "2016-05-01",
					name: "Tom",
					address: "No. 189, Grove St, Los Angeles",
				},
			],
			formData: { name: "hello world", test: "", address: "", age: 18 },
			formRules: {
				name: [{ type: "required", msg: "用户名不能为空" }],
				address: [{ type: "required", msg: "地址不能为空" }],
				age: [
					{
						type: "fn",
						msg: "请输入年龄",
						validator(val: any) {
							if (!val) {
								state.formRules.age[0].msg = "年龄不能为空";
								return false;
							} else if (isNaN(Number(val))) {
								state.formRules.age[0].msg = "年龄必须是数字";
								return false;
							} else if (Number(val) <= 100) {
								state.formRules.age[0].msg = "年龄最少3位";
								return false;
							}
							return true;
						},
					},
				],
			},
			fieldRules: {
				name: [
					{
						required: true,
						settings: false,
						message: "请输入name",
						trigger: "blur",
					},
				],
				option: [
					{
						required: true,
						settings: true,
						fn: () => {
							if (!state.formData.option) {
								return "请输入信息";
							} else {
								return "";
							}
						},
						trigger: "blur",
					},
				],
				test: [
					{
						required: true,
						settings: true,
						fn: () => {
							return "请输入test";
						},
						trigger: "blur",
					},
				],
			},
			verify: "",
			loginLoading: false,
			loginSuc: false,
		});
		setInterval(() => {
			state.cur += 0.05;
		}, 1000 / 60);
		const methods = {
			reset() {
				// console.log(form);
				form.value.reset();
			},
			subtest() {
				form.value.validate().then(
					(item: any) => {
						proxy.$wxMessage.success("成功");
					},
					(err: any) => {
						console.log(proxy);
						proxy.$wxMessage.error("失败");
					}
				);
			},
			testaa(a: any, b: any) {
				console.log(11);
			},
			resetForm() {},
			delClick(row: any) {
				let { index } = row;
				state.data.splice(index, 1);
			},
			login() {
				return;
				form.value.validate((valid: any) => {
					if (valid) {
						if (state.verify === "") {
							ElMessage.warning("请输入验证码");
						} else {
							// 验证码
							if (verifyRef.value.imgCode.toLowerCase() === state.verify) {
								state.loginLoading = true;
								login(state.loginForm).then(
									(res) => {
										if (res.errorCode === 1) {
											state.loginSuc = true; // 登录成功添加转动
											const url = res.first_url ? res.first_url : "/";
											router.push(url);
											ElNotification({
												type: "success",
												title: "成功√",
												message: res.message,
											});
											sessionStorage.setItem("menu", JSON.stringify(res.menu));
											sessionStorage.setItem("token", res.token);
											sessionStorage.setItem("name", res.admin_name);
										} else {
											ElMessage.error(res.message);
											state.loginLoading = false;
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
							} else {
								ElMessage.warning("验证码错误，请重新输入");
								store.dispatch("changeErrorAction", true);
							}
						}
					} else {
						return false;
					}
				});
			},
			reset123() {
				state.loginForm.admin_name = "";
				state.loginForm.admin_password = "";
				state.verify = "";
				state.loginLoading = false;
				store.dispatch("changeErrorAction", true);
			},
			keyup() {
				document.onkeydown = (e) => {
					let key = null;
					if (window.event === undefined) {
						key = e.keyCode;
					} else {
						key = window.event.keyCode;
					}
					if (key === 13) {
						methods.login();
					}
				};
			},
			handleSubmit() {
				// proxy.$wxFrame.start(60);
				proxy.$refs.form.validate((item) => {
					if (item) {
						proxy.$wxMessage.warning("成功");
					} else {
						// alert("失败");
						proxy.$wxMessage.info("登录失败");
						// proxy.$message.error("失败");
					}
				});
			},
			handleReset() {
				// proxy.$wxFrame.stop();
				form.value.resetFields();
			},
		};
		onUnmounted(() => {
			document.onkeydown = undefined;
		});
		return { ...toRefs(state), ...methods, verifyRef, form };
	},
});
</script>
