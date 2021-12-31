# API 说明文档

## 概述

接口统一存放在 `/api` 下，并且按照模块划分接口文件，避免将所有接口存放在一个文件的情况

## 使用方法

GET 请求

```javascript
export const getUserInfo = function (params) {
  return request({
    url: '/getUserInfo',
    method: 'GET',
    params
  })
}
```

POST 请求，需要注意数据格式，修改对应 `Content-type` 值

```javascript
// 根据项目要求使用qs格式化
import qs from 'qs'
export const setUserInfo = function (data) {
  return request({
    url: '/setUserInfo',
    method: 'POST',
    data: qs.stringify(data)
  })
}
```

接口使用：promise 方式

```javascript
// import 时请携带上文件后缀
import {getUserInfo, setUserInfo} from '@/api/user.js'

// methods 中
oneMethods() {
    getUserInfo().then(res => {
        // ...成功处理方法
        console.log(res)
    }).catch(err => {
        // ...错误处理方法
        console.log(err)
    })
}
```

接口使用：try-catch 方式

注意 try-catch 不能捕获异步下的异常！

```javascript
import {getUserInfo, setUserInfo} from '@/api/user.js'

// methods 中
async oneMethods() {
 try{
  const res = await oneMethods()
  // ...成功处理方法
 } catch(e) {
  console.log(e)
  // ...错误处理方法
 }
}
```

promise 和 try-catch 的对比

- [ES6 文档](https://es6.ruanyifeng.com/#docs/async#%E4%B8%8E%E5%85%B6%E4%BB%96%E5%BC%82%E6%AD%A5%E5%A4%84%E7%90%86%E6%96%B9%E6%B3%95%E7%9A%84%E6%AF%94%E8%BE%83)
- [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function#%E7%A4%BA%E4%BE%8B)
