<template>
	<div @keyup.prevent="keyup">
		<wx-table :data="data">
			<wx-column label="日期" prop="date" />
			<wx-column label="姓名" prop="name" />
			<wx-column label="省份" prop="address" />
			<wx-column label="操作">
				<template #default="scope">
					<button @click="delClick(scope)">删除</button>
				</template>
			</wx-column>
		</wx-table>
		<wx-progress :type="otype" :cur="cur"></wx-progress>
		<h3 class="title">登录{{ formData.name }}{{ formData.test }}</h3>
		<wx-form :rules="fieldRules" :model="formData" ref="form">
			<wx-form-item label="名称" prop="name">
				<wx-input v-model="formData.name" />
			</wx-form-item>
			<wx-form-item label="测试" prop="test">
				<wx-input v-model="formData.test" />
			</wx-form-item>
			<wx-button @click="handleSubmit">提 交</wx-button>
			<wx-button @click="handleReset">重 置</wx-button>
		</wx-form>
		<wx-loading></wx-loading>
	</div>
</template>

<script>
import "@/css/login.scss";
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
export default defineComponent({
	setup() {
		console.log("白屏时间:", performance.blankTime);
		const router = useRouter();
		const store = useStore();
		const verifyRef = ref(null);
		const { proxy } = getCurrentInstance();
		const form = ref(null);
		const state = reactive({
			cur: 20,
			otype: 5,
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
			formData: { name: "", test: "", option: "" },
			loginForm: {
				admin_name: "",
				admin_password: "",
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
			delClick(row) {
				console.log(row);
			},
			login() {
				form.value.validate((valid) => {
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
			reset() {
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
				proxy.$refs.form.resetFields();
			},
		};
		onUnmounted(() => {
			document.onkeydown = undefined;
		});
		return { ...toRefs(state), ...methods, verifyRef, form };
	},
});
</script>
