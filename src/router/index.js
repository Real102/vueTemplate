import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Layout = () => import('@/layout/index.vue')

// ! 如果使用sideBarForJSX，那么路由的格式要求如下：
// 1. 需要显示在导航菜单的路由，格式如下首页/测试管理页
// 2. 如果不需要显示在导航菜单，请在meta标签增加hideSideBar: true属性
// 3. 如果只有一个children，那么会采取Object.assign的方式将子的meta合并到父的meta

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: { icon: 'Icon-2' },
    children: [
      {
        path: '/index',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/customComp',
    component: Layout,
    redirect: '/customComp/index',
    meta: { icon: 'Icon-2' },
    children: [
      {
        path: '/customComp/index',
        component: () =>
          import(/* webpackChunkName: "customComp" */ '@/views/customComp/index.vue'),
        meta: { title: '自定义组件' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "sign" */ '@/views/login/index.vue'),
    meta: { title: '登录', hideSideBar: true }
  },
  {
    path: '/404',
    name: '404',
    meta: { title: '404' },
    component: () => import(/* webpackChunkName: "assist" */ '@/views/other/404.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

if (process.env.NODE_ENV === 'development') {
  asyncRoutes.push({
    path: '/test',
    component: Layout,
    children: [
      {
        path: '/test/index',
        component: () => import(/* webpackChunkName: "test" */ '@/views/test/index.vue'),
        meta: { title: '测试管理' }
      }
    ]
  })
}

//  不需要经过权限判断的路由
export const constantRoutes = []

// 解决重复点击菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const createRouter = () =>
  new VueRouter({
    scrollBehavior: () => ({ y: 0 })
  })

// 获取VueRouter实例
const router = createRouter()

// 初始化（重置）路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  // TODO: 这里是添加路由操作，如果需要做权限处理，在filterRouters函数中处理
  // ! vue-cli4 已经废除了addRoutes方法，因此这里改为遍历执行addRoute方法
  const r = asyncRoutes
  r.forEach(i => router.addRoute(i))
}

// TODO: 目前项目的菜单都是前端写死，而非后端返回所有菜单路径，因此这里直接执行路由初始化
resetRouter()

export default router
