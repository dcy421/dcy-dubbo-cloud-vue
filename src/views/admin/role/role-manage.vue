<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form ref="queryParams" :model="queryParams" inline label-width="80px" label-position="left">
      <el-form-item label="角色名">
        <el-input v-model="queryParams.roleName" clearable placeholder="请输入角色名称"/>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-button icon="el-icon-search" type="primary" @click="refresh()">查询</el-button>
        <el-button icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="addRole()">添加</el-button>
        <el-button icon="el-icon-delete" type="primary" @click="removeBatch()" :disabled="delBtnDisabled">删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <table-page
      ref="tablePage"
      :url="tableUrl"
      :columns="columns"
      :query-params="queryParams"
      @table-select-val="selectVal">
      <template slot-scope="{ row, index }" slot="roleStatus">
        <el-tag type="success" v-if="row.roleStatus === '0'">正常</el-tag>
        <el-tag type="error" v-if="row.roleStatus === '1'">禁用</el-tag>
      </template>
      <template slot-scope="{ row }" slot="action">
        <el-button @click="update(row)" type="text">修改</el-button>
        <el-button @click="remove(row)" type="text">删除</el-button>
        <el-button @click="authModule(row)" type="text">授权</el-button>
      </template>
    </table-page>

    <!-- 添加表单 -->
    <el-dialog
      :label="dialogTitle"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      @close="handleReset('form')">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="form.roleKey" placeholder="请输入角色权限字符串"/>
        </el-form-item>
        <el-form-item label="状态" prop="roleStatus">
          <el-select v-model="form.roleStatus" placeholder="请输入角色状态" style="width: 100%">
            <template v-for="item in statusOptionList">
              <el-option :value="item.dictValue" :label="item.dictLabel"/>
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
        node-key="id"
        ref="moduleTree"
        default-expand-all
        :default-checked-keys="defModuleIds"
        :props="{
          children: 'children',
          label: 'resName'
        }"
        show-checkbox/>
      <!-- 自定义按钮组 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModuleShow = false">取 消</el-button>
        <el-button type="primary" @click="saveAuthModule()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addRole, deleteBatchRoleById, deleteRoleById, saveAuthResource, updateRole} from '_a/admin/role/role'
  import {ConfirmCustom, MessageError, MessageSuccess} from '_l/message'
  import {mapActions, mapGetters} from "vuex";
  import {getResourceTreeList, getResourceTreeTableList} from "_a/admin/resource/module";
  import TablePage from "_c/CommonForm/table-page";

  export default {
    name: 'role-manage',
    components: {TablePage },
    data() {
      return {
        tableUrl:'/admin-center/role/page',
        columns: [
          { label: '名称', prop: 'roleName' },
          { label: '权限字符', prop: 'roleKey' },
          { label: '状态', slot: 'roleStatus' },
          { label: '备注', prop: 'remark' },
          { label: '操作', slot: 'action' }
        ],
        queryParams: {},
        dialogShow: false,
        delBtnDisabled: true,
        dialogTitle: '添加角色',
        form: {},
        ids:[],
        rules: {
          roleName: [this.$ruler('角色名称')],
          roleKey: [this.$ruler('角色权限字符串'), {pattern: /^[A-Z_]{3,10}$/, message: '请输入大写字母或者下划线并且3-10个字符'}],
          roleStatus: [this.$ruler('角色状态')]
        },
        roleId: null,
        statusOptionList:[],

        dialogModuleShow: false,
        moduleData: [],
        defModuleIds:[],
      }
    },
    computed:{
      ...mapGetters(["userId"]),
    },
    methods: {
      ...mapActions(['getDictListByType']),
      /**
       * 刷新
       */
      refresh() {
        this.$refs.tablePage.refresh()
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
      addRole() {
        this.form = {};
        this.dialogTitle = '添加角色'
        this.dialogShow = true
      },
      /**
       * 修改弹出框
       * @param row
       */
      update(row) {
        this.form = { ...row }
        this.dialogTitle = '修改角色'
        this.dialogShow = true
      },
      /**
       * 点击每一行的checkbox
       */
      selectVal(ids) {
        this.ids = ids.map(val => val['id'])
        this.delBtnDisabled = !this.ids.length
      },
      /**
       * 批量删除
       */
      removeBatch() {
        ConfirmCustom({ type: 'warning' }).then(() => {
          deleteBatchRoleById(this.ids).then(res => {
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
          deleteRoleById(row.id).then(res => {
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
            if (this.dialogTitle === '添加角色') {
              addRole(this.form).then(res => {
                if (res.data) {
                  MessageSuccess('add')
                } else {
                  MessageError('add')
                }
                this.cancelDialogAndRefresh()
              })
            } else {
              updateRole(this.form).then(res => {
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
        this.roleId = row.id
        this.dialogModuleShow = true;
        getResourceTreeList(this.roleId).then(res => {
          this.defModuleIds = res.data
        })
        getResourceTreeTableList().then(res =>{
          this.moduleData = res.data;
        })
      },
      saveAuthModule() {
        // 获取选中及半选节点
        let resIds = []
        this.$refs.moduleTree.getCheckedNodes(false,false).forEach(e => {
          resIds.push(e.id)
        })
        let roleResourceDto = {
          userId: this.userId,
          roleId: this.roleId,
          resIds: resIds
        }
        saveAuthResource(roleResourceDto).then(res => {
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
    },
    mounted() {
      this.getDictListByType('status').then(res=>{
        this.statusOptionList = res
      })
    }
  }
</script>

<style scoped lang="scss">

</style>
