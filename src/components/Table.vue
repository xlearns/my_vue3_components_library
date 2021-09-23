<template>
	<div class="table_com" ref="table">
		<el-table
			v-loading="isLoading"
			element-loading-background="rgba(255, 255, 255, .5)"
			element-loading-text="加载中，请稍后..."
			element-loading-spinner="el-icon-loading"
			:data="tableData"
			:max-height="size"
			ref="multipleTable"
			@selection-change="handleSelectionChange"
			@row-click="rowClick"
			:row-style="rowStyle"
		>
			<el-table-column v-if="selection" type="selection" width="50" />
			<el-table-column v-if="number" label="序号" width="55" align="center">
				<template #default="scope">
					{{
						(curPage - 1) * 10 + scope.$index + 1 >= 10
							? (curPage - 1) * 10 + scope.$index + 1
							: `0${scope.$index + 1}`
					}}
				</template>
			</el-table-column>
			<el-table-column
				v-for="(item, i) in headTitle"
				:key="i"
				:label="item.label"
				:width="switch_width(item)"
				show-overflow-tooltip
				align="center"
			>
				<template #default="scope">
					<div
						v-if="
							($route.path == '/resourse/resourcemanage' &&
								item.label == '上传时间') ||
							($route.path == '/trustedwork/versionmanage' &&
								item.label == '更新日期') ||
							($route.path == '/logs/managementlog' && item.label == '时间') ||
							($route.path == '/logs/systemlog' && item.label == '时间')
						"
					>
						<span class="ellipsis">{{
							item.val ? formatter(scope.row[item.val]) : scope.$index + 1
						}}</span>
					</div>
					<div
						v-else-if="
							$route.path == '/user/terminal' && item.label == '所属部门'
						"
					>
						<span class="ellipsis">
							<span v-for="(item, index) in scope.row.groupDTOS" :key="item">{{
								index === scope.row.groupDTOS.length - 1
									? item.group_name
									: item.group_name + "/"
							}}</span>
						</span>
					</div>
					<div
						v-else-if="
							$route.path == '/gateway/gateway' && item.label == '状态'
						"
					>
						<span v-if="scope.row[item.val] == -1" style="color: #ff0101"
							>不可用</span
						>
						<span v-else-if="scope.row[item.val] == 1">在线可用</span>
						<span v-else-if="scope.row[item.val] == 2">忙碌</span>
						<span v-else-if="scope.row[item.val] == 0">下线</span>
						<span v-else>-</span>
					</div>
					<div
						v-else-if="
							$route.path == '/trustedwork/versionmanage' &&
							item.label == '状态'
						"
					>
						<span class="ellipsis">{{
							scope.row[item.val] ? "默认版本" : "当前版本"
						}}</span>
					</div>
					<div
						v-else-if="
							$route.path == '/trustedwork/versionmanage' &&
							item.label == '应用大小'
						"
					>
						<span class="ellipsis">{{ scope.row[item.val] }}MB</span>
					</div>
					<div
						v-else-if="
							$route.path == '/gateway/gatewayRoute' && item.label == '代理类型'
						"
					>
						<span class="ellipsis">{{
							scope.row[item.val] === 1
								? "tcp"
								: scope.row.proxyType === 2
								? "http"
								: "udp"
						}}</span>
					</div>
					<div
						v-else-if="
							$route.path == '/gateway/gatewayRoute' && item.label == '状态'
						"
					>
						<span class="ellipsis">{{
							scope.row[item.val] === 0 ? "未连接" : "连接中"
						}}</span>
					</div>
					<div
						v-else-if="
							$route.path == '/system/usermanage' && item.label == '权限'
						"
					>
						<span class="ellipsis">{{ format(scope.row[item.val]) }}</span>
					</div>
					<div
						v-else-if="
							($route.path === '/logs/managementlog' ||
								$route.path === '/logs/operationlog' ||
								$route.path === '/logs/systemlog') &&
							item.label == '操作结果'
						"
					>
						<span class="ellipsis">{{
							scope.row[item.val] === -1
								? "失败"
								: scope.row[item.val] === 0
								? "系统操作"
								: "成功"
						}}</span>
					</div>
					<div
						v-else-if="
							($route.path === '/logs/managementlog' ||
								$route.path === '/logs/operationlog' ||
								$route.path === '/logs/systemlog') &&
							item.label == '等级'
						"
					>
						<span class="ellipsis">{{
							scope.row[item.val] === 1
								? "ERROR"
								: scope.row[item.val] === 2
								? "WARN"
								: scope.row[item.val] === 3
								? "INFO"
								: "DEBUG"
						}}</span>
					</div>
					<div
						v-else-if="
							($route.path === '/logs/managementlog' ||
								$route.path === '/logs/operationlog' ||
								$route.path === '/logs/systemlog') &&
							item.label == '来源'
						"
					>
						<span class="ellipsis">{{
							scope.row[item.val] === 1
								? "用户操作"
								: scope.row[item.val] === 2
								? "管理员操作"
								: "系统生成"
						}}</span>
					</div>

					<div v-else>
						<span class="ellipsis">{{
							item.val ? scope.row[item.val] : scope.$index + 1
						}}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				v-if="operate"
				label="操作"
				:width="
					$route.path == '/trustedwork/versionmanage'
						? operate.length * 100
						: operate.length * 80
				"
				align="center"
			>
				<template #default="scope">
					<el-button
						size="mini"
						v-for="(item, i) in operate"
						:key="i"
						type="text"
						@click="handleOperate(scope.row, item)"
					>
						<span
							v-if="
								$route.path == '/gateway/gateway' &&
								scope.row.availability != -1 &&
								item == '自定义'
							"
							>上线</span
						>
						<span
							v-else-if="
								$route.path == '/gateway/gateway' &&
								scope.row.availability == -1 &&
								item == '自定义'
							"
							>下线</span
						>
						<span v-else>{{ item }}</span>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts">
import {
	Slots,
	defineComponent,
	ref,
	reactive,
	toRefs,
	getCurrentInstance,
} from "vue";
import "../css/table.scss";
import { formatter } from "@/utils/common";

// ts类型
interface Data {
	[key: string]: string | number | unknown;
}
interface SetupContext {
	attrs: Data;
	slots: Slots;
	emit: (event: string, ...args: unknown[]) => void;
}

export default defineComponent({
	props: {
		isLoading: {
			type: Boolean,
		},
		tableData: Array,
		headTitle: Array,
		operate: Array,
		selection: {
			type: Boolean,
		},
		number: {
			type: Boolean,
		},
		isDebounce: {
			type: Boolean,
			default: true,
		},
		curPage: {
			type: Number,
			default: 1,
		},
		total: {
			type: Number,
			default: 1,
		},
	},
	setup(props, context: SetupContext) {
		let timer: any;
		const time = 300;
		const { proxy }: any = getCurrentInstance();
		const multipleTable = ref(null) as any;
		const state = reactive({
			type: "",
			seleced: 0,
			size: 200,
		});
		const getSize = function () {
			proxy.$nextTick(() => {
				if (!proxy.$refs.table) return;
				state.size = proxy.$refs.table.offsetHeight;
			});
		};
		const methods = {
			rowStyle(row: any, rowIndex: any) {
				if (state.size == 200) return;
				const os: any = (state.size - 48) / 10;
				return { height: os + "px" };
			},
			switch_width(item: any) {
				let res: any;
				if (item.label == "存储位置") {
				}

				return res;
			},
			format(value: Array<string>) {
				if (value) {
					return value.join(",");
				}
			},
			handleOperate(row: any, type: string, open = false) {
				state.type = type;
				const fn = function () {
					if (!open) {
						context.emit("def", type, row);
						state.type = "";
					} else {
						switch (type) {
							case "删除":
								context.emit("del", row);
								break;
							case "查看":
								context.emit("show", row);
								break;
							case "编辑":
								context.emit("edit", row);
						}
					}
				};
				if (props.isDebounce) {
					timer && clearTimeout(timer);
					timer = setTimeout(() => {
						fn();
					}, time);
				} else {
					fn();
				}
			},
			handleSelectionChange(val: Array<object>) {
				state.seleced = val && val.length;
				context.emit("handleSelectionChange", val);
			},
			rowClick(row: any, column: any, event: any) {
				if (state.type === "") {
					multipleTable.value.toggleRowSelection(row);
					context.emit("handleSelectionChange", row);
				}
				state.type = "";
			},
		};
		window.addEventListener("resize", () => {
			getSize();
		});
		getSize();
		return { ...methods, formatter, multipleTable, ...toRefs(state) };
	},
});
</script>
