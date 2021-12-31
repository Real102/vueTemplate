<!-- 说明 -->
<!-- @author 作者 -->
<template>
  <div>
    <div class="text">404 很抱歉，您查看的页面找不到了！</div>
    <el-button class="back" type="text" @click="$router.go(-1)">立即返回</el-button>
    <span class="second">({{ second }})</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      second: 3,
      timer: null
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.second = 3
      vm.startTimer()
    })
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    this.timer = null
    next()
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.second--
        if (this.second <= 0) {
          this.$router.go(-1)
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  padding-top: 200px;
  width: 100%;
  height: 100%;
  font-size: 34px;
  text-align: center;
  color: #b0bec5;
  display: block;
}
.back {
  margin: 30px auto 0;
  font-size: 18px;
  text-align: center;
  text-decoration: underline;
  color: #007dff;
  cursor: pointer;
}
.second {
  font-size: 18px;
  letter-spacing: 3px;
  margin-left: 10px;
}
</style>
