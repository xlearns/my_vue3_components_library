<template>
  <div class="tools">
    <el-aside>
      <div class="menu">
        <div class="logo">
          <h1><img src="../assets/nav/logo.png" alt="" /></h1>
        </div>
        <nav>
          <ul>
            <li @click="gotoControl">
              <img src="../assets/nav/diannao.png" alt="" /><span>总控屏</span>
            </li>
            <li @click="gotoMind">
              <img src="../assets/nav/naotu.png" alt="" /><span>脑图</span>
            </li>
            <li>
              <img src="../assets/nav/ceshi.png" alt="" /><span>测试</span>
            </li>
            <li>
              <img src="../assets/nav/xiazai.png" alt="" /><span>下载</span>
            </li>
            <li @click="fullScreen">
              <img src="../assets/nav/quanping.png" alt="" /><span>全屏</span>
            </li>
            <li @click="quit">
              <img src="../assets/nav/tuichu.png" alt="" /><span>退出</span>
            </li>
          </ul>
        </nav>
      </div>
      <div class="menu-nav">
        <div class="menu-user">
          <img src="../assets/nav/touxiang.png" alt="" />
          <div class="username">管理员：{{ name }}</div>
        </div>
        <div>
          <MenuList :list="list" :is-collapse="false" />
        </div>
      </div>
    </el-aside>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import MenuList from '../components/MenuList.vue'
import { useRouter } from 'vue-router'
import './../css/tools.scss'
import screenfull from 'screenfull'
export default defineComponent({
  props: {
    list: Array,
  },
  components: {
    MenuList,
  },
  setup() {
    const router = useRouter()
    const { proxy }: any = getCurrentInstance()
    const state = reactive({
      isFullscreen: false,
      head: '/head.png',
      name: localStorage.getItem('name'),
      isDot: false,
    })
    const methods = {
      gotoMind() {
        router.push('/bigscreen/mind')
      },
      fullScreen() {
        //全屏
        if (!screenfull.isEnabled) {
          proxy.$message({
            message: '您的浏览器版本过低不支持全屏显示！',
            type: 'warning',
          })
          return false
        }
        state.isFullscreen = !state.isFullscreen
        screenfull.toggle()
      },
      gotoControl() {
        router.push('/bigscreen/control')
      },
      quit() {
        proxy
          .$confirm('此操作将退出此系统, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            localStorage.clear()
            proxy.$message.success('退出成功！')
            router.push('/login')
          })
          .catch(() => {
            proxy.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
    }
    return {
      ...toRefs(state),
      ...methods,
    }
  },
})
</script>
