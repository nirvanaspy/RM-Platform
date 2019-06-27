<template>
  <div class="uploadWrapper">
    <Description :reedit="reedit"
                 @showupload="isshow"
                 @deletelock="deletelock" />
    <transition name="fade">
      <uploader v-if="readyUpload"
                ref="uploader"
                :options="options"
                class="uploader-example"
                :file-status-text="fileStatusText"
                :auto-start="false"
                @file-added="onFileAdded"
                @file-success="onFileSuccess"
                @file-progress="onFileProgress"
                @file-error="onFileError"
                @file-removed="onfileRemoved">
        <uploader-unsupport />
        <div style="height:44px">
          <div v-show="reedit">
            <uploader-btn :directory="false"> <i class="el-icon-upload" />选择文件</uploader-btn>
          </div>
          <i class="el-icon-close closeUpload"
             style="position: absolute;width: 32px;height: 32px;margin-top: 10px;right: 0;top: 0;margin-right: 10px;text-align: center;"
             @click="hiddenUpload" />
          <div class="title">
            <span>
              <el-button type="primary"
                         @click="realUpload">开始上传</el-button>
            </span>
            <span>{{ description }}</span>
          </div>
        </div>

        <div class="listWrapper">
          <uploader-list />
        </div>

      </uploader>
    </transition>
  </div>

</template>
<script>
import { getToken } from '@/utils/auth'
import Description from '@/components/Description/index'
import SparkMD5 from 'spark-md5'
import { postMerge, getresourceId, realupload } from '@/api/upload'
// import { commitdescrition } from '@/api/upload'
import qs from 'qs'
// import { setTimeout } from 'timers';
export default {
  components: {
    Description
  },
  data() {
    return {
      options: {
        // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
        target: 'api/files/chunks',
        chunkSize: '2048000',
        // chunkSize:'10485760',
        maxChunkRetries: 3,
        // allowDuplicateUploads: false,
        testChunks: true, // 是否开启服务器分片校验
        checkChunkUploadedByResponse: function(chunk, message) {
          // console.log('chunk: ' + chunk.offset)

          var objMessage = {}
          try {
            objMessage = JSON.parse(message)
            if (objMessage.skipUpload) {
              return true
            }
          } catch (e) {
            // this.description = '正在传输....'
          }
          return (objMessage.chunkNumerList || []).indexOf(chunk.offset + 1) >= 0
        },
        parseTimeRemaining: function(timeRemaining, parsedTimeRemaining) {
          return parsedTimeRemaining
            .replace(/\syears?/, '年')
            .replace(/\days?/, '天')
            .replace(/\shours?/, '小时')
            .replace(/\sminutes?/, '分钟')
            .replace(/\sseconds?/, '秒')
        },
        categoryMap: {
          image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
          video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
          audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'],
          document: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx'],
          zip: ['zip']
        },
        headers: {
          Authorization: 'Bearer' + getToken()
        }
      },
      attrs: {
        accept: 'image/*'
      },
      fileStatusText: function(status, response) {
        const statusTextMap = {
          success: '上传成功',
          error: '上传失败',
          uploading: '正在上传',
          paused: '暂停',
          waiting: '排队等待中'
        }
        return statusTextMap[status]
      },
      description: '目前尚未选择文件',
      readyUpload: false,
      reedit: true,
      wholeupload: null,
      information: null,
      uploadflag: true,
      successfile: 0,
      errorfile: 0,
      allfile: 0,
      canstart: false,
      resourceid: ''
    }
  },
  watch: {
    successfile(newvalue, oldvalue) {
      if (newvalue === this.allfile) {
        this.commitUpload()
      }
    }
  },
  methods: {
    realUpload() {
      this.uploadflag = false
      const filelist = this.$refs.uploader.uploader.files
      this.allfile = filelist.length
      var obj = JSON.parse(JSON.stringify(this.information))
      obj.tag = obj.tag.join(',')
      getresourceId(qs.stringify(obj)).then((data) => {
        this.resourceid = data.data.data.id
        // this.canstart = true
        filelist.forEach(element => {
          this.computeMD5(element)
        })
      }).catch(() => {
        this.canstart = false
        this.uploadflag = true
      })
      // if (this.canstart) {
      //   filelist.forEach(element => {
      //     this.computeMD5(element)
      //   })
      // }
    },
    deletelock() {
      const sizeUploaded = this.$refs.uploader.uploader.sizeUploaded()
      const getSize = this.$refs.uploader.uploader.getSize()
      if (this.$refs.uploader.uploader.files.length === 0) {
        this.reedit = true
      }
      if (sizeUploaded === getSize) {
        this.reedit = true
      }
    },
    hiddenedite() {
    },
    hiddenUpload() {
      const sizeUploaded = this.$refs.uploader.uploader.sizeUploaded()
      const getSize = this.$refs.uploader.uploader.getSize()
      const isUploading = this.$refs.uploader.uploader.isUploading()
      if (isUploading || sizeUploaded !== getSize) {
        this.$confirm('此操作将取消上传所有文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.uploadflag = true
          this.$message({
            type: 'success',
            message: '已取消上传',
            duration: 1000
          })
          // this.readyUpload = false
          this.$refs.uploader.uploader.cancel()
          this.reedit = true
          this.$refs.uploader.uploader.cancel()
        }).catch(() => {
          this.reedit = false
        })
      } else {
        // 隐藏上传组件，并且可重新编辑信息
        this.readyUpload = false
        this.reedit = true
      }
    },
    isshow(data) {
      this.readyUpload = data.show
      this.information = data.data
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      const fileReader = new FileReader()
      const time = new Date().getTime()
      let md5 = ''
      file.pause()
      this.description = '正在校验MD5'
      fileReader.readAsArrayBuffer(file.file)
      fileReader.onload = e => {
        if (file.size !== e.target.result.byteLength) {
          this.error('Browser reported success but could not read the file until the end.')
          return
        }
        md5 = SparkMD5.ArrayBuffer.hash(e.target.result)
        // 添加额外的参数
        // this.uploader.opts.query = {
        //   ...this.params
        // }
        this.description = `MD5计算完毕用时：${new Date().getTime() - time} ms`
        // console.log(`MD5计算完毕：${file.id} ${file.name} MD5：${md5} 用时：${new Date().getTime() - time} ms`)
        file.uniqueIdentifier = md5
        file.resume()
        this.description = '文件上传中，请勿中途停止'
      }
      fileReader.onerror = function() {
        this.error('FileReader onerror was triggered, maybe the browser aborted due to high memory usage.')
      }
    },
    onFileAdded(file) {
      this.reedit = false
      console.log(file)
      // this.computeMD5(file)
    },
    onFileSuccess(rootFile, file, response, chunk) {
      console.log('fileSuccess')
      const data = {}
      data.totalChunks = file.chunks.length
      data.chunkSize = this.options.chunkSize
      data.totalSize = file.size
      data.identifier = file.uniqueIdentifier
      data.filename = file.name
      data.relativePath = file.relativePath
      this.successfile += 1
      console.log(this.successfile)
      postMerge(qs.stringify(data)).then(() => {
        // this.$notify({
        //   title: '成功',
        //   message: `文件${file.name}合并完成`,
        //   type: 'success',
        //   position: 'bottom-right'
        // })
        // this.description = '文件合并完成'
        // this.commitUpload(file)
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: `文件${file.name}合并失败`,
          type: 'error',
          position: 'bottom-right'
        })
        this.description = '文件合并失败'
      })
      this.commitUpload()
    },
    onFileProgress(rootFile, file, response, chunk) {
      // console.log('fileProgress')
      // console.log(file)
    },
    onFileError(rootFile, file, response, chunk) {
      this.$notify({
        title: '失败',
        message: `文件${file.name}上传失败，请删除或请重新上传`,
        type: 'error',
        position: 'bottom-right'
      })
    },
    onfileRemoved(file) {
      this.description = '暂无上传文件'
    },
    commitUpload() {
      const fileobj = this.getfileList()
      // 文件上传成功后添加描述信息
      const obj = {
        // 'parentNodeId': '',
        // 'fileMetaEntityList': fileobj,
        'jsonObject': fileobj
      }
      realupload(this.resourceid, obj, { 'parentNodeId': this.resourceid }).then(() => {
        this.$notify({
          title: '成功',
          message: `uploader完成`,
          type: 'success',
          position: 'bottom-right'
        })
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: `uploader失败，检查网络重新上传`,
          type: 'error',
          position: 'bottom-right'
        })
      })
    },
    getfileList() {
      const filelist = this.$refs.uploader.uploader.files
      var filearr = []
      filelist.forEach((element) => {
        const fileinformation = {}
        fileinformation.name = element.name
        fileinformation.fileid = element.uniqueIdentifier
        fileinformation.relativePath = element.relativePath
        filearr.push(fileinformation)
      })
      return filearr
    },
    isfilecomplete() {
      // this.$emit('uploadstate',{})
      if (!this.reedit) {
        return false
      } else {
        return true
      }
    }

  }
}
</script>
<style>
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-enter {
  transform: translateY(-100%);
  opacity: 0;
}
.fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.fade-leave {
  opacity: 1;
  transform: translateY(0%);
}

.fade-enter-active {
  transition: all 0.7s ease;
}

.fade-leave-active {
  transition: all 0.7s ease;
}
input[type="file"] {
  visibility: hidden;
  position: inherit !important;
  width: 1px;
  height: 1px;
}

.uploader-example {
  width: 700px;
  /* padding: 15px; */
  margin: 40px auto 40px;
  /* font-size: 12px; */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  background: rgba(7, 17, 27, 0.8);
  border-radius: 10px;
}
.uploader-example .closeUpload {
  transition: all 0.3s;
}
.uploader-example .closeUpload:hover {
  color: #2afadf;
  transform: rotate(360deg);
  transform-origin: center;
}
.uploader-example .title {
  color: #d2c5c5;
  line-height: 40px;
  position: absolute;
  top: 0;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  text-align: center;
  font-family: fantasy;
}
.uploader-example .uploader-btn {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  -webkit-appearance: none;
  text-align: center;
  /* -webkit-box-sizing: border-box; */
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  /* -webkit-transition: .1s; */
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.uploader-example .uploader-btn:hover {
  background-color: #409eff;
}
.uploader-example .uploader-list {
  clear: both;
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.uploadWrapper {
  min-height: 750px;
}
.uploadWrapper .uploader-file {
  margin-top: 10px;
  border-bottom: none;
}
.uploadWrapper .uploader-file-progress {
  border-radius: 10px;
  position: absolute;
  width: 100%;
  height: 100%;
  /* background: linear-gradient(to right, #64b3f4, #c2e59c); */
  background: linear-gradient(135deg, #2afadf 10%, #4c83ff 100%);
  transform: translateX(-100%);
}
.uploadWrapper .uploader-file-icon[icon="document"] {
  background-image: url("word文档.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.uploadWrapper .uploader-file-icon[icon="unknown"] {
  background-image: url("文件.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.uploadWrapper .uploader-file-icon[icon="image"] {
  background-image: url("图片.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.uploadWrapper .uploader-file-icon[icon="zip"] {
  background-image: url("压缩包.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.uploadWrapper .uploader-file-icon[icon="video"] {
  background-image: url("视频.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.uploadWrapper .uploader-file-icon[icon="video"]:before {
  content: "";
}
.uploadWrapper .uploader-file-icon[icon="zip"]:before {
  content: "";
}
.uploadWrapper .uploader-file-icon[icon="document"]:before {
  content: "";
}
.uploadWrapper .uploader-file-icon[icon="image"]:before {
  content: "";
}
.uploadWrapper .uploader-file-icon[icon="unknown"]:before {
  content: "";
}
.el-message-box {
  border-radius: 10px;
}
</style>
