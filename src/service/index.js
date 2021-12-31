import axios from 'axios'
import router from '@/router'
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
    return config
  },
  err => {
    return Promise.inject(err)
  }
)

// TODO: 按项目要求调整状态码
service.interceptors.response.use(
  response => {
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
