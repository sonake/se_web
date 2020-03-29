<template>
  <el-dialog
    title="添加菜单"
    :visible.sync="dialogFormVisible"
    @close="dialogClose"
    width="40%">
    <!--内容主体区域-->
    <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
      <el-form-item label="菜单名" prop="menuName">
        <el-input v-model="addForm.menuName"></el-input>
      </el-form-item>
      <el-form-item label="路由" prop="path">
        <el-input v-model="addForm.path"></el-input>
      </el-form-item>
      <el-form-item label="组件" prop="component">
        <el-input v-model="addForm.component"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="perms">
        <el-input v-model="addForm.perms"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="addForm.icon"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="addForm.type">
          <el-radio label="0">菜单</el-radio>
          <el-radio label="1">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="父菜单" prop="parentId">
          <el-cascader
            ref="ecPid"
            v-model="addForm.parentId"
            @change="getCurrentNode"
            placeholder="请选择父级菜单"
            :props="{checkStrictly: true, value: 'id'}"
            :options="menuData"
            clearable>
          </el-cascader>
<!--        </el-select>-->
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input v-model="addForm.orderNum"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm">重置</el-button>
<!--    <el-button type="info" @click="addDialogVisible = false">取 消</el-button>-->
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'MenuAdd',
  props: {
    addDialogVisible: {
      default: false
    }
  },
  data () {
    return {
      menuData: [],
      addForm: {
        menuName: '',
        path: '',
        component: '',
        perms: '',
        icon: '',
        type: '1',
        parentId: '1',
        orderNum: ''
      },
      addRules: {
        menuName: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        perms: [
          { required: true, message: '请输入权限', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ]
      },
      menuInfo: {
        type: 0,
        menuName: ''
      },
      dialogFormVisible: false
    }
  },
  watch: {
    addDialogVisible(newVal, oldVal) {
      this.dialogFormVisible = newVal
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    getCurrentNode(val) {
      let nodesObj = this.$refs['ecPid'].getCheckedNodes()
      console.log(nodesObj[0].data.id)
    },
    // 获取菜单列表
    getMenuList() {
      this.$get('/system/menu', this.menuInfo).then(res => {
        if (res.data.code !== 200) return this.$msg.error('获取菜单失败！')
        this.menuData = res.data.data.list
        // console.log(this.menuData)
      })
    },
    handleSubmit() {
      let that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.$post('/system/menu', this.addForm).then(res => {
            if (res.status !== 200) {
              that.$emit('close')
              return that.$msg.error('新增菜单失败!')
            }
            that.$emit('success')
            that.resetForm()
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.addFormRef.resetFields()
    },
    dialogClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
