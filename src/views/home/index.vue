<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="~@/assets/imgs/bg-small.jpg" style="width: 50%" /> -->
    <svg-icon iconClass="success" title="成功" style="width: 40px; height: 40px"></svg-icon>
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <div class="spriteTest">
      <i class="icon icon-Icon-2"></i>
    </div>
    <pagination
      :total="paginationData.total"
      :currentPage="paginationData.currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></pagination>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
// import { getUserInfo, setUserInfo } from '@/api/user.js'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data() {
    return {
      paginationData: {
        total: 100,
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    // getUserInfo({ name: '666' })
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   }),
    //   setUserInfo({ name: '777' })
    //     .then(res => {
    //       console.log(res)
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
  },
  methods: {
    handleSizeChange(pageSize) {
      this.paginationData.currentPage = 1
      this.paginationData.pageSize = pageSize
    },
    handleCurrentChange(page) {
      this.paginationData.currentPage = page
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/sprite/sprite.less';

.spriteTest {
  width: 50px;
  height: 100px;
  border: 1px solid #ccc;
}
</style>
