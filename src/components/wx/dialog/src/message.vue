<template>
	<transition :name="animation">
		<div
			v-show="visible"
			ref="el"
			:class="{
				[`${prefixCls}-dialog-modal`]: true,
				modal: !modal,
				center: center,
			}"
			:style="{ zIndex: zIndex }"
			@click="btnClick('modal')"
		>
			<div
				ref="dialogEl"
				:class="{
					[prefixCls + '-dialog']: true,
					[className]: className,
					[prefixCls + '-dialog-isAlert']: isAlert,
				}"
				:style="{
					width: width,
					top: top,
					left: left,
					'transition-duration': moveFlag ? '0s' : '',
				}"
				@click.stop=""
			>
				<a
					v-if="showClose"
					:class="`${prefixCls}-dialog-close icon-close`"
					@click="btnClick('close')"
				>
				</a>
				<div v-if="autoClose > 0" :class="`${prefixCls}-dialog-auto-close`">
					<span v-html="closeTips.replace('S', autoTime)"></span>
				</div>
				<div
					v-if="title || $slots.title"
					ref="headEl"
					:class="{ [`${prefixCls}-dialog-header`]: true, move: move }"
					@mousedown="mouseDown"
				>
					<template v-if="title">{{ title }}</template>
					<slot v-else name="title"></slot>
				</div>
				<div
					v-if="content || $slots.default"
					:style="{ height: height }"
					:class="{
						[prefixCls + '-dialog-alert']: isAlert,
						[prefixCls + '-dialog-content']: true,
					}"
				>
					<i v-if="icon" :class="[{ ['icon-' + iconName]: icon }]"></i>
					<div
						v-if="content"
						:class="[prefixCls + '-dialog-text']"
						v-html="content"
					></div>
					<slot v-else></slot>
				</div>
				<div v-if="$slots.footer" :class="`${prefixCls}-dialog-footer`">
					<slot name="footer"></slot>
				</div>
				<div v-if="confirm || cancel" :class="`${prefixCls}-dialog-footer`">
					<d-button
						v-if="confirm"
						type="primary"
						@click="btnClick('confirm')"
						>{{ confirm }}</d-button
					>
					<d-button v-if="cancel" type="cancel" @click="btnClick('cancel')">{{
						cancel
					}}</d-button>
				</div>
			</div>
		</div>
	</transition>
</template>
<script lang="ts">
import {
	defineComponent,
	reactive,
	toRefs,
	computed,
	onMounted,
	nextTick,
	ref,
	onBeforeUnmount,
	watch,
} from "vue";
</script>
