<template>
  <div class="previewWrapper">
    <div style="line-height: 50px;margin-top: 20px;padding: 0px 20px;">
      <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">
        搜索
      </el-button>
      <a href="#" target="_blank" style="margin-left:15px;">
        <el-tag type="info">Documentation</el-tag>
      </a>
    </div>
  </div>
</template>
<script>
// options components
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'
export default {
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx' }
  },
  methods: {
    handleDownload() {
      console.log('下载文件')
    }
  }
}
</script>
<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
