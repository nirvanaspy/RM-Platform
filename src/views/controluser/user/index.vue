<template>
  <div>
    <div style="margin: 20px 40px 0 40px">
      <el-button type="primary"
                 icon="el-icon-plus"
                 @click="adduser">新增用户</el-button>
    </div>
    <div class="userWrapper">

      <el-table v-loading="listLoading"
                :data="tableData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                max-height="600">
        <el-table-column label="身份"
                         prop="roleEntities[0].name"
                         align="center" />
        <el-table-column label="用户名"
                         prop="username"
                         align="center" />
        <el-table-column label="密级"
                         prop="securityClassification"
                         align="center" />
        <el-table-column label="部门">
          <template slot-scope="scope">
            {{ scope.row.department?scope.row.department.name:'暂无' }}
          </template>
        </el-table-column>
        <el-table-column label="身份认证"
                         prop="authorities[0].authority"
                         align="center" />
        <el-table-column label="操作"
                         width="300"
                         align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini"
                       type="primary"
                       @click="handlepassword(scope.$index, scope.row)">密码</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog id="identy"
                 title="用户"
                 :visible.sync="adduserDialog"
                 width="500px"
                 class="userdialog">
        <div slot="title"
             class="header-title"
             style="pading: 0 10px">
          <i v-if="editorflag"
             class="el-icon-info"
             style="color:#E6A23C" />
          <i v-if="!editorflag"
             class="el-icon-circle-plus"
             style="color:#35affb" />
          <span style="margin-left:20px">{{ editorflag?'编辑用户':'添加用户' }}</span>
        </div>
        <el-form ref="ruleForm"
                 :model="ruleForm"
                 :rules="rules"
                 label-width="100px"
                 class="demo-ruleForm">
          <el-form-item v-if="!editorflag"
                        label="用户名"
                        prop="name">
            <el-input v-model="ruleForm.name"
                      style="width: 300px;" />
          </el-form-item>
          <el-form-item label="权限"
                        prop="limite">
            <el-select v-model="ruleForm.limite"
                       placeholder="请设置权限"
                       style="width: 300px;">
              <el-option label="普通用户"
                         value="user" />
              <el-option label="审计员"
                         value="audit" />
              <el-option label="安全员"
                         value="security" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="密级"
                        prop="secrelever">
            <el-select v-model="ruleForm.secrelever"
                       placeholder="选择密级"
                       style="width: 300px;">
              <el-option label="一级"
                         value="1" />
              <el-option label="二级"
                         value="2" />
              <el-option label="三级"
                         value="3" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="部门"
                        prop="department">
            <el-select v-model="ruleForm.department"
                       placeholder="请选择部门"
                       style="width: 300px;">
              <el-option v-for="item in getdepartmentlist"
                         :key="item.index"
                         :label="item.name"
                         :value="item.name" />
            </el-select>
          </el-form-item>

          <el-form-item label="登录密码"
                        prop="password">
            <el-input v-model="ruleForm.password"
                      style="width: 300px;"
                      type="password" />
          </el-form-item>
          <el-form-item label="确认密码"
                        prop="repassword">
            <el-input v-model="ruleForm.repassword"
                      style="width: 300px;"
                      type="password" />
          </el-form-item>
          <el-form-item label="职责描述"
                        prop="desc">
            <el-input v-model="ruleForm.desc"
                      type="textarea"
                      style="width: 300px;" />
          </el-form-item>
          <el-form-item style="margin-top:10px">
            <el-button @click="resetForm('ruleForm')">取消</el-button>
            <el-button type="primary"
                       :loading="creatLoading"
                       @click="submitForm('ruleForm')">{{ editorflag?'确认':'创建用户' }}</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>
      <el-dialog id="editor"
                 title="用户"
                 :visible.sync="editorDialog"
                 width="500px"
                 class="userdialog">
        <div slot="title"
             class="header-title"
             style="pading: 0 10px">
          <i v-if="editorflag"
             class="el-icon-info"
             style="color:#E6A23C" />
          <span style="margin-left:20px">编辑用户</span>
        </div>
        <el-form ref="ruleForm"
                 :model="ruleForm"
                 :rules="rules"
                 label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="权限"
                        prop="limite">
            <el-select v-model="ruleForm.limite"
                       placeholder="请设置权限"
                       style="width: 300px;">
              <el-option label="普通用户"
                         value="user" />
              <el-option label="审计员"
                         value="audit" />
              <el-option label="安全员"
                         value="security" />
            </el-select>
          </el-form-item>
          <el-form-item label="部门"
                        prop="department">
            <el-select v-model="ruleForm.department"
                       placeholder="请选择部门"
                       style="width: 300px;">
              <el-option v-for="item in getdepartmentlist"
                         :key="item.index"
                         :label="item.name"
                         :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top:10px">
            <el-button @click="resetForm('ruleForm')">取消</el-button>
            <el-button type="primary"
                       :loading="creatLoading"
                       @click="esubmitForm('ruleForm')">确认</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>
      <el-dialog title="警告"
                 :visible.sync="centerDialogVisible"
                 width="400px"
                 center>
        <div slot="title"
             class="header-title">
          <i class="el-icon-warning"
             style="color:red" />
          <span style="margin-left:10px">警告</span>
        </div>
        <span>你将要删除用户{{ username }}</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     :loading="loading"
                     @click="sureCommit">确 定</el-button>
        </span>
      </el-dialog>
      <reset-password ref="pass" />
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :size.sync="listQuery.size"
                  @pagination="getList" />
    </div>
  </div>

</template>
<script>
import resetPassword from '@/components/Resetpassword/index'
import Pagination from '@/components/Pagination'
import { deletuser, getuserlist, getdepartment, adduser, edituser } from '@/api/user'
import qs from 'qs'
export default {
  components: {
    resetPassword,
    Pagination
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.repassword !== '') {
          this.$refs.ruleForm.validateField('repassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      search: '',
      centerDialogVisible: false,
      adduserDialog: false,
      editorDialog: false,
      editorflag: false,
      loadingeditor: false,
      loading: false,
      passwordobj: {},
      username: '',
      deletuser_id: null,
      creatLoading: false,
      getdepartmentlist: [],
      edituser_id: '',
      ruleForm: {
        name: '',
        limite: '',
        // secrelever: '',
        password: '',
        repassword: '',
        desc: '',
        department: ''
      },
      rules: {
        name: [
          { required: true, message: '用户户名', trigger: 'blur' },
          { min: 2, max: 14, message: '长度在 6 到 14 个字符', trigger: 'blur' }
        ],
        limite: [
          { required: true, message: '设置权限', trigger: 'change' }
        ],
        secrelever: [
          { required: true, message: '设置密级', trigger: 'change' }
        ],
        password: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        repassword: [
          { validator: validatePass2, required: true, trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填职责', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '设置部门', trigger: 'change' }
        ]
      },
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 5,
        paged: true
      }
    }
  },
  created() {
    this.getList()
    // this.total = 1
  },
  methods: {
    getList() {
      this.listLoading = true
      //  console.log(this.listQuery)
      // const that = this
      var obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.page = obj.page - 1
      getuserlist(obj).then((res) => {
        this.total = res.data.data.totalElements
        this.tableData = res.data.data.content
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        throw new Error('数据请求失败')
      })
    },
    sureCommit() {
      this.loading = true
      deletuser(this.deletuser_id).then(() => {
        this.centerDialogVisible = false
        this.loading = false
        this.$message({
          message: '删除成功',
          showClose: true,
          center: true,
          type: 'success'
        })
        this.getList()
      }).catch((data) => {
        this.loading = false
        this.$message({
          message: data.message,
          showClose: true,
          center: true,
          type: 'error'
        })
      })
    },
    editorsure() {
      this.loadingeditor = true
    },
    adduser() {
      this.editorflag = false
      this.adduserDialog = true
      getdepartment().then((data) => {
        this.getdepartmentlist = data.data.data.content
      })
    },
    handleEdit(index, row) {
      this.editorDialog = true
      this.editorflag = true
      if (this.getdepartmentlist.length === 0) {
        getdepartment().then((data) => {
          this.getdepartmentlist = data.data.data.content
        })
      }
      this.edituser_id = row.id
    },
    esubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creatLoading = true
          const obj = {
            'departmentName': this.ruleForm.department,
            'roleEntities': this.ruleForm.limite
          }
          edituser(this.edituser_id, qs.stringify(obj)).then(() => {
            this.creatLoading = false
            this.editorDialog = false
            this.$message({
              message: '修改成功',
              showClose: true,
              center: true,
              type: 'success'
            })
            this.getList()
          }).catch((data) => {
            this.creatLoading = false
            this.$message({
              message: data.data.message,
              showClose: true,
              center: true,
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    /**
     * 修改列表用户的密码
     * @param {number} index
     * @param {object} row
     */
    handlepassword(index, row) {
      this.passwordobj.show = true
      this.passwordobj.id = row.id
      this.$refs.pass.getShow(this.passwordobj)
    },
    handleDelete(index, row) {
      this.centerDialogVisible = true
      this.username = row.username
      this.deletuser_id = row.id
      // this.updatetable(row.id)
      // console.log(index, row)
    },
    updatetable(id) {
      this.tableData = this.tableData.filter((value, index) => {
        return value.id !== id
        // if (value.id === id) {
        //   this.tableData.splice(index, 1)
        // }
      })
    },
    /**
     * 添加用户
     * @param {string} formName
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creatLoading = true
          const obj = {
            'username': this.ruleForm.name,
            'password': this.ruleForm.password,
            'departmentName': this.ruleForm.department,
            'roleEntities': this.ruleForm.limite
          }
          adduser(qs.stringify(obj)).then(() => {
            this.creatLoading = false
            this.adduserDialog = false
            this.$message({
              message: '添加成功',
              showClose: true,
              center: true,
              type: 'success'
            })
            this.getList()
          }).catch((data) => {
            this.creatLoading = false
            this.$message({
              message: data.data.message,
              showClose: true,
              center: true,
              type: 'error'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.adduserDialog = false
      this.loading = false
      this.creatLoading = false
      this.editorDialog = false
      this.$refs[formName].resetFields()
    }

  }
}
</script>
<style>
.userWrapper {
  margin: 20px 40px 0 40px;
  border: 1px solid #5a5f6561;
  overflow: hidden;
  border-radius: 8px;
}
.userWrapper .el-dialog {
  transform: none;
  left: 0;
  position: relative;
  margin: 0 auto;
  border-radius: 10px;
}
.userWrapper #identy .el-dialog__body {
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
}
.userWrapper .el-form-item__content {
  text-align: center;
}
.userWrapper .userdialog .el-form-item__error {
  left: 30px;
}
</style>
