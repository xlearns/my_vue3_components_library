<template>
	<transition>
		<div class="drag-container">
			<slot></slot>
		</div>
	</transition>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive, onMounted } from "vue";
//拖拽
import Sortable from "sortablejs";
export default defineComponent({
	name: "wxDraggable",
	props: {
		modelValue: {},
		config: {
			type: Object,
			default: () => {
				//Grid
				return {
					multiDrag: true, // Enable multi-drag
					selectedClass: "selected", // The class applied to the selected items
					fallbackTolerance: 3, // So that we can select items on mobile
					animation: 150,
				};
			},
		},
	},
	setup(props, { emit }) {
		let state = reactive({
			drag: true,
			sortable: null,
		});
		const methods = {};
		onMounted(() => {
			let el = document.querySelector(".drag-container");
			if (!props.config.onEnd) {
				props.config["onEnd"] = function (evt: any) {
					props.modelValue.splice(
						evt.newIndex,
						0,
						props.modelValue.splice(evt.oldIndex, 1)[0]
					);
					emit("update:modelValue", props.modelValue);
				};
			}
			state.sortable = Sortable.create(el, props.config);
		});
		return {
			...toRefs(state),
			...methods,
		};
	},
});
</script>
