<template>
  <div v-if="dialogFormVisible"
       class="limitsWrapper">
    <el-dialog title="修改权限"
               :visible.sync="dialogFormVisible"
               width="500px">
      <div slot="title"
           class="header-title"
           style="pading: 0 10px">
        <i class="el-icon-edit"
           style="color:#409EFF" />
        <span style="margin-left:10px">修改权限</span>
      </div>
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules">
        <!-- <el-form-item label="身份"
                      :label-width="formLabelWidth"
                      prop="identity">
          <el-select v-model="ruleForm.identity"
                     placeholder="设置身份"
                     style="width:250px">
            <el-option label="管理员"
                       value="管理员" />
            <el-option label="普通用户"
                       value="普通用户" />
            <el-option label="密保员"
                       value="密保员" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="密级"
                      :label-width="formLabelWidth"
                      prop="level">
          <el-select v-model="ruleForm.level"
                     placeholder="选择密级"
                     style="width:250px">
            <el-option label="公开"
                       value="0" />
            <el-option label="秘密"
                       value="1" />
            <el-option label="机密"
                       value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"
                   :loading="loading"
                   @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { reditsecurity } from '@/api/user'
export default {
  data() {
    return {
      ruleForm: {
        identity: '',
        level: ''
      },
      rules: {
        identity: [
          { required: true, message: '选择身份', trigger: 'change' }
        ],
        level: [
          { required: true, message: '设置密级', trigger: 'change' }
        ]
      },
      formLabelWidth: '100px',
      dialogFormVisible: false,
      loading: false,
      user_id: ''
    }
  },
  methods: {
    cancel() {
      this.$refs['ruleForm'].resetFields()
      this.dialogFormVisible = false
      this.loading = false
      this.$message({
        message: '已取消',
        type: 'success'
      })
    },
    submit() {
      console.log(this.form)
      this.loading = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const obj = { 'securityClassification': this.ruleForm.level }
          reditsecurity(this.user_id, obj).then(() => {
            this.loading = false
            this.$message({
              message: '修改完成',
              type: 'success',
              center: true
            })
            this.$refs['ruleForm'].resetFields()
            this.dialogFormVisible = false
          }).catch((data) => {
            this.loading = false
            this.$message({
              message: data.message,
              type: 'error',
              center: true
            })
          })
        } else {
          this.loading = false
          this.$message({
            message: '验证失败',
            type: 'error',
            center: true
          })
          return false
        }
      })
    },
    isshow(flag, id) {
      this.dialogFormVisible = flag
      this.user_id = id
    }
  }
}
</script>
<style>
.limitsWrapper {
  overflow: hidden;
}
.limitsWrapper .el-dialog {
  border-radius: 10px;
}
</style>
