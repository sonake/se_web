<template>
  <el-dialog
    title="修改菜单"
    @close="dialogClose"
    :visible.sync="dialogFormVisible"
    width="40%">
    <!--内容主体区域-->
    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
      <el-form-item label="菜单名" prop="menuName">
        <el-input v-model="editForm.menuName"></el-input>
      </el-form-item>
      <el-form-item label="路由" prop="path">
        <el-input v-model="editForm.path"></el-input>
      </el-form-item>
      <el-form-item label="组件" prop="component">
        <el-input v-model="editForm.component"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="perms">
        <el-input v-model="editForm.perms"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="editForm.icon"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="editForm.type">
          <el-radio label="0">菜单</el-radio>
          <el-radio label="1">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="父菜单" prop="parentId">
        <!--        <el-select v-model="editForm.pId" multiple placeholder="请选择父级">-->
        <el-cascader
          v-model="editForm.parentId"
          placeholder="请选择父级菜单"
          :options="menuData"
          :props="{ checkStrictly: true, value: 'id' }"
          clearable>
        </el-cascader>
        <!--        </el-select>-->
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input v-model="editForm.orderNum"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm">重置</el-button>
      <!--    <el-button type="info" @click="editDialogVisible = false">取 消</el-button>-->
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'MenuEdit',
  props: {
    editDialogVisible: {
      default: false
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      editForm: {
        id: '',
        menuName: '',
        path: '',
        component: '',
        perms: '',
        icon: '',
        type: '0',
        parentId: '0',
        orderNum: ''
      },
      editRules: {
        menuName: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        perms: [
          { required: true, message: '请输入权限', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ]
      },
      menuData: []
    }
  },
  watch: {
    editDialogVisible(newVal, oldVal) {
      this.dialogFormVisible = newVal
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    // 获取菜单列表
    getMenuList() {
      this.$get('/system/menu', this.menuInfo).then(res => {
        if (res.data.code !== 200) return this.$msg.error('获取菜单失败！')
        this.menuData = res.data.data.list
        // console.log(this.menuData)
      })
    },
    // 查询需要修改的原始数据
    setFormValues(val) {
      // 表单数据
      let fields = []
      Object.keys(this.editForm).forEach((key) => {
        fields.push(key)
      })
      // console.log(fields)
      Object.keys(val).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.editForm[key] = val[key]
        }
        if (fields.indexOf('label')) {
          this.editForm.menuName = val['label']
        }
      })
      console.log(this.editForm)
    },
    handleSubmit() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          debugger
          this.$put('/system/menu', this.editForm).then(res => {
            // console.log(res)
            if (res.status !== 200) {
              this.$emit('close')
              return this.$msg.error('修改菜单失败!')
            }
            this.$emit('success')
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.editFormRef.resetFields()
    },
    dialogClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
