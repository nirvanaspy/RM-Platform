<template slot-scope="scope">
  <div class="departmentWrapper">
    <el-tabs v-model="activeName"
             type="card">
      <el-tab-pane label="部门管理"
                   name="first">
        <div style="margin: 20px 40px 0 40px">
          <p>
            <el-button type="primary"
                       icon="el-icon-plus"
                       style="margin-left:50px"
                       @click="add">新增部门</el-button>
          </p>
          <el-dialog :title="change"
                     :visible.sync="dialogVisible"
                     style="font-size:25px;color:rgb(24,144,255)">
            <p>部门名称：</p>
            <p>
              <el-input v-model="input"
                        placeholder="请输入内容"
                        @input="errHide1" />
              <el-alert v-show="inpflag2"
                        title="您输入的内容为空"
                        type="error"
                        show-icon />
            </p>
            <p>部门职责描述：</p>
            <p>
              <el-input v-model="textarea"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        @input="errHide" />
              <el-alert v-show="inpflag3"
                        title="您输入的内容为空"
                        type="error"
                        show-icon />
            </p>
            <span slot="footer"
                  class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary"
                         :loading="truebtn"
                         @click="setVal">确 定</el-button>
            </span>
          </el-dialog>
          <el-dialog title="部门编辑"
                     :visible.sync="dialog2Visible"
                     style="font-size:25px;color:rgb(24,144,255)">
            <p>部门名称：</p>
            <p>
              <el-input v-model="input1"
                        placeholder="请输入内容"
                        @input="errHide" />
              <el-alert v-show="inpflag"
                        title="您输入的内容为空"
                        type="error"
                        show-icon />
            </p>
            <p>部门职责描述：</p>
            <p>
              <el-input v-model="textarea1"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        @input="errHide" />
              <el-alert v-show="inpflag1"
                        title="您输入的内容为空"
                        type="error"
                        show-icon />
            </p>
            <span slot="footer"
                  class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary"
                         :loading="truebtn"
                         @click="editVal">确 定</el-button>
            </span>
          </el-dialog>

        </div>
        <el-table :data="tableData"
                  style="width: 90%;margin:0 auto;border-radius:15px"
                  border>
          <el-table-column prop="name"
                           label="部门"
                           width="180" />
          <el-table-column prop="description"
                           label="部门职责" />

          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary"
                         size="mini"
                         @click="edit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini"
                         type="danger"
                         @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="部门分配"
                   name="second">
        <el-table v-loading="listLoading"
                  :data="departData"
                  style="width: 90%;margin:0 auto;border-radius:15px"
                  border>
          <el-table-column label="用户姓名"
                           prop="username"
                           width="180" />
          <el-table-column label="部门">
            <template slot-scope="scope">
              {{ scope.row.department?scope.row.department.name:'暂无' }}
            </template>
          </el-table-column>
          <el-table-column label="部门划分">
            <template slot-scope="scope">
              <el-button type="primary"
                         :plain="true"
                         size="mini"
                         @click="makeSure(scope.$index, scope.row)">划分部门</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0"
                    :total="total"
                    :page.sync="listQuery.page"
                    :size.sync="listQuery.size"
                    @pagination="getUsers" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="部门划分"
               :visible.sync="dialog3Visible"
               width="35%"
               style="textAlign:center">
      <el-select v-model="value"
                 placeholder="请选择">
        <el-option v-for="item in tableData"
                   :key="item.value"
                   :label="item.name"
                   :value="item.id" />
      </el-select>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cancelDepart">取 消</el-button>
        <el-button type="primary"
                   :loading="truebtn"
                   @click="setDepart">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import {
  getDepart,
  deleteDepart,
  updateDepart,
  addDepart,
  setDepartment
} from '@/api/department'
import { getuserlist } from '@/api/user'
import qs from 'qs'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dialogVisible: false,
      dialog2Visible: false,
      dialog3Visible: false,
      input: '',
      textarea: '',
      input1: '',
      listLoading: true,
      textarea1: '',
      activeName: 'first',
      search: '',
      change: '添加部门',
      index: '',
      index1: '',
      label: '',
      total: 0,
      name1: '',
      truebtn: false,
      duty: '',
      id: '',
      userid: '',
      data: {},
      inpflag: false,
      inpflag1: false,
      inpflag2: false,
      inpflag3: false,
      departmentId: null,
      departId: null,
      departs: [
        {
          value: 'softDev',
          label: '软件开发部'
        },
        {
          value: 'personres',
          label: '人力资源部'
        },
        {
          value: 'finance',
          label: '财务部'
        }
      ],
      value: '',
      departData: [],
      listQuery: {
        page: 1,
        size: 5,
        paged: true
      },
      tableData: []
    }
  },
  created() {
    this.getDepart()
    this.getUsers()
  },
  methods: {
    getUsers() {
      this.listLoading = true
      var obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.page = obj.page - 1
      getuserlist(obj)
        .then(res => {
          // console.log(res.data.data.content);
          this.total = res.data.data.totalElements
          this.departData = res.data.data.content
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
          throw new Error('数据请求失败')
        })
    },
    getDepart() {
      var obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.page = obj.page - 1
      getDepart(obj)
        .then(res => {
          if (res.data.code === 100) {
            this.tableData = res.data.data.content
          }
        })
        .catch(() => {
          this.listLoading = false
          throw new Error('数据请求失败')
        })
    },
    add() {
      this.dialogVisible = true
      this.change = '添加部门'
    },
    setVal() {
      if (this.textarea === '' && this.input === '') {
        this.inpflag2 = this.inpflag3 = true
      } else if (this.input === '') {
        this.inpflag2 = true
      } else if (this.textarea === '') {
        this.inpflag3 = true
      } else {
        this.dialogVisible = false
        this.data.name = this.input
        this.data.description = this.textarea
        this.tableData.push(this.data)
        // this.data.id=this.tableData.indexOf(this.data);
        const dataPost = qs.stringify(this.data)
        addDepart(dataPost).then(res => {
          this.truebtn = true
          this.getDepart()
          this.truebtn = false
          this.name1 = this.data.name
        }).then(() => {
          this.duty = this.data.description
          this.input = this.textarea = ''
          this.inpflag2 = this.inpflag3 = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        })
      }
    },
    cancel() {
      this.dialog2Visible = this.dialogVisible = false
      this.input = this.textarea = this.input1 = this.textarea1 = ''
      this.inpflag = this.inpflag1 = this.inpflag2 = this.inpflag3 = false
    },

    edit(index, row) {
      this.dialog2Visible = true
      this.change = '部门编辑'
      this.input1 = row.name
      this.id = row.id
      this.textarea1 = row.description
    },
    editVal() {
      if (this.textarea1 === '' && this.input1 === '') {
        this.inpflag = this.inpflag1 = true
      } else if (this.input1 === '') {
        this.inpflag = true
      } else if (this.textarea1 === '') {
        this.inpflag1 = true
      } else {
        const obj = {
          'name': this.input1,
          'description': this.textarea1
        }
        var form = new FormData()
        form.append('name', obj.name)
        form.append('description', obj.description)
        updateDepart(this.id, form).then(res => {
          this.truebtn = true
          this.getDepart()
          this.truebtn = false
          this.dialog2Visible = false
          this.inpflag = this.inpflag1 = false
          this.textarea1 = this.input1 = ''
        }).then(() => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
      }
    },
    errHide() {
      this.inpflag = this.inpflag1 = false
    },
    errHide1() {
      this.inpflag2 = this.inpflag3 = false
    },
    del(row) {
      this.$confirm('此操作将永久删除该部门信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 确认删除
          deleteDepart(row.id).then(res => {
            if (res.data.code === 100) {
              this.getDepart()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: '这是一条错误的提示消息'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    opChoose(item) {
      this.label = item
    },
    makeSure(index, row) {
      this.dialog3Visible = true
      this.userid = row.id
      this.value = row.department.name
      // console.log(this.userid)
    },
    cancelDepart() {
      this.dialog3Visible = false
    },
    setDepart() {
      setDepartment(this.userid, this.value).then((res) => {
        this.truebtn = true
        this.getUsers()
        this.truebtn = false
        this.dialog3Visible = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: '修改失败',
          type: 'danger'
        })
      })
    }
  }
}
</script>
