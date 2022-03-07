/**
 * @author wolfBerry
 * @email 906368017@qq.com
 * @create date 2022-03-07 10:33:57
 * @modify date 2022-03-07 10:41:40
 * @desc 全局获取手机验证码前的图形验证码弹框插件
 * @use this.$captcha()
 */

/**
 * this.$captcha() 默认返回的是一个Promise
 * 当用于校验通过图形验证码时，会触发关闭事件，并且返回 resolve
 * 如果图形验证码校验失败，则直接返回失败 reject
 */
import Vue from 'vue'
import CaptchaComp from './index.vue'

const captcha = {}
captcha.install = function (Vue) {
  Vue.prototype.$captcha = () => {
    return new Promise((resolve, reject) => {
      const MsgConstructor = Vue.extend(CaptchaComp)
      // 参数可以是vue选项中的任意一个，并且在子组件可以直接访问
      const instance = new MsgConstructor({
        data: function () {
          return {
            options: 'test'
          }
        },
        methods: {
          checkCaptcha() {
            setTimeout(() => {
              closeCaptcha()
            }, 2000)
          }
        }
      })

      // 将vue实例挂在在DOM上，并插入到HTML中
      // instance.$el是vue实例的DOM对象
      // instance.vm是vue实例对象
      // 可以指定挂载到某一个元素下
      instance.vm = instance.$mount()
      instance.dom = instance.$el
      document.querySelector('body').appendChild(instance.dom)
      // 控制背景不滚动
      document.querySelector('body').style.overflow = 'hidden'
      // 关闭验证码弹框的方法
      function closeCaptcha() {
        document.querySelector('body').removeChild(instance.dom)
        document.querySelector('body').style.overflow = 'auto'
        resolve('666')
      }
    })
  }
}
Vue.use(captcha)
