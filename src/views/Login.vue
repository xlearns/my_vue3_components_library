<template>
	<div class="login" @keyup.prevent="keyup">
		<div :class="`login-main ${loginSuc ? 'login1' : ''}`">
			<div class="map"></div>
			<div class="container">
				<div class="login-container">
					<h3 class="title">登录{{ formData.name }}{{ formData.test }}</h3>
					<wx-form :rules="fieldRules" :model="formData" ref="form">
						<wx-form-item label="名称" prop="name">
							<wx-input v-model="formData.name" />
						</wx-form-item>
						<wx-form-item label="测试" prop="test">
							<wx-input v-model="formData.test" />
						</wx-form-item>
						<wx-form-item label="下拉" prop="option">
							<select v-model="formData.option">
								<option>123</option>
								<option>13</option>
								<option>1234</option>
							</select>
						</wx-form-item>
						<wx-button @click="handleSubmit">提 交</wx-button>
						<wx-button @click="handleReset">重 置</wx-button>
					</wx-form>
					<!-- <wx-form
						:model="loginForm"
						:rules="fieldRules"
						ref="form"
						label-position="left"
						label-width="0px"
						@submit.prevent
					>
						<wx-form-item prop="admin_name" model="form">
							<wx-input
								type="text"
								v-model="loginForm.admin_name"
								prefix-icon="el-icon-user"
								auto-complete="false"
								placeholder="账号"
								clearable
							></wx-input>
						</wx-form-item>
						<wx-form-item prop="admin_password">
							<wx-input
								type="password"
								v-model="loginForm.admin_password"
								prefix-icon="el-icon-edit"
								auto-complete="false"
								placeholder="密码"
								clearable
								show-password
							></wx-input>
						</wx-form-item>
						<wx-form-item prop="code" model="form" class="code">
							<wx-input
								type="text"
								v-model="verify"
								placeholder="验证码"
								clearable
							></wx-input>
							<CanvasVarify ref="verifyRef" />
						</wx-form-item>
						<wx-form-item style="width: 100%">
							<wx-button style="width: 48%" @click.prevent="reset" size="medium"
								>重 置</wx-button
							>
							<wx-button
								style="width: 48%"
								@click="login"
								size="medium"
								:disabled="loginLoading"
								:loading="loginLoading"
								>登 录</wx-button
							>
						</wx-form-item>
					</wx-form> -->
				</div>
			</div>
		</div>
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
	getCurrentInstance,
} from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElNotification } from "element-plus";
import CanvasVarify from "@/components/DrawCanvas.vue";
import { useStore } from "vuex";
import { login } from "@/utils/api";
import { throttle } from "throttle-debounce";

export default defineComponent({
	setup() {
		const router = useRouter();
		const store = useStore();
		const verifyRef = ref(null);
		const { proxy } = getCurrentInstance();
		const form = ref(null);
		const state = reactive({
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
		const methods = {
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
											store.state.userInfo = res.userInfo;
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
				proxy.$refs.form.validate((item) => {
					console.log(item);
					if (item) {
						consle.log("1");
					} else {
						// alert("失败");
						console.log("失败");
						// proxy.$message.error("失败");
					}
				});
			},
			handleReset() {
				proxy.$refs.form.resetFields();
			},
		};
		console.log(proxy.$wxMessage.success("呵呵你好世界"));
		onUnmounted(() => {
			document.onkeydown = undefined;
		});
		return { ...toRefs(state), ...methods, verifyRef, form };
	},
});
</script>
