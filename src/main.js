import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// css
import '@/styles/reset.less'
import '@/styles/sprite/sprite.less'
// 路由登录限制
import '@/router/permission.js'
// 提示文案
import msgTips from '@/lang/zh.js'
// 国际化
import { i18n } from '@/lang/i18n'

// 全局引入数据埋点方法
import submitBuriedPoint from '@/utils/buriedPoint.js'
Vue.use(submitBuriedPoint)

// 全局引入的组件、自定义指令、插件，需要有对应index.js才可引入（只vue文件不会引入）
const components = require.context('@/components', true, /\.js$/)
const plugins = require.context('@/plugins', true, /\.js$/)
const directives = require.context('@/directives', true, /\.js$/)
const requireAll = arr => {
  arr.forEach(requireContext => requireContext.keys().map(requireContext))
}
requireAll([components, plugins, directives])

Vue.config.productionTip = false
Vue.prototype.$msgTips = msgTips

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
