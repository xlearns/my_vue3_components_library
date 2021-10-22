<template>
	<div ref="scrollDom" class="wx-scroll">
		<div class="wx-scroll__wrapper">
			<div ref="scrollContent">
				<slot />
			</div>
			<slot :pullUp="pullUp" :pullUpNow="pullUpNow" name="pullup">
				<div v-if="pullUp" class="wx-scroll__pullup">
					<div v-if="!pullUpNow">
						<span>{{ pullUpTxt }}</span>
					</div>
					<div v-else>
						加载
						<!-- <Loading /> -->
					</div>
				</div>
			</slot>
		</div>
		<slot
			:pullDown="pullDown"
			:pullDownStyle="pullDownStyle"
			:pullDownBefore="pullDownBefore"
			:pullDownNow="pullDownNow"
			:bubbleY="bubbleY"
			name="pulldown"
		>
			<div
				v-if="pullDown"
				ref="pulldown"
				:style="pullDownStyle"
				class="wx-scroll__pulldown"
			>
				<div v-if="pullDownBefore" class="wx-scroll__pulldown__before">
					动画
					<!-- <Bubble :y="bubbleY" /> -->
				</div>
				<div v-else class="wx-scroll__pulldown__after">
					<div v-if="pullDownNow">
						加载
						<!-- <Loading /> -->
					</div>
					<div v-else>
						<span>{{ pullDownTxt }}</span>
					</div>
				</div>
			</div>
		</slot>
	</div>
</template>
<script lang="ts">
import BScroll from "better-scroll";
import {
	defineComponent,
	reactive,
	toRefs,
	ref,
	computed,
	watch,
	onMounted,
	nextTick,
} from "vue";
export default defineComponent({
	name: "wxScroll",
	props: {
		probeType: {
			// 滚动事件监听类型
			type: Number,
			default: 1,
		},
		click: {
			// 开启点击事件代理
			type: Boolean,
			default: true,
		},
		listenScroll: {
			// 监听滚动
			type: Boolean,
			default: false,
		},
		listenBeforeScrollStart: {
			// 监听滚动开始前
			type: Boolean,
			default: false,
		},
		scrollX: {
			// 开启X轴滚动
			type: Boolean,
			default: false,
		},
		scrollY: {
			// 开启Y轴滚动
			type: Boolean,
			default: true,
		},
		scrollbar: {
			// 开启滚动条
			type: null,
			default: false,
		},
		pullDown: {
			// 启用下拉刷新
			type: Boolean,
			default: true,
		},
		pullDownConfig: {
			// 下拉刷新配置
			type: Object,
			default: () => ({
				threshold: 90, // 触发 pullingDown 的距离
				stop: 40, // pullingDown 正在刷新 hold 时的距离
				txt: "刷新成功",
			}),
		},
		pullUp: {
			// 启用上拉加载
			type: Boolean,
			default: true,
		},
		pullUpConfig: {
			// 上拉加载配置
			type: Object,
			default: () => ({
				threshold: 100, // 提前触发 pullingUp 的距离
				txt: { more: "上拉加载", noMore: "— 我是有底线的 —" },
			}),
		},
		startY: {
			// 起始Y位置
			type: Number,
			default: 0,
		},
		bounce: {
			// 回弹效果
			type: Boolean,
			default: true,
		},
		bounceTime: {
			// 回弹时间
			type: Number,
			default: 600,
		},
		preventDefaultException: {
			// 不阻止默认行为
			type: Object,
			default: () => ({
				tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/,
			}),
		},
		mouseWheel: {
			// 启用 PC 鼠标滚轮
			type: Boolean,
			default: false,
		},
		betterScrollOptions: {
			// 任何的 better-scroll 配置项，将合并在初始化 better-scroll 的配置中。注意：与 props 冲突的配置项将被 props 覆盖
			type: Object,
			default: null,
		},
		autoUpdate: {
			// 自动刷新高度:适用于简单场景，复杂场景请使用updateData/refreshData
			type: Boolean,
			default: false,
		},
		updateData: {
			// 引起更新上拉/下拉加载状态的数据（下拉刷新/上拉加载相关的数据）
			type: Array,
			default: null,
		},
		refreshData: {
			// 引起刷新高度的数据（不包含 updateData 内的数据）
			type: Array,
			default: null,
		},
	},
	setup(props, { emit }) {
		const pulldown = ref();
		const scrollDom = ref();
		const scrollContent = ref();
		const state = reactive({
			pullDownBefore: true, // 下拉之前
			pullDownNow: false, // 正在下拉
			pullDownStyle: "", // 下拉样式
			pullUpNow: false, // 正在上拉
			pullUpFinally: false, // true表示到了上拉加载到了最底部
			isRebounding: false, // 正在回弹
			bubbleY: 0, // 气泡y坐标
			pullDownInitTop: 0,
			scroll: {} as any,
			pullDownUpdateState: false,
			pullUpUpdateState: false,
		});
		//下拉文本
		const pullDownTxt = computed(() => {
			return props.pullDownConfig && props.pullDownConfig.txt;
		});
		// 上拉的文本
		const pullUpTxt = computed(() => {
			const moreTxt =
				props.pullUpConfig &&
				props.pullUpConfig.txt &&
				props.pullUpConfig.txt.more;
			const noMoreTxt =
				props.pullUpConfig &&
				props.pullUpConfig.txt &&
				props.pullUpConfig.txt.noMore;
			return state.pullUpFinally ? noMoreTxt : moreTxt;
		});
		onMounted(() => {
			let _pulldown = pulldown.value;
			state.pullDownInitTop =
				parseInt(_pulldown && getComputedStyle(_pulldown).top) || -50;
			// await nextTick();
			methods.initScroll();
			// 自动刷新高度：深监视 $data，发生改变时更新高度
		});
		let _scroll: any;
		let _scrollContent: any;
		const methods = {
			initScroll() {
				_scroll = scrollDom.value;
				_scrollContent = scrollContent.value;
				if (!_scroll) return;
				// 设置scrollContent的最小高，实现高度不足时也有回弹效果
				if (_scrollContent) {
					_scrollContent.style.minHeight = `${
						_scroll.getBoundingClientRect().height + 1
					}px`;
				}
				const options: any = {
					...props.betterScrollOptions,
					probeType: props.probeType,
					click: props.click,
					scrollX: props.scrollX,
					scrollY: props.scrollY,
					scrollbar: props.scrollbar,
					pullDownRefresh: props.pullDown && props.pullDownConfig,
					pullUpLoad: props.pullUp && props.pullUpConfig,
					startY: props.startY,
					bounce: props.bounce,
					bounceTime: props.bounceTime,
					preventDefaultException: props.preventDefaultException,
					mouseWheel: props.mouseWheel,
				};
				state.scroll = new BScroll(_scroll, options);
				props.listenScroll &&
					state.scroll.on("scroll", (pos: any) => {
						emit("scroll", pos);
					});
				props.listenBeforeScrollStart &&
					state.scroll.on("beforeScrollStart", () => {
						emit("beforeScrollStart");
					});
				props.pullDown && methods._initPullDown();
				props.pullUp && methods._initPullUp();
			},
			// 初始化下拉刷新
			_initPullDown() {
				state.scroll.on("pullingDown", () => {
					state.pullDownBefore = false;
					state.pullDownNow = true;
					emit("pullingDown");
					state.scroll.closePullDown(); // 防止在 bounce 前二次触发
				});
				state.scroll.on("scroll", (pos: any) => {
					if (!props.pullDown || pos.y < 0) return;
					const posY = Math.floor(pos.y); // 滚动的y轴位置：Number
					if (state.pullDownBefore) {
						state.bubbleY = Math.max(0, posY + state.pullDownInitTop);
						state.pullDownStyle = `transform: translateY(${Math.min(
							posY,
							-state.pullDownInitTop
						)}px)`;
					} else {
						state.bubbleY = 0;
					}
					if (state.isRebounding) {
						state.pullDownStyle = `transform: translateY(${Math.min(
							posY,
							props.pullDownConfig.stop
						)}px)`;
					}
				});
			},
			// 初始化上拉加载
			_initPullUp() {
				state.scroll.on("pullingUp", () => {
					if (state.pullUpFinally) {
						state.scroll.finishPullUp();
					} else {
						state.pullUpNow = true;
						emit("pullingUp");
					}
				});
			},
			// 关闭滚动
			disable() {
				state.scroll && state.scroll.disable();
			},
			// 开启滚动
			enable() {
				state.scroll && state.scroll.enable();
			},
			// 销毁滚动示例
			destroy() {
				state.scroll && state.scroll.destroy();
			},
			// 刷新滚动高度
			refresh() {
				state.scroll && state.scroll.refresh();
			},
			// 更新加载状态，下拉/下拉成功后使用
			async update(final: any) {
				if (props.pullDown && state.pullDownNow) {
					if (state.pullDownUpdateState) return;
					state.pullDownUpdateState = true; // 正在update状态
					// 下拉刷新触发成功后
					state.pullDownNow = false;
					await timeout(props.bounceTime / 2); // 刷新成功hold
					state.isRebounding = true;
					state.scroll.finishPullDown(); // 开始回弹
					await timeout(props.bounceTime);
					state.pullDownBefore = true;
					state.isRebounding = false;
					state.scroll.openPullDown(props.pullDownConfig);
					state.pullUpFinally = false;
				} else if (props.pullUp && state.pullUpNow) {
					if (state.pullUpUpdateState) return;
					state.pullUpUpdateState = true; // 正在update状态
					// 上拉加载触发成功后
					state.pullUpNow = false;
					state.scroll.finishPullUp();
				}
				typeof final !== "undefined" && (state.pullUpFinally = !!final);
				await nextTick();
				this.refresh();
				state.pullDownUpdateState = false;
				state.pullUpUpdateState = false;
			},
			scrollTo(x = 0, y = 0, time = props.bounceTime) {
				state.scroll && state.scroll.scrollTo(x, y, time);
			},
			// 滚动到元素
			scrollToElement() {
				state.scroll &&
					state.scroll.scrollToElement.apply(state.scroll, arguments);
			},
			// 滚动到顶部
			scrollToTop() {
				state.scroll && this.scrollTo(0, 0);
			},
			// 滚动到底部
			scrollToBottom() {
				state.scroll && this.scrollTo(0, state.scroll.maxScrollY);
			},
			// 手动触发下拉刷新
			autoPullDownRefresh() {
				state.scroll && state.scroll.autoPullDownRefresh();
			},
		};
		return {
			pullDownTxt,
			pulldown,
			pullUpTxt,
			scrollDom,
			scrollContent,
			...methods,
			...toRefs(state),
		};
	},
});
</script>
