# Axios 说明文档

## 概述

axios 全局拦截器，在接口发出前及接收时进行统一管理

## 配置

### baseURL 域名设置

一般项目会分为三种环境（NODE_ENV）：开发环境、测试环境、生产环境，每一种环境下的域名都不一样，因此需要进行统一设置

若为开发环境，直接使用默认的 baseURL，但需要增加 proxy 前缀；其他环境不需要使用 proxy，直接设置对应域名即可

```javascript
const { NODE_ENV, VUE_APP_PROXY_PREFIX, VUE_APP_BASE_URL } = process.env
const baseURL = NODE_ENV === 'development' ? VUE_APP_PROXY_PREFIX : VUE_APP_BASE_URL
```

### 发送时拦截器

一般用于配置统一的 `withCredentials` 凭证、`timeout` 超时、`auth` 请求头等

用户登录 token 校验，一般会存储在请求头的`auth`字段上，参考如下

```javascript
import { getToken } from '@/utils/auth'
service.interceptors.request.use(config => {
  config.headers = getToken()
  return config
})
```

### 接收时拦截器

初步处理接口返回的数据，可以针对某些特定的状态码执行一些特定的操作，需要视项目（看后端）而定，其他状态码由各接口函数内部处理

## 参考地址

[axios 文档 🚀](http://www.axios-js.com/zh-cn/docs/)
