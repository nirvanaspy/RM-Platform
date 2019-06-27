<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="name"
                placeholder="文件名"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-select v-model="securityClassification"
                 placeholder="密级"
                 clearable
                 style="width: 90px"
                 class="filter-item">
        <el-option v-for="(item,index) in importanceOptions"
                   :key="index"
                   :label="item"
                   :value="index" />
      </el-select>
      <el-select v-model="status"
                 placeholder="状态"
                 clearable
                 class="filter-item"
                 style="width: 130px">
        <el-option v-for="(item,index) in typeOptions"
                   :key="index"
                   :label="item"
                   :value="index" />
      </el-select>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">
        搜索
      </el-button>
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
                       align="center"
                       width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间"
                       width="160"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述"
                       min-width="150px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handlePreview(scope)">{{ scope.row.description }}</span>
          <el-tag>{{ scope.row.tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上传人"
                       width="110px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名"
                       width="110px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编写单位"
                       width="110px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
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
      <el-table-column label="密级"
                       width="80px"
                       align="center">
        <template slot-scope="scope">
          <div v-if="+scope.row.securityClassification<=0">
            <span>公开</span>
          </div>
          <svg-icon v-for="n in +scope.row.securityClassification"
                    :key="n"
                    icon-class="star"
                    class="meta-item__icon" />
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
          <el-button size="mini"
                     type="success"
                     @click="handleModifyStatus(row)">
            下载
          </el-button>
          <!-- <el-button size="mini"
                     type="warning"
                     @click="preview(row)">
            预览
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList" />
    <el-dialog :visible.sync="dialoginfoVisible"
               title="文件信息">
      <el-table :data="pvData"
                border
                fit
                highlight-current-row
                style="width: 100%">
        <el-table-column prop="name"
                         label="Channel" />
        <el-table-column prop="FileEntity.postfix"
                         label="类型" />
        <el-table-column label="操作"
                         align="center"
                         width="230"
                         class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <div v-if="scope.row.FileEntity.postfix=='pdf'">
              <el-button size="mini"
                         type="warning"
                         @click="preview(row)">
                预览
              </el-button>
            </div>

          </template>
        </el-table-column>
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
import { fetchPv } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import { datalist } from '@/api/mockdata'
import { standardFilelist, standardconditon } from '@/api/fileSearch'
import { standars } from '@/api/download'
import { searchmodelfile } from '@/api/searccondition'
import { preview, getallfiles } from '@/api/preview'
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
          'name': 'ssf',
          'postfix': 'pdf'
        },
        {
          'name': 'roman',
          'postfix': 'date'
        }
      ],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 5,
        paged: true
      },
      name: '',
      securityClassification: '',
      status: '',
      importanceOptions: ['公开', '秘密', '机密'],
      typeOptions: ['入库', '审核中', '驳回'],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialoginfoVisible: false,
      resouceid: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // const data = datalist

      // this.list = data.data.items
      // this.total = data.data.total
      var obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.page = obj.page - 1
      standardFilelist(obj).then((res) => {
        this.total = res.data.data.totalElements
        this.list = res.data.data.content
        this.listLoading = false
      }).catch(() => {
        throw new Error('error')
      })
    },
    handleCreate() {
      console.log('添加')
    },
    handleFilter() {
      this.listQuery.page = 1
      const options = {
        'name': this.name.trim(),
        'securityClassification': this.securityClassification,
        'status': this.status
      }
      var obj = JSON.parse(JSON.stringify(options))
      for (var item in options) {
        console.log(item)
        if (options[item] == null || options[item].length === 0) { delete obj[item] }
      }
      const data = searchmodelfile(obj)
      if (data.filters.length === 0) return
      standardconditon(data).then((data) => {
        this.list = data.data.data
        // this.$notify({
        //   title: 'Success',
        //   message: 'serch Successfully',
        //   type: 'success',
        //   duration: 1000
        // })
      }).catch(() => {
        this.$notify({
          title: '出错了',
          message: '无法建立连接',
          type: 'error',
          duration: 1000
        })
      })
      // console.log(data)
      // this.getList()
    },
    handleModifyStatus(row) {
      standars(this.user_id, row.id).then((data) => {
        // window.open(data.request.responseURL)
        location.href = data.request.responseURL
        // console.log(data)
      }).catch(() => {
      })
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
    handleUpdate(scope) {
      this.$emit('uploadfile', {})

      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      // this.dialogStatus = 'update'
      // this.dialogFormVisible = true
    },
    handlePreview(scope) {
      getallfiles(scope.row.id).then((data) => {
        // console.log(data)
        this.pvData = data.data.data
        this.dialoginfoVisible = true
        // this.resouceid=data.data.id
      }).catch(() => {
        console.log('资源列表获取失败')
      })
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
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      console.log('handle')
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal, this.list)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    preview(row) {
      preview(row.FileEntity.id).then((data) => {
        const id = data.data.pathId
        window.open(`http://192.168.31.88:8080/standards/viewer/document/${id}`)
        // location.href = `http://192.168.43.202:8080/standards/viewer/document/${id}`
      }).then(() => {

      })
    }
  },
  computed: {
    ...mapGetters(['user_id'])
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

