<template>
  <div class="control_nav">
    <header>
      <div @click="exit" class="return">
        <i class="el-icon-back" />
      </div>
      <h1>计算节点主动免疫系统——总控屏</h1>
      <div class="showTime">当前时间：{{ currentDate }}</div>
    </header>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import "../css/controlNav.scss";
export default defineComponent({
  setup() {
    const router = useRouter();
    const state = reactive({
      currentDate: new Date().toLocaleString()
    });
    const methods = {
      exit: function() {
        router.go(-1);
        // router.push("/main");
      }
    };
    return { ...toRefs(state), ...methods };
  }
});
</script>
