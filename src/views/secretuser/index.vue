<template>
  <div class="roleWrapper">
    <el-table v-loading="listLoading"
              :data="rolesList"
              style="width: 100%;margin-top:30px;"
              border
              max-height="600">
      <el-table-column align="center"
                       label="身份"
                       width="220"
                       prop="roleEntities[0].name" />
      <el-table-column align="center"
                       label="用户名"
                       width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="header-center"
                       label="部门"
                       width="220">
        <template slot-scope="scope">
          {{ scope.row.department?scope.row.department.name:'暂无' }}
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="300">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     @click="handleEdit(scope)">
            修改权限
          </el-button>
          <!-- <el-button type="danger"
                     size="small"
                     @click="handleDelete(scope)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <Limits ref="limits" />
    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :size.sync="listQuery.size"
                @pagination="getList" />
  </div>
</template>
<script>
import Limits from '@/components/Limits'
import Pagination from '@/components/Pagination'
import { getuserlist } from '@/api/user'
export default {
  components: {
    Limits,
    Pagination
  },
  data() {
    return {
      rolesList: [
        {
          key: 'admin',
          name: 'admin',
          description: 'hello'
        }
      ],
      listQuery: {
        page: 1,
        size: 5,
        paged: true
      },
      total: 0,
      listLoading: false
    }
  },
  created() {
    this.getList()
    // this.total = 1
  },
  methods: {
    handleEdit(scope) {
      this.$refs.limits.isshow(true, scope.row.id)
    },
    handleDelete(cope) {
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      console.log('delet')
    },
    getList() {
      this.listLoading = true
      var obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.page = obj.page - 1
      getuserlist(obj).then((res) => {
        this.total = res.data.data.totalElements
        this.rolesList = res.data.data.content
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        throw new Error('数据请求失败')
      })
    }
  }
}
</script>
<style scope>
.roleWrapper {
  padding: 20px;
}
</style>
