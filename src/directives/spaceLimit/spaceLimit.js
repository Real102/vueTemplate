let exactTarget = null
export default {
  bind: el => {
    if (el.tagName.toUpperCase() === 'INPUT' || el.tagName.toUpperCase() === 'TEXTAREA') {
      exactTarget = el
    } else {
      exactTarget = Array.from(el.children).find(
        i => i.tagName.toUpperCase() === 'INPUT' || i.tagName.toUpperCase() === 'TEXTAREA'
      )
    }
    exactTarget.addEventListener('keypress', handleKeypress)
    exactTarget.addEventListener('input', handleInput)
  },
  unbind: () => {
    exactTarget.removeEventListener('keypress', handleKeypress)
    exactTarget.removeEventListener('input', handleInput)
  }
}

function handleKeypress(e) {
  const event = e || window.event
  if (event.keyCode === 32) {
    event.preventDefault()
    return false
  }
}

function handleInput(e) {
  const event = e || window.event
  event.target.value = event.target.value.replace(/\s/gi, '')
}
