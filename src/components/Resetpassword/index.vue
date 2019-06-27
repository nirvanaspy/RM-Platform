<template>
  <div class="passwordWrapper">

    <el-dialog title="修改密码"
               :visible.sync="passwordDialog"
               width="400px"
               :before-close="resetfiles">
      <div slot="title"
           class="header-title"
           style="pading: 0 10px">
        <i class="el-icon-info"
           style="color:#E6A23C" />
        <span style="margin-left:20px">修改密码</span>
      </div>
      <el-form ref="ruleForm"
               :model="ruleForm"
               status-icon
               :rules="rules"
               label-width="80px"
               class="demo-ruleForm">
        <el-form-item label="密码"
                      prop="pass">
          <el-input v-model="ruleForm.pass"
                    type="password"
                    autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="checkPass">
          <el-input v-model="ruleForm.checkPass"
                    type="password"
                    autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary"
                     :loading="loading"
                     @click="submitForm('ruleForm')">确认</el-button>

        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { resetpassword } from '@/api/resetpassword'
export default {
  data() {
    // this.passwordDialog = this.passwordobj.show
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordDialog: false,
      loading: false,
      user_id: '',
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getShow(obj) {
      this.passwordDialog = obj.show
      this.user_id = obj.id
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const form = new FormData()
          form.append('password', this.ruleForm.pass)
          // form.append('userId', this.user_id)
          resetpassword(this.user_id, form).then((data) => {
            this.loading = false
            this.passwordDialog = false
            this.$notify({
              title: '成功',
              message: '密码更改完成',
              type: 'success'
            })
            console.log(data)
          }).catch(() => {
            this.loading = false
            this.$notify.error({
              title: '失败',
              message: '修改失败，请稍后重试'
            })
            console.log('error submit!!')
          })
        } else {
          this.loading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.passwordDialog = false
    },
    resetfiles(done) {
      this.$refs['ruleForm'].resetFields()
      done()
    }
  }
}
</script>
<style>
.passwordWrapper .el-dialog__body {
  padding: 30px 40px;
  color: #606266;
  font-size: 14px;
}
.passwordWrapper .el-form-item__label {
  text-align: center;
}
.passwordWrapper .el-form-item__content {
  text-align: center;
}
.passwordWrapper .el-form-item__error {
  left: 0;
}
</style>
