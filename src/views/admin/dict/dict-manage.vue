<template>
  <div class="app-container">

    <!-- 表格 -->
    <table-page
      ref="tablePage"
      :url="tableUrl"
      row-key="id"
      :page-ing-type="false"
      default-expand-all
      :check-box="false"
      :columns="columns">
      <template slot-scope="{ row }" slot="action">
        <el-button @click="addDict(row)" type="text">添加</el-button>
        <el-button @click="update(row)" type="text">修改</el-button>
        <el-button @click="remove(row)" v-if="row.children.length === 0" type="text">删除</el-button>
      </template>
    </table-page>

    <!-- 添加表单 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      @close="handleReset('form')">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父级名称" v-if="dialogTitle === '添加字典'">
          <el-input disabled v-model="form.parentName" placeholder="请输入父级名称"/>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType" v-if="addGroupType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" @input="change($event)"/>
        </el-form-item>
        <el-form-item label="字典名称" prop="dictLable">
          <el-input v-model="form.dictLable" placeholder="请输入字典名称"/>
        </el-form-item>
        <el-form-item label="字典键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入字典键值"/>
        </el-form-item>
        <el-form-item label="排序" prop="location">
          <el-input v-model="form.location" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="子类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入子类型" @input="change($event)"/>
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
  import {addDict, deleteDictById, updateDict} from '_a/admin/dict/dict'
  import {ConfirmCustom, MessageError, MessageSuccess} from '_l/message'
  import TablePage from "_c/CommonForm/table-page";

  export default {
    name: 'dict-manage',
    components: {TablePage },
    data() {
      const validateLocation = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入排序'));
        } else {
          callback();
        }
      };
      return {
        tableUrl:'/admin-center/dict/getDictTreeTableList',
        columns: [
          { label: '字典名称', prop: 'dictLabel',align:'left',width:'300'},
          { label: '字典键值', prop: 'dictValue' },
          { label: '排序', prop: 'dictSort' },
          { label: '子类型', prop: 'type' },
          { label: '操作', slot: 'action' }
        ],
        dialogShow: false,
        dialogTitle: '添加字典',
        form: {},
        rules: {
          dictLable: [this.$ruler('字典名称')],
          dictValue: [this.$ruler('字典键值')],
          dictType: [this.$ruler('字典类型')],
          location: [{validator: validateLocation, trigger: 'blur', required: true}],
          type: [this.$ruler('子类型')]
        },
        addGroupType:true
      }
    },
    methods: {
      change(e) {
        this.$forceUpdate()
      },
      /**
       * 刷新
       */
      refresh() {
        this.$refs.tablePage.refresh()
      },
      /**
       * 添加弹出框
       */
      addDict(row) {
        this.form = {};
        this.selTreeNode = {...row};
        this.dialogTitle = '添加字典';
        this.form.parentId = this.selTreeNode.id;
        this.form.parentName = this.selTreeNode.dictLable;
        let childList = [];
        if (this.selTreeNode.children){
          childList = this.selTreeNode.children
        }
        if (this.selTreeNode.dictType === 'all') {
          // 添加group
          this.addGroupType = true;
          this.form.type = '';
          this.form.dictType = '';
        } else {
          this.addGroupType = false;
          if (childList.length > 0){
            this.form.type = childList[0].type;
          }
          this.form.dictType = this.selTreeNode.dictType;
        }
        //
        if (this.selTreeNode.parentIds !== null){
          this.form.parentIds = this.selTreeNode.parentIds + ',' + this.selTreeNode.id;
        }else{
          this.form.parentIds = this.selTreeNode.id;
        }
        this.dialogShow = true;
      },
      /**
       * 修改弹出框
       * @param row
       */
      update(row) {
        this.form = { ...row }
        this.dialogTitle = '修改字典'
        this.dialogShow = true
      },
      /**
       * 行内删除
       * @param row
       */
      remove(row) {
        ConfirmCustom({ type: 'warning' }).then(() => {
          deleteDictById(row.id).then(res => {
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
            if (this.dialogTitle === '添加字典') {
              addDict(this.form).then(res => {
                if (res.data) {
                  MessageSuccess('add')
                } else {
                  MessageError('add')
                }
                this.cancelDialogAndRefresh()
              })
            } else {
              updateDict(this.form).then(res => {
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

    }
  }
</script>

<style scoped lang="scss">

</style>
