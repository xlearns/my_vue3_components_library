<template>
  <div class="resourceapp">
    <div class="operate">
      <div class="left">
        <div>
          <span class="label">App名称：</span>
          <el-input
            size="mini"
            v-model="form.key1"
            placeholder="请输入"
          ></el-input>
        </div>
        <div>
          <span class="label operation-time">App等级：</span>
          <el-select v-model="form.key2" size="mini" placeholder="请选择">
            <el-option
              v-for="item in user_level_option_new"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="right">
          <el-button type="primary" size="mini" @click="select">查询</el-button>
          <el-button size="mini" @click="reset(true)">重置</el-button>
        </div>
      </div>
    </div>
    <span class="delete" @click="showrecycle"></span>
    <div class="operate--bottom">
      <span class="all"></span>
      <div>
        <el-select v-model="form.key3" size="mini" placeholder="请选择排列方式">
          <el-option label="按导入时间排序" value="app_time"> </el-option>
          <el-option label="按名称排序" value="app_name"> </el-option>
          <el-option label="按等级排序" value="app_level"> </el-option>
        </el-select>
      </div>
      <el-button
        class="all_delete"
        type="danger"
        size="mini"
        @click="multipleDelete"
        >删除</el-button
      >
    </div>
    <div class="seleced">
      <span class="seleced_logo"></span>
      已勾选
      <span class="color_blue">&nbsp;{{ multipleSelection.length }}&nbsp;</span
      >项
    </div>
    <div class="content">
      <el-row :gutter="24" class="app_table">
        <el-col :span="6" @click="add">
          <div class="app_table__add box"><span></span>新增APP</div></el-col
        >
        <el-col
          :span="6"
          v-for="item in tableData"
          :key="item.app_id"
          @mouseover="app_mouseover(item)"
          @mouseleave="app_mouseenter(item)"
        >
          <div class="app_table__item box">
            <div class="app_table__item--left">
              <span
                class="logo"
                :style="{
                  background:
                    'url(data:image/gif;base64,' +
                    item.app_icon +
                    ')no-repeat left center/contain',
                }"
              ></span>
            </div>
            <div class="app_table__item--right">
              <h1 class="ellipsis" :title="item.app_name + item.app_version">
                {{ item.app_name }}
                <span class="color_99">v{{ item.app_version }}</span>
              </h1>
              <p class="mt8">
                导入时间：{{ new Date(item.app_time).toLocaleDateString() }}
              </p>
              <p class="flex mt8">
                <span class="logo"></span>等级：{{ item.app_level }}级
              </p>
            </div>
            <div class="check">
              <input
                type="checkbox"
                @mouseenter="app_mouseenter(item)"
                @click="onchecked(item)"
              />
            </div>
            <div class="modal animate__animated" v-show="item.show_modal">
              <div class="item" @click="checkDetail(item)">
                <span class="modal_logo modal_check"></span>
                <div class="textcenter">查看详情</div>
              </div>
              <div class="line"></div>
              <div class="item" @click="handleClick(item)">
                <div class="modal_logo modal_change"></div>
                <div class="textcenter">更改等级</div>
              </div>
              <div class="line"></div>
              <div class="item" @click="del(item)">
                <div class="modal_logo modal_remove"></div>
                <div class="textcenter">移除</div>
              </div>
            </div>
          </div></el-col
        >
      </el-row>
    </div>
    <!-- 上传app模态框 -->
    <el-dialog
      :title="
        type == 'add' ? '添加APP' : type === 'edit' ? '修改APP' : '查看APP'
      "
      v-model="addDialog"
      width="400px"
      @open="open"
    >
      <div v-if="type == 'add'">
        <div>
          <el-steps :active="addIndex" simple>
            <el-step title="步骤 1" icon="el-icon-edit"></el-step>
            <el-step title="步骤 2" icon="el-icon-upload"></el-step>
          </el-steps>
        </div>
        <!-- 步骤二 填等级 -->
        <div v-if="addIndex == 1">
          <el-form class="oform">
            <el-form-item label="app等级:">
              <el-select
                v-model="appLv"
                size="medium"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in user_level_option"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="上传方式">
							<el-radio-group v-model="way">
								<el-radio label="0">文件夹</el-radio>
								<el-radio label="1">文件</el-radio>
							</el-radio-group>
						</el-form-item> -->
            <el-form-item label="所属部门:">
              <el-select
                v-model="group_id"
                placeholder="请选择"
                multiple
                @change="selectAll"
              >
                <el-option label="全部" :value="0"> </el-option>
                <el-option
                  v-for="item in group_list"
                  :key="item"
                  :label="item.group_name"
                  :value="item.group_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <!-- 步骤二 上传 -->
        <el-upload
          v-else-if="way == 1"
          class="upload-demo"
          ref="upload"
          drag
          action="/api/app/upload"
          multiple
          name="files"
          accept=".apk"
          :data="{ app_level: appLv, group_id: JSON.stringify(group_id) }"
          :file-list="fileList"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :before-remove="beforeRemove"
          :on-error="onError"
        >
          <div v-if="isuploading">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </div>
          <!-- 进度条 -->
          <div class="loading_parent" v-else>
            <el-progress
              type="circle"
              :percentage="percentage"
              class="loading"
            ></el-progress>
          </div>

          <template #tip>
            <div class="el-upload__tip">只能上传 apk 文件</div>
          </template>
        </el-upload>
        <div v-else-if="way == 0">
          <el-upload
            class="folder"
            ref="folder"
            drag
            action="/api/app/upload"
            multiple
            name="files"
            accept=".apk"
            :data="{ app_level: appLv }"
            :file-list="fileList"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            :on-error="onError"
          >
            <div v-if="isuploading">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </div>
            <!-- 进度条 -->
            <div class="loading_parent" v-else>
              <el-progress
                type="circle"
                :percentage="percentage"
                class="loading"
              ></el-progress>
            </div>

            <template #tip>
              <div class="el-upload__tip">只能上传 apk 文件</div>
            </template>
          </el-upload>
        </div>
      </div>
      <div v-else>
        <el-form ref="formDom" :model="formInfo" label-width="80px">
          <el-form-item label="APP名称">
            <el-input v-model="formInfo.app_name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="版本号">
            <el-input
              v-model="formInfo.app_version"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="APP签名">
            <el-input
              v-model="formInfo.app_autograph"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="导入时间">
            <el-input v-model="formInfo.app_time" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="下载链接">
            <el-input v-model="formInfo.app_link" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="APP等级" v-if="type === 'edit'">
            <el-select
              v-model="formInfo.app_level"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in user_level_option"
                :key="item.value"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer class="dialog-footer">
        <div v-if="addIndex == 1 && type != 'edit' && type != 'check'">
          <el-button size="medium" type="success" @click="next"
            >下一步</el-button
          >
        </div>
        <div v-else>
          <el-button
            size="medium"
            type="danger"
            @click="cancelUpload"
            v-if="type !== 'check'"
            >取 消</el-button
          >
          <el-button
            type="success"
            size="medium"
            @click="submitUpload"
            v-if="type !== 'check'"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 回收站 -->
    <el-dialog title="回收站" v-model="recycleVisible">
      <el-table
        :data="recycleData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="date" label="序号">
          <template #="scope">
            {{ scope.$index + 1 }}
          </template></el-table-column
        >
        <el-table-column prop="app_name" label="APP名称"> </el-table-column>
        <el-table-column prop="expire_time" label="过期时间">
          <template #default="scope">
            {{ formattingTime(scope.row.expire_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="app_version" label="版本号"> </el-table-column>
        <el-table-column prop="app_autograph" label="APP签名">
        </el-table-column>
        <el-table-column prop="app_time" label="导入时间">
          <template #default="scope">
            {{ formattingTime(scope.row.app_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="app_link" label="下载链接"> </el-table-column>
        <el-table-column prop="app_level" label="APP等级"> </el-table-column>
        <el-table-column label="操作" width="50">
          <template #default="scope">
            <div class="obtn">
              <el-button @click="restore(scope.row)" type="text" size="small"
                >恢复</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="recycle_page.total"
        :pageSize="recycle_page.pageSize"
        :pageNo="recycle_page.pageNo"
        @handleCurrentChange="recycle_handleCurrentChange"
        @sizeChange="recycle_handleSizeChange"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
} from 'vue'
import {
  existUserName,
  saveUser,
  updateUser,
  getAllApp,
  deleteApp,
  updateApp,
  delRecycle,
  queryUserList,
} from '../../utils/api'
import '@/css/resourceapp.scss'
import Pagination from '../../components/Pagination.vue'
import Loading from '../../components/Loading.vue'
import { ElNotification } from 'element-plus'
export default defineComponent({
  components: {
    Pagination,
    Loading,
  },
  setup() {
    let timer: any
    const { proxy }: any = getCurrentInstance()
    const state = reactive({
      addIndex: 1,
      appLv: '',
      group_id: [],
      recycleSum: 0,
      way: '1',
      recycleData: [],
      seleced: 0,
      recycleVisible: false,
      fileType: 1 as any,
      fileList: [] as any,
      isuploading: true,
      addDialog: false,
      user_id: '',
      loader: false,
      ofile: null,
      type: 'add',
      formInfo: {} as any,
      percentage: 0,
      process_status: 'process',
      rules: {
        user_name: [
          {
            validator: (rule: any, value: any, callback: any) => {
              if (value === '') {
                callback(new Error('请输入用户姓名'))
              } else {
                existUserName({
                  user_name: value,
                  user_id: state.user_id,
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
            trigger: 'blur',
          },
        ],
      },
      multipleSelection: [] as any,
      form: {
        key1: '',
        key2: '',
        key3: '',
        key4: '',
        key5: '',
      } as any,
      user_level_option_new: ['全部', 1, 2, 3, 4, 5],
      user_level_option: [1, 2, 3, 4, 5],
      tableData: [] as any,
      group_list: [
        {
          group_id: '',
          group_name: '',
          group_description: null,
          group_level: '',
        },
      ] as any,
      page: {
        total: 1,
        pageSize: 100,
        pageNo: 1,
      },
      recycle_page: {
        total: 10,
        pageSize: 10,
        pageNo: 1,
      },
    })
    watch(
      () => state.addIndex,
      (count, prevCount) => {
        if (state.addIndex == 2 && state.way == '0') {
          setTimeout(() => {
            const input = document.querySelector('.el-upload__input') as any
            input.webkitdirectory = true
          })
        }
      }
    )
    const getTable = function (bool: any, isMessage: any) {
      const data = {} as any
      data.pageNo = state.page.pageNo
      data.pageSize = state.page.pageSize
      data.key4 = 0
      if (bool) {
        data.key1 = state.form.key1 ? String(state.form.key1) : null
        data.key3 = state.form.key3 ? String(state.form.key3) : null
        if (state.form.key2 && state.form.key2 != '全部') {
          data.key2 = String(state.form.key2)
        } else {
          data.key2 = null
        }
      }
      getAllApp(data).then(
        (res: any) => {
          if (res.errorCode != 1) {
            proxy.$message.error(res.message)
            return
          }
          state.tableData = res.app_list
          state.page.total = res.sum
          state.recycleSum = res.recycleSum
          state.loader = true
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
    const getRecycleTable = function () {
      const data = {} as any
      data.pageNo = state.recycle_page.pageNo
      data.pageSize = state.recycle_page.pageSize
      data.key4 = 1
      getAllApp(data).then(
        (res: any) => {
          if (res.errorCode != 1) {
            proxy.$message.error(res.message)
            return
          }
          state.recycleData = res.app_list
          state.recycle_page.total = res.sum
          state.loader = true
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
      app_mouseover(item: any) {
        clearInterval(timer)
        timer = setTimeout(() => {
          item.show_modal = true
        }, 200)
      },
      onchecked(res: any) {
        if (!res) return
        res.ischecked = !res.ischecked
        state.multipleSelection = state.tableData.filter((v: any) => {
          return v.ischecked
        })
      },
      app_mouseenter(item: any) {
        clearInterval(timer)
        item.show_modal = false
      },
      restore(val: any) {
        const { app_id } = val
        delRecycle({ app_id: app_id }).then((res: any) => {
          if (res.errorCode != 1) {
            return proxy.$message.error(res.message)
          }
          proxy.$message.success(res.message)
          getRecycleTable()
          getTable(false, false)
        })
      },
      showrecycle() {
        state.recycleVisible = true
        getRecycleTable()
      },
      handleCommand(val: any) {
        state.form.key3 = val
        getTable(true, true)
      },
      next() {
        if (!state.appLv) {
          return proxy.$message.warning('请先选择等级！')
        }
        state.addIndex = 2
      },
      onError(v: any) {
        // console.log(v);
      },
      formattingTime(time: any) {
        let result = ''
        if (time) {
          const data = new Date(time)
          const year = data.getFullYear()
          const month = data.getMonth()
          const day = data.getDate()
          result = `${year}/${month}/${day}`
        }
        return result
      },
      beforeRemove() {
        // proxy.$refs.upload.clearFiles();
      },
      cancelUpload() {
        //取消上传
        if (state.type == 'add') {
          proxy.$refs.upload?.abort && proxy.$refs.upload?.abort()
          proxy.$refs.upload?.clearFiles && proxy.$refs.upload?.clearFiles()
          state.addIndex = 1
          state.appLv = ''
          proxy.$message.warning('已取消上传！')
        } else {
          state.addDialog = false
        }
      },
      submitUpload() {
        if (state.type == 'add') {
          proxy.$refs.upload?.submit()
          proxy.$refs.folder?.submit()
          getTable(false, false)
        } else {
          const obj = {} as any
          obj.app_name = state.formInfo.app_name
          obj.app_id = state.formInfo.app_id
          obj.app_version = state.formInfo.app_version
          obj.app_level = state.formInfo.app_level
          obj.app_link = state.formInfo.app_link
          obj.app_autograph = state.formInfo.app_autograph
          updateApp(obj).then(
            (res: any) => {
              if (res.errorCode != 1) {
                proxy.$message.error(res.message)
                return
              }
              state.addDialog = false
              proxy.$message.success(res.message)
              getTable(false, false)
            },
            (error: any) => {
              const result = error.message ? error.message : '失败'
              proxy.$message.error(result)
            }
          )
        }
      },
      beforeUpload(file: any) {
        const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const extension = testmsg === 'apk'
        if (!extension) {
          proxy.$message({
            message: '上传文件只能是 apk格式!',
            type: 'warning',
          })
          return false
        }
        return true
      },
      open() {
        proxy.$forceUpdate()
      },
      recycle_handleSizeChange(val: any) {
        state.recycle_page.pageSize = val
        state.recycle_page.pageNo = 1
        getRecycleTable()
      },
      handleSizeChange(val: any) {
        state.page.pageSize = val
        state.page.pageNo = 1
        getTable(false, false)
      },
      add() {
        state.type = 'add'
        state.addDialog = true
      },
      checkDetail(res: any) {
        state.type = 'check'
        state.addDialog = true
        state.formInfo.app_name = res.app_name
        state.formInfo.app_version = res.app_version
        state.formInfo.app_time = methods.formattingTime(res.app_time)
        state.formInfo.app_link = res.app_link
        state.formInfo.app_autograph = res.app_autograph
      },
      handleClick(res: any) {
        state.type = 'edit'
        state.addDialog = true
        state.formInfo.app_name = res.app_name
        state.formInfo.app_id = res.app_id
        state.formInfo.app_version = res.app_version
        state.formInfo.app_time = methods.formattingTime(res.app_time)
        state.formInfo.app_level = res.app_level
        state.formInfo.app_link = res.app_link
        state.formInfo.app_autograph = res.app_autograph
      },
      init() {
        state.multipleSelection = []
        state.tableData = state.tableData.map((v: any) => {
          v.ischecked = false
          return v
        })
      },
      multipleDelete() {
        //多删
        let obj = [] as any
        obj = state.multipleSelection.map((v: any) => {
          return v.app_id
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
            deleteApp({
              id_list: obj,
            }).then(
              (res: any) => {
                if (res.errorCode != 1) {
                  proxy.$message.error(res.message)
                  return
                }
                proxy.$message.success(res.message)
                getTable(false, false)
                methods.init()
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
      },
      addUser() {
        proxy.$refs['formDom'].validate((valid: any) => {
          if (valid) {
            if (state.type == 'add') {
              //添加
              const obj = {} as any
              obj.user_name = state.formInfo.user_name
              obj.group_id = state.formInfo.group_id
              obj.super_sim_card = state.formInfo.super_sim_card
              obj.user_level = state.formInfo.user_level
              saveUser(obj).then(
                (res: any) => {
                  if (res.errorCode != 1) {
                    proxy.$message.success(res.message)
                    return
                  }
                  proxy.$refs['formDom'] && proxy.$refs['formDom'].resetFields()
                  state.addDialog = false
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
              updateUser(state.formInfo).then(
                (res: any) => {
                  if (res.errorCode != 1) {
                    proxy.$message.success(res.message)
                    return
                  }
                  proxy.$refs['formDom'] && proxy.$refs['formDom'].resetFields()
                  state.addDialog = false
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
        const id = v.app_id
        const obj = [] as any
        obj[0] = id
        proxy
          .$confirm('此操作将删除已选择数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            deleteApp({
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
      recycle_handleCurrentChange(val: number) {
        state.recycle_page.pageNo = val
        getRecycleTable()
      },
      handleCurrentChange(val: number) {
        state.page.pageNo = val
        getTable(true, false)
      },
      reset(kg = false) {
        proxy.$refs['formDom'] && proxy.$refs['formDom'].resetFields()
        Object.keys(state.form).forEach((item) => {
          state.form[item] = null
        })
        if (!kg) return
        getTable(false, false)
      },
      select() {
        getTable(true, true)
      },
      getGroupList() {
        queryUserList({
          pageSize: 10,
          pageNo: 1,
        }).then((res) => {
          state.group_list = res.group_list
        })
      },
      selectAll(val: any) {
        if (val.includes(0)) {
          state.group_id = state.group_list.map((item: any) => {
            return item.group_id
          })
        }
      },
    }
    methods.getGroupList()
    return { ...toRefs(state), ...methods }
  },
})
</script>
<style scoped>
.table_content {
  display: flex;
  flex-wrap: wrap;
}
.table_content_item {
  display: flex;
  align-items: center;
  padding: 5px;
  margin: 15px;
  width: 22%;
  height: 100px;
  background: inherit;
  background-color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(236, 128, 141, 1);
  border-radius: 20px;
  cursor: pointer;
}
.table_content_item--logo {
  display: inline-block;
  background: url(../../assets/android.png) no-repeat left top/contain;
  width: 60px;
  height: 60px;
}
.table_content_item:hover {
  background: rgba(236, 128, 141, 0.1);
}
.color-level-five {
  border-color: rgba(236, 128, 141, 1);
}
.color-level-five:hover {
  border-color: rgba(236, 128, 141, 0.1);
}
.color-level-four {
  border-color: rgba(128, 128, 255, 1);
}
.color-level-four:hover {
  border-color: rgba(128, 128, 255, 0.1);
}
.color-level-three {
  border-color: rgba(202, 249, 130, 1);
}
.color-level-three:hover {
  border-color: rgba(202, 249, 130, 0.1);
}
.color-level-two {
  border-color: rgba(255, 255, 128, 1);
}
.color-level-two:hover {
  border-color: rgba(255, 255, 128, 0.1);
}
.color-level-one {
  border-color: rgba(215, 215, 215, 1);
}
.color-level-one:hover {
  border-color: rgba(215, 215, 215, 0.1);
}
</style>
