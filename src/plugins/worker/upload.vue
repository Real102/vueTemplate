<!--
@author wolfBerry
@email 906368017@qq.com
@create date 2022-01-19 16:01:05
@modify date 2022-01-21 14:34:12
@desc 文件上传组件
-->

<!--
//! 流程描述
  1. 上传组件总共有两种样式，默认是一个上传按钮。另外一种需要传一个flag参数，目前不限制传的内容（flag="pic"）
  2. uploadedChunk 是记录已经上传完成的chunk数量，当其与chunk总数：chunks相等时，表示已上传完成。同样，进度条也是基于上两数据实现
  3. 注意文件上传发起的接口请求时同时发起的，但不保证完成时间是发起的顺序值，因此上传成功后不一定是最后一个接口才有path，所以需要做一下path非空判断，然后再保存
  4. 目前看来是chunk上传完成后，即返回文件路径。但按后端的说法，可能需要check一下file？实际好像又不用check？这一个点测试的时候注意一下
-->

<template>
  <div class="upload">
    <div class="chose-file-wrap" v-if="!flag">
      <button>选择文件</button>
      <input type="file" @change="handleFileChange" ref="uploadFileRef" />
    </div>
    <div class="up-area" v-else>
      <!-- input需要绝对定位，但如果上传了照片之后，需要隐藏input，否则重复点击会异常 -->
      <div v-show="!fileData.path" v-loading="isLoading">
        <input type="file" @change="handleFileChange" ref="uploadFileRef" />
        <img src="@/assets/img/upload-bg.png" alt="" />
      </div>
      <div v-show="fileData.path" class="img-show-wrap">
        <img :src="fileData.path" alt="出错了" class="uploadedImgWrap" />
        <div class="img-ctl">
          <i class="el-icon-zoom-in" @click="handleEnlarge"></i>
          <i class="el-icon-delete" @click="handleDelete"></i>
        </div>
      </div>
    </div>
    <p class="cp-item-tips" v-if="!flag">
      <slot></slot>
    </p>
    <div class="attachment-wrap" v-show="fileData.name && !flag">
      <div class="aw-msg">
        <img src="@/assets/img/attachment.png" alt="" width="22" height="26" />
        <span>{{ fileData.name }}</span>
        <i class="icon icon-Close" @click="handleDelete"></i>
      </div>
      <div class="aw-progress">
        <el-progress
          :percentage="pg.percentage"
          :status="pg.status"
          :show-text="false"
        ></el-progress>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import Worker from 'worker-loader!@/plugins/worker.js'
export default {
  name: 'Upload',
  props: {
    flag: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      worker: undefined,
      dialogVisible: false,
      dialogImageUrl: '',
      isLoading: false,
      pg: {
        percentage: 0,
        status: undefined
      },
      uploadedChunk: 0,
      fileData: {
        name: '',
        size: '',
        md5: '',
        path: ''
      }
    }
  },
  mounted() {
    this.worker = new Worker()
    this.worker.onmessage = this.handleMessage
    this.$once('hook:beforeDestroy', function () {
      this.worker.onmessage = null
      this.worker = undefined
    })
  },
  methods: {
    handleFileChange(e) {
      const file = e.target.files[0],
        { name, size, type } = file,
        maxSize = 20
      this.fileData.name = name
      this.fileData.size = size
      if (!['png', 'jpeg', 'jpg', 'pdf'].some(i => type.indexOf(i) > -1)) {
        if (this.flag) {
          // 身份证照不允许上传pdf
          if (type.indexOf('pdf') > -1) {
            this.$message.warning('请上传png、jpeg、jpg格式文件')
          }
        } else {
          this.$message.warning('请上传png、jpeg、jpg、pdf格式文件')
        }
      } else if (size > maxSize * 1024 * 1024) {
        this.$message.warning(`请上传${maxSize}MB以内的文件`)
      } else {
        this.worker.postMessage({ file })
        this.isLoading = true
      }
    },
    handleMessage(e) {
      const { uploaded, chunks, path, md5, msg, missNum } = e.data
      if (uploaded) {
        ++this.uploadedChunk
        if (path) {
          this.fileData.path = process.env.VUE_APP_DEV_PROXY_TARGET_API + path
        }
        this.fileData.md5 = md5
        if (chunks === 0 && path) {
          // 这是秒传的情况--上传完成
          this.isLoading = false
          this.pg.status = 'success'
          this.pg.percentage = 100
          // 上传完成或上传失败的时候，需要手动清空input的内容，否则重新上传文件会没有反应
          this.$refs.uploadFileRef.value = ''
        } else {
          // 非秒传情况下，根据上传完成的chunk的数量uploadedChunk来计算进度
          // 当uploadedChunk = chunks的时候，表示已经上传完成
          // 上传中显示蓝色，上传完成显示绿色
          this.pg.percentage = Math.ceil((this.uploadedChunk * 100) / chunks)
          if (this.uploadedChunk === chunks || this.uploadedChunk === missNum) {
            // 上传完成
            this.pg.status = 'success'
            this.pg.percentage = 100
            this.$refs.uploadFileRef.value = ''
            this.isLoading = false
          } else {
            // 上传中
            this.pg.status = undefined
            this.isLoading = false
          }
        }
      } else {
        if (this.uploadedChunk === chunks || chunks === 0) {
          // 如果上传失败，则在最后一个接口请求的时候提示
          // 如果文件校验失败，则返回chunks = 0
          // 上传失败
          this.$message.error(msg || '文件上传失败')
        }
        this.pg.status = 'exception'
        this.$refs.uploadFileRef.value = ''
      }
    },
    handleEnlarge() {
      this.dialogVisible = true
      this.dialogImageUrl = this.fileData.path
    },
    handleDelete() {
      this.fileData = this.$options.data().fileData
    }
  }
}
</script>
<style lang="less" scoped>
.upload {
  .chose-file-wrap {
    width: 88px;
    height: 32px;
    position: relative;
    cursor: pointer;
    button {
      width: 100%;
      background: #009bf9;
      border-radius: 4px;
      font-size: 14px;
      color: #ffffff;
      line-height: 32px;
      cursor: pointer;
    }
    input {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      width: 88px;
      cursor: pointer;
      font-size: 0;
      padding: 0;
    }
  }
  .up-area {
    width: 104px;
    height: 104px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 24px;
    cursor: pointer;
    // border: 1px dashed #d1d2d3;
    img {
      max-width: 100%;
      max-height: 100%;
      display: block;
    }
    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      font-size: 0;
      padding: 0;
      cursor: pointer;
    }
    .img-show-wrap {
      .img-ctl {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        i {
          font-size: 20px;
          margin-right: 10px;
          color: #ffffff;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      &:hover {
        .img-ctl {
          display: flex;
        }
      }
    }
  }
  .cp-item-tips {
    font-size: 14px;
    color: #999999;
    line-height: 22px;
    font-weight: 400;
    margin-top: 8px;
    white-space: nowrap;
  }
  .attachment-wrap {
    width: 300px;
    margin-top: 16px;
    transition: all;
    .aw-msg {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 22px;
      img {
        width: 10px;
        display: block;
        height: auto;
        flex-shrink: 0;
        margin-right: 4px;
      }
      i {
        flex-shrink: 0;
        cursor: pointer;
      }
      span {
        width: 100%;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        color: #181818;
        line-height: 22px;
      }
    }
    .aw-progress {
      width: 100%;
      // padding-left: 14px;
      box-sizing: border-box;
      margin-top: 8px;
      /deep/.el-progress-bar__outer {
        height: 4px !important;
      }
    }
  }
}
</style>
