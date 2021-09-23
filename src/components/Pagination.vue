<template>
  <el-pagination
    v-if="total > 10"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    :page-sizes="[10, 20, 30, 40, 100]"
    :page-size="pageSize"
    :current-page="pageNo"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  >
  </el-pagination>
</template>

<script lang="ts">
import { defineComponent, Slots } from 'vue'
import '../css/pagination.scss'
// ts类型
interface Data {
  [key: string]: unknown
}

interface SetupContext {
  attrs: Data
  slots: Slots
  emit: (event: string, ...args: unknown[]) => void
}

export default defineComponent({
  props: {
    total: Number,
    pageSize: Number,
    pageNo: Number,
  },
  setup(props, context: SetupContext) {
    const methods = {
      // 切页
      handleCurrentChange(val: number) {
        context.emit('handleCurrentChange', val)
      },
      handleSizeChange(val: number) {
        context.emit('handleSizeChange', val)
      },
    }
    return { ...methods }
  },
})
</script>
<style>
/* .el-pagination {
  position: fixed;
  bottom: 6px;
  left: 360px;
  z-index: 0;
} */
</style>
