<template>
  <div class="systemlog">
    <!-- <div class="head-title split-line flex">
      <div>系统日志</div>
    </div> -->
    <div v-if="first_loader" class="data-list">
      <div class="operate">
        <div class="left">
          <div>
            <span class="label">操作时间：</span>
            <el-date-picker
              v-model="form.key5"
              type="daterange"
              unlink-panels
              size="mini"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="shortcuts"
            >
            </el-date-picker>
          </div>
          <div>
            <span class="label operation-time">日志等级：</span>
            <el-select v-model="form.key1" size="mini" placeholder="请选择">
              <el-option
                v-for="(item, index) in level_option"
                :key="index"
                :label="item.name"
                :value="item.values"
              >
              </el-option>
            </el-select>
          </div>
          <!-- <div>
          <span class="label operation-time">来源：</span>
          <el-select v-model="form.key2" size="mini" placeholder="请选择">
            <el-option
              v-for="(item, index) in users_data"
              :key="index"
              :label="item.name"
              :value="item.values"
            >
            </el-option>
          </el-select>
        </div> -->
          <div>
            <!--  -->
            <span class="label operation-time">执行类：</span>
            <el-select
              v-model="form.key3"
              size="mini"
              placeholder="请选择"
              @change="controller_fn"
            >
              <el-option
                v-for="(item, index) in controller"
                :key="index"
                :label="item.name"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <span class="label operation-time">方法：</span>
            <el-select
              v-model="form.key4"
              size="mini"
              placeholder="请选择"
              :disabled="isClick"
            >
              <el-option
                v-for="(item, index) in options_child"
                :key="index"
                :label="item.name"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="right">
          <el-button type="primary" size="mini" @click="select">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </div>
      </div>

      <Table
        :tableData="tableData"
        :headTitle="logHeadTitle"
        :operate="operate"
        @def="def"
        @handleSelectionChange="getDelList"
        :selection="true"
        :curPage="middlePage"
        :isLoading="!loader"
        :number="true"
        :total="page.total"
      />
      <!-- 分页 -->
      <Pagination
        :total="page.total"
        :pageSize="page.pageSize"
        :pageNo="page.pageNo"
        @handleCurrentChange="handleCurrentChange"
        @sizeChange="handleSizeChange"
      />
    </div>
    <div v-else>
      <Loading type="0" />
    </div>
  </div>
</template>
<script lang="ts">
import axios from 'axios'
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import { getAllLog } from '../../utils/api'
import '@/css/systemlog.scss'
import Table from '@/components/Table.vue'
import Pagination from '../../components/Pagination.vue'
import Loading from '../../components/Loading.vue'
import { logHeadTitle } from '@/utils/constant'
import { ElNotification } from 'element-plus'
export default defineComponent({
  components: {
    Pagination,
    Loading,
    Table,
  },
  setup() {
    const { proxy }: any = getCurrentInstance()
    const state = reactive({
      date: '',
      logHeadTitle: [
        {
          label: '时间',
          val: 'log_time',
        },

        {
          label: '操作内容',
          val: 'operation_type',
        },
        {
          label: '操作结果',
          val: 'operation_result',
        },
        {
          label: '等级',
          val: 'log_level',
        },
      ],
      shortcuts: [
        {
          text: '最近一周',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          },
        },
        {
          text: '最近一个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          },
        },
        {
          text: '最近三个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
          },
        },
      ],
      fileType: 1 as any,
      controller: [
        {
          name: '',
          key: '',
        },
      ] as any,
      options_child: [
        {
          name: '',
          key: '',
        },
      ] as any,
      fileList: [],
      addDialog: false,
      user_id: '',
      loader: false,
      ofile: null,
      type: 'add',
      formInfo: {} as any,
      rules: {},
      first: true,
      uploadLoading: false,
      multipleSelection: [] as any,
      form: {
        key1: '',
        key2: '3',
        key3: '',
        key4: '',
        key5: '',
      } as any,
      user_level_option: [1, 2, 3, 4, 5],
      tableData: [] as any,
      level_option: [
        {
          name: 'ERROR',
          values: '1',
        },
        {
          name: 'WARN',
          values: '2',
        },
        {
          name: 'INFO',
          values: '3',
        },
        {
          name: 'DEBUG',
          values: '4',
        },
      ],
      users_data: [
        {
          name: '用户操作',
          values: '1',
        },
        {
          name: '管理员操作',
          values: '2',
        },
        {
          name: '系统生成',
          values: '3',
        },
      ],
      group_list: [
        {
          group_id: '',
          group_name: '',
          group_description: null,
          group_level: '',
        },
      ] as any,
      page: {
        total: 10,
        pageSize: 10,
        pageNo: 1,
      },
      controller_data: [] as any,
      isClick: true,
      first_loader: false,
      middlePage: 1,
    })
    const getTable = function (bool: any, isMessage: any) {
      const data = {} as any
      data.pageNo = state.page.pageNo
      data.pageSize = state.page.pageSize
      data.key2 = state.form.key2
      if (bool) {
        data.key1 = state.form.key1 ? String(state.form.key1) : null
        data.key2 = '3'
        data.key3 = state.form.key3 ? String(state.form.key3) : null
        data.key4 = state.form.key4 ? String(state.form.key4) : null
        if (state.form.key5) {
          const date = state.form.key5.map((v: any) => {
            return new Date(v).getTime()
          })
          data.key5 = date.join(',')
        } else {
          data.key5 = null
        }
      }
      getAllLog(data).then(
        (res: any) => {
          if (res.errorCode != 1) {
            proxy.$message.error(res.message)
            return
          }
          if (state.first) {
            const array: any = []
            state.first = true
            Object.keys(res.interfaceInfo).map((v: any) => {
              array.push({
                name: v,
                key: v,
              })
            })
            state.controller = array
            state.controller_data = res.interfaceInfo
          }

          state.tableData = res.log_list
          state.page.total = res.sum
          state.loader = true
          if (!state.first_loader) {
            state.first_loader = true
          }
          state.middlePage = state.page.pageNo
          isMessage && proxy.$message.success(res.message)
        },
        (error: any) => {
          ElNotification({
            type: 'error',
            title: '失败',
            message: error.message,
          })
        }
      )
    }
    getTable(true, false)
    const methods = {
      formattingTime(time: any) {
        let result = ''
        if (time) {
          const data = new Date(time)
          const year = data.getFullYear()
          const month = data.getMonth() + 1
          const day = data.getDate()
          const hour = data.getHours()
          const minutes = data.getMinutes()
          const seconds = data.getSeconds()
          result = `${year}/${month}/${day} ${hour}:${minutes}:${seconds}`
        }
        return result
      },
      handleSizeChange(val: any) {
        state.loader = false
        state.page.pageSize = val
        state.page.pageNo = 1
        getTable(true, false)
      },
      controller_fn(val: any) {
        state.isClick = false
        state.form.key4 = ''
        state.options_child = state.controller_data[val].map((v: any) => {
          return {
            name: v,
            key: v,
          }
        })
      },
      resetData() {
        state.addDialog = false
      },
      handleCurrentChange(val: number) {
        state.loader = false
        state.page.pageNo = val
        getTable(true, false)
      },
      reset() {
        proxy.$refs['formDom'] && proxy.$refs['formDom'].resetFields()
        state.isClick = true
        Object.keys(state.form).forEach((item) => {
          state.form[item] = null
        })
        getTable(true, false)
      },
      select() {
        getTable(true, true)
      },
    }
    return { ...toRefs(state), ...methods }
  },
})
</script>
