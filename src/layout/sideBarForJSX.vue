<template>
  <div class="sideBar">
    <item
      v-for="item in routerData"
      :key="item.path"
      :routeData="item"
      @handleExpand="handleExpand"
    >
      <template v-if="item.children">
        <subItem v-for="sub in item.children" :key="sub.path" :subRouteData="sub"></subItem>
      </template>
    </item>
  </div>
</template>
<script>
import item from './components/item.vue'
import subItem from './components/subItem.vue'
import { asyncRoutes } from '@/router/index.js'
export default {
  name: 'SideBar',
  components: {
    item,
    subItem
  },
  data() {
    return {
      routerData: []
    }
  },
  watch: {
    $route: {
      handler: function () {
        this.$nextTick(() => {
          // 刷新页面时，如果打开了某子页面，那么自动展开该父列
          this.routerData.forEach(item => {
            const res = item.children?.find(sub => sub.path === this.$route.path)
            if (res) {
              item.expanded = true
            }
          })
        })
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.routerData = []
    asyncRoutes.forEach(rt => {
      // 处理路由格式，区分只有一个子页面和多个子页面的情况
      // 统一数据格式，便于遍历
      if (!['/404', '*'].includes(rt.path)) {
        if (!rt.meta?.hideSideBar) {
          if (rt.children?.length > 1) {
            // 这里判断是否有多个子路由，并且子路由都是要显示的
            const subChildren = []
            rt.children?.forEach(srt => {
              if (!srt.meta?.hideSideBar) {
                subChildren.push(srt)
              }
            })
            this.routerData.push({
              path: rt.path,
              meta: rt.meta || {},
              expanded: false,
              children: rt.children
            })
          } else if (rt.children?.length === 1) {
            const sub = rt.children[0]
            this.routerData.push({
              path: sub.path,
              meta: Object.assign(rt.meta || {}, sub.meta)
            })
          }
        }
      }
    })
  },
  methods: {
    handleExpand(path) {
      this.routerData.forEach(i => {
        if (i.path === path) {
          i.expanded = !i.expanded
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.sideBar {
  width: 100%;
  background-color: #1f1f1f;
  padding-top: @topBar-h;
  box-sizing: border-box;
  .activeItemClass,
  .activeSubItemClass {
    display: block;
    width: 100%;
    height: 50px;
    overflow: hidden;
    background-color: rgb(84, 92, 100);
  }
  .activeSubItemClass {
    height: 40px;
  }
}
</style>
