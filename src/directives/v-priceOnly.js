const vPriceOnly = {
  bind(el) {
    const priceReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/
    el.handel = event => {
      const oldText = event.target.value.slice(0, -1)
      if (event.target.value === '') return
      if (!priceReg.test(event.target.value)) {
        event.target.value = oldText
        return
      }
      if (/^\./.test(event.target.value)) {
        event.target.value = '0' + event.target.value
        return
      }
      if (event.target.value.length > 1 && /^0/.test(event.target.value)) {
        // eslint-disable-next-line no-unused-expressions
        !/\./.test(event.target.value) ? (event.target.value = event.target.value.slice(1)) : ''
      }
    }
    el.onpaste = () => false
    el.addEventListener('input', el.handel)
  },
  unbind(el) {
    el.removeEventListener('input', el.handel)
  }
}

export default vPriceOnly
