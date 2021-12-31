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
