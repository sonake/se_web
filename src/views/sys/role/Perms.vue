<template>
  <el-drawer
    title="权限"
    @close="dialogClose"
    :direction="direction"
    :visible.sync="dialogFormVisible"
    width="40%">
    <!--内容主体区域-->
    <el-form ref="permFormRef" label-width="80px" class="demo-ruleForm">
      <div class="el-role-tree">
      <el-form-item label="权限" >
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
  </el-drawer>
</template>
<script>
export default {
  name: 'Perms',
  props: {
    permDialogVisible: {
      default: false
    }
  },
  data () {
    return {
      // 已经选中的权限id
      checkedArr: [],
      menus: [],
      direction: 'rtl',
      dialogFormVisible: false
    }
  },
  mounted() {
    this.initMenus()
  },
  watch: {
    permDialogVisible(newVal, oldVal) {
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
    setPermFormValues(role) {
      this.checkedArr = []
      // role.mids.split(',').forEach((item) => {
      //   this.checkedArr.push(parseInt(item))
      // })
      this.checkedArr = role.mids.split(',').map(item => parseInt(item))
    },
    // handleSubmit() {
    //   this.addForm.menuIds = this.handleCheckChange()
    //   this.$refs.editFormRef.validate(valid => {
    //     if (valid) {
    //       this.$put('/system/role', this.editForm).then(res => {
    //         console.log(res)
    //         if (res.status !== 200) {
    //           this.$emit('close')
    //           return this.$msg.error('修改用户失败!')
    //         }
    //         this.$emit('success')
    //       })
    //     } else {
    //       return false
    //     }
    //   })
    // },
    handleCheckChange() {
      let res = this.$refs.roleTree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        arr.push(item.id)
      })
      return arr
    },
    // resetForm() {
    //   this.$refs.editFormRef.resetFields()
    // },
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
    height: 500px;
    overflow: auto;
  }

</style>
