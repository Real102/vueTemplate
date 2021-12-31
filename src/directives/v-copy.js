import { Message } from 'element-ui'

const vCopy = {
  bind(el, { value }) {
    el.$value = value
    el.handel = () => {
      if (!el.$value) {
        return
      }
      const textarea = document.createElement('textarea')
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-99999x'
      textarea.value = el.$value
      document.body.appendChild(textarea)
      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)
      const result = document.execCommand('Copy')
      if (result) {
        Message.success('支付链接已复制至剪贴板！')
      }
      document.body.removeChild(textarea)
    }
    el.addEventListener('click', el.handel)
  },
  componentUpdated(el, { value }) {
    el.$value = value
  },
  unbind(el) {
    el.removeEventListener('click', el.handel)
  }
}

export default vCopy
