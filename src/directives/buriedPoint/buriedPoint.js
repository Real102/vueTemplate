/**
 * @author wolfBerry
 * @email 906368017@qq.com
 * @create date 2021-08-02 16:04:39
 * @modify date 2021-08-02 17:00:39
 * @desc 数据埋点指令，需要配合工具函数submitBuriedPoint一起使用，适用于点击按钮情况，需要传按钮名称和数据类型两个参数
 * @use 使用方式：v-buriedPoint="{name: '按钮名称', type: 'page || button'}"
 */

import { submitBuriedPoint } from '@/utils/buriedPoint.js'

export default {
  inserted: (el, binding) => {
    el.handleClick = () => {
      submitBuriedPoint(binding.value.name, binding.value.type)
    }
    el.addEventListener('click', el.handleClick)
  },
  unbind: el => {
    el.removeEventListener('click', el.handleClick)
  }
}
