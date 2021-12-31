/**
 * @author wolfBerry
 * @email 906368017@qq.com
 * @create date 2021-07-15 10:44:33
 * @modify date 2021-09-13 16:57:52
 * @desc 按产品需求开发出的vue指令，显示当前已输入字数及限制的字数，超过限制字数时，边框和文字颜色变红。
 * @limit 限制条件：input或者textarea都必须得包裹在一个容器内，且容器内只有一个子节点时，才能保证不出现bug
 * @problem 在查询子节点时,直接通过children[x]的方式选取子节点，如果要用此插件，需要注意一下
 * ------------------------------------------------------------------------------------------
 * @resolve 已优化为：通过DOM判断子节点，但仍然需要包裹在同一个容器，且一个容器内只能有一个input使用wordlimit
 */

export const wordLimit = {
  inserted: (el, binding) => {
    console.log(el.children[0].style.cssText)
    el.children[0].style.padding = '0 50px 0 0;' // 好像不生效？
    getNode(el, binding.value)
  },
  update: (el, binding) => {
    // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新--from vue.js官网
    getNode(el, binding.value)
  }
}

function getNode(el, value) {
  // 如果DOM结构已经存在的情况下，不需要重新生成，只需要更改对应字数及颜色等
  const { limit } = value // 限制最长内容长度
  const length = value.word.length // 输入内容的长度

  const domList = Array.from(el.children) // dom伪数组转换成数组

  // 获取input或textarea的DOM节点
  const textNode = domList.find(
    i => i.tagName.toUpperCase() === 'INPUT' || i.tagName.toUpperCase() === 'TEXTAREA'
  )

  // 获取到spanNode的dom节点
  const _spanNode = domList.find(
    i => i.tagName.toUpperCase() === 'SPAN' && Array.from(i.classList).includes('wordLimitSpan')
  )
  if (domList.indexOf(_spanNode) > -1) {
    // inod是spanNode内，需要改变颜色的那一个dom节点，也是span
    const inod = _spanNode.firstChild
    inod.innerHTML = length
    inod.style = length > limit ? 'color: #F56C6C' : ''
    // 注意样式设置，不能直接style=xxx，否则在拉升textarea时会自动变回初始高度
    textNode.style.cssText +=
      length > limit ? 'border:1px solid #F56C6C' : 'border:1px solid #DCDFE6'
  } else {
    // 不存在spanNode，原生js创建
    const textNode1 = document.createTextNode(length)
    const textNode2 = document.createTextNode(`/${limit}`)
    const spanNode = document.createElement('span')
    const iNode = document.createElement('i')
    iNode.append(textNode1)
    iNode.style = length > limit ? 'color: #F56C6C' : ''
    textNode.style.cssText += length > limit ? 'border:1px solid #F56C6C' : ''
    spanNode.append(iNode)
    spanNode.append(textNode2)
    spanNode.style = 'position:absolute;bottom:0px;right:5px;font-size:14px'
    spanNode.classList.add('wordLimitSpan')
    el.append(spanNode)
  }
}
