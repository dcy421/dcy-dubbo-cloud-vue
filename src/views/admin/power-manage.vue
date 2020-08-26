<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form ref="queryParams" :model="queryParams" inline label-width="80px" label-position="left">
      <el-form-item label="权限名称">
        <el-input v-model="queryParams.powName" clearable placeholder="请输入权限名称"/>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-button icon="el-icon-search" type="primary" @click="refresh()">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="addPower()">添加</el-button>
        <el-button icon="el-icon-delete" type="primary" @click="removeBatch()" :disabled="delBtnDisabled">删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <dcy-table
      ref="dcyTable"
      url="power/page"
      :columns="columns"
      :query-params="queryParams"
      @table-select-val="selectVal">
      <template slot-scope="{ row, index }" slot="powType">
        <el-tag type="success" v-if="row.powType === '0'">模块权限</el-tag>
        <el-tag type="error" v-if="row.powType === '1'">菜单权限</el-tag>
      </template>
      <template slot-scope="{ row, index }" slot="powStatus">
        <el-tag type="success" v-if="row.powStatus === '0'">正常</el-tag>
        <el-tag type="error" v-if="row.powStatus === '1'">禁用</el-tag>
      </template>
      <template slot-scope="{ row }" slot="action">
        <el-button @click="update(row)" type="text">修改</el-button>
        <el-button @click="remove(row)" type="text">删除</el-button>
        <el-button @click="authModule(row)" v-if="row.powType === '0'" type="text">授权模块</el-button>
        <el-button @click="authMenu(row)" v-if="row.powType === '1'" type="text">授权菜单</el-button>
      </template>
    </dcy-table>

    <!-- 添加表单 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      @close="handleReset('form')">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="权限名称" prop="powName">
          <el-input v-model="form.powName" placeholder="请输入权限名称"/>
        </el-form-item>
        <el-form-item label="权限类型" prop="powType">
          <el-select v-model="form.powType" placeholder="请输入权限类型" style="width: 100%">
            <template v-for="item in powerTypeOptionList">
              <el-option :value="item.dictValue" :label="item.dictLable"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="权限状态" prop="powStatus">
          <el-select v-model="form.powStatus" placeholder="请输入权限状态" style="width: 100%">
            <template v-for="item in statusOptionList">
              <el-option :value="item.dictValue" :label="item.dictLable"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <!-- 自定义按钮组 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleReset('form')">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 授权模块 -->
    <el-dialog
      title="授权模块"
      :visible.sync="dialogModuleShow"
      :close-on-click-modal="false"
      @close="dialogModuleShow = false">
      <el-tree
        :data="moduleData"
        node-key="moduleId"
        ref="dcyModuleTree"
        default-expand-all
        :default-checked-keys="defModuleIds"
        :props="{
          children: 'children',
          label: 'moduleName'
        }"
        show-checkbox/>
      <!-- 自定义按钮组 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModuleShow = false">取 消</el-button>
        <el-button type="primary" @click="saveAuthModule()">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 授权菜单 -->
    <el-dialog
      title="授权菜单"
      :visible.sync="dialogMenuShow"
      :close-on-click-modal="false"
      @close="dialogMenuShow = false">
      <el-tree
        ref="dcyMenuTree"
        :data="menuData"
        node-key="menuId"
        default-expand-all
        :default-checked-keys="defMenuIds"
        :props="{
          children: 'children',
          label: 'menuName'
        }"
        show-checkbox/>
      <!-- 自定义按钮组 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMenuShow = false">取 消</el-button>
        <el-button type="primary" @click="saveMenuModule()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import DcyTable from '@/components/dcy/dcy-table'
  import { addPower, deleteBatchPowerById, deletePowerById, updatePower } from '@/api/admin/power'
  import { MessageError, MessageSuccess, ConfirmCustom } from '@/libs/message'
  import { getDictByType } from '../../api/common'
  import { getModuleTreeList, getModuleTreeTableList } from '_a/admin/resource/module'
  import { saveAuthMenu, saveAuthModule } from '../../api/admin/power'
  import { getMenuTreeList, getMenuTreeTableList } from '../../api/admin/menu'

  export default {
    name: 'power-manage',
    components: { DcyTable },
    data() {
      return {
        columns: [
          { label: '权限名称', prop: 'powName' },
          { label: '权限类型', slot: 'powType' },
          { label: '权限状态', slot: 'powStatus' },
          { label: '备注', prop: 'remark' },
          { label: '操作', slot: 'action' }
        ],
        queryParams: {},
        dialogShow: false,
        dialogModuleShow: false,
        dialogMenuShow: false,
        delBtnDisabled: true,
        dialogTitle: '添加权限',
        form: {},
        ids:[],
        rules: {
          powName: [this.$ruler('权限名称')],
          powType: [this.$ruler('权限类型')],
          powStatus: [this.$ruler('权限状态')]
        },
        moduleData: [],
        defModuleIds:[],
        menuData: [],
        defMenuIds:[],
        powerId: null,
        statusOptionList: [],
        powerTypeOptionList: []
      }
    },
    methods: {
      /**
       * 刷新
       */
      refresh() {
        this.$refs.dcyTable.refresh()
      },
      /**
       * 重置搜索条件
       */
      reset() {
        this.queryParams = {}
      },
      /**
       * 添加弹出框
       */
      addPower() {
        this.dialogTitle = '添加权限'
        this.dialogShow = true
      },
      /**
       * 修改弹出框
       * @param row
       */
      update(row) {
        this.form = { ...row }
        this.dialogTitle = '修改权限'
        this.dialogShow = true
      },
      /**
       * 点击每一行的checkbox
       */
      selectVal(ids) {
        this.ids = ids.map(val => val['powerId'])
        this.delBtnDisabled = !this.ids.length
      },
      /**
       * 批量删除
       */
      removeBatch() {
        ConfirmCustom({ type: 'warning' }).then(() => {
          deleteBatchPowerById(this.ids).then(res => {
            if (res.data) {
              MessageSuccess('del')
            } else {
              MessageError('del')
            }
            this.refresh()
          })
        })
      },
      /**
       * 行内删除
       * @param row
       */
      remove(row) {
        ConfirmCustom({ type: 'warning' }).then(() => {
          deletePowerById(row.powId).then(res => {
            if (res.data) {
              MessageSuccess('del')
            } else {
              MessageError('del')
            }
            // 刷新表格
            this.refresh()
          })
        })
      },
      /**
       * 重置表单
       * @param name
       */
      handleReset(name) {
        this.dialogShow = false
        this.$refs[name].resetFields()
      },
      /**
       * 提交表单
       * @param name
       */
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.dialogTitle === '添加权限') {
              addPower(this.form).then(res => {
                if (res.data) {
                  MessageSuccess('add')
                } else {
                  MessageError('add')
                }
                this.cancelDialogAndRefresh()
              })
            } else {
              updatePower(this.form).then(res => {
                if (res.data) {
                  MessageSuccess('upd')
                } else {
                  MessageError('upd')
                }
                this.cancelDialogAndRefresh()
              })
            }
          }
        })
      },
      /**
       * 关闭弹出框 和 刷新表格
       */
      cancelDialogAndRefresh() {
        // 清空表单
        this.handleReset('form')
        // 刷新表格
        this.refresh()
      },
      /**
       * 授权模块
       * @param row
       */
      authModule(row) {
        this.powerId = row.powId
        this.dialogModuleShow = true;
        getModuleTreeList(this.powerId).then(res => {
          this.defModuleIds = res.data
        })
        getModuleTreeTableList().then(res =>{
          this.moduleData = res.data;
        })
      },
      saveAuthModule() {
        // 获取选中及半选节点
        let moduleIds = []
        this.$refs.dcyModuleTree.getCheckedNodes(false,true).forEach(e => {
          // 只取菜单类型得
          if (e.type === '1') {
            moduleIds.push(e.moduleId)
          }
        })
        let powerModuleDTO = {
          powerId: this.powerId,
          moduleIds: moduleIds
        }
        saveAuthModule(powerModuleDTO).then(res => {
          if (res.data) {
            MessageSuccess('upd')
          } else {
            MessageError('upd')
          }
          this.dialogModuleShow = false;
          // 刷新表格
          this.refresh()
        })
      },
      /**
       * 授权菜单
       * @param row
       */
      authMenu(row) {
        this.powerId = row.powId
        this.dialogMenuShow = true;
        getMenuTreeList(this.powerId).then(res => {
          this.defMenuIds = res.data
        })
        getMenuTreeTableList().then(res=>{
          this.menuData = res.data;
        })

      },
      saveMenuModule() {
        // 获取选中及半选节点
        let menuIds = []
        this.$refs.dcyMenuTree.getCheckedNodes(false,true).forEach(e => {
          // 只取菜单类型得
          if (e.type === '1') {
            menuIds.push(e.menuId)
          }
        })
        let powerMenuDTO = {
          powerId: this.powerId,
          menuIds: menuIds
        }
        saveAuthMenu(powerMenuDTO).then(res => {
          if (res.data) {
            MessageSuccess('upd')
          } else {
            MessageError('upd')
          }
          this.dialogMenuShow = false;
          // 刷新表格
          this.refresh()
        })
      }
    },
    mounted() {
      getDictByType('status').then(res => {
        this.statusOptionList = res.data
      })
      getDictByType('power_type').then(res => {
        this.powerTypeOptionList = res.data
      })
    }
  }
</script>

<style scoped lang="scss">

</style>
