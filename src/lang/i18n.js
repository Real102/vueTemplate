import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

const messages = {
  zh: {
    hello: '你好，世界',
    search: '搜索'
  },
  en: {
    hello: 'hello world',
    search: 'search'
  }
}

// 需要在 new Vue({ i18n }) 中引入
export const i18n = new VueI18n({
  locale: 'zh', // 设置语言环境
  fallbackLocale: 'en',
  messages // 设置语言环境信息
})

// 可以通过 this.$i18n.locale 访问当前的语言环境以及修改全局语言环境

// ! 如何动态加载语言文件？
// 1. 判断是否是预设的语言，如果不是则接口请求新的语言文件
// 2. 获取目标语言文件，通过 i18n.setLocaleMessage(lang, messages.default) 设置语言数据
// 3. 调用 i18n.locale = lang 设置语言

// 常用语beforeEach钩子，当语言更换完毕时再改变路由，提升用户体验
// router.beforeEach((to, from, next) => {
//   const lang = to.params.lang
//   loadLanguageAsync(lang).then(() => next())
// })
