<template>
  <div class="branch">
    <!-- <div class="head-title split-line">部门列表</div> -->
    <div v-if="first_loader" class="data-list">
      <div class="operate">
        <div class="left">
          <div>
            <span class="label">部门名称: </span>
            <el-input
              size="mini"
              v-model="form.group_name"
              placeholder="请输入"
            ></el-input>
          </div>
          <div class="right">
            <el-button type="primary" size="mini" @click="select"
              >查询</el-button
            >
            <el-button size="mini" v-debounce="[resetSelect]">重置</el-button>
            <el-button type="success" size="mini" @click="add">添加</el-button>
            <el-button type="danger" size="mini" @click="multipleDelete"
              >删除</el-button
            >
          </div>
        </div>
      </div>

      <Table
        :headTitle="headTitle"
        :tableData="tableData"
        :selection="true"
        :number="true"
        @def="def"
        :operate="operate"
        :isLoading="!loader"
        :curPage="middlePage"
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
      <Loading />
    </div>
    <!-- 模态框 -->
    <el-dialog
      :title="type === 'add' ? '添加用户管理' : '修改用户管理'"
      v-model="addDialog"
      width="40%"
      @open="open"
    >
      <el-form
        :model="formInfo"
        :rules="rules"
        label-width="80px"
        ref="formDom"
        class="add_user"
      >
        <el-form-item label="部门名称" prop="group_name" class="user_name">
          <el-input
            v-model="formInfo.group_name"
            autocomplete="off"
            class=""
          ></el-input>
        </el-form-item>
        <el-form-item label="上级部门">
          <el-select v-model="formInfo.group_parent" placeholder="请选择">
            <el-option
              v-for="item in group_list"
              :key="item"
              :label="item.group_name"
              :value="item.group_parent_id"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="resetData" size="medium" type="danger"
          >取 消</el-button
        >
        <el-button type="success" size="medium" @click="addUser"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import Table from '../../components/Table.vue'
import {
  queryGroup,
  saveGroup,
  deleteGroup,
  updateGroup,
  groupUserName,
} from '../../utils/api'
import '@/css/branch.scss'
import Pagination from '../../components/Pagination.vue'
import Loading from '../../components/Loading.vue'
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
      headTitle: [
        { label: '部门名称', val: 'group_name' },
        { label: '上级部门', val: 'group_parent_name' },
      ],
      operate: ['编辑', '删除'],
      addDialog: false,
      user_id: '',
      loader: false,
      type: 'add',
      formInfo: {
        group_parent: '',
        group_name: '',
        group_id: '',
      } as any,
      rules: {
        group_name: [
          {
            validator: (rule: any, value: any, callback: any) => {
              if (!value) {
                callback(new Error('请输入部门名称'))
              } else {
                groupUserName({
                  group_name: value,
                  group_id: state.user_id,
                }).then(
                  (res: any) => {
                    if (res.errorCode != 1) {
                      callback(new Error(res.message))
                    } else {
                      callback()
                    }
                  },
                  (error) => {
                    ElNotification({
                      type: 'error',
                      title: '失败',
                      message: error.message,
                    })
                    methods.reset()
                  }
                )
              }
            },
            trigger: ['blur', 'change'],
          },
        ],
        group_parent: [
          {
            required: true,
            message: '请选择上级部门名称',
            trigger: ['blur', 'change'],
          },
        ],
      },
      multipleSelection: [] as any,
      form: {
        group_name: '',
      } as any,
      tableData: [] as any,
      group_list: [
        {
          group_name: '',
          group_parent_id: '',
        },
      ] as any,
      group_list_proxy: [
        {
          group_name: '',
          group_parent_id: '',
        },
      ] as any,
      page: {
        total: 10,
        pageSize: 10,
        pageNo: 1,
      },
      first_loader: false,
      middlePage: 1,
    })
    const getTable = function (bool: any, isMessage: any) {
      const data = {} as any
      data.pageNo = state.page.pageNo
      data.pageSize = state.page.pageSize
      if (bool) {
        data.key1 = state.form.group_name ? String(state.form.group_name) : null
      }
      queryGroup(data).then(
        (res: any) => {
          if (res.errorCode != 1) {
            proxy.$message.error(res.message)
            return
          }
          state.tableData = res.group_list
          state.page.total = res.sum

          if (res.group_list.length > 0) {
            state.group_list = res.group_list.map((v: any) => {
              //;
              return {
                group_name: v.group_name,
                group_parent_id: v.group_id,
              }
            })
          } else {
            state.group_list = [
              {
                group_name: '',
                group_parent_id: '',
              },
            ]
          }
          state.group_list_proxy = JSON.parse(JSON.stringify(state.group_list))
          state.loader = true
          if (!state.first_loader) {
            state.first_loader = true
          }
          state.middlePage = state.page.pageNo
          isMessage && proxy.$message.success(res.message)
        },
        (error) => {
          ElNotification({
            type: 'error',
            title: '失败',
            message: error.message,
          })
          methods.reset()
        }
      )
    }
    getTable(false, false)
    const methods = {
      def(type: any, val: any) {
        if (type == '编辑') {
          methods.handleClick(val)
        } else if (type == '删除') {
          methods.del(val)
        }
      },
      open() {
        proxy.$forceUpdate()
      },
      handleSizeChange(val: any) {
        state.loader = false
        state.page.pageSize = val
        state.page.pageNo = 1
        getTable(false, false)
      },
      add() {
        state.type = 'add'
        methods.reset()
        state.addDialog = true
        state.group_list = state.group_list_proxy
      },
      handleClick(res: any) {
        proxy.$nextTick(() => {
          state.type = '编辑'
          state.user_id = res.group_id
          state.formInfo.group_name = res.group_name
          state.formInfo.group_id = res.group_id
          state.group_list = state.group_list.map((v: any) => {
            if (v.group_name == res.group_name) {
              v.disabled = true
            } else {
              v.disabled = false
            }
            return v
          })
          if (res.group_parent_id) {
            state.formInfo.group_parent = res.group_parent_id
          } else {
            state.formInfo.group_parent = ''
          }
          state.addDialog = true
        })
      },
      multipleDelete() {
        let obj = [] as any
        obj = state.multipleSelection.map((v: any) => {
          return v.group_id
        })
        if (state.multipleSelection.length <= 0) {
          proxy.$message.warning('最少选择一条数据')
          return
        }
        proxy
          .$confirm('此操作将删除已选择数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            deleteGroup({
              id_list: obj,
            }).then(
              (res: any) => {
                if (res.errorCode != 1) {
                  proxy.$message.error(res.message)
                  return
                }
                proxy.$message.success(res.message)
                getTable(false, false)
              },
              (error) => {
                ElNotification({
                  type: 'error',
                  title: '失败',
                  message: error.message,
                })
                methods.reset()
              }
            )
          })
          .catch(() => {
            proxy.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
      resetData() {
        state.addDialog = false
        methods.reset()
      },
      resetSelect() {
        Object.keys(state.form).forEach((item) => {
          state.form[item] = null
        })
        getTable(false, false)
      },
      reset() {
        proxy.$refs['formDom'] && proxy.$refs['formDom'].resetFields()
        Object.keys(state.formInfo).forEach((item) => {
          state.formInfo[item] = null
        })
      },
      addUser() {
        proxy.$refs['formDom'].validate((valid: any) => {
          if (valid) {
            if (state.type == 'add') {
              //添加
              const obj = {} as any
              obj.group_name = state.formInfo.group_name
              obj.group_id = state.formInfo.group_parent
              saveGroup(obj).then(
                (res: any) => {
                  if (res.errorCode != 1) {
                    proxy.$message.error(res.message)
                    return
                  }
                  state.addDialog = false
                  methods.reset()
                  proxy.$message.success(res.message)
                  getTable(false, false)
                },
                (error) => {
                  ElNotification({
                    type: 'error',
                    title: '失败',
                    message: error.message,
                  })
                  methods.reset()
                }
              )
            } else {
              const newobj = {} as any
              newobj.group_name = state.formInfo.group_name
              newobj.group_id = state.formInfo.group_id
              newobj.group_parent_id = state.formInfo.group_parent
              updateGroup(newobj).then(
                (res: any) => {
                  if (res.errorCode != 1) {
                    proxy.$message.error(res.message)
                    return
                  }
                  state.addDialog = false
                  methods.reset()
                  proxy.$message.success(res.message)
                  getTable(false, false)
                },
                (error) => {
                  ElNotification({
                    type: 'error',
                    title: '失败',
                    message: error.message,
                  })
                  methods.reset()
                }
              )
            }
          } else {
            return false
          }
        })
      },
      handleSelectionChange(val: any) {
        //多删
        state.multipleSelection = val
      },
      del(v: any) {
        const id = v.group_id
        const obj = [] as any
        obj[0] = id
        proxy
          .$confirm('此操作将删除已选择数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            deleteGroup({
              id_list: obj,
            }).then(
              (res: any) => {
                if (res.errorCode != 1) {
                  proxy.$message.error(res.message)
                  return
                }
                proxy.$message.success(res.message)
                getTable(false, false)
              },
              (error) => {
                ElNotification({
                  type: 'error',
                  title: '失败',
                  message: error.message,
                })
                methods.reset()
              }
            )
          })
          .catch(() => {
            proxy.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
      getInvestInfo() {
        // state.group_list = state.group_list_proxy;
      },
      handleCurrentChange(val: number) {
        state.loader = false
        state.page.pageNo = val
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
