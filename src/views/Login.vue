<template>
	<!-- <wx-table :data="data">
			<wx-column label="日期" prop="date" />
			<wx-column label="姓名" prop="name" />
			<wx-column label="省份" prop="address" />
			<wx-column label="操作">
				<template #default="scope">
					<wx-button @click="delClick(scope)">删除</wx-button>
				</template>
			</wx-column>
		</wx-table> -->
	<!-- <wx-progress :type="otype" :cur="cur"></wx-progress> -->
	<!-- <h3 class="title">登录{{ formData.name }}{{ formData.test }}</h3> -->
	<!-- <div>
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
		 <wx-button @click="resetForm">reset</wx-button>
		</div> -->
	<!-- <wx-row>
			<wx-col :span="6"><div style="background: red">123</div></wx-col>
			<wx-col :span="6"><div style="background: red">123</div></wx-col>
			<wx-col :span="6"><div style="background: red">123</div></wx-col>
			<wx-col :span="6"><div style="background: red">123</div></wx-col>
		</wx-row> -->
	<!-- <wx-loading to="#foot-container"></wx-loading> -->
	<!-- <wxDialog
			v-model="ot"
			title="测试"
			width="90%"
			:beforeClose="bc"
			:auto-close="10"
		>
			<WxFormItem label="名字">
				<wx-input />
			</WxFormItem>
			<WxFormItem label="年龄">
				<wx-input />
			</WxFormItem>
			<WxFormItem label="地址">
				<wx-input />
			</WxFormItem>
			<template #footer>
				<wxButton type="success" @click="ot = !ot">submit</wxButton>
				<wxButton type="danger">reset</wxButton>
			</template>
		</wxDialog> -->
	<!-- <wx-captcha
			ref="dragVerify"
			:plain="true"
			v-model="isPassing"
			:showRefresh="true"
			style="right: 0; top: 0"
			:imgsrc="imgsrc"
			:logo="imgsrc"
			@refresh="reimg"
			@passcallback="pass"
		></wx-captcha> -->
	<!-- <wxDialog
		v-model="ot"
		:showClose="true"
		:closeOnClickModal="false"
		:fullscreen="ot"
	>
		<template #title>
			<h1>hello world</h1>
		</template>
		<template #footer>
			<wx-button type="success">123</wx-button>
			<wx-button type="danger">123</wx-button>
		</template>
	</wxDialog> -->
	<!-- <wxInput :disabled="false" type="password" :showEye="false" v-model="msg">
	</wxInput>
	<div style="margin: 20px 0px"></div>
	<wxInput :disabled="true" type="text" :showEye="false" v-model="msg">
	</wxInput>
	<div style="margin: 20px 0px"></div>
	<wxInput :disabled="false" type="password" :showEye="false" v-model="msg">
	</wxInput> -->
	<!-- <wxDraggable v-model="myArray">
		<div v-for="element in myArray" :key="element.num" class="item">
			{{ element.num }}
		</div>
	</wxDraggable> -->
	<!-- <div style="height: 1000vh"></div>
	<wx-button :goTop="fs" id="goTop">全屏</wx-button> -->
	<bd-scroll @botton="bottomFn" @top="topFn" :minHeight="minHeight">
		<div class="test">
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
			<p>123</p>
		</div>
	</bd-scroll>
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
	getCurrentInstance,
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
		const scroll = ref();
		const verifyRef = ref(null);
		const { proxy }: any = getCurrentInstance();
		const form = ref();
		const state = reactive({
			ot: true,
			fs: {
				isEnabled: true,
				target: "#goTop",
			},
			listScroll: [] as any,
			myArray: [
				{ grid: "cn", num: 1 },
				{ grid: "cn", num: 2 },
				{ grid: "cn", num: 3 },
				{ grid: "cn", num: 4 },
				{ grid: "cn", num: 5 },
				{ grid: "cn", num: 6 },
				{ grid: "cn", num: 7 },
				{ grid: "cn", num: 8 },
				{ grid: "cn", num: 9 },
			],
			msg: "hello",
			imgsrc:
				"data:image/jpeg;base64,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",
			isPassing: false,
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
			page: 1,
		});
		const timeout = function (time: any) {
			//延迟执行 setTimeout
			//异步 promise包裹
			//异步延迟执行
			return new Promise((resolve) => {
				setTimeout(resolve, time);
			});
		};
		const _fetchList = async function (page = 1, pageSize = 10) {
			try {
				await timeout(1000);
				if (page < 3) {
					// 模拟数据返回
					return Array.from(
						{ length: pageSize },
						(value, index) => `第${page}页的数据${index}`
					);
				} else {
					// 模拟已到达最后一页时的数据返回
					return Array.from(
						{ length: pageSize / 2 },
						(value, index) => `最后一页,第${page}页的数据${index}`
					);
				}
			} catch (e) {
				return false;
			}
		};

		const methods: any = {
			bottomFn(v: any) {
				console.log("下拉");
				//重置
				v();
			},
			topFn(v: any) {
				console.log("上拉");
				v();
			},
			pullingUp() {
				console.log(2);
			},
			bc() {
				console.log(1);
			},
			reimg(v: any) {
				let arr = [
					"data:image/jpeg;base64,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",
					"data:image/jpeg;base64,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",
					// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBhVbMwSomDcVJGkM9rw9A2vqxhimTkw_qcg&usqp=CAU",
					// "data:image/jpeg;base64,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",
				];
				let i = ++index % arr.length;
				state.imgsrc = arr[i];
			},
			pass() {
				console.log("成功");
			},
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
		return { ...toRefs(state), ...methods, verifyRef, form, scroll };
	},
});
</script>
