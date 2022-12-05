const vNumOnly = {
  bind(el) {
    el.onkeypress = event => {
      return /[\d]/.test(String.fromCharCode(event.keyCode || event.which)) || event.which === 8
    }
    el.handel = event => {
      event.target.value = event.target.value.replace(/\D/gi, '')
    }
    el.addEventListener('input', el.handel)
  },
  unbind(el) {
    el.removeEventListener('input', el.handel)
  }
}

export default vNumOnly
// const vNumOnly = {
//   bind(el) {
//     const $inp = findEle(el, 'input')
//     el.$inp = $inp
//     $inp.handle = function() {
//       const val = $inp.value
//       // 输入框只能输入纯数字与小数点(支持小数点后两位数)
//       $inp.value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')

//       trigger($inp, 'input')
//     }
//     $inp.addEventListener('keyup', $inp.handle)
//   },
//   unbind(el) {
//     el.$inp.removeEventListener('keyup', el.$inp.handle)
//   },
// }

// export default vNumOnly
// const findEle = (parent, type) => {
//   return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
// }

// const trigger = el => {
//   const e = document.createEvent('HTMLEvents')
//   el.dispatchEvent(e)
// }
