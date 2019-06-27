<template>
  <div class="app-container">
    <el-tabs v-model="activeName"
             type="border-card"
             @tab-click="handleClick">
      <el-tab-pane name="first"
                   style="min-height:800px">
        <span slot="label"><i class="el-icon-search" /> 文件查找</span>
        <list @uploadfile="uploadfile" />
      </el-tab-pane>
      <el-tab-pane label="消息中心"
                   name="second"> <span slot="label"><i class="el-icon-upload" /> 文件上传</span>
        <fileupload ref="fileupload" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import fileupload from '@/components/fileupload'
import list from '@/components/list'
export default {
  components: { fileupload, list },
  data() {
    return {
      activeName: 'first',
      deny: false
    }
  },
  methods: {
    uploadfile(obj) {
      if (this.deny) {
        this.$message({
          type: 'warning',
          message: '有文件正在更新',
          duration: 1000
        })
      }
      this.activeName = 'second'
    },
    handleClick(tab, event) {
      // console.log(tab, event)
      if (tab.name === 'first') {
        if (!this.$refs.fileupload.isfilecomplete()) {
          this.deny = true
        } else {
          this.deny = false
        }
      }
    }
  }
}
</script>
<style>
</style>

