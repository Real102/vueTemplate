/**
 * Search List
 * 1. parseTime 时间格式化
 * 2. debounce 防抖
 * 3. deepClone 深拷贝
 * 4. cleanArray 清空数组
 * 5. isEqual 判断两对象是否相等
 * 6. isAllNull 判断某对象所有key是否都为空
 * 7. merge 合并两对象
 * 8. getImageSize 获取网络图片size
 */

/**
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {object} obj1
 * @param {object} obj2
 * @return {boolean}
 * @desc 主要用于校验两个对象是否相等的方法。可用于判断某个temp跟原数据是否相等，即是否被修改过
 */
export const isEqual = (obj1, obj2) => {
  // 需要注意一下：typeof null === 'object'
  if (obj1 && obj2 && typeof obj1 === 'object' && typeof obj2 === 'object') {
    // 比较两个对象的属性
    const len1 = Object.keys(obj1).length
    const len2 = Object.keys(obj2).length
    let result = true
    if (len1 === len2) {
      Object.keys(obj1).forEach(key => {
        if (typeof obj1[key] !== 'object') {
          if (obj1[key] !== obj2[key]) {
            result = false
          }
        } else {
          if (isEqual(obj1[key], obj2[key]) === false) {
            result = false
          }
        }
      })
      return result
    } else {
      return false
    }
  } else {
    return obj1 === obj2
  }
}

/**
 * @param {object} obj
 * @return {boolean}
 * @desc 本方法主要用于判断某对象是否都为空的校验，如果都为空需要做null转换处理
 */
export const isAllNull = obj => {
  let isNull = true
  if (obj) {
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
          if (!isAllNull(obj[key])) {
            isNull = false
          }
        } else {
          if (obj[key]) {
            isNull = false
          }
        }
      })
    }
  }
  return isNull
}

// 合并对象
export function merge(target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    const source = arguments[i] || {}
    for (const prop in source) {
      // eslint-disable-next-line no-prototype-builtins
      if (source.hasOwnProperty(prop)) {
        const value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }

  return target
}

// 获取网络图片大小
export const getImageSize = () => {
  // 通过ajax请求，下载一次图片并返回arraybuffer文件，然后即可通过 arraybuffer.byteLength 获取文件大小
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', this.selectData.url)
    xhr.responseType = 'arraybuffer'
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const arrayBuffer = xhr.response
        if (arrayBuffer) {
          resolve(arrayBuffer.byteLength)
        } else {
          reject(new Error('calculate fail'))
        }
      }
    }
    xhr.send(null)
  })
}
