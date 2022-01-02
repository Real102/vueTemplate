# vue 开发模板

## 概览

本项目为 `vue` 开发模板，基于 `vue2.x` + `vue-cli4.x` + `webpack` + `element-ui` + `es6` + `less` + `express` 技术栈开发

## 运行

### 命令行

常用命令行示例：

- `npm run dev`： 本地运行项目
- `npm run stage`： 打包测试环境（如需）
- `npm run build`： 打包生产环境
- `npm run analyze`： 打包体积分析
- `npm run compressImg`：压缩图片体积（规划中）

具体以项目中 `package.json` 中 `scripts` 内容为准

Tips：

- 可以通过 `vscode explorer` 模块左下方的 `NPM SCRIPTS` 点击快速启动

## 规范

### vue 组件顺序规范（请配置 eslint，已支持自动修复功能）

```text
el：            挂载DOM
name：          组件名称
components：    注册组件
directives：    注册指令
filters：       注册过滤器（vue3已废除，避免使用）
mixins：        注册过滤器
props：         组件传参
data()          数据
computed：      计算属性
watch：         监听
mounted()       钩子函数
methods：       方法
```

#### commit message 规范

- 将打包的输出路径、local 文件等不需要提交到 gitlab 的文件添加到 .gitignore 文件中
- 分功能点填写 commit 信息。
  - 如果是第一次提交，可以考虑已整个功能模块命名提交信息如：`feat：搭建应用页二级详情页前端开发（未接接口）`
  - 如果是修改 bug，同时又有一些新的功能点，那么需要明确区分
  - **Tips**: 可以考虑使用 vscode 的 `Source Control` 模块，将同一功能点/模块/bug 放入到一个 stage change 中并填写对应的 message，再 commit staged 到缓存区，等所有 stage 都写好说明后再一并 commit 所有改动
- 提交到 gitlab 的对应开发分支

```doc
feat: 新特性
fix: 修改问题
refactor: 代码重构
docs: 文档修改
style: 代码格式修改, 注意不是 css 修改
test: 测试用例修改
chore: 其他修改, 比如构建流程, 依赖管理
```

Source Control 操作参考示意图：

![Source Control 操作参考示意图](./docs/img/git-commit.png 'Source Control 操作参考示意图')

参考文档：

- [Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
- [Git-Commit-Log 规范（Angular 规范）](https://www.jianshu.com/p/c7e40dab5b05)

### 代码书写规范

### views 目录建议

尽量把一个模块的代码放置在一个文件夹内

![汇聚页风格](./docs/img/views-hjy.png '汇聚页风格')
![支付平台风格](./docs/img/views-pay.png '支付平台')

## 配置项

### 环境变量

- .env.development 开发环境配置文件，需要提交到 gitlab
- .env.development.local 开发环境配置文件，不需要提交到 gitlab，用于本机测试环境下不同测试条件的调整，优先级高于.env.development，但非必须文件
- .env.production 生产环境配置文件，需要提交到 gitlab
- .env.stage 测试环境配置文件，需要提交到 gitlab

#### 关键参数解析

- NODE_ENV：vue-cli 打包模式（值只能为：development、production、test）
- ENV：环境变量参数，可以为任意自定义数据，表示当前所处环境（一般为：开发环境 development、生产环境 production、测试环境 stage）
- VUE_APP_BASE_URL：统一接口前缀，即域名，开发环境下用于接口代理，正式环境和测试环境下用于修改域名
- VUE_APP_PROXY_PREFIX：开发环境下的接口前缀，用于接口代理（proxy）（仅用于开发环境）

### setting.js 全局配置文件

## 开发

### 项目结构

```text
|-- .vscode 覆盖vscode的配置
|-- dist 打包路径，需要区分项目设置打包名
|-- node_modules 依赖路径
|-- public 不需要压缩的图片、html 等
|-- src
|   |-- api 所有接口存放路径，以模块划分接口文件
|   |-- assets 图片资源
|       |-- icon 需要制作雪碧图的 icon 存放路径
|       |-- imgs 其他所有图片都存放在当前路径，此路径的文件都会经过 webpack 压缩
|       |-- svg svg 图片存放路径
|   |-- components 全局组件/第三方组件
|   |-- directives 全局指令/自定义指令
|   |-- filters 自定义过滤器/第三方过滤器（由于vue3废除了过滤器，考虑不将filters纳入版本）
|   |-- layout 页面结构代码：顶部导航和侧边导航
|   |-- libs 第三方js文件/包，不支持npm下载的第三方包都存放在当前路径
|   |-- mixins 自定义混入 mixin
|   |-- plugins 自定义插件/第三方插件
|       |-- element-ui 饿了么按需加载
|   |-- router 路由注册、权限路由
|   |-- service axios 全局拦截器配置
|   |-- store vuex 配置
|       |-- modules  按模块划分
|       |-- index.js
|   |-- styles 样式资源
|       |-- sprite   雪碧图存放路径
|       |-- _variables.less   变量
|       |-- common.less  公共/常用样式mixin
|       |-- reset.less   样式初始化文件
|   |-- utils 工具函数
|   |-- views
|       |-- module1 参考示例：模块一
|           |-- components 局部组件
|           |-- filters 局部过滤器
|           |-- mixins 局部混入
|           |-- plugins 局部插件
|       |-- others
|           |-- 404.vue 页面不存在，重定向到 404 页面
|       |-- app.vue 入口文件
|       |-- main.js 入口文件
|       |-- settings.js 全局配置文件
|-- .env.development(.local) 本地测试环境配置文件（.local 后缀为本地生效文件）
|-- .env.production(.local) 生产环境配置文件
|-- .env.stage(.local) 在线测试环境配置文件
|-- .eslintrc.js eslint 配置文件
|-- .gitignore  git提交限制文件
|-- .prettier.config.js prettier 配置文件
|-- vue.config.js vue 打包配置文件
```

### 功能/插件说明

#### layout 布局

**概述**：抽离顶部导航栏 topBar 和侧边导航栏 sideBar 的代码并形成 layout 组件

**用法**：将 layout 组件作为“父”组件，插入到每个模块中，子组件都通过 layout 打开，达到相同结构的效果，并易于控制显隐

```javascript
// router.js
const Layout = () => import('@/layout/index.vue')
const routes = [{
  path: '/test',
  component: Layout,    // 关键
  children: [
    {
      path: '/test/index',
      component: () => import(/* webpackChunkName: "test" */ '@/views/test/index.vue')
    }
  ]
}],
```

#### 工具函数

##### index.js

包含较多常用的工具函数：`deepclone`、`parseTime`、`debounce` 等

##### open-window.js

新标签打开页面工具函数，禁用了 `opener`、`referrer` 等功能

## vscode 插件

### Better Comments 更友好的注释

使用方式：

```text
<!-- ! 存在警告的信息 -->
<!-- ? 存在疑问的信息 -->
<!-- * 表示比较重要的信息 -->
<!-- todo 表示下一步要做的信息 -->
```

## 参考文档

- [vue 现代模式 🚀](https://cli.vuejs.org/zh/guide/browser-compatibility.html#%E7%8E%B0%E4%BB%A3%E6%A8%A1%E5%BC%8F)
- [vue 风格指南 🚀](https://cn.vuejs.org/v2/style-guide/#%E7%BB%84%E4%BB%B6-%E5%AE%9E%E4%BE%8B%E7%9A%84%E9%80%89%E9%A1%B9%E7%9A%84%E9%A1%BA%E5%BA%8F%E6%8E%A8%E8%8D%90)
- [Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
- [Git-Commit-Log 规范（Angular 规范）](https://www.jianshu.com/p/c7e40dab5b05)
