<template>
	<div class="control">
		<!-- <Header /> -->
		<div class="main">
			<Nav />
			<div class="content">
				<Overview />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import Overview from "./Overview.vue";
import { defineComponent, reactive, toRefs } from "vue"; // @ is an alias to /src
import Nav from "../../components/controlNav.vue";
import "@/css/control.scss";

export default defineComponent({
	name: "Control",
	components: {
		Nav,
		Overview,
	},
	setup() {
		const route = useRoute();
		const state = reactive({});

		return { ...toRefs(state) };
	},
});
</script>
