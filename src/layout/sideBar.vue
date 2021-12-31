<template>
  <div class="sideBar">
    <div class="menu-top" @click="openPage">
      <i class="icon icon-i-logo"></i>
      <span class="menu-top-title" style="margin: 0 8px; cursor: pointer">{{ title }}</span>
    </div>
    <ul>
      <li v-for="(item, index) in menuConfig" :key="index">
        <div
          :class="['menu-item', { 'menu-item__active': comMenuActive(item) }]"
          @click="clickMenuItem(item, index)"
        >
          <i
            class="icon item-icon"
            :class="comMenuActive(item) ? [`icon-${item.iconSelect}`] : [`icon-${item.icon}`]"
          ></i>
          <span>{{ item.name }}</span>
          <i
            v-if="item.children && item.children.length > 0"
            class="item-arrow-icon icon icon-i-arrow-menu"
            :class="{ 'item-arrow-icon__open': openSubList.includes(index) }"
          ></i>
        </div>

        <!-- 下拉子菜单 -->
        <ul
          v-if="item.children && item.children.length > 0"
          class="menu-sub"
          :style="{
            height: openSubList.includes(index) ? `${item.children.length * 50}px` : 0
          }"
        >
          <li
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            :class="['menu-item', { 'menu-item__active': comMenuActive(child) }]"
            @click="clickMenuItem(child, childIndex)"
          >
            <div
              class="item-icon"
              :style="{ color: comMenuActive(child) ? '#007DFF' : '#303133' }"
            ></div>
            {{ child.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { MAIN_TITLE } from '@/setting.js'

export default {
  name: 'SideBar',
  props: {
    // TODO: 通过接口获取菜单数据，可以考虑存储在vuex，这样会比通过props更便于管理
    // menuConfig: {
    //  type: Array,
    //  default: () => []
    // },
    defaultActive: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentRoute: '',
      isOpenSub: false,
      openSubList: [],
      menuConfig: [
        // TODO: 视项目情况修改目录
        {
          name: '测试页面',
          path: '/test/index',
          icon: 'i-zffsgl',
          iconSelect: 'i-zffsgl',
          subPath: ['/test/index']
        },
        {
          name: '演示数据2',
          path: '/login',
          icon: 'i-zfmbgl',
          iconSelect: 'i-zfmbgl',
          subPath: ['/login']
        },
        {
          name: '演示数据3',
          icon: 'i-ddgl',
          iconSelect: 'i-ddgl',
          children: [
            {
              name: '演示数据4',
              path: '/orderList',
              subPath: ['/orderDetail']
            },
            {
              name: '演示数据5',
              path: '/refundManage',
              subPath: ['/refundDetail']
            }
          ]
        }
      ]
    }
  },
  computed: {
    iconClass(icon) {
      return 'icon-' + icon
    },
    comMenuActive() {
      return function (item) {
        const res =
          item.path === this.currentRoute ||
          (item.subPath && item.subPath.findIndex(b => b === this.currentRoute) !== -1)
        return res
      }
    },
    title() {
      return MAIN_TITLE
    }
  },
  watch: {
    $route: {
      handler(val) {
        this.currentRoute = val.path
      },
      deep: true
    }
  },
  created() {
    this.currentRoute = this.$route.path
    this.changeOpenSubMenu()
  },
  methods: {
    // 点击 添加已打开菜单 index 到 openSubList
    clickMenuItem(item, index) {
      if (item.path) this.$router.push({ path: item.path })
      if (!item.children || item.children.length === 0) return
      const idx = this.openSubList.indexOf(index)
      if (idx === -1) {
        this.openSubList.push(index)
      } else {
        this.openSubList.splice(idx, 1)
      }
    },

    changeOpenSubMenu() {
      this.menuConfig.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          let res = false
          item.children.forEach(child => {
            res =
              child.path === this.currentRoute ||
              (child.subPath && child.subPath.findIndex(b => b === this.currentRoute) !== -1)
            if (res) {
              this.openSubList.push(index)
            }
          })
        }
      })
    },
    openPage() {
      // 回到首页
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/sprite/sprite.less';

.sideBar {
  position: absolute;
  width: 100%;
  background-color: #1f1f1f;
}
.menu-top {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: inherited;
}
.menu-item {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 26px;
  width: 100%;
  height: 50px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: rgb(84, 92, 100);
  }
}
.menu-item__active {
  background-color: #2962ff;
  &:hover {
    background-color: #2962ff;
  }
}
.item-icon {
  margin-right: 8px;
  width: 14px;
  height: 14px;
  text-align: center;
}
.item-arrow {
  &-icon {
    position: absolute;
    top: 50%;
    right: 20px;
    margin-top: -6px;
    transition: transform 0.3s;
    transform: none;
  }
  &-icon__open {
    transition: transform 0.3s;
    transform: rotate(180deg);
  }
}
.menu-sub {
  overflow: hidden;
  transition: all 0.4s;
}
</style>
