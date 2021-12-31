<!-- @Desc 平台头部，包括 logo 和 用户名 -->
<!-- @author LinWanjun -->
<template>
  <header class="topBar">
    <el-dropdown @command="handleDropdownCommand">
      <div v-show="$store.state.user.userInfo.name" class="user">
        <span class="user-name">{{ $store.state.user.userInfo.name }}</span>
        <!-- TODO: icon未显示 -->
        <i class="icon icon-i-arrow-small"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in dropdownList"
          :key="item.name"
          :divided="item.divided"
          :command="item"
          >{{ item.name }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </header>
</template>

<script>
export default {
  name: 'TopBar',
  data() {
    return {
      userName: 'admin',
      dropdownList: [
        {
          name: '账号管理'
        },
        {
          name: '退出'
        }
      ]
    }
  },
  created() {
    // if (localStorage.getItem('token')) {
    //  this.$store.dispatch('user/saveUserInfo')
    // }
  },
  methods: {
    handleDropdownCommand(dropdownItem) {
      switch (dropdownItem.name) {
        case '退出':
          this.$store.dispatch('user/logout')
          break
        case '账号管理':
          this.$router.push('/account')
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.topBar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 23px 0 31px;
  width: 100%;
  height: 48px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 21, 41, 0.12);
  z-index: 100;
}
.nav-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .logo-text {
    margin-left: 8px;
    font-size: 18px;
    color: #fff;
  }
}
.user {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &-head {
    margin-right: 10px;
    width: 24px;
  }
  &-name {
    margin-right: 6px;
    font-size: 14px;
    color: #000;
  }
}
</style>
