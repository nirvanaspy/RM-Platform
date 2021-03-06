<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title"
                placeholder="标题"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance"
                 placeholder="重要性"
                 clearable
                 style="width: 90px"
                 class="filter-item">
        <el-option v-for="item in importanceOptions"
                   :key="item"
                   :label="item"
                   :value="item" />
      </el-select>
      <el-select v-model="listQuery.type"
                 placeholder="类型"
                 clearable
                 class="filter-item"
                 style="width: 130px">
        <el-option v-for="item in calendarTypeOptions"
                   :key="item.key"
                   :label="item.display_name+'('+item.key+')'"
                   :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort"
                 style="width: 140px"
                 class="filter-item"
                 @change="handleFilter">
        <el-option v-for="item in sortOptions"
                   :key="item.key"
                   :label="item.label"
                   :value="item.key" />
      </el-select>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves
                 :loading="false"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer"
                   class="filter-item"
                   style="margin-left:15px;"
                   @change="tableKey=tableKey+1">
        审核人
      </el-checkbox>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%; margin-top:10px;border-radius:10px"
              @sort-change="sortChange">
      <el-table-column label="序号"
                       prop="id"
                       sortable="custom"
                       align="center"
                       width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间"
                       width="150px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题"
                       min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type"
                @click="handlepreview(row)">{{ row.title }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作者"
                       width="110px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer"
                       label="审核人"
                       width="110px"
                       align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重要性"
                       width="80px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance"
                    :key="n"
                    icon-class="star"
                    class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="阅读数"
                       align="center"
                       width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews"
                class="link-type"
                @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       class-name="status-col"
                       width="100"
                       align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="230"
                       class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary"
                     size="mini"
                     @click="handleUpdate(row)">
            更新
          </el-button>
          <el-button v-if="row.status!='published'"
                     size="mini"
                     type="success"
                     @click="handleModifyStatus(row,'published')">
            出版
          </el-button>
          <el-button v-if="row.status!='draft'"
                     size="mini"
                     @click="handleModifyStatus(row,'draft')">
            发布
          </el-button>
          <el-button v-if="row.status!='deleted'"
                     size="mini"
                     type="danger"
                     @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList" />
    <el-dialog :visible.sync="dialoginfoVisible"
               title="Reading statistics">
      <el-table :data="pvData"
                border
                fit
                highlight-current-row
                style="width: 100%">
        <el-table-column prop="key"
                         label="Channel" />
        <el-table-column prop="pv"
                         label="Pv" />
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="dialoginfoVisible = false">确认</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { datalist } from '@/api/mockdata'
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      pvData: [
        {
          'key': 'title',
          'pv': 'hello'
        },
        {
          'key': 'roman',
          'pv': 'date'
        }
      ],
      dialoginfoVisible: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = false
      const data = datalist

      this.list = data.data.items
      this.total = data.data.total
      // this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      // }).catch(() => {
      //   console.log('sss')
      //   this.listLoading = false
      // })
    },
    handleCreate() {
      console.log('添加')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleUpdate(row) {
      this.$emit('uploadfile', {})
    },
    handlepreview() {
      this.dialoginfoVisible = true
    },
    updateData() {
      this.$notify({
        title: 'Success',
        message: 'Update Successfully',
        type: 'success',
        duration: 2000
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
    },
    handleDownload() {
      console.log('handle')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
.filter-container {
  padding-bottom: 10px;
  min-width: 600px;
}
.filter-container .filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}
</style>

