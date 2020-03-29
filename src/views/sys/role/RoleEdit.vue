<template>
  <el-drawer
    title="修改角色"
    @close="dialogClose"
    :direction="direction"
    :visible.sync="dialogFormVisible"
    width="40%">
    <!--内容主体区域-->
    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="editForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="是否禁用" prop="status">
        <el-switch
          v-model="editForm.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <div class="el-role-tree">
      <el-form-item label="权限" prop="menuIds">
        <el-tree
          ref="roleTree"
          :data="menus"
          show-checkbox
          node-key="id"
          @check-change="handleCheckChange"
          :default-checked-keys="checkedArr"
          :default-expand-all="true">
        </el-tree>
      </el-form-item>
      </div>
    </el-form>
    <el-card>
    <el-button @click="resetForm">重置</el-button>
<!--    <el-button type="info" @click="addDialogVisible = false">取 消</el-button>-->
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-card>
  </el-drawer>
</template>
<script>
export default {
  name: 'roleEdit',
  props: {
    editDialogVisible: {
      default: false
    }
  },
  data () {
    return {
      // 已经选中的权限id
      checkedArr: [],
      menus: [],
      direction: 'rtl',
      dialogFormVisible: false,
      editForm: {
        id: '',
        roleName: '',
        status: '',
        menuIds: []
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.initMenus()
  },
  watch: {
    editDialogVisible(newVal, oldVal) {
      this.dialogFormVisible = newVal
    }
  },
  methods: {
    // 获取权限树
    initMenus() {
      this.$get('/system/menu').then(res => {
        if (res.data.code !== 200) {
          return this.$msg(res.data.msg)
        }
        this.menus = res.data.data.list
      })
    },
    // 查询需要修改的原始数据
    setFormValues(role) {
      // 表单数据
      let fields = []
      Object.keys(this.editForm).forEach((key) => {
        fields.push(key)
      })
      Object.keys(role).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.editForm[key] = role[key]
        }
      })
      this.checkedArr = []
      // role.mids.split(',').forEach((item) => {
      //   this.checkedArr.push(parseInt(item))
      // })
      this.checkedArr = role.mids.split(',').map(item => parseInt(item))
    },
    handleSubmit() {
      this.editForm.menuIds = this.handleCheckChange()
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$put('/system/role', this.editForm).then(res => {
            // console.log(res)
            if (res.status !== 200) {
              this.$emit('close')
              return this.$msg.error('修改用户失败!')
            }
            this.$emit('success')
          })
        } else {
          return false
        }
      })
    },
    handleCheckChange() {
      let res = this.$refs.roleTree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        arr.push(item.id)
      })
      return arr
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
  .el-card{
    position:absolute;
    bottom:0;
    /*padding-right: 0;*/
    width:100%;
    height:100px;
  }
  .el-role-tree{
    height: 300px;
    overflow: auto;
  }

</style>
