# 路由配置说明文档

## 概述

访问页面前需要配置路由，如有需要，根据后端返回的权限数据进行路由控制

## 配置项

### webpackChunkName 配置

每个路由模块都必须分配不同的 webpackChunkName，webpack 打包时会根据这个名字拆分我们的代码，有助于提升项目性能

### 所有路由对象

配置路由，使能正常访问页面

- 如果需要使用 layout 布局，请在父路由上使用 `component: Layout,`
- 如有需要，请在每个路由的 meta 属性上配置标题 `meta: { title: '首页' }`
- 如果需要，请在每个路由的 meta 属性上配置用户角色 `meta: { role: ['admin'] }`，具体属性和值按项目需求调整

### 重复点击菜单报错问题

当点击相同路由时会报错，请添加以下代码：

说明：下面代码仅仅是通过改些 push 方法，将错误给“干掉”不显示到控制台而已，错误仍然存在的

```javascript
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
```

### 路由过滤

根据项目需求，筛选符合条件（即权限内的）路由，通过 router.addRoute 方法添加
