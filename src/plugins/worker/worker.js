/**
 * @author wolfBerry
 * @email 906368017@qq.com
 * @create date 2022-01-11 10:54:54
 * @modify date 2022-01-21 14:33:01
 * @desc 秒传、切片上传worker
 */

// ! 流程描述：
// 首先计算整个文件的md5值，需要使用fileReader转换后才能计算md5
// 然后将md5提交到后端，后端计算该md5值的文件是否已上传过或是否全部上传成功或是否未上传
// 如果上传过，那么直接使用旧文件；如果部分上传成功，那么会返回未上传成功的切片信息；如果未上传，那么就开始切片上传流程
// 接下来利用slice方法，将文件切片，注意不需要再对切片进行md5计算了
// 计算完成后需要获取到文件名，然后与切片一起存储到formData中。注意切片的类型为原文件类型，不需要转换
// 将其他数据存储到formData中，通过接口传给后端
// 注意文件需要放在public下

// ! 其他注意事项：
// 使用了worker-loader后，此文件已被默认注册为web worker，但文件类型已不属于worker类型文件，相当于普通js文件。
// 因此不需要再使用importScripts引入外部文件，同样也可以引入依赖的模块
// 需要在vue.config.js配置loader项，同时注意文件名要被loader的test命中
// 此外还需要配置eslint，因为worker相关“插件/第三方js”不需要eslint处理
// 使用方式如下：
// import Worker from 'worker-loader!@/plugins/worker/worker.js'
// this.worker = new Worker()

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// TODO: 需要修改接口地址、切片大小等
const fileSlice = File.prototype.slice || File.prototype.mozSlice || file.prototype.webkitSlice,
  reader = new FileReader(),
  checkFilePath = 'http://192.168.195.56:8406/file/checkFileMd5', // 检查文件是否存在的接口
  uploadFilePath = 'http://192.168.195.56:8406/file/upload', // 切片上传文件的接口
  chunkSize = 50 * 1024 // 切片大小为5MB

let missUploadedChunks = undefined, // 未上传完成的chunks
  chunk = 0, // 当前分片id
  chunks = undefined // 总共多少切片

// importScripts('./spark-md5.min.js')
import SparkMD5 from './spark-md5.min.js'

self.onmessage = e => {
  const { file } = e.data
  if (file) {
    checkFile(file).then(({ md5 }) => {
      // 检查是否文件已存在，如果未存在或部分上传成功，则继续后续的步骤
      const { size } = file
      // 计算总共有多少切片
      chunks = Math.ceil(size / chunkSize)
      function loadNext() {
        const start = chunk * chunkSize
        const end = Math.min(start + chunkSize, size)
        const slicedFile = fileSlice.call(file, start, end)
        if (
          !missUploadedChunks ||
          missUploadedChunks?.length === 0 ||
          missUploadedChunks.includes(chunk)
        ) {
          // TODO: 如果有 missUploadedChunks，那么只需要上传该组内的chunk，否则全部都上传
          // 此功能还需要校验之后才能确定
          uploadFile({ slicedFile, md5, size, chunkSize, chunk, chunks, name: file.name })
        }
        chunk++
        if (chunk < chunks) {
          loadNext()
        }
      }
      loadNext()
    })
  }
}

function uploadFile({ slicedFile, md5, size, chunkSize, chunk, chunks, name }) {
  const formData = new FormData()
  formData.append('md5', md5)
  formData.append('size', size)
  formData.append('chunkSize', chunkSize)
  formData.append('chunk', chunk)
  formData.append('chunks', chunks)
  formData.append('file', slicedFile, name)
  const xhr = new XMLHttpRequest()
  xhr.open('POST', uploadFilePath, true)
  xhr.send(formData)
  xhr.onreadystatechange = () => {
    if (xhr.status !== 200) {
      // 接口错误，停止上传
      self.postMessage({
        uploaded: false,
        chunk,
        chunks
      })
    } else if (xhr.status === 200 && xhr.readyState === 4) {
      // 如果切片上传成功，那么回调给主线程
      const { path } = JSON.parse(xhr.responseText).data
      self.postMessage({
        uploaded: true,
        chunk,
        chunks,
        path,
        missNum: missUploadedChunks?.length
      })
    }
  }
}

function checkFile(file) {
  return new Promise((resolve, reject) => {
    getFileMd5(file).then(({ md5 }) => {
      // 计算并获得整个文件的md5值，然后提交给后端判断是否已存在
      const xhr = new XMLHttpRequest()
      const url = checkFilePath + '?md5=' + md5 + '&path=data'
      xhr.open('GET', url, true)
      xhr.send()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const res = JSON.parse(xhr.responseText)
          const { code, missChunks, path } = res.data
          if (code === 404) {
            // 文件未上传过
            resolve({ md5 })
          } else if (code === 200) {
            // 文件已经上传过，不用再上传
            self.postMessage({ uploaded: true, chunks: 0, path, md5 })
          } else if (code === 206) {
            missUploadedChunks = missChunks
            resolve({ md5 })
            // 文件上传了一部分
          } else {
            self.postMessage({ uploaded: false, msg: '文件校验失败', chunks: 0 })
          }
        }
      }
    })
  })
}

function getFileMd5(file) {
  const spark = new SparkMD5.ArrayBuffer()
  return new Promise((resolve, reject) => {
    reader.readAsArrayBuffer(file)
    reader.onload = function () {
      spark.append(this.result)
      resolve({ md5: spark.end() })
    }
  })
}
