<template>
  <div class="captcha">
    captcha <br />
    {{ options }} <br />
    <el-button type="danger" size="small" @click="checkCaptcha">关闭验证码</el-button>
  </div>
</template>
<script>
export default {
  name: 'Captcha',
  methods: {}
}
</script>
<style lang="less" scoped>
.captcha {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  z-index: 100000;
}
</style>
