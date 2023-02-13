import axios from 'axios'
import router from '@/router'
import CryptoJS from 'crypto-js'
import { getToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'

// 根据当前环境，设置 baseURL 参数。当 NODE_ENV 为 development 时不需要加前缀，而非 development 环境时需要加前缀
// 因此 api 下文件不需要再加接口前缀
// 同时设置统一前缀VUE_APP_PROXY_PREFIX，并且在vue.config中通过pathrewrite还原，可避免重复写proxy😏
// 可以在.env.development文件中修改
const { NODE_ENV, VUE_APP_PROXY_PREFIX, VUE_APP_BASE_URL } = process.env
const baseURL = NODE_ENV === 'development' ? VUE_APP_PROXY_PREFIX : VUE_APP_BASE_URL

const service = axios.create({
  baseURL
})

const resCode = {
  success: 10200, // 接口请求成功
  fail: 10500, // 接口请求失败
  notLogin: 10001, // 没有登录
  wrongParams: 100002, // 请求参数有误
  withoutAuth: 10400 // 没有权限
}

service.interceptors.request.use(
  config => {
    config.withCredentials = true
    config.headers = Object.assign(config.headers, {
      // 增加登录token，用于校验登录token是否过期
      Authorization: getToken()
    })
    setCancel(config)
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// TODO: 按项目要求调整状态码
service.interceptors.response.use(
  response => {
    removeCancel(response.config)
    if (response.status === 200) {
      const { code } = response.data
      // * 状态码的对应处理方案
      switch (code) {
        case resCode.success:
          return response.data
        case resCode.fail:
          throw response.data
        case resCode.notLogin:
          // 若返回token已过期，手动删除token，否则打开页面会一直弹框提示token过期
          removeToken()
          Message({
            message: '登录已过期，请重新登录',
            type: 'warning',
            duration: 2000
          })
          throw response.data
        case resCode.withoutAuth:
          Message({
            message: '无权访问',
            type: 'error',
            duration: 2000,
            onClose: function () {
              router.go(-1)
            }
          })
          break
        default:
          throw response.data
      }
    } else {
      throw response.data
    }
  },
  err => {
    throw err
  }
)
export default service

// ! 拦截器统一避免表单重复提交（需要实际环境试用）
// ! 存在限制：接口请求完成前不允许再次重复请求；接口的唯一性通过计算url+data的md5值来确定

// 获取字符串md5值
const getStringMd5 = str => {
  const hash = CryptoJS.MD5(str).toString()
  return hash
}

// 逻辑校验接口请求是否重复/频繁提交，若是则取消请求
const CancelToken = axios.CancelToken
const historyList = {}
let cancel
const setCancel = config => {
  // 存储cancel方法
  config.cancelToken = new CancelToken(function (c) {
    cancel = c
  })
  const key = getStringMd5(config.url + '-' + config.data)
  if (!historyList[key]) {
    historyList[key] = cancel
  } else {
    // 如果已存在，那么执行cancel命令，避免重复提交
    cancel()
  }
  return config
}

const removeCancel = config => {
  const key = getStringMd5(config.url + '-' + config.data)
  if (historyList[key]) {
    delete historyList[key]
  }
}
