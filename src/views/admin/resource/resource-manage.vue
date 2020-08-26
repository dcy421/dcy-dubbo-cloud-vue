<template>
  <div class="app-container">

    <!-- 表格 -->
    <dcy-table
      ref="dcyTable"
      url="/admin-center/resources/getResourceTreeTableList"
      row-key="id"
      :page-ing-type="false"
      default-expand-all
      :check-box="false"
      :columns="columns">
      <template slot="resType" slot-scope="{row}">
        <el-tag type="primary" v-if="row.resType === '0'">模块</el-tag>
        <el-tag type="warning" v-if="row.resType === '1'">操作</el-tag>
      </template>
      <template slot="httpMethod" slot-scope="{row}">
        <el-tag type="primary" v-if="row.httpMethod === 'GET'">GET</el-tag>
        <el-tag type="warning" v-if="row.httpMethod === 'POST'">POST</el-tag>
      </template>
      <template slot="resStatus" slot-scope="{row}">
        <el-tag type="success" v-if="row.resStatus === '0'">正常</el-tag>
        <el-tag type="error" v-if="row.resStatus === '1'">禁用</el-tag>
      </template>
      <template slot-scope="{ row }" slot="action">
        <el-button @click="addResource(row)" type="text">添加</el-button>
        <el-button @click="update(row)" type="text">修改</el-button>
        <el-button @click="remove(row)" v-if="row.children.length === 0" type="text">删除</el-button>
      </template>
    </dcy-table>

    <!-- 添加表单 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      @close="handleReset('form')">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父级名称" v-if="dialogTitle === '添加模块'">
          <el-input disabled v-model="form.parentName" placeholder="请输入模块名称"/>
        </el-form-item>

        <el-form-item label="名称" prop="resName">
          <el-input v-model="form.resName" placeholder="请输入模块名称"/>
        </el-form-item>
        <el-form-item label="类型" prop="resType">
          <el-select v-model="form.resType" placeholder="请输入类型" style="width: 100%">
            <template v-for="item in moduleTypeOptionList">
              <el-option :value="item.dictValue" :label="item.dictLabel"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="resPath" v-if="form.resType === '1'">
          <el-input v-model="form.resPath" placeholder="请输入地址"/>
        </el-form-item>

        <el-form-item label="请求方式" prop="httpMethod" v-if="form.resType === '1'">
          <el-select v-model="form.httpMethod" placeholder="请输入请求方式" style="width: 100%">
            <template v-for="item in httpMethodOptionList">
              <el-option :value="item.dictValue" :label="item.dictLabel"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="resStatus">
          <el-select v-model="form.resStatus" placeholder="请输入状态" style="width: 100%">
            <template v-for="item in statusOptionList">
              <el-option :value="item.dictValue" :label="item.dictLabel"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"/>
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
  </div>
</template>

<script>
  import DcyTable from '_c/dcy/dcy-table'
  import {addResource, deleteResourceById, updateResource} from '_a/admin/resource/module'
  import {ConfirmCustom, MessageError, MessageSuccess} from '_l/message'
  import {mapActions} from "vuex";

  export default {
    name: 'resource-manage',
    components: { DcyTable },
    data() {
      return {
        columns: [
          { label: '名称', prop: 'resName', align: 'left', width: '400' },
          { label: '类型', slot: 'resType' },
          { label: '地址', prop: 'resPath' },
          { label: '请求方式', slot: 'httpMethod' },
          { label: '状态', slot: 'resStatus' },
          { label: '排序', prop: 'resSort' },
          { label: '操作', slot: 'action' }
        ],
        dialogShow: false,
        dialogTitle: '添加模块',
        form: {},
        rules: {
          resName: [this.$ruler('名称')],
          resPath: [this.$ruler('地址')],
          httpMethod: [this.$ruler('方式', 'change')],
          resStatus: [this.$ruler('状态', 'change')],
          type: [this.$ruler('类型', 'change')]
        },
        statusOptionList: [],
        httpMethodOptionList: [],
        moduleTypeOptionList: []
      }
    },
    methods: {
      ...mapActions(['getDictListByType']),
      /**
       * 刷新
       */
      refresh() {
        this.$refs.dcyTable.refresh()
      },
      /**
       * 添加弹出框
       */
      addResource(row) {
        this.form = {};
        if (row.resType === '1') {
          this.$message.error('操作类型下面不可以在添加子节点！')
        } else {
          this.selTreeNode = { ...row }
          this.dialogTitle = '添加模块'
          this.form.parentId = this.selTreeNode.id
          this.form.parentName = this.selTreeNode.resName
          this.form.parentIds = this.selTreeNode.parentIds + ',' + this.selTreeNode.id
          this.dialogShow = true
        }
      },
      /**
       * 修改弹出框
       * @param row
       */
      update(row) {
        this.form = { ...row }
        this.dialogTitle = '修改模块'
        this.dialogShow = true
      },
      /**
       * 行内删除
       * @param row
       */
      remove(row) {
        ConfirmCustom({ type: 'warning' }).then(() => {
          deleteResourceById(row.id).then(res => {
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
            if (this.dialogTitle === '添加模块') {
              addResource(this.form).then(res => {
                if (res.data) {
                  MessageSuccess('add')
                } else {
                  MessageError('add')
                }
                this.cancelDialogAndRefresh()
              })
            } else {
              updateResource(this.form).then(res => {
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
      }
    },
    mounted() {
      this.getDictListByType('status').then(res => {
        this.statusOptionList = res
      })
      this.getDictListByType('module_type').then(res => {
        this.moduleTypeOptionList = res
      })
      this.getDictListByType('http_method').then(res => {
        this.httpMethodOptionList = res
      })
    }
  }
</script>

<style scoped lang="scss">

</style>
