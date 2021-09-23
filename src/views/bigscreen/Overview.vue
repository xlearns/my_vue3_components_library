<template>
	<div class="overview">
		<div class="left">
			<div class="item">
				<div class="content-title">资产访问排名</div>
				<div class="box nodatatitle" v-if="ifchart1Show">暂无数据</div>
				<div class="box" id="chart1" v-else></div>
			</div>
			<div class="item">
				<div class="content-title">用户活跃度排名</div>
				<div class="box nodatatitle" v-if="ifchart2Show">暂无数据</div>
				<div class="box" id="chart2" v-else></div>
			</div>
		</div>
		<div class="center">
			<div class="count-all">
				<div
					class="item-block"
					v-for="(item, index) in summaryList"
					:key="index"
				>
					<span class="num">{{
						typeof item === "object" ? Object.values(item)[0] : 0
					}}</span>
					<span class="name">{{ headKey[Object.keys(item)[0]] || item }}</span>
				</div>
			</div>
			<div class="item">
				<div class="content-title">智能溯源</div>
				<div class="box" id="chart5"></div>
			</div>
		</div>
		<div class="right">
			<div class="item">
				<div class="content-title">非白名单访问量排名</div>
				<div class="box nodatatitle" v-if="ifchart3Show">暂无数据</div>
				<div class="box" id="chart3" v-else></div>
			</div>
			<div class="item">
				<div class="content-title">数据流动图</div>
				<div class="box nodatatitle" v-if="ifchart4Show">暂无数据</div>
				<div class="box" id="chart4" v-else></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	defineComponent,
	getCurrentInstance,
	onMounted,
	onUnmounted,
	reactive,
	shallowRef,
	toRefs,
} from "vue";
import "@/css/overview.scss";
interface Data {
	[key: string]: string | any;
}

export default defineComponent({
	setup() {
		const { proxy }: any = getCurrentInstance();
		const chartone = shallowRef<any>();
		const chartTwo = shallowRef<any>();
		const chartThree = shallowRef<any>();
		const chartFour = shallowRef<any>();
		const chartFive = shallowRef<any>();
		const state = reactive({
			dataOne: [],
			dataTwo: [],
			ifchart1Show: false,
			ifchart4Show: false,
			ifchart2Show: false,
			ifchart3Show: false,
			dataThree: [
				{
					type: "机器行为",
					main: "张先知",
					startTime: "2020/10/18 10:12",
					danger: 1,
				},
				{
					type: "机器行为",
					main: "张先知",
					startTime: "2020/10/18 10:12",
					danger: 2,
				},
				{
					type: "机器行为",
					main: "张先知",
					startTime: "2020/10/18 10:12",
					danger: 3,
				},
				{
					type: "机器行为",
					main: "张先知",
					startTime: "2020/10/18 10:12",
					danger: 4,
				},
				{
					type: "机器行为",
					main: "张先知",
					startTime: "2020/10/18 10:12",
					danger: 5,
				},
			],
			// 热点接口
			chartOneList: [
				{
					num: 1,
					value1: 1,
				},
				{
					num: 2,
					value1: 2,
				},
				{
					num: 3,
					value1: 3,
				},
				{
					num: 4,
					value1: 4,
				},
				{
					num: 5,
					value1: 5,
				},
			],
			// 敏感接口排名
			chartTwoList: [],
			// 敏感数据top10
			chartThreeList: [
				{
					name: 1,
					num: 1,
				},
				{
					name: 2,
					num: 2,
				},
				{
					name: 3,
					num: 3,
				},
				{
					name: 4,
					num: 4,
				},
				{
					name: 5,
					num: 5,
				},
			],
			headKey: [],
			summaryList: [
				"资产数量",
				"在线用户",
				"离线用户",
				"网关在线",
				"网关集群运行状态",
			],
		});
		const methods = {
			// path(val) {
			//   state.$router.push("/" + val);
			// },
			init() {
				window.addEventListener("resize", () => {
					chartone.value?.resize();
					chartTwo.value?.resize();
					chartThree.value?.resize();
					chartFour.value?.resize();
					chartFive.value?.resize();
				});
			},
			drawOne() {
				// state.chartone = proxy.$echarts.init(document.getElementById("chart1"));
				chartone.value = proxy.$echarts.init(document.getElementById("chart1"));
				const data = state.chartOneList;

				const attackSourcesColor = [
					new proxy.$echarts.graphic.LinearGradient(0, 1, 1, 1, [
						{ offset: 0, color: "#EB3B5A" },
						{ offset: 1, color: "#FE9C5A" },
					]),
					new proxy.$echarts.graphic.LinearGradient(0, 1, 1, 1, [
						{ offset: 0, color: "#FA8231" },
						{ offset: 1, color: "#FFD14C" },
					]),
					new proxy.$echarts.graphic.LinearGradient(0, 1, 1, 1, [
						{ offset: 0, color: "#F7B731" },
						{ offset: 1, color: "#FFEE96" },
					]),
					new proxy.$echarts.graphic.LinearGradient(0, 1, 1, 1, [
						{ offset: 0, color: "#395CFE" },
						{ offset: 1, color: "#2EC7CF" },
					]),
				];
				const attackSourcesColor1 = [
					"#EB3B5A",
					"#FA8231",
					"#F7B731",
					"#3860FC",
					"#1089E7",
					"#F57474",
					"#56D0E3",
					"#1089E7",
					"#F57474",
					"#1089E7",
					"#F57474",
					"#F57474",
				];
				const attaData: (string | number)[] = [];
				const topName: number[] = [];
				data.forEach((it: Data, index) => {
					attaData[index] = parseFloat(it.num).toFixed(2);
					topName[index] = it.value1;
				});
				const salvProMax = []; //背景按最大值
				for (let i = 0; i < attaData.length; i++) {
					salvProMax.push(attaData[0]);
				}
				function attackSourcesDataFmt(sData: (number | string)[]) {
					const sss: {
						value: number | string;
						itemStyle: { color: string };
					}[] = [];
					sData.forEach(function (item, i: number) {
						const itemStyle = {
							color: i > 3 ? attackSourcesColor[3] : attackSourcesColor[i],
						};
						sss.push({
							value: item,
							itemStyle: itemStyle,
						});
					});
					return sss;
				}

				const option = {
					backgroundColor: "#0A0933",
					tooltip: {
						show: false,
						backgroundColor: "rgba(3,169,244, 0.5)", //背景颜色（此时为默认色）
						textStyle: {
							fontSize: 16,
						},
					},
					color: ["#F7B731"],
					grid: {
						left: "1%",
						right: "1%",
						bottom: "1%",
						top: "2%",
						containLabel: true,
					},
					xAxis: {
						type: "value",

						splitLine: {
							show: false,
						},
						axisLabel: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
						},
					},
					yAxis: [
						{
							type: "category",
							inverse: true,
							axisLine: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							axisPointer: {
								label: {
									show: true,
								},
							},
							padding: [5, 0, 0, 0],
							data: topName,
							axisLabel: {
								margin: 30,
								fontSize: 10,
								align: "left",
								padding: [2, 0, 0, 0],
								color: "#000",
								rich: {
									nt1: {
										color: "#fff",
										backgroundColor: attackSourcesColor1[0],
										width: 13,
										height: 13,
										fontSize: 10,
										align: "center",
										borderRadius: 100,
										lineHeight: "5",
										padding: [0, 1, 2, 1],
									},
									nt2: {
										color: "#fff",
										backgroundColor: attackSourcesColor1[1],
										width: 13,
										height: 13,
										fontSize: 10,
										align: "center",
										borderRadius: 100,
										padding: [0, 1, 2, 1],
									},
									nt3: {
										color: "#fff",
										backgroundColor: attackSourcesColor1[2],
										width: 13,
										height: 13,
										fontSize: 10,
										align: "center",
										borderRadius: 100,
										padding: [0, 1, 2, 1],
									},
									nt: {
										color: "#fff",
										backgroundColor: attackSourcesColor1[3],
										width: 13,
										height: 13,
										fontSize: 10,
										align: "center",
										borderRadius: 100,
										padding: [0, 1, 2, 1],
										lineHeight: 5,
									},
								},
								formatter: function (value: unknown, index: number) {
									index++;
									if (index - 1 < 3) {
										return ["{nt" + index + "|" + index + "}"].join("\n");
									} else {
										return ["{nt|" + index + "}"].join("\n");
									}
								},
							},
						},
						{
							type: "category",
							inverse: true,
							axisTick: "none",
							axisLine: "none",
							show: true,
							axisLabel: {
								color: "#fff",
								fontSize: "10",
							},
							data: attackSourcesDataFmt(attaData),
						},
					],
					series: [
						{
							zlevel: 1,
							type: "bar",
							barWidth: "15px",
							animationDuration: 1500,
							data: attackSourcesDataFmt(attaData),
							align: "center",
							itemStyle: {
								borderRadius: 10,
							},
							label: {
								color: "#fff",
								show: true,
								align: "left",
								position: [0, "-15px"],
								fontSize: 10,
								formatter: function (a: { name: string }) {
									return a.name;
								},
							},
						},
						{
							type: "bar",
							barWidth: 15,
							barGap: "-100%",
							margin: "20",
							data: salvProMax,
							textStyle: {
								//图例文字的样式
								fontSize: 10,
								color: "#fff",
							},
							itemStyle: {
								color: "#05325F",
								fontSize: 10,
								borderRadius: 30,
							},
						},
					],
				};
				// state.chartone.setOption(option);
				chartone.value.setOption(option);
			},
			drawTwo() {
				// state.chartTwo = proxy.$echarts.init(document.getElementById("chart2"));
				chartTwo.value = proxy.$echarts.init(document.getElementById("chart2"));
				const list: { name: number; value: number }[] = [];
				const data: number[] = [];
				const values: number[] = [];
				// 数据
				state.chartOneList.forEach((item) => {
					list.push({
						name: item.value1,
						value: item.num,
					});
					data.push(item.value1);
					values.push(item.num);
				});
				const option = {
					backgroundColor: "#0A0933",
					xAxis: {
						max: 20,
						splitLine: {
							show: false,
						},
						axisLabel: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
						},
					},
					grid: {
						containLabel: true,
						left: 10,
						top: 10,
						right: 30,
						bottom: 0,
					},
					yAxis: [
						{
							data: data,
							inverse: true,
							axisLine: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							axisLabel: {
								show: false,
								margin: 10,
								fontSize: 14,
								color: "#fff",
							},
						},
						{
							type: "category",
							inverse: true,
							axisTick: "none",
							axisLine: "none",
							show: true,
							axisLabel: {
								// 右侧文字在上
								interval: 0,
								color: ["#fff"],
								fontSize: 13,
								margin: 10,
								formatter: function (value: Data) {
									return value;
								},
							},
							data: values,
						},
					],
					series: [
						{
							//内
							type: "bar",
							barWidth: 10,
							legendHoverLink: false,
							symbolRepeat: true,
							silent: true,
							itemStyle: {
								color: {
									type: "linear",
									x: 0,
									y: 0,
									x2: 1,
									y2: 0,
									colorStops: [
										{
											offset: 0,
											color: "#2EFEDA", // 0% 处的颜色
										},
										{
											offset: 1,
											color: "#2EFEDA", // 100% 处的颜色
										},
									],
								},
							},
							data: list,
							z: 1,
							animationEasing: "elasticOut",
						},
						{
							type: "pictorialBar",
							animationDuration: 0,
							symbolRepeat: "fixed",
							symbolMargin: "25%",
							symbol: "roundRect",
							symbolSize: [7, 10],
							symbolBoundingData: 20,
							itemStyle: {
								color: "#12272A",
							},
							// 设置柱形条上方显示文字
							label: {
								color: "#fff",
								show: true,
								align: "left",
								position: [0, "-10px"],

								fontSize: 13,
								formatter: function (a: { name: string }) {
									return a.name;
								},
							},
							data: values,
							z: 0,
							animationEasing: "elasticOut",
						},
						{
							//分隔
							type: "pictorialBar",
							itemStyle: {
								color: "#000",
							},
							symbolRepeat: "fixed",
							symbolMargin: 2,
							symbol: "roundRect",
							symbolClip: true,
							symbolSize: [2, 10],
							symbolPosition: "start",
							symbolOffset: [0, 0],
							symbolBoundingData: 20,
							data: list,
							z: 2,
							animationEasing: "elasticOut",
						},
					],
				};
				// state.chartTwo.setOption(option);
				chartTwo.value.setOption(option);
			},
			drawThree() {
				chartThree.value = proxy.$echarts.init(
					document.getElementById("chart3")
				);
				let data: { name: number; value: number }[] = [];
				state.chartThreeList.forEach((item) => {
					const obj = {
						name: item.name,
						value: item.num,
					};
					data.push(obj);
				});
				const getArrByKey = (
					data: { name: number; value: number }[],
					k: string
				) => {
					const key = k || "value";
					const res: number[] = [];
					if (data) {
						data.forEach((item: Data) => {
							res.push(item[key]);
						});
					}
					return res;
				};
				const getSymbolData = (data: { name: number; value: number }[]) => {
					const arr = [];
					for (let i = 0; i < data.length; i++) {
						arr.push({
							value: data[i].value,
							symbolPosition: "end",
						});
					}
					return arr;
				};
				data = data.sort((a, b) => {
					return b.value - a.value;
				});
				const option = {
					backgroundColor: "#0A0933",
					grid: {
						top: "2%",
						bottom: -15,
						right: 30,
						left: 30,
						containLabel: true,
					},
					xAxis: {
						show: false,
					},
					yAxis: [
						{
							type: "category",
							triggerEvent: true,
							show: true,
							inverse: true,
							data: getArrByKey(data, "name"),
							axisLine: {
								show: false,
							},
							splitLine: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							axisLabel: {
								show: true,
								interval: 0,
								color: "#fff",
								margin: 5,
								fontSize: 14,
							},
						},
						{
							type: "category",
							triggerEvent: true,
							show: true,
							inverse: true,
							data: getArrByKey(data, "name"),
							axisLine: {
								show: false,
							},
							splitLine: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							axisLabel: {
								inside: false,
								interval: 0,
								color: ["#fff"],
								lineHeight: 30,
								fontSize: 13,
								formatter: function (value: unknown, index: number) {
									return data[index].value;
								},
							},
						},
					],
					series: [
						{
							name: "XXX",
							type: "pictorialBar",
							symbol:
								"image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAZlBMVEUAAABe3uVe3+Vf3uVf3+Zf3uVg3+Zg3+Zf3+Vi4OZh4OZg3+Z86/Bh3+Zi4Odj4Odi4OZ86/B76/B86/Bj4ed56+9x5+xn4umB7/N87PB36e+A7/N+7fF/7vJ/7vJ+7fGA7/OB7/PReX+lAAAAIXRSTlMABQkVDREmIhk3MR10LEFFPHh7cUprXE35h2XnqMLAp+mHAG9cAAAB5ElEQVRIx83WjU7CMBQFYIoiKMqU/XUboHv/l/Tce7t2XamDNSacETEmX86tlK2rx4py150o+MstMBLwWRfHKo6JCVxLnvmFGBjFQ58oF1//sUZhGy/ClSTWObgnL4O+bkeN4nY2okfNMbkRt9/vtxz8InoTsWplJSCzFxPmO8+GpSIByX3YQAuGDWtRKhKjCnxDXhF6Z4yxnZ20Wgko7BMRDmxtSGVaI4kdTIgb+zTYoJQlIMlDlmUFgrcDWWC201qSayqlTkiCddWWeV62VU0YlnpRi9VOKaSUsiyq/N0krwq2Ugt7lVpZl5BfHNiytjagMi+XYp0kCR45hMlivVQrE/uU5pXSrCB5bM6d1t2lOZItMqmliT3q5uVxqxzyW/ccfYLNKx7ZTeykMvNyac2yt2Fbc61MHLSC0rwoxbiNdlQ3GBm1NLHQsHUrtEXppR/ljNpW6DbSCoqlFiVoN6YdaFlgsSFVPs1BdT8OaB5QyQzVcaqWDows/zepxR8ObLglTrdtCRVuRNj4Rrxh+//0ke2f8KVL+Kon3GCSbmsJN9OUW3j6g0Ns+LgCij2u0h+Sghc8mlMPBMgdx5DFh59VmOVHrvmDnoNxCz3J7MFWsMuaLyR089xz/xhlfijvwutR8gv3zk6BLUUeCgAAAABJRU5ErkJggg==",
							symbolSize: [50, 50],
							symbolOffset: [20, 0],
							z: 12,
							itemStyle: {
								color: "#14b1eb",
							},
							data: getSymbolData(data),
						},
						{
							name: "条",
							type: "bar",
							// 展示条形柱形图的背景底色！！！
							showBackground: true,
							barBorderRadius: 30,
							yAxisIndex: 0,
							data: data,
							barWidth: 10,
							itemStyle: {
								color: new proxy.$echarts.graphic.LinearGradient(
									0,
									0,
									1,
									0,
									[
										{
											offset: 0,
											color: "#0000BF",
										},
										{
											offset: 0.6,
											color: "#02A7F0",
										},
										{
											offset: 1,
											color: "#5EDEE5",
										},
									],
									false
								),
								borderRadius: 10,
							},
							borderRadius: 4,
						},
					],
				};
				chartThree.value.setOption(option);
			},
			drawFour() {
				chartFour.value = proxy.$echarts.init(
					document.getElementById("chart4")
				);
				const salvProName = [
					"192.168.1.56",
					"192.168.12.33",
					"192.168.1.75",
					"192.168.1.1",
					"192.168.5.6",
					"192.168.45.90",
				];
				const salvProValue = [239, 181, 154, 144, 135, 117];
				const salvProMax = []; //背景按最大值
				for (let i = 0; i < salvProValue.length; i++) {
					salvProMax.push(salvProValue[0]);
				}
				const option = {
					backgroundColor: "#0A0933",
					grid: {
						left: "2%",
						right: "2%",
						bottom: "2%",
						top: "15%",
						containLabel: true,
					},
					tooltip: {
						trigger: "axis",
						appendToBody: true,
						axisPointer: {
							type: "none",
						},
						formatter: function (params: { name: string; value: string }[]) {
							return params[0].name + " : " + params[0].value;
						},
					},
					xAxis: {
						show: false,
						type: "value",
					},
					yAxis: [
						{
							type: "category",
							show: true,
							inverse: true,
							axisLabel: {
								show: false,
								interval: 0,
								color: "#fff",
							},
							splitLine: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							axisLine: {
								show: false,
							},
							data: salvProName,
						},
						{
							type: "category",
							inverse: true,
							axisTick: "none",
							axisLine: "none",
							show: true,
							axisLabel: {
								// 右侧文字在上
								interval: 0,
								color: ["#fff"],
								margin: -40,
								verticalAlign: "bottom",
								lineHeight: 30,
								fontSize: 13,
							},
							data: salvProValue,
						},
					],
					series: [
						{
							name: "值",
							type: "bar",
							zlevel: 1,
							itemStyle: {
								borderRadius: 30,
								color: new proxy.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
									{
										offset: 0,
										color: "#141F52",
									},
									{
										offset: 1,
										color: "#26DFFB",
									},
								]),
							},
							// 设置柱形条上方显示文字
							label: {
								color: "#fff",
								show: true,
								position: [0, "-20px"],

								fontSize: 13,
								formatter: function (a: { name: string }) {
									return a.name;
								},
							},
							barWidth: 10,
							data: salvProValue,
						},
						{
							name: "背景",
							type: "bar",
							barWidth: 10,
							barGap: "-100%",
							data: salvProMax,
							itemStyle: {
								color: "rgba(24,31,68,1)",
								borderRadius: 30,
							},
						},
					],
				};
				chartFour.value.setOption(option);
			},
			drawFive() {
				chartFive.value = proxy.$echarts.init(
					document.getElementById("chart5")
				);

				const data = [
					{
						name: "控制器",
						tooltip: {
							formatter: "{b}: 19999<br />",
						},
						symbol:
							"image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAyCAYAAAAA9rgCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3QkMzRkE4QUEwQUYxMUVBOUZEREI0QzdBNDdFMjJDQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3QkMzRkE4QkEwQUYxMUVBOUZEREI0QzdBNDdFMjJDQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdCQzNGQTg4QTBBRjExRUE5RkREQjRDN0E0N0UyMkNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdCQzNGQTg5QTBBRjExRUE5RkREQjRDN0E0N0UyMkNBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ya4ogQAACBpJREFUeNrsWdtvFFUY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",
						symbolSize: [90, 60],
						value: [500, 0],
						x: 500,
						y: 100,
						fixed: true,
						category: 1,
						label: {
							color: "#FFF",
							position: "bottom",
						},
						itemStyle: {
							color: new proxy.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{
									offset: 0,
									color: "#157eff",
								},
								{
									offset: 1,
									color: "#35c2ff",
								},
							]),
						},
					},
					{
						name: "客户端",
						symbol:
							"image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAgCAYAAABO6BuSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMzhFMDM4REEwQUYxMUVBQkY1NEIzNTg4MTM4RjIxOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMzhFMDM4RUEwQUYxMUVBQkY1NEIzNTg4MTM4RjIxOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUzOEUwMzhCQTBBRjExRUFCRjU0QjM1ODgxMzhGMjE4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUzOEUwMzhDQTBBRjExRUFCRjU0QjM1ODgxMzhGMjE4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZMccrwAACbZJREFUeNrkWUtvJFcV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",
						symbolSize: [90, 60],
						label: {
							color: "#efefef",
							position: "bottom",
						},
						value: [100, 500],
						x: 100,
						y: 500,
						fixed: true,
						category: 1,
						itemStyle: {
							color: new proxy.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{
									offset: 0,
									color: "#ffb402",
								},
								{
									offset: 1,
									color: "#ffdc84",
								},
							]),
						},
					},
					{
						name: "网关",
						symbol:
							"image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAgCAYAAABO6BuSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMzhFMDM4REEwQUYxMUVBQkY1NEIzNTg4MTM4RjIxOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMzhFMDM4RUEwQUYxMUVBQkY1NEIzNTg4MTM4RjIxOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUzOEUwMzhCQTBBRjExRUFCRjU0QjM1ODgxMzhGMjE4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUzOEUwMzhDQTBBRjExRUFCRjU0QjM1ODgxMzhGMjE4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZMccrwAACbZJREFUeNrkWUtvJFcV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",
						symbolSize: [90, 60],
						label: {
							color: "#efefef",
							position: "bottom",
						},
						x: 800,
						y: 500,
						value: [950, 300],
						fixed: true,
						category: 1,
						itemStyle: {
							color: new proxy.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{
									offset: 0,
									color: "#ffb402",
								},
								{
									offset: 1,
									color: "#ffdc84",
								},
							]),
						},
					},
				];

				const option = {
					backgroundColor: "#0A0933",
					xAxis: {
						show: false,
						type: "value",
					},
					yAxis: {
						show: false,
						type: "value",
					},
					tooltip: {
						appendToBody: true,
					},
					series: [
						{
							type: "graph",
							zlevel: 5,
							draggable: false,
							coordinateSystem: "cartesian2d", //使用二维的直角坐标系（也称笛卡尔坐标系）
							symbol: "rect",
							symbolOffset: ["15%", 0],
							label: {
								show: true,
							},
							data: data,
							links: [
								{
									source: "客户端",
									target: "控制器",
								},
								{
									source: "控制器",
									target: "客户端",
								},
								{
									source: "控制器",
									target: "网关",
								},
								{
									source: "客户端",
									target: "网关",
								},
								{
									source: "网关",
									target: "客户端",
								},
							],
							lineStyle: {
								opacity: 1,
								color: "#53B5EA",
								curveness: 0.2,
								width: 2,
							},
						},
						{
							type: "lines",
							coordinateSystem: "cartesian2d",
							z: 1,
							zlevel: 2,
							animation: false,
							effect: {
								show: true,
								period: 5,
								trailLength: 0.01,
								symbolSize: 12,
								symbol: "pin",
								loop: true,
								color: "rgba(55,155,255,0.5)",
							},
							lineStyle: {
								color: "#22AC38",
								width: 0,
								curveness: 0.2,
							},
							data: [
								{
									coords: [
										[500, 0],
										[100, 500],
									],
								},
								{
									coords: [
										[100, 500],
										[500, 0],
									],
								},
								{
									coords: [
										[500, 0],
										[950, 300],
									],
								},
								{
									coords: [
										[100, 500],
										[950, 300],
									],
								},
								{
									coords: [
										[950, 300],
										[100, 500],
									],
								},
							],
						},
						{
							type: "lines",
							coordinateSystem: "cartesian2d",
							z: 1,
							zlevel: 2,
							animation: false,
							effect: {
								show: true,
								period: 6,
								trailLength: 0.01,
								symbolSize: 12,
								symbol: "pin",
								loop: true,
								color: "rgba(55,155,255,0.5)",
							},
							lineStyle: {
								normal: {
									color: "#22AC38",
									width: 0,
									curveness: 0.2,
								},
							},
							data: [
								{
									coords: [
										[500, 0],
										[100, 500],
									],
								},
								{
									coords: [
										[100, 500],
										[500, 0],
									],
								},
								{
									coords: [
										[100, 500],
										[950, 300],
									],
								},
								{
									coords: [
										[500, 0],
										[950, 300],
									],
								},
								{
									coords: [
										[950, 300],
										[100, 500],
									],
								},
							],
						},
						{
							type: "lines",
							coordinateSystem: "cartesian2d",
							z: 1,
							zlevel: 2,
							animation: false,

							effect: {
								show: true,
								period: 8,
								trailLength: 0.01,
								symbolSize: 12,
								symbol: "pin",
								loop: true,
								color: "rgba(55,155,255,0.5)",
							},
							lineStyle: {
								color: "#22AC38",
								width: 0,
								curveness: 0.2,
							},

							data: [
								{
									coords: [
										[500, 0],
										[100, 500],
									],
								},
								{
									coords: [
										[100, 500],
										[500, 0],
									],
								},
								{
									coords: [
										[100, 500],
										[950, 300],
									],
								},
								{
									coords: [
										[500, 0],
										[950, 300],
									],
								},
								{
									coords: [
										[950, 300],
										[100, 500],
									],
								},
							],
						},
					],
				};

				chartFive.value.setOption(option);
			},
			sse() {
				//sse测试
				const source = new EventSource(
					"http://192.168.3.186:9009/websocket/getRankList"
				);
				source.onopen = function (event) {
					console.log("链接成功");
				};
				source.addEventListener("message", function (e) {
					console.log(2, e);
				});
			},
		};
		onMounted(() => {
			methods.drawOne();
			methods.drawTwo();
			methods.drawThree();
			methods.drawFour();
			methods.drawFive();
			methods.init();
			// methods.sse();
		});
		onUnmounted(() => {
			window.removeEventListener("resize", methods.init);
		});
		return { ...toRefs(state), ...methods };
	},
});
</script>
