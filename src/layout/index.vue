<template>
  <div class="layout">
    <div class="topBar"><topBar></topBar></div>
    <div class="sideBar"><sideBar></sideBar></div>
    <router-view class="wrap"></router-view>
  </div>
</template>
<script>
import sideBar from './sideBarForJSX'
import topBar from './topBar'
export default {
  name: 'Layout',
  components: {
    sideBar,
    topBar
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/_variables.less';
// 顶部导航和侧边栏导航部分样式于_variables.less全局统一设置
.layout {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  background: @main-bg-color;
  .topBar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: @topBar-h;
    box-sizing: border-box;
  }
  .sideBar {
    position: fixed;
    top: 0;
    left: 0;
    width: @sideBar-w;
    height: 100%;
    box-shadow: 2px 0 4px 0 rgba(0, 21, 41, 0.12);
  }
  .wrap {
    position: fixed;
    top: @topBar-h;
    left: @sideBar-w;
    right: 0;
    bottom: 0;
    margin-top: 10px;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
    background: #fff;
  }
}
</style>
