import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const reg = /\/([a-zA-Z]+)\.js/
const fileList = [] // 文件名缓存
const modules = {}
const r = require.context('./modules/', false, /\.js$/)
r.keys().forEach(f => {
  const temp = f.match(reg)
  // 正则匹配获取到文件名并存到临时变量fileList中
  fileList.push(temp[1])
})

const requireAll = r => {
  // 拆解 r => r.keys().map(r)，map实质是执行函数
  r.keys().forEach((k, i) => (modules[fileList[i]] = r(k).default))
}
requireAll(r)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules
})
