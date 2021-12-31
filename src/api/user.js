import request from '@/service/index.js'
import qs from 'qs'

// TODO: 仅用于参考，开发时需删除
export const getUserInfo = function (params) {
  return request({
    url: '/getUserInfo',
    method: 'GET',
    params
  })
}

export const setUserInfo = function (data) {
  return request({
    url: '/setUserInfo',
    method: 'POST',
    // TODO: 根据项目要求使用qs格式化
    data: qs.stringify(data)
  })
}
