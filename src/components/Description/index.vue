<template>
  <div class="descriptionWrapper">
    <div class="editortitle"
         style="margin-bottom: 10px;padding: 0 0 0 20px;position:relative">
      <el-button type="primary"
                 icon="el-icon-edit"
                 circle />
      <div class="description">描述信息</div>
    </div>
    <el-form ref="ruleForm"
             :model="ruleForm"
             :rules="rules"
             label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="文件名称"
                    prop="name">
        <el-input v-model="ruleForm.name"
                  style="width:500px" />
      </el-form-item>
      <el-form-item label="编写人"
                    prop="author">
        <el-input v-model="ruleForm.author"
                  style="width:500px" />
      </el-form-item>
      <el-form-item label="编写时间"
                    prop="data">
        <el-date-picker v-model="ruleForm.data"
                        type="datetime"
                        placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item label="编写单位"
                    prop="unit">
        <el-input v-model="ruleForm.unit"
                  style="width:500px" />
      </el-form-item>
      <el-form-item label="版本号"
                    prop="version">
        <el-input v-model="ruleForm.version"
                  style="width:500px" />
      </el-form-item>
      <el-form-item label="密级"
                    prop="securityClassification">
        <el-select v-model="ruleForm.securityClassification"
                   placeholder="设置密级">
          <el-option label="公开"
                     value="0" />
          <el-option label="机密"
                     value="1" />
          <el-option label="绝密"
                     value="2" />
        </el-select>

      </el-form-item>
      <el-form-item label="添加标签"
                    prop="tag">
        <el-tag v-for="tag in dynamicTags"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-input v-if="inputVisible"
                  ref="saveTagInput"
                  v-model="inputValue"
                  class="input-new-tag"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm" />
        <el-button v-else
                   class="button-new-tag"
                   size="small"
                   @click="showInput">+ 新标签</el-button>
      </el-form-item>
      <el-form-item label="描述信息"
                    prop="description">
        <el-input v-model="ruleForm.description"
                  type="textarea"
                  style="width:500px" />
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary"
                   @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item> -->
    </el-form>
    <div v-if="!reedit"
         class="dialoginfoemation"
         @click="editlock">等待文件上传，可取消上传重新编辑</div>
  </div>
</template>

<script>
export default {
  props: {
    reedit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dynamicTags: ['文件'],
      inputVisible: false,
      inputValue: '',
      ruleForm: {
        name: '',
        author: '',
        data: '',
        unit: '',
        version: '',
        securityClassification: '',
        // tag: [],
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '文件名不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '填写编写人', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        data: [
          { required: true, type: 'date', message: '选择时间', trigger: 'change' }
        ],
        unit: [{ required: true, message: '填写编写单位', trigger: 'blur' },
          { min: 3, message: '长度需要大于3', trigger: 'blur' }],
        version: [
          { required: true, message: '填写版本号', trigger: 'blur' },
          { min: 3, message: '字符需要大于3', trigger: 'blur' }
        ],
        securityClassification: [
          { required: true, message: '选择密级', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    ruleForm: {
      handler(oldVal, newVal) {
        if (newVal.description !== '') {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              // const obj = Object.assign(this.ruleForm, { 'tag': this.dynamicTags })

              // let tag=this.dynamicTags
              let obj = {}
              obj = JSON.parse(JSON.stringify(this.ruleForm))
              obj.tag = this.dynamicTags
              this.$emit('showupload', { 'show': true, 'data': obj })
              // this.$emit('showupload', true)
            } else {
              this.$emit('showupload', { 'show': false, 'data': null })
              // this.$emit('showupload', false)
            }
          })
        } else {
          this.$emit('showupload', { 'show': false, 'data': null })
          // this.$emit('showupload', false)
        }
      }, deep: true
    }

  },
  methods: {
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    editlock() {
      this.$emit('deletelock')
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    typeget() {
      const typeitems = ['', 'success', 'info', 'danger', 'warning']
      const index = Math.floor(Math.random() * 4)
      console.log(index)
      return typeitems[index]
    }
  }

}
</script>
<style>
.descriptionWrapper {
  position: relative;
  width: 700px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  margin-top: 40px;
  padding: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.description {
  color: white;
  overflow: hidden;
  z-index: -1;
  display: inline-block;
  height: 40px;
  vertical-align: bottom;
  line-height: 40px;
  background: #1890ffba;
  width: 200px;
  position: absolute;
  left: 20px;
  padding-left: 60px;
  border-radius: 80px;
  transition: all 0.5s;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.dialoginfoemation {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #0000005e;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
</style>

