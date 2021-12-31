import router from './index.js'
import { getToken } from '@/utils/auth'
import { MAIN_TITLE } from '@/setting.js'

// 白名单列表，不需要登录即可访问
// const whiteList = ['/login', '/other/404', '/test/index']
router.beforeEach(async (to, from, next) => {
  // 当没有设置title时，默认显示项目名
  const { title } = to.meta
  document.title = title ? title + ' · ' + MAIN_TITLE : MAIN_TITLE

  // 登录token判断
  const hasToken = getToken()

  if (to.path === '/login' || to.path === '/register') {
    // 有登录token，不需要再次跳转到登录、注册页面
    hasToken ? next({ path: '/' }) : next()
  } else {
    if (to.path === '/' && from.path === '/') {
      // 判断页面是否刷新了，如果刷新了，获取sessionstorage中的path路径，重定向到path
      // 注意处理当path为空或者path='/'时的情况，此时应该是重定向到首页
      const path = sessionStorage.getItem('path') || '/'
      if (path !== '/') {
        // path存在，则直接跳转到path页
        next(path)
      } else {
        // 其他情况则直接跳转，不用处理（也就只剩下跳转到首页的情况）
        next()
      }
    } else {
      // 这里需要存储用户最新访问的路径，仅对当前标签页有效
      sessionStorage.setItem('path', to.path)
      next()
    }
  }
})
