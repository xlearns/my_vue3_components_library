<template>
	<div class="header">
		<div class="summary">
			<el-row :gutter="24">
				<el-col :span="4">
					<div class="box">
						<span class="zaixian logo"></span>
						<div>
							<span><i>45</i>/300</span>
							<p>在线用户数</p>
						</div>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="box">
						<span class="kexin logo"></span>
						<div>
							<span><i>45</i>/300</span>
							<p>可信用户数</p>
						</div>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="box">
						<span class="wangguan logo"></span>
						<div>
							<span class="storage"><i>23</i>/30</span>
							<p>在线网关数</p>
						</div>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="box">
						<span class="cpu_logo logo"></span>
						<div>
							<span class="cpu">30%</span>
							<p>网关CPU负载</p>
						</div>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="box">
						<span class="xitong logo"></span>
						<div>
							<span class="real-time">30%</span>
							<p>网关内存负载</p>
						</div>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="box last">
						<span class="shiwangsu logo"></span>
						<div>
							<div class="speed">
								<img src="../assets/header/wangsu.png" alt="" />
								<div class="max">
									<span
										><i>{{ top_speed }}</i></span
									>
									<span
										><i>{{ bottom_speed }}</i></span
									>
								</div>
							</div>
							<p>实时网速</p>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { VITE_SERVER_IP } from "@/utils/config";
import "@/css/header.scss";

export default defineComponent({
	name: "Header",
	setup() {
		const state = reactive({
			top_speed: 0 + "MB/s",
			bottom_speed: 0 + "MB/s",
		});
		const methods = {
			change(limit: any) {
				let size: any = "";
				if (limit < 1024) {
					size = limit.toFixed(2) + "KB/s";
				} else {
					size = (limit / 1024).toFixed(2) + "MB/s";
				}
				return size;
			},
			sse() {
				const source = new EventSource(
					`${VITE_SERVER_IP}/websocket/getNetWork`
				);
				source.onopen = function () {
					console.log("实时网速:链接成功" + new Date().toLocaleString());
				};
				source.addEventListener("message", function (e) {
					const { download, upload } = JSON.parse(e.data);
					state.bottom_speed = methods.change(Number(download));
					state.top_speed = methods.change(Number(upload));
				});
				source.addEventListener("error", function () {
					console.log("实时网速:链接失败" + new Date().toLocaleString());
				});
			},
		};
		onMounted(() => {
			methods.sse();
		});
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>
