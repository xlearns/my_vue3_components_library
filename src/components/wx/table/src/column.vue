<script lang="ts">
import { defineComponent, inject, onMounted } from "vue";

import pType from "../../utils/pType";
import { AnyPropName } from "../../types";

export default defineComponent({
	name: "wxColumn",
	props: {
		prop: pType.string(),
		label: pType.string(),
		width: pType.string(),
		className: pType.string(),
		align: pType.oneOfString(["left", "center", "right"]),
		type: pType.oneOfString(["selection", "index", "extend"]),
		fixed: pType.oneOfString(["left", "right"]),
		sortBy: pType.bool(),
		title: pType.bool(true),
		drag: pType.bool(true),
		formatter: Function,
	},
	setup(props, { slots }) {
		onMounted(() => {
			const columnsType: boolean = inject("columnsType", false);
			if (!columnsType) {
				const getColumns = inject("getColumns") as AnyPropName;
				const columns = getColumns.value;
				let has = false;
				const addData = Object.assign({}, props, { slots: slots, layer: 1 });
				columns &&
					columns.forEach((item: any) => {
						if (JSON.stringify(item) === JSON.stringify(addData)) {
							has = true;
						}
					});
				if (!has) {
					columns && columns.push(addData);
				}
			}
		});
	},
	render() {
		return null;
		// return h('div', {}, this.$slots.default)
	},
});
</script>
<style lang="scss" scoped>
@import "@/components/wx/table/src/column.scss";
</style>
